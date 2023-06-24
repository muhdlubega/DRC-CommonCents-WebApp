import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import "../../styles/main.scss";
import { getDoc, setDoc } from "firebase/firestore";
import apiStore from "../../store/ApiStore";
import authStore from "../../store/AuthStore";
import { observer } from "mobx-react";

const Proposal: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const proposalContainerRef = useRef<HTMLDivElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  // const [sellSuccessful, setSellSuccessful] = useState(false);
  // const [additionalAmount, setAdditionalAmount] = useState(0);
  // const [sellFailed, setSellFailed] = useState(false);
  // const [deductedAmount, setDeductedAmount] = useState(0);
  // const [totalAmountWon, setTotalAmountWon] = useState(0);
  // const [totalAmountLost, setTotalAmountLost] = useState(0);

  const handleDurationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDuration = parseInt(event.target.value, 10);
    apiStore.setDuration(newDuration);
    // apiStore.subscribeProposal();
  };

  const handlePayoutChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPayout = parseInt(event.target.value, 10);
    apiStore.setPayout(newPayout);
    // apiStore.subscribeProposal();
  };

  const handleBuy = async (isHigher: boolean) => {
    setIsProcessing(true); 
    try {
      const balanceSnapshot = await getDoc(authStore.userDocRef);
      if (!balanceSnapshot.exists()) {
        console.log("Balance document does not exist");
        return;
      }
      const balanceData = balanceSnapshot.data();
      if (!balanceData || typeof balanceData.balance !== "number") {
        console.log("Invalid balance data");
        return;
      }
      const currentBalance = balanceData.balance;

      const payoutValue = parseInt(apiStore.payout.toString(), 10);

      console.log(payoutValue);
      console.log(currentBalance);

      if (currentBalance < payoutValue) {
        console.log("Insufficient balance");
        return;
      }

      const newBalance = currentBalance - payoutValue;
      authStore.setBalance(newBalance);
      await setDoc(authStore.userDocRef, { balance: newBalance });

      setTimeout(() => handleSell(isHigher), apiStore.duration * 1000);

      console.log("Buy successful");
    } catch (error) {
      console.error("Error:", error);
      setIsProcessing(false);
    }
  };

  const handleSell = async (isHigher: boolean) => {
    setIsProcessing(true); 
    try {
      const balanceSnapshot = await getDoc(authStore.userDocRef);
      if (!balanceSnapshot.exists()) {
        console.log("Balance document does not exist");
        return;
      }
      const balanceData = balanceSnapshot.data();
      if (!balanceData || typeof balanceData.balance !== "number") {
        console.log("Invalid balance data");
        return;
      }
      const currentBalance = balanceData.balance;

      const payoutValue = parseInt(apiStore.payout.toString(), 10);

      console.log("payout/stake", payoutValue);
      console.log("balance", currentBalance);
      console.log("proposal data", apiStore.proposalData);

      if (apiStore.proposalData.length > 0) {
        console.log(
          "testing",
          apiStore.proposalData[
            apiStore.proposalData.length - apiStore.duration
          ]
        );
        const previousSpot =
          apiStore.proposalData[
            apiStore.proposalData.length - apiStore.duration
          ].spot;
        const currentSpot =
          apiStore.proposalData[apiStore.proposalData.length - 1].spot;
          const additionalAmount =
          apiStore.proposalData[
            apiStore.proposalData.length - apiStore.duration
          ].payout;

        if (previousSpot && currentSpot) {
          const previousSpotValue = previousSpot;
          const currentSpotValue = currentSpot;

          console.log("previous spot:", previousSpotValue);
          console.log("current spot:", currentSpotValue);

          if (isHigher) {
            if (currentSpotValue > previousSpotValue) {
              const updatedBalance = currentBalance + additionalAmount;
              authStore.setBalance(updatedBalance);
              await setDoc(authStore.userDocRef, { balance: updatedBalance });
              console.log("Sell successful", additionalAmount);
              apiStore.setSellSuccessful(true);
              apiStore.setAdditionalAmount(additionalAmount);
              apiStore.setTotalAmountWon(apiStore.totalAmountWon + additionalAmount); 
            } else {
              console.log("Spot is not higher", additionalAmount);
              apiStore.setSellFailed(true);
              apiStore.setDeductedAmount(payoutValue);
              apiStore.setTotalAmountLost(apiStore.totalAmountLost + payoutValue);
            }
          } else {
            if (previousSpotValue > currentSpotValue) {
              const additionalAmount =
                apiStore.proposalData[
                  apiStore.proposalData.length - apiStore.duration
                ].payout;
              const updatedBalance = currentBalance + additionalAmount;
              authStore.setBalance(updatedBalance);
              await setDoc(authStore.userDocRef, { balance: updatedBalance });
              console.log("Sell successful");
              apiStore.setSellSuccessful(true);
              apiStore.setAdditionalAmount(additionalAmount);
              apiStore.setTotalAmountWon(apiStore.totalAmountWon + additionalAmount); 
            } else {
              console.log("Spot is not lower", additionalAmount);
              apiStore.setSellFailed(true);
              apiStore.setDeductedAmount(payoutValue);
              apiStore.setTotalAmountLost(apiStore.totalAmountLost + payoutValue);
            }
          }
        } else {
          console.log("Previous spot or current spot is not available");
        }
      } else {
        console.log("Not enough data to compare spot prices");
      }
      setIsProcessing(false);
    } catch (error) {
      console.error("Error:", error);
      setIsProcessing(false);
    }
  };

  // useEffect(() => {
  //   apiStore.getProposal(id!);
  // }, []);

  useEffect(() => {

    if (id) {
        apiStore.getProposal(id);
      const proposal = document.querySelector<HTMLButtonElement>("#proposal");
      proposal?.addEventListener("click", () => apiStore.getProposal(id));

      const proposal_unsubscribe = document.querySelector<HTMLButtonElement>(
        "#proposal-unsubscribe"
      );
      proposal_unsubscribe?.addEventListener(
        "click",
        apiStore.unsubscribeProposal
      );

      return () => {
        proposal?.removeEventListener("click", () => apiStore.getProposal(id));
        proposal_unsubscribe?.removeEventListener(
          "click",
          apiStore.unsubscribeProposal
        );
      };
    }
  }, [id, apiStore.payout, apiStore.duration]);

  return (
    <div>
      <div className="proposal-btn-group">
        <button
          style={{
            backgroundColor: apiStore.basis === "payout" ? "blue" : "white",
            color: apiStore.basis === "payout" ? "white" : "blue",
          }}
          className="proposal-options"
          onClick={() => apiStore.setBasis("payout")}
        >
          Payout
        </button>
        <button
          style={{
            backgroundColor: apiStore.basis === "stake" ? "blue" : "white",
            color: apiStore.basis === "stake" ? "white" : "blue",
          }}
          className="proposal-options"
          onClick={() => apiStore.setBasis("stake")}
        >
          Stake
        </button>
      </div>
      <div>
        <span>Set Price: </span>
        <input
          type="range"
          min="1"
          max="500"
          value={apiStore.payout}
          onChange={handlePayoutChange}
        />
        <span>{apiStore.payout}</span>
      </div>
      <div>
        <span>Ticks: </span>
        <input
          type="range"
          min="1"
          max="10"
          value={apiStore.duration}
          onChange={handleDurationChange}
        />
        <span>{apiStore.duration}</span>
      </div>

      <button hidden id="proposal" className="proposal-btn">
        Subscribe proposal
      </button>
      <button hidden id="proposal-unsubscribe" className="resetBtn">
        Unsubscribe proposal
      </button>
      <div ref={proposalContainerRef} id="proposalContainer"></div>
      <span className="proposal-btn-group">
        <button className={`proposal-btn-higher ${isProcessing ? "processing" : ""}`}
          onClick={() => handleBuy(true)}
          disabled={isProcessing}>
          Higher
        </button>
        <button className={`proposal-btn-lower ${isProcessing ? "processing" : ""}`}
          onClick={() => handleBuy(false)}
          disabled={isProcessing}>
          Lower
        </button>
      </span>
      {/* {apiStore.sellSuccessful && ( */}
        <div>
          <div>Won {apiStore.additionalAmount.toFixed(2)} USD</div>
          <div>Total Won: {apiStore.totalAmountWon.toFixed(2)} USD</div>
        </div>
      {/* )} */}
      {/* {apiStore.sellFailed && ( */}
        <div>
          <div>Lost {apiStore.deductedAmount.toFixed(2)} USD</div>
          <div>Total Lost: {apiStore.totalAmountLost.toFixed(2)} USD</div>
        </div>
      {/* )} */}
    </div>
  );
};

export default observer(Proposal);
