import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import DerivAPIBasic from "https://cdn.skypack.dev/@deriv/deriv-api/dist/DerivAPIBasic";
import "../../App.css";

const app_id = 1089;
const connection = new WebSocket(
  `wss://ws.binaryws.com/websockets/v3?app_id=${app_id}`
);
const api = new DerivAPIBasic({ connection });

const Proposal: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const proposalContainerRef = useRef<HTMLDivElement>(null);
  const [duration, setDuration] = useState<number>(1);
  const [payout, setPayout] = useState<number>(100);

  const proposal_request = {
    proposal: 1,
    subscribe: 1,
    amount: payout,
    basis: "payout",
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
  };

  const getProposal = async () => {
    connection.addEventListener("message", proposalResponse);
    await api.proposal(proposal_request);
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

  return (
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
      <div>
        <span>Payout: </span>
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
        <span>Duration: </span>
        <input
          type="range"
          min="1"
          max="10"
          value={duration}
          onChange={handleDurationChange}
        />
        <span>{duration}</span>
      </div>
    </div>
  );
};

export default Proposal;
