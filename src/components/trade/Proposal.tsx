import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useGlobalState } from '../../store/Context'
import DerivAPIBasic from "https://cdn.skypack.dev/@deriv/deriv-api/dist/DerivAPIBasic";
import "../../styles/main.scss";
import { getDoc, setDoc } from "firebase/firestore";

const app_id = 1089;
const connection = new WebSocket(
  `wss://ws.binaryws.com/websockets/v3?app_id=${app_id}`
);
const api = new DerivAPIBasic({ connection });

const Proposal: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const proposalContainerRef = useRef<HTMLDivElement>(null);
  const globalStore = useGlobalState();

  const proposal_request = {
    proposal: 1,
    subscribe: 1,
    amount: globalStore.payout,
    basis: globalStore.basis,
    contract_type: "CALL",
    currency: "USD",
    duration: globalStore.duration,
    duration_unit: "t",
    symbol: id,
    barrier: "+0.1",
  };

  const proposalResponse = async (res: MessageEvent) => {
    const data = JSON.parse(res.data);
    if (data.error !== undefined) {
      console.log("Error: %s ", data.error.message);
      connection.removeEventListener("message", proposalResponse, false);
      await api.disconnect();
    } else if (data.msg_type === "proposal") {
      if (proposalContainerRef.current) {
        proposalContainerRef.current.innerHTML = `
          <div class="proposal-card">
            <p><strong>Details:</strong> ${data.proposal.longcode}</p>
            <p><strong>Ask Price:</strong> ${data.proposal.display_value}</p>
            <p><strong>Payout:</strong> ${data.proposal.payout}</p>
            <p><strong>Spot:</strong> ${data.proposal.spot}</p>
          </div>
        `;
      }
    }
    globalStore.setData(data.proposal);
    globalStore.setPreviousSpot(parseFloat(data.proposal.spot));
    globalStore.setProposalTicks(data.proposal.duration);
    console.log("ticks:", globalStore.proposalTicks);
    globalStore.setCurrentSpot(parseFloat(data.proposal.spot));
  };

  const getProposal = async () => {
    connection.addEventListener("message", proposalResponse);
    await api.proposal(proposal_request)
  };

  const unsubscribeProposal = () => {
    connection.removeEventListener("message", proposalResponse, false);
  };

  const handleDurationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDuration = parseInt(event.target.value, 10);
    globalStore.setDuration(newDuration);
  };

  const handlePayoutChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPayout = parseInt(event.target.value, 10);
    globalStore.setPayout(newPayout);
  };

  const handleBuy = async () => {
    try {
      const balanceSnapshot = await getDoc(globalStore.balanceDocRef);
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

      const payoutValue = parseInt(globalStore.payout.toString(), 10);

      console.log(payoutValue);
      console.log(currentBalance);

      if (currentBalance < payoutValue) {
        console.log("Insufficient balance");
        return;
      }

      const newBalance = currentBalance - payoutValue;
      globalStore.setBalance(newBalance);
      await setDoc(globalStore.balanceDocRef, { balance: newBalance });

      setTimeout(handleSell, globalStore.duration * 1000);

      console.log("Buy successful");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSell = async () => {
    try {
      const balanceSnapshot = await getDoc(globalStore.balanceDocRef);
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
  
      const payoutValue = parseInt(globalStore.payout.toString(), 10);
      const isDurationEnded = globalStore.isDurationEnded;
      const proposalData = globalStore.data;
  
      console.log("payout/stake", payoutValue);
      console.log("balance", currentBalance);
  
      if (isDurationEnded) {
        console.log("Duration ended");
        // return;
      }
  
      console.log("previous spot:", globalStore.previousSpot);
      console.log("current spot:", globalStore.currentSpot);
  
      if (globalStore.previousSpot === null) {
        console.log("Previous spot is not available");
        return;
      }
  
      if (globalStore.currentSpot === null) {
        console.log("Current spot is not available");
        return;
      }
  
      if (globalStore.currentSpot > globalStore.previousSpot) {
        const additionalAmount = parseInt(proposalData.payout, 10);
        const updatedBalance = currentBalance + additionalAmount;
        globalStore.setBalance(updatedBalance);
        await setDoc(globalStore.balanceDocRef, { balance: updatedBalance });
        console.log("Sell successful");
      } else {
        console.log("Spot is not higher");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  

  useEffect(() => {
    const proposal = document.querySelector<HTMLButtonElement>("#proposal");
    proposal?.addEventListener("click", getProposal);

    const proposal_unsubscribe = document.querySelector<HTMLButtonElement>(
      "#proposal-unsubscribe"
    );
    proposal_unsubscribe?.addEventListener("click", unsubscribeProposal);

    return () => {
      proposal?.removeEventListener("click", getProposal);
      proposal_unsubscribe?.removeEventListener(
        "click",
        unsubscribeProposal
      );
    };
  }, [id, globalStore.payout, globalStore.duration]);

  useEffect(() => {
    globalStore.setIsDurationEnded(false);
  }, [globalStore.duration]);

  useEffect(() => {
    if (globalStore.proposalTicks === 0) {
      globalStore.setIsDurationEnded(true);
    }
  }, [globalStore.proposalTicks]);

  return (
    <div>
      <div>
        <button
          style={{
            backgroundColor: globalStore.basis === "payout" ? "blue" : "white",
            color: globalStore.basis === "payout" ? "white" : "blue",
          }}
          className="proposal-options"
          onClick={() => globalStore.setBasis("payout")}
        >
          Payout
        </button>
        <button
          style={{
            backgroundColor: globalStore.basis === "stake" ? "blue" : "white",
            color: globalStore.basis === "stake" ? "white" : "blue",
          }}
          className="proposal-options"
          onClick={() => globalStore.setBasis("stake")}
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
          value={globalStore.payout}
          onChange={handlePayoutChange}
        />
        <span>{globalStore.payout.toString()}</span>
      </div>
      <div>
        <span>Ticks: </span>
        <input
          type="range"
          min="1"
          max="10"
          value={globalStore.duration}
          onChange={handleDurationChange}
        />
        <span>{globalStore.duration.toString()}</span>
      </div>

      <button
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

export default Proposal;


