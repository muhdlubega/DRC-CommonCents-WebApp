import { action, makeObservable, observable } from "mobx";
import DerivAPIBasic from "https://cdn.skypack.dev/@deriv/deriv-api/dist/DerivAPIBasic";

const app_id = 1089;
// const connection = new WebSocket(
//   `wss://ws.binaryws.com/websockets/v3?app_id=${app_id}`
// );
// const api = new DerivAPIBasic({ connection });

class ProposalStore {
  previousSpot: number = 0;
  currentSpot: number = 0;
  proposalData: any[] = [];
  duration: number = 5;
  payout: number = 100.00;
  basis: string = "stake";

  connection: WebSocket | null = null;
  api: any = null;

  constructor() {
    makeObservable(this, {
      duration: observable,
      payout: observable,
      basis: observable,
      previousSpot: observable,
      currentSpot: observable,
      proposalData: observable,
      proposalResponse: action,
      getProposal: action,
      unsubscribeProposal: action,
      setDuration: action.bound,
      setPayout: action.bound,
      setBasis: action.bound,
      setPreviousSpot: action.bound,
      setCurrentSpot: action.bound,
    });
    this.connectWebSocket();
  }

  connectWebSocket() {
    // runInAction(() => {
      this.connection = new WebSocket(
        `wss://ws.binaryws.com/websockets/v3?app_id=${app_id}`
      );
      this.api = new DerivAPIBasic({ connection: this.connection });
    // });
  }

  disconnectWebSocket() {
    // runInAction(() => {
      if (this.connection) {
        // this.connection.close();
        this.connection = null;
      }
    // });
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

  setPreviousSpot(previousSpot: number) {
    this.previousSpot = previousSpot;
  }

  setCurrentSpot(currentSpot: number) {
    this.currentSpot = currentSpot;
  }

  proposalResponse = async (res: MessageEvent) => {
    const data = await JSON.parse(res.data);
    // console.log('wth', data.msg_type);
    // console.log("wer u", this.proposalData);
    if (data.error !== undefined) {
      console.log("Error: ", data.error.message);
      this.connection?.removeEventListener("message", this.proposalResponse, false);
      await this.api.disconnect();
    } else if (data.msg_type === "proposal") {
        // const proposal = data.proposal;
        // this.setPreviousSpot(parseFloat(proposal.spot));
        // this.proposalData.push(proposal);
        // console.log("proposal data", data.proposal);
      // this.setProposalTicks(data.proposal.duration);
      this.proposalData.push(await data.proposal);
      // this.setPayout(data.proposal.payout);
      // console.log("helo", data.proposal.spot);

    //   const updatedData = [...this.proposalData, await data.proposal];
    //   this.proposalData = updatedData;
    //   console.log("wer u", this.proposalData);
      // if (this.proposalData.length > 20) {
      //   this.proposalData.splice(0, 1);
    //   }
    }
  };

  getProposal = async (id: string) => {
    const proposal_request = {
      proposal: 1,
      subscribe: 1,
      amount: this.payout,
      basis: this.basis,
      contract_type: "CALL",
      currency: "USD",
      duration: this.duration,
      duration_unit: "t",
      symbol: id,
    };

    this.unsubscribeProposal();
    this.connectWebSocket();
    this.connection?.addEventListener("message", this.proposalResponse);
    await this.api.proposal(proposal_request);
  }
    // const keepAlive = () => proposal_request;

    // const keepAliveRes = async (res: any) => {
    //   const data = JSON.parse(res.data);
    //   if (data.error !== undefined) {
    //     // runInAction(() => {
    //     console.log("Error: %s ", data.error.message);
    //     connection.removeEventListener("message", keepAliveRes, false);
    //     // });
    //     await api.disconnect();
    //   } else if (data.msg_type === "ping") {
    //     // runInAction(() => {
    //     console.log(data.msg_type);
    //     console.log("ping");
    //     // });
    //   }
    // };

    // const checkSignal = async () => {
    //   keepAlive();
    //   connection.addEventListener("message", keepAliveRes);
    // };

    // try {
    //   checkSignal();
    //   this.unsubscribeProposal();
    //   connection.addEventListener("message", this.proposalResponse);
    //   await api.proposal(proposal_request);
    // } catch (error) {
    //   console.log("Error fetching proposal: ", error);
    // }
//   };

  // subscribeProposal = async () => {
  //   const selectedSymbol = this.selectedSymbol;

  //   if (!selectedSymbol) {
  //     return;
  //   }

  //   await this.getProposal(selectedSymbol);
  // };

  unsubscribeProposal = async () => {
    this.connection?.removeEventListener("message", this.proposalResponse, false);
    // this.proposalData = [];
    this.api.disconnect();
    this.disconnectWebSocket();
  };
}

const proposalStore = new ProposalStore();

export default proposalStore;
