import { makeAutoObservable } from "mobx";
import DerivAPIBasic from "https://cdn.skypack.dev/@deriv/deriv-api/dist/DerivAPIBasic";

const app_id = 1089;
const connection = new WebSocket(
  `wss://ws.binaryws.com/websockets/v3?app_id=${app_id}`
);
const api = new DerivAPIBasic({ connection });

class ApiStore {
  duration: number = 5;
  payout: number = 100;
  previousSpot: number | null = null;
  currentSpot: number | null = null;
  data: any = null;
  basis: string = "stake";
  proposalTicks: number = 0;
  isDurationEnded: boolean = false;
  proposalData: any[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  setDuration(duration: number) {
    this.duration = duration;
  }

  setPayout(payout: number) {
    this.payout = payout;
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
  
  setProposalTicks(proposalTicks: number) {
    this.proposalTicks = proposalTicks;
  }

  setIsDurationEnded(isDurationEnded: boolean) {
    this.isDurationEnded = isDurationEnded;
  }

  setData(data: any) {
    this.duration = parseInt(data.duration, 10);
    this.payout = parseInt(data.display_value, 10);
    this.basis = data.basis;
    this.previousSpot = parseFloat(data.spot);
    this.currentSpot = parseFloat(data.spot);
    this.proposalTicks = parseInt(data.duration, 10);
  }

//   getProposal = async (id: string) => {
//     const proposal_request = {
//       proposal: 1,
//       subscribe: 1,
//       amount: this.payout,
//       basis: this.basis,
//       contract_type: "CALL",
//       currency: "USD",
//       duration: this.duration,
//       duration_unit: "t",
//       symbol: id,
//       barrier: "+0.1",
//     };

//     const proposalResponse = async (res: MessageEvent) => {
//       const data = JSON.parse(res.data);
//       if (data.error !== undefined) {
//         console.log("Error: %s ", data.error.message);
//         connection.removeEventListener("message", proposalResponse, false);
//         await api.disconnect();
//       } else if (data.msg_type === "proposal") {
//         this.setData(data.proposal);
//         this.setPreviousSpot(parseFloat(data.proposal.spot));
//         this.setProposalTicks(data.proposal.duration);
//       }
//     };

//     connection.addEventListener("message", proposalResponse);
//     await api.proposal(proposal_request);
//   };

//   unsubscribeProposal = () => {
//     if (this.proposalResponse) {
//         connection.removeEventListener("message", this.proposalResponse, false);
//       }
//   };

  proposalResponse = async (res: MessageEvent) => {
    const data = JSON.parse(res.data);
    if (data.error !== undefined) {
      console.log("Error: %s ", data.error.message);
      connection.removeEventListener("message", this.proposalResponse, false);
      await api.disconnect();
    } else if (data.msg_type === "proposal") {
    //   this.setData(data.proposal);
      this.setPreviousSpot(parseFloat(data.proposal.spot));
      this.setProposalTicks(data.proposal.duration);
      this.proposalData.push(data.proposal);

      // const updatedData = [...this.proposalData, data.proposal];
      // if (this.proposalData.length > 20) {
      //   this.proposalData.splice(0, 1);
      // }
      // this.proposalData = updatedData;
      // console.log("api store array", data.proposal)
      // console.log("updated data", updatedData)
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
      barrier: "+0.1",
    };

    connection.addEventListener("message", this.proposalResponse);
    await api.proposal(proposal_request);
  };

  unsubscribeProposal = () => {
    if (this.proposalResponse) {
        connection.removeEventListener("message", this.proposalResponse, false);
      }
  };
}

const apiStore = new ApiStore;

export default apiStore;
