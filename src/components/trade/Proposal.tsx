import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import "../../styles/main.scss";
import { collection, getDocs } from "firebase/firestore";
import { Box, Typography } from "@mui/material";
import apiStore from "../../store/ApiStore";
import authStore from "../../store/AuthStore";
import { observer } from "mobx-react-lite";
import { auth, db } from "../../firebase";
import proposalStore from "../../store/ProposalStore";

const Proposal = observer(() => {
  const { id } = useParams<{ id: string }>();
  const proposalContainerRef = useRef<HTMLDivElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDurationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDuration = parseInt(event.target.id, 10);
    proposalStore.setDuration(newDuration);
  };

  const handlePayoutChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("e", event.target.value);

    const newPayout = parseInt(event.target.value);
    proposalStore.setPayout(newPayout);
  };

  const handleBuy = async (isHigher: boolean) => {
    // if(id){
    //   proposalStore.unsubscribeProposal();
    //   proposalStore.getProposal(id);
    // }
    setIsProcessing(true);
    let balance = 0;
    try {
      const balanceSnapshot = await getDocs(collection(db, "users"));
      balanceSnapshot.forEach((doc) => {
        if (auth.currentUser!.uid == doc.id) {
          balance = doc.data().balance || null;
        }
      });
      const currentBalance = balance;

      const payoutValue = parseInt(proposalStore.payout.toString(), 10);
      const askPrice = proposalStore.proposalData[proposalStore.proposalData.length - 1].ask_price;
      console.log(askPrice);

      console.log(payoutValue);
      console.log(currentBalance);

      if (currentBalance < payoutValue) {
        console.log("Insufficient balance");
        return;
      }

      let newBalance = 0;
      if (proposalStore.basis === "payout"){
      newBalance = currentBalance - askPrice;
      } else {
      newBalance = currentBalance - payoutValue;
      }
      authStore.setBalance(newBalance);

      setTimeout(() => handleSell(isHigher), proposalStore.duration * 1000);

      authStore.setAlert({
        open: true,
        message: `Option successfully bought for USD ${proposalStore.basis === "payout" ? askPrice : payoutValue}`,
        type: "success",
      });

      console.log("Buy successful");
    } catch (error) {
      console.error("Error:", error);
      authStore.setAlert({
        open: true,
        message: `Error. Try again later`,
        type: "error",
      });
      setIsProcessing(false);
    }
  };

  const handleSell = async (isHigher: boolean) => {
    setIsProcessing(true);
    let balance = 0;
    try {
      const balanceSnapshot = await getDocs(collection(db, "users"));
      balanceSnapshot.forEach((doc) => {
        if (auth.currentUser!.uid == doc.id) {
          balance = doc.data().balance || null;
        }
      });
      const currentBalance = balance;

      const payoutValue = parseInt(proposalStore.payout.toString(), 10);

      console.log("payout/stake", payoutValue);
      console.log("balance", currentBalance);
      // console.log("proposal data", proposalStore.proposalData);

      // if (proposalStore.proposalData.length > 0) {
        // console.log(
        //   "testing",
        //   proposalStore.proposalData[
        //     proposalStore.proposalData.length - proposalStore.duration
        //   ]
        // );
        
        const previousSpot =
        apiStore.ticks[apiStore.ticks.length - proposalStore.duration].close;
        const currentSpot =
        apiStore.ticks[apiStore.ticks.length - 1].close;

        console.log("prev", previousSpot);
        console.log("next", currentSpot);

        const additionalAmount =
          proposalStore.proposalData[proposalStore.proposalData.length - 1].payout;

        if (previousSpot && currentSpot) {
          const previousSpotValue = previousSpot;
          const currentSpotValue = currentSpot;

          console.log("previous spot:", previousSpotValue);
          console.log("current spot:", currentSpotValue);

          if (isHigher) {
            if (currentSpotValue > previousSpotValue) {
              const updatedBalance = currentBalance + additionalAmount;
              authStore.setBalance(updatedBalance);
              console.log("Spot is higher!!!", additionalAmount);
              authStore.setAlert({
                open: true,
                message: `Spot is higher! You won USD ${additionalAmount}!`,
                type: "success",
              });
              apiStore.setSellSuccessful(true);
              apiStore.setAdditionalAmount(additionalAmount);
              apiStore.setTotalAmountWon(
                apiStore.totalAmountWon + additionalAmount
              );
            } else {
              console.log("Spot is not higher", additionalAmount);
              authStore.setAlert({
                open: true,
                message: `Spot is not higher. You lost :(`,
                type: "error",
              });
              apiStore.setSellFailed(true);
              apiStore.setDeductedAmount(payoutValue);
              apiStore.setTotalAmountLost(
                apiStore.totalAmountLost + payoutValue
              );
            }
          } else {
            if (previousSpotValue > currentSpotValue) {
              // const additionalAmount =
              //   proposalStore.payout;
              const updatedBalance = currentBalance + additionalAmount;
              authStore.setBalance(updatedBalance);
              console.log("Spot is lower!!!", additionalAmount);
              authStore.setAlert({
                open: true,
                message: `Spot is lower! You won USD ${additionalAmount}!`,
                type: "success",
              });
              apiStore.setSellSuccessful(true);
              apiStore.setAdditionalAmount(additionalAmount);
              apiStore.setTotalAmountWon(
                apiStore.totalAmountWon + additionalAmount
              );
            } else {
              console.log("Spot is not lower", additionalAmount);
              authStore.setAlert({
                open: true,
                message: `Spot is not lower. You lost :(`,
                type: "error",
              });
              apiStore.setSellFailed(true);
              apiStore.setDeductedAmount(payoutValue);
              apiStore.setTotalAmountLost(
                apiStore.totalAmountLost + payoutValue
              );
            }
          }
        } else {
          console.log("Previous spot or current spot is not available");
          authStore.setAlert({
            open: true,
            message: `Error. Try again later`,
            type: "error",
          });
        }
      // } else {
      //   console.log("Not enough data to compare spot prices");
      //   authStore.setAlert({
      //     open: true,
      //     message: `Error. Try again later`,
      //     type: "error",
      //   });
      // }
      setIsProcessing(false);
    } catch (error) {
      console.error("Error:", error);
      authStore.setAlert({
        open: true,
        message: `Error. Try again later`,
        type: "error",
      });
      setIsProcessing(false);
    }
  };

  const decrementPayout = () => {
    if (proposalStore.payout > 1) {
      proposalStore.setPayout(proposalStore.payout - 1);
    }
  };

  const incrementPayout = () => {
    if (proposalStore.payout < 500) {
      proposalStore.setPayout(proposalStore.payout + 1);
    }
  };

  useEffect(() => {
    if (id){
      proposalStore.getProposal(id);
    }
  }, [id, proposalStore.basis, proposalStore.payout, proposalStore.duration]);

  return (
    <Box>
      <Box className="proposal-ticks">
        <Typography sx={{ marginRight: "1vw", fontFamily: "Montserrat" }}>
          Ticks:{" "}
        </Typography>
        {/* <input
          type="range"
          min="1"
          max="10"
          value={apiStore.duration}
          onChange={handleDurationChange}
        /> */}
        <Box className="duration-change-slider">
          <input
            required
            type="radio"
            name="duration-change"
            className="duration-change-btn"
            id="1"
            value={proposalStore.duration}
            onChange={handleDurationChange}
          />
          <input
            required
            type="radio"
            name="duration-change"
            className="duration-change-btn"
            id="2"
            value={proposalStore.duration}
            onChange={handleDurationChange}
          />
          <input
            required
            type="radio"
            name="duration-change"
            className="duration-change-btn"
            id="3"
            value={proposalStore.duration}
            onChange={handleDurationChange}
          />
          <input
            required
            type="radio"
            name="duration-change"
            className="duration-change-btn"
            id="4"
            value={proposalStore.duration}
            onChange={handleDurationChange}
          />
          <input
            required
            type="radio"
            name="duration-change"
            className="duration-change-btn"
            id="5"
            value={proposalStore.duration}
            onChange={handleDurationChange}
            defaultChecked
          />
          <input
            required
            type="radio"
            name="duration-change"
            className="duration-change-btn"
            id="6"
            value={proposalStore.duration}
            onChange={handleDurationChange}
          />
          <input
            required
            type="radio"
            name="duration-change"
            className="duration-change-btn"
            id="7"
            value={proposalStore.duration}
            onChange={handleDurationChange}
          />
          <input
            required
            type="radio"
            name="duration-change"
            className="duration-change-btn"
            id="8"
            value={proposalStore.duration}
            onChange={handleDurationChange}
          />
          <input
            required
            type="radio"
            name="duration-change"
            className="duration-change-btn"
            id="9"
            value={proposalStore.duration}
            onChange={handleDurationChange}
          />
          <input
            required
            type="radio"
            name="duration-change"
            className="duration-change-btn"
            id="10"
            value={proposalStore.duration}
            onChange={handleDurationChange}
          />
        </Box>
      </Box>
      <Box className="proposal-btn-group">
        <button
          style={{
            backgroundColor:
              proposalStore.basis === "payout" ? "blue" : "white",
            color: proposalStore.basis === "payout" ? "white" : "blue",
          }}
          className="proposal-options"
          onClick={() => proposalStore.setBasis("payout")}
        >
          Payout
        </button>
        <button
          style={{
            backgroundColor: proposalStore.basis === "stake" ? "blue" : "white",
            color: proposalStore.basis === "stake" ? "white" : "blue",
          }}
          className="proposal-options"
          onClick={() => proposalStore.setBasis("stake")}
        >
          Stake
        </button>
      </Box>
      <Box className="proposal-input-container">
        <button className="proposal-input-btn left" onClick={decrementPayout} disabled={proposalStore.payout <= 0}>
          -
        </button>
        <input
          type="number"
          value={proposalStore.payout}
          onChange={handlePayoutChange}
          min="1"
          max="500"
          className="proposal-input-field"
        />
        <button className="proposal-input-btn right" onClick={incrementPayout} disabled={proposalStore.payout >= 501}>
          +
        </button>
      </Box>

      <Box ref={proposalContainerRef} id="proposalContainer"></Box>
      <Box className="proposal-btn-choices">
        <button
          className={`proposal-btn-buy ${
            isProcessing || proposalStore.payout >= 501 || proposalStore.payout <= 0 ? "processing" : ""
          } higher `}
          onClick={() => handleBuy(true)}
          disabled={isProcessing || proposalStore.payout >= 501 || proposalStore.payout <= 0}
        >
          Higher
        </button>
        <button
          className={`proposal-btn-buy ${
            isProcessing || proposalStore.payout >= 501 || proposalStore.payout <= 0 ? "processing" : ""
          } lower`}
          onClick={() => handleBuy(false)}
          disabled={isProcessing || proposalStore.payout >= 501 || proposalStore.payout <= 0}
        >
          Lower
        </button>
      </Box>
      {/* <Box>
        {apiStore.sellSuccessful && (
          <div>
            <div>Won {apiStore.additionalAmount.toFixed(2)} USD</div>
            <div>Total Won: {apiStore.totalAmountWon.toFixed(2)} USD</div>
          </div>
        )}
      </Box>
      <Box>
        {apiStore.sellFailed && (
          <div>
            <div>Lost {apiStore.deductedAmount.toFixed(2)} USD</div>
            <div>Total Lost: {apiStore.totalAmountLost.toFixed(2)} USD</div>
          </div>
        )}
      </Box> */}
    </Box>
  );
});

export default Proposal;
