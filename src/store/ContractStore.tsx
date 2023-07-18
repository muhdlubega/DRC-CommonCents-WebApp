import { action, makeObservable, observable } from "mobx";
import authStore from "./AuthStore";
import { auth, db } from "../firebase";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import proposalStore from "./ProposalStore";
import apiStore from "./ApiStore";

class ContractStore {
  timestamp: number = 0;
  isProcessing: boolean = false;
  sellSuccessful: boolean = false;
  additionalAmount: number = 0;
  sellFailed: boolean = false;
  deductedAmount: number = 0;

  constructor() {
    makeObservable(this, {
      timestamp: observable,
      isProcessing: observable,
      sellSuccessful: observable,
      additionalAmount: observable,
      sellFailed: observable,
      deductedAmount: observable,
      setIsProcessing: action.bound,
      setSellSuccessful: action.bound,
      setAdditionalAmount: action.bound,
      setSellFailed: action.bound,
      setDeductedAmount: action.bound,
      handleBuy: action,
      handleSell: action,
    });
  }

  setIsProcessing(isProcessing: boolean) {
    this.isProcessing = isProcessing;
  }

  setSellSuccessful(sellSuccessful: boolean) {
    this.sellSuccessful = sellSuccessful;
  }

  setAdditionalAmount(additionalAmount: number) {
    this.additionalAmount = additionalAmount;
  }

  setSellFailed(sellFailed: boolean) {
    this.sellFailed = sellFailed;
  }

  setDeductedAmount(deductedAmount: number) {
    this.deductedAmount = deductedAmount;
  }

  handleBuy = async (isHigher: boolean) => {
    this.setIsProcessing(true);
    let balance = 0;
    try {
      const balanceSnapshot = await getDocs(collection(db, "users"));
      balanceSnapshot.forEach((doc) => {
        if (auth.currentUser!.uid == doc.id) {
          balance = doc.data().balance || null;
        }
      });

      this.timestamp = Date.now();
      proposalStore.setContractType(isHigher ? "CALL" : "PUT");
      const currentBalance = balance;
      const payoutValue = parseFloat(proposalStore.payout.toString());
      const askPrice =
        proposalStore.proposalData[proposalStore.proposalData.length - 1]
          .ask_price;

      if (currentBalance < payoutValue) {
        authStore.setAlert({
          open: true,
          message: "Insufficient balance",
          type: "error",
        });
        return;
      }

      let newBalance = 0;
      if (proposalStore.basis === "payout") {
        newBalance = currentBalance - askPrice;
      } else {
        newBalance = currentBalance - payoutValue;
      }
      authStore.setBalance(newBalance);

      setTimeout(
        () => this.handleSell(isHigher),
        proposalStore.duration * 1000
      );

      authStore.setAlert({
        open: true,
        message: `Option successfully bought for USD ${
          proposalStore.basis === "payout" ? askPrice : payoutValue
        }`,
        type: "success",
      });
    } catch (error) {
      authStore.setAlert({
        open: true,
        message: `Error ${error}. Please refresh or try again later`,
        type: "error",
      });
      this.setIsProcessing(false);
    }
  };

