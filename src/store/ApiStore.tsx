import { makeAutoObservable } from "mobx";
import DerivAPIBasic from "https://cdn.skypack.dev/@deriv/deriv-api/dist/DerivAPIBasic";

const app_id = 1089;
const connection = new WebSocket(
  `wss://ws.binaryws.com/websockets/v3?app_id=${app_id}`
);
const api = new DerivAPIBasic({ connection });

interface Tick {
  epoch: EpochTimeStamp;
  quote: number;
  symbol: string;
}

class ApiStore {
  duration: number = 5;
  payout: number = 100;
  activeSymbols: any[] = [];
  previousSpot: number | null = null;
  currentSpot: number | null = null;
  data: any = null;
  basis: string = "stake";
  // proposalTicks: number = 0;
  isDurationEnded: boolean = false;
  proposalData: any[] = [];
  selectedSymbol: string = "";
  ticks: Tick[] = [];

  ticks_history_request = {
    ticks_history: "",
    adjust_start_time: 1,
    count: 300,
    end: "latest",
    start: 300,
    style: "ticks",
  };

  connection: WebSocket | null = null;
  api: any = null;

  constructor() {
    makeAutoObservable(this);
    this.connectWebSocket();
  }

  connectWebSocket() {
    const app_id = 1089;
    this.connection = new WebSocket(
      `wss://ws.binaryws.com/websockets/v3?app_id=${app_id}`
    );
    this.api = new DerivAPIBasic({ connection: this.connection });
  }

  disconnectWebSocket() {
    if (this.connection) {
      this.connection.close();
      this.connection = null;
    }
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

  setActiveSymbols = (symbols: []) => {
    this.activeSymbols = symbols;
  };

  setPreviousSpot(previousSpot: number) {
    this.previousSpot = previousSpot;
  }

  setCurrentSpot(currentSpot: number) {
    this.currentSpot = currentSpot;
  }

  // setProposalTicks(proposalTicks: number) {
  //   this.proposalTicks = proposalTicks;
  // }

  setIsDurationEnded(isDurationEnded: boolean) {
    this.isDurationEnded = isDurationEnded;
  }

  setData(data: any) {
    this.duration = parseInt(data.duration, 10);
    this.payout = parseInt(data.display_value, 10);
    this.basis = data.basis;
    this.previousSpot = parseFloat(data.spot);
    this.currentSpot = parseFloat(data.spot);
    // this.proposalTicks = parseInt(data.duration, 10);
  }

  handleActiveSymbolsResponse = async (res: MessageEvent) => {
    const data = JSON.parse(res.data);

    if (data.error !== undefined) {
      console.log("Error: ", data.error?.message);
      this.connection?.removeEventListener(
        "message",
        this.handleActiveSymbolsResponse,
        false
      );
      await this.api.disconnect();
    }

    if (data.msg_type === "active_symbols") {
      this.setActiveSymbols(data.active_symbols);
      this.connection?.removeEventListener(
        "message",
        this.handleActiveSymbolsResponse,
        false
      );
    }
  };

  getActiveSymbols = async () => {
    const active_symbols_request = {
      active_symbols: "brief",
      product_type: "basic",
    };

    this.connection?.addEventListener("message", this.handleActiveSymbolsResponse);
    await this.api.activeSymbols(active_symbols_request);
  };

  setSelectedSymbol(symbol: string) {
    this.selectedSymbol = symbol;
    this.ticks_history_request.ticks_history = symbol;
  }

  subscribeTicks = async () => {
    this.unsubscribeTicks();
    this.connectWebSocket();

    await this.tickSubscriber();
    await this.getTicksHistory();
    this.connection?.addEventListener("message", this.tickResponse);
  };

  unsubscribeTicks = () => {
    this.connection?.removeEventListener("message", this.tickResponse, false);
    this.tickSubscriber().unsubscribe();
    this.disconnectWebSocket(); 
  };

  getTicksHistory = async () => {
    this.ticks_history_request.ticks_history = this.selectedSymbol;

    this.connection?.addEventListener("message", this.ticksHistoryResponse);
    await this.api.ticksHistory(this.ticks_history_request);
  };

  tickSubscriber = () => {
    const ticksSubscriber = this.api.subscribe(this.ticks_history_request);
    return ticksSubscriber;
  };

  ticksHistoryResponse = async (res: MessageEvent) => {
    const data = JSON.parse(res.data);
    if (data.error !== undefined) {
      console.log("Error : ", data.error.message);
      this.connection?.removeEventListener(
        "message",
        this.ticksHistoryResponse,
        false
      );
      await this.api.disconnect();
    }
    if (data.msg_type === "history") {
      const historyTicks = data.history.prices.map((price: number, index: number) => ({
        epoch: data.history.times[index],
        quote: price,
      }));

      this.setTicks([...this.ticks, ...historyTicks]);

      this.connection?.removeEventListener(
        "message",
        this.ticksHistoryResponse,
        false
      );
    }
  };

  tickResponse = async (res: MessageEvent) => {
    const data = JSON.parse(res.data);
    if (data.error !== undefined) {
      console.log("Error: ", data.error.message);
      this.connection?.removeEventListener("message", this.tickResponse, false);
      await this.api.disconnect();
    }
    if (data.msg_type === "tick") {
      const newTick = {
        epoch: data.tick.epoch,
        quote: data.tick.quote,
        symbol: data.tick.symbol,
      };
      this.setTicks([...this.ticks, newTick]);
    }
  };

  setTicks(ticks: Tick[]) {
    this.ticks = ticks;
  }

  proposalResponse = async (res: MessageEvent) => {
    const data = JSON.parse(res.data);
    if (data.error !== undefined) {
      console.log("Error: ", data.error.message);
      connection.removeEventListener("message", this.proposalResponse, false);
      await api.disconnect();
    } else if (data.msg_type === "proposal") {
      this.setPreviousSpot(parseFloat(data.proposal.spot));
      // this.setProposalTicks(data.proposal.duration);
      this.proposalData.push(data.proposal);
      const updatedData = [...this.proposalData, data.proposal];
      if (this.proposalData.length > 20) {
        this.proposalData.splice(0, 1);
      }
      this.proposalData = updatedData;
      // console.log('ask price', data.proposal.display_value, 'spot', data.proposal.spot, 'payout', data.proposal.payout);
      // console.log('array:', updatedData)
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

    try {
      this.unsubscribeProposal();
      connection.addEventListener("message", this.proposalResponse);
      await api.proposal(proposal_request);
    } catch (error) {
      console.log("Error fetching proposal: ", error);
    }
  };

  unsubscribeProposal = () => {
      connection.removeEventListener("message", this.proposalResponse, false);
  }
}

const apiStore = new ApiStore();

export default apiStore;