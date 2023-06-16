import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useGlobalState } from '../../Context'
import DerivAPIBasic from "https://cdn.skypack.dev/@deriv/deriv-api/dist/DerivAPIBasic";
import "../../App.css";
import { getDoc, setDoc } from "firebase/firestore";

const app_id = 1089;
const connection = new WebSocket(
  `wss://ws.binaryws.com/websockets/v3?app_id=${app_id}`
);
const api = new DerivAPIBasic({ connection });

const Proposal: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const proposalContainerRef = useRef<HTMLDivElement>(null);
  const [duration, setDuration] = useState<number>(5);
  const [payout, setPayout] = useState<number>(100);
  const [previousSpot, setPreviousSpot] = useState<number | null>(null);
  const [data, setData] = useState<any>(null);
  const [basis, setBasis] = useState<string>("payout");
  const { balanceDocRef, setBalance } = useGlobalState();
  const [proposalTicks, setProposalTicks] = useState<number>(0);
  const [isDurationEnded, setIsDurationEnded] = useState<boolean>(false);
  // const firestore = getFirestore();

  const proposal_request = {
    proposal: 1,
    subscribe: 1,
    amount: payout,
    basis: basis,
    contract_type: "CALL",
    currency: "USD",
    duration: duration,
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
    setData(data.proposal);
    setPreviousSpot(parseFloat(data.proposal.spot));
    setProposalTicks(data.proposal.duration);
    console.log("ticks:", proposalTicks);
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
    setDuration(newDuration);
  };

  const handlePayoutChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPayout = parseInt(event.target.value, 10);
    setPayout(newPayout);
  };

  const handleBuy = async () => {
    try {
      const balanceSnapshot = await getDoc(balanceDocRef);
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

      const payoutValue = parseInt(payout.toString(), 10);
      // const proposalSpot = parseFloat(data?.spot);
      // const proposalPayout = parseInt(data?.payout, 10);

      console.log(payoutValue);
      console.log(currentBalance);

      if (currentBalance < payoutValue) {
        console.log("Insufficient balance");
        return;
      }

      // Deduct the balance based on the buy price
      const newBalance = currentBalance - payoutValue;
      setBalance(newBalance);
      await setDoc(balanceDocRef, { balance: newBalance });

      // Set a timeout to call handleSell after the tick duration
      setTimeout(handleSell, duration * 1000);

      console.log("Buy successful");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSell = async () => {
    try {
      const balanceSnapshot = await getDoc(balanceDocRef);
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

      const payoutValue = parseInt(payout.toString(), 10);
      const proposalSpot = parseFloat(data?.spot);
      // const proposalPayout = parseInt(data?.payout, 10);

      console.log("payout/stake", payoutValue);
      console.log("balance", currentBalance);

      if (isDurationEnded) {
        console.log("Duration ended");
        return;
      }

      if (previousSpot === null) {
        console.log("Previous spot is not available");
        return;
      }

      console.log("previous spot:", previousSpot)
      console.log("new spot:", proposalSpot)

      // Add the proposal payout to the balance if proposal spot is higher after the duration
      if (proposalSpot > previousSpot) {
        const additionalAmount = parseInt(data?.payout, 10);
        const updatedBalance = currentBalance + additionalAmount;
        setBalance(updatedBalance);
        await setDoc(balanceDocRef, { balance: updatedBalance });
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
  }, [id, payout, duration]);

  useEffect(() => {
    // Reset the duration status when the duration changes
    setIsDurationEnded(false);
  }, [duration]);

  return (
    <div>
      <div>
        <button
          style={{
            border: "1px solid darkorchid",
            borderRadius: 5,
            margin: 10,
            padding: 10,
            paddingLeft: 20,
            paddingRight: 20,
            fontSize: 15,
            fontFamily: "Montserrat",
            cursor: "pointer",
            backgroundColor: basis === "payout" ? "darkorchid" : "white",
            color: basis === "payout" ? "white" : "darkorchid",
            fontWeight: "bold",
            width: "45%",
          }}
          onClick={() => setBasis("payout")}
        >
          Payout
        </button>
        <button
          style={{
            border: "1px solid darkorchid",
            borderRadius: 5,
            margin: 10,
            padding: 10,
            paddingLeft: 20,
            paddingRight: 20,
            fontSize: 15,
            fontFamily: "Montserrat",
            cursor: "pointer",
            backgroundColor: basis === "stake" ? "darkorchid" : "white",
            color: basis === "stake" ? "white" : "darkorchid",
            fontWeight: "bold",
            width: "45%",
          }}
          onClick={() => setBasis("stake")}
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
          value={payout}
          onChange={handlePayoutChange}
        />
        <span>{payout}</span>
      </div>
      <div>
        <span>Ticks: </span>
        <input
          type="range"
          min="1"
          max="10"
          value={duration}
          onChange={handleDurationChange}
        />
        <span>{duration}</span>
      </div>

      <button
        style={{
          border: "1px solid darkorchid",
          borderRadius: 5,
          margin: 10,
          padding: 10,
          paddingLeft: 20,
          paddingRight: 20,
          fontSize: 15,
          fontFamily: "Montserrat",
          cursor: "pointer",
          backgroundColor: "darkorchid",
          color: "white",
          fontWeight: "bold",
          width: "95%",
        }}
        id="proposal"
        className="submitBtn"
      >
        Subscribe proposal
      </button>
      <button hidden id="proposal-unsubscribe" className="resetBtn">
        Unsubscribe proposal
      </button>
      <div ref={proposalContainerRef} id="proposalContainer"></div>
      <button
        style={{
          border: "1px solid darkorchid",
          borderRadius: 5,
          margin: 10,
          padding: 10,
          paddingLeft: 20,
          paddingRight: 20,
          fontSize: 15,
          fontFamily: "Montserrat",
          cursor: "pointer",
          backgroundColor: "darkorchid",
          color: "white",
          fontWeight: "bold",
          width: "95%",
        }}
        onClick={handleBuy}
      >
        Buy
      </button>
      <button
        onClick={handleSell}
        // disabled={!isDurationEnded}
        style={{
          border: "1px solid darkorchid",
          borderRadius: 5,
          margin: 10,
          padding: 10,
          paddingLeft: 20,
          paddingRight: 20,
          fontSize: 15,
          fontFamily: "Montserrat",
          cursor: "pointer",
          backgroundColor: "darkorchid",
          color: "white",
          fontWeight: "bold",
          width: "95%",
        }}
      >
        Sell
      </button>
    </div>
  );
};

export default Proposal;