  handleSell = async (isHigher: boolean) => {
    this.setIsProcessing(true);
    let balance = 0;
    var status = null;
    const balanceSnapshot = await getDocs(collection(db, "users"));
    balanceSnapshot.forEach((doc) => {
      if (auth.currentUser!.uid == doc.id) {
        balance = doc.data().balance || null;
      }
    });

    proposalStore.setContractType(isHigher ? "CALL" : "PUT");
    const currentBalance = balance;
    const payoutValue = parseFloat(proposalStore.payout.toString());
    const askPrice =
      proposalStore.proposalData[proposalStore.proposalData.length - 1]
        .ask_price;
    const previousSpot = apiStore.isTicks
      ? apiStore.proposalTicks[
          apiStore.proposalTicks.length - proposalStore.duration - 1
        ].quote
      : apiStore.proposalTicks[
          apiStore.proposalTicks.length - proposalStore.duration - 1
        ].close;
    const currentSpot = apiStore.isTicks
      ? apiStore.proposalTicks[apiStore.proposalTicks.length - 1].quote
      : apiStore.proposalTicks[apiStore.proposalTicks.length - 1].close;

    const additionalAmount =
      proposalStore.proposalData[proposalStore.proposalData.length - 1].payout;
    const strategy = isHigher ? "Higher" : "Lower";

    try {
      if (previousSpot && currentSpot) {
        const previousSpotValue = previousSpot;
        const currentSpotValue = currentSpot;

        if (isHigher) {
          if (currentSpotValue > previousSpotValue) {
            const updatedBalance = currentBalance + additionalAmount;
            authStore.setBalance(updatedBalance);
            authStore.setAlert({
              open: true,
              message: `Spot is higher! You won USD ${additionalAmount}!`,
              type: "success",
            });
            status = "Won";
            this.setSellSuccessful(true);
            this.setAdditionalAmount(additionalAmount);
            this.setDeductedAmount(0);
            authStore.setTotalAmountWon(
              authStore.totalAmountWon + additionalAmount
            );
          } else {
            authStore.setAlert({
              open: true,
              message: `Spot is not higher. You lost USD ${askPrice} :(`,
              type: "error",
            });
            status = "Lost";
            this.setSellFailed(true);
            this.setDeductedAmount(askPrice);
            this.setAdditionalAmount(0);
            authStore.setTotalAmountLost(authStore.totalAmountLost + askPrice);
          }
        } else {
          if (previousSpotValue > currentSpotValue) {
            const updatedBalance = currentBalance + additionalAmount;
            authStore.setBalance(updatedBalance);
            authStore.setAlert({
              open: true,
              message: `Spot is lower! You won USD ${additionalAmount}!`,
              type: "success",
            });
            status = "Won";
            this.setSellSuccessful(true);
            this.setAdditionalAmount(additionalAmount);
            this.setDeductedAmount(0);
            authStore.setTotalAmountWon(
              authStore.totalAmountWon + additionalAmount
            );
          } else {
            authStore.setAlert({
              open: true,
              message: `Spot is not lower. You lost USD ${askPrice} :(`,
              type: "error",
            });
            status = "Lost";
            this.setSellFailed(true);
            this.setDeductedAmount(askPrice);
            this.setAdditionalAmount(0);
            authStore.setTotalAmountLost(authStore.totalAmountLost + askPrice);
          }
        }
      } else {
        authStore.setAlert({
          open: true,
          message: `Unable to trade currently. Please refresh or try again later`,
          type: "error",
        });
        const updatedBalance = currentBalance + payoutValue;
        authStore.setBalance(updatedBalance);
      }
      const tradeData = {
        additionalAmount,
        askPrice,
        payoutValue,
        previousSpot,
        currentSpot,
        tickDuration: proposalStore.duration,
        strategy,
        status,
        basis: proposalStore.basis,
        marketType: apiStore.selectedSymbol,
        timestamp: this.timestamp,
      };
      const totalProfit = authStore.totalAmountWon;
      const totalLoss = authStore.totalAmountLost;
      const netWorth = totalProfit - totalLoss;
      const tradeSummary = {
        totalProfit,
        totalLoss,
        netWorth,
        timestamp: this.timestamp,
      };
      await addDoc(
        collection(db, "users", auth.currentUser!.uid, "tradeHistory"),
        tradeData
      );
      await updateDoc(
        doc(db, "users", auth.currentUser!.uid, "tradeHistory", "tradeSummary"),
        tradeSummary
      );
      this.setIsProcessing(false);
    } catch (error) {
      authStore.setAlert({
        open: true,
        message: `Error ${error}. Please refresh or try again later`,
        type: "error",
      });
      const updatedBalance = currentBalance + payoutValue;
      authStore.setBalance(updatedBalance);
      this.setIsProcessing(false);
    }
  };
}

const contractStore = new ContractStore();

export default contractStore;