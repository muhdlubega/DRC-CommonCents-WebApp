import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import "../../styles/main.scss";
import { getDoc, setDoc } from "firebase/firestore";
import apiStore from "../../store/ApiStore";
import authStore from "../../store/AuthStore";
import { observer } from "mobx-react";

const Proposal: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const proposalContainerRef = useRef<HTMLDivElement>(null);

  const handleDurationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDuration = parseInt(event.target.value, 10);
    apiStore.setDuration(newDuration);
  };

  const handlePayoutChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPayout = parseInt(event.target.value, 10);
    apiStore.setPayout(newPayout);
  };

  const handleBuy = async () => {
    try {
      const balanceSnapshot = await getDoc(authStore.balanceDocRef);
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
      await setDoc(authStore.balanceDocRef, { balance: newBalance });

      setTimeout(handleSell, apiStore.duration * 1000);

      console.log("Buy successful");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSell = async () => {
    try {
      const balanceSnapshot = await getDoc(authStore.balanceDocRef);
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
      console.log("proposal data", apiStore.proposalData)
  
        if (apiStore.proposalData.length > 0) {
          console.log("testing", apiStore.proposalData[apiStore.proposalData.length - 1]);
          const previousSpot = apiStore.proposalData[apiStore.proposalData.length - apiStore.duration].spot;
          const currentSpot = apiStore.proposalData[apiStore.proposalData.length - 1].spot;
          
  
          if (previousSpot && currentSpot) {
            const previousSpotValue = previousSpot;
            const currentSpotValue = currentSpot;
  
            console.log("previous spot:", previousSpotValue);
            console.log("current spot:", currentSpotValue);
  
            if (currentSpotValue > previousSpotValue) {
              const additionalAmount = (apiStore.proposalData[apiStore.proposalData.length - apiStore.duration].payout);
              const updatedBalance = currentBalance + additionalAmount;
              authStore.setBalance(updatedBalance);
              await setDoc(authStore.balanceDocRef, { balance: updatedBalance });
              console.log("Sell successful");
            } else {
              console.log("Spot is not higher");
            }
          } else {
            console.log("Previous spot or current spot is not available");
          }
        } else {
          console.log("Not enough data to compare spot prices");
        }
      
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    apiStore.getProposal(id!);
  }, [id])
  
  
  useEffect(() => {
    if(id){
    const proposal = document.querySelector<HTMLButtonElement>("#proposal");
    proposal?.addEventListener("click", () => apiStore.getProposal(id));

    const proposal_unsubscribe = document.querySelector<HTMLButtonElement>(
      "#proposal-unsubscribe"
    );
    proposal_unsubscribe?.addEventListener("click", apiStore.unsubscribeProposal);

    return () => {
      proposal?.removeEventListener("click", () => apiStore.getProposal(id));
      proposal_unsubscribe?.removeEventListener(
        "click",
        apiStore.unsubscribeProposal
      );
    };}
  }, [id, apiStore.payout, apiStore.duration]);

  // useEffect(() => {
  //   apiStore.setIsDurationEnded(false);
  // }, [apiStore.duration]);

  // useEffect(() => {
  //   if (apiStore.proposalTicks === 0) {
  //     apiStore.setIsDurationEnded(true);
  //   }
  // }, [apiStore.proposalTicks]);

  return (
    <div>
      <div>
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

      <button hidden
        id="proposal"
        className="proposal-btn"
      >
        Subscribe proposal
      </button>
      <button hidden id="proposal-unsubscribe" className="resetBtn">
        Unsubscribe proposal
      </button>
      <div ref={proposalContainerRef} id="proposalContainer"></div>
      <button
        className="proposal-btn"
        onClick={handleBuy}
      >
        Buy
      </button>
      <button 
        hidden
        onClick={handleSell}
      >
        Sell
      </button>
    </div>
  );
};

export default observer(Proposal);


