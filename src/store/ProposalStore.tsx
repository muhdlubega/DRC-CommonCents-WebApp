import { action, makeObservable, observable } from "mobx";
import DerivAPIBasic from "https://cdn.skypack.dev/@deriv/deriv-api/dist/DerivAPIBasic";

const app_id = 1089;

class ProposalStore {
  previousSpot: number = 0;
  currentSpot: number = 0;
  proposalData: any[] = [];
  duration: number = 5;
  payout: number = 100.0;
  basis: string = "stake";
  contractType: string = "CALL";

  connection: WebSocket | null = null;
  api: typeof DerivAPIBasic | null = null;

  constructor() {
    makeObservable(this, {
      duration: observable,
      payout: observable,
      basis: observable,
      contractType: observable,
      previousSpot: observable,
      currentSpot: observable,
      proposalData: observable,
      proposalResponse: action,
      getProposal: action,
      unsubscribeProposal: action,
      setDuration: action.bound,
      setPayout: action.bound,
      setBasis: action.bound,
      setContractType: action.bound,
      setPreviousSpot: action.bound,
      setCurrentSpot: action.bound,
    });
    this.connectWebSocket();
  }

  connectWebSocket() {
    this.connection = new WebSocket(
      `wss://ws.binaryws.com/websockets/v3?app_id=${app_id}`
    );
    this.api = new DerivAPIBasic({ connection: this.connection });
  }

  disconnectWebSocket() {
    if (this.connection) {
      this.connection = null;
    }
  }

  setDuration(duration: number) {
    this.duration = duration;
  }

  setPayout(payout: number) {
    this.payout = parseFloat(payout.toFixed(2));
  }

  setBasis(basis: string) {
    this.basis = basis;
  }

  setContractType(contractType: string) {
    this.contractType = contractType;
  }

  setPreviousSpot(previousSpot: number) {
    this.previousSpot = previousSpot;
  }

  setCurrentSpot(currentSpot: number) {
    this.currentSpot = currentSpot;
  }

  proposalResponse = async (res: MessageEvent) => {
    const data = await JSON.parse(res.data);
    if (data.error !== undefined) {
      console.log("Error: ", data.error.message);
      this.connection?.removeEventListener(
        "message",
        this.proposalResponse,
        false
      );
      await this.api.disconnect();
    } else if (data.msg_type === "proposal") {
      action(() => {
        this.proposalData.push(data.proposal);
      })();
    }
  };

  getProposal = async (id: string) => {
    const proposal_request = {
      proposal: 1,
      subscribe: 1,
      amount: this.payout,
      basis: this.basis,
      contract_type: this.contractType,
      currency: "USD",
      duration: this.duration,
      duration_unit: "t",
      symbol: id,
    };

    this.unsubscribeProposal();
    this.connectWebSocket();
    this.connection?.addEventListener("message", this.proposalResponse);
    await this.api.proposal(proposal_request);
  };

  unsubscribeProposal = async () => {
    this.connection?.removeEventListener(
      "message",
      this.proposalResponse,
      false
    );
    this.api.disconnect();
    this.disconnectWebSocket();
  };
}

const proposalStore = new ProposalStore();

export default proposalStore;
