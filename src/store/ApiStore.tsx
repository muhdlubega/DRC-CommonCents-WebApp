import { makeAutoObservable } from "mobx";
import DerivAPIBasic from "https://cdn.skypack.dev/@deriv/deriv-api/dist/DerivAPIBasic";

const app_id = 1089;
const connection = new WebSocket(
  `wss://ws.binaryws.com/websockets/v3?app_id=${app_id}`
);
const api = new DerivAPIBasic({ connection });

interface Tick {
  epoch: number;
  quote: number;
}

class ApiStore {
  duration: number = 5;
  payout: number = 100;
  activeSymbols: any[] = [];
  previousSpot: number | null = null;
  currentSpot: number | null = null;
  data: any = null;
  basis: string = "stake";
  proposalTicks: number = 0;
  isDurationEnded: boolean = false;
  proposalData: any[] = [];
  selectedSymbol: string = '';
  loadedTicks: number = 0;
  ticks: Tick[] = [];

  ticks_history_request = {
    ticks_history: '',
    adjust_start_time: 1,
    count: 100,
    end: 'latest',
    start: 1,
    style: 'ticks',
  };

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

  setActiveSymbols = (symbols: []) => {
    this.activeSymbols = symbols;
  };

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

  handleActiveSymbolsResponse = async (res: MessageEvent) => {
    const data = JSON.parse(res.data);

    if (data.error !== undefined) {
      console.log('Error: ', data.error?.message);
      connection.removeEventListener('message', this.handleActiveSymbolsResponse, false);
      await api.disconnect();
    }

    if (data.msg_type === 'active_symbols') {
      this.setActiveSymbols(data.active_symbols);
      // console.log(data.active_symbols);
      connection.removeEventListener('message', this.handleActiveSymbolsResponse, false);
    }
  };

  getActiveSymbols = async () => {
    const active_symbols_request = {
      active_symbols: 'brief',
      product_type: 'basic',
    };

    connection.addEventListener('message', this.handleActiveSymbolsResponse);
    await api.activeSymbols(active_symbols_request);
  };

  setSelectedSymbol(symbol: string) {
    this.selectedSymbol = symbol;
    this.ticks_history_request.ticks_history = symbol;
  }

  subscribeTicks = async () => {
  await this.tickSubscriber();
  await this.getTicksHistory();
  connection.addEventListener('message', this.tickResponse);
};


  unsubscribeTicks = () => {
    connection.removeEventListener('message', this.tickResponse, false);
    this.tickSubscriber().unsubscribe();
  };

  getTicksHistory = async () => {
    const start = Math.max(0, this.loadedTicks - 80);
    this.ticks_history_request.start = start;
    this.ticks_history_request.count = 100;
  
    connection.addEventListener('message', this.ticksHistoryResponse);
    await api.ticksHistory(this.ticks_history_request);
  };
  

  tickSubscriber = () => {
    const ticksSubscriber = api.subscribe(this.ticks_history_request);
    return ticksSubscriber;
  };  

  ticksHistoryResponse = async (res: MessageEvent) => {
    const data = JSON.parse(res.data);
    if (data.error !== undefined) {
      console.log('Error : ', data.error.message);
      connection.removeEventListener('message', this.ticksHistoryResponse, false);
      await api.disconnect();
    }
    if (data.msg_type === 'history') {
      const historyTicks = data.history.prices.map((price: number, index: number) => ({
        epoch: data.history.times[index],
        quote: price,
      }));
  
      this.setTicks([...this.ticks, ...historyTicks]);
      this.loadedTicks += historyTicks.length;
  
      connection.removeEventListener('message', this.ticksHistoryResponse, false);
    }
  };
  

  tickResponse = async (res: MessageEvent) => {
    const data = JSON.parse(res.data);
    if (data.error !== undefined) {
      console.log('Error: ', data.error.message);
      connection.removeEventListener('message', this.tickResponse, false);
      await api.disconnect();
    }
    if (data.msg_type === 'tick') {
      this.setTicks([...this.ticks, data.tick]);
      // console.log("come to tick", this.ticks)
    }
  };

  setTicks(ticks: Tick[]) {
    this.ticks = ticks;
  }

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
    }
  };

  getProposal = async (id: string) => {
    const proposal_request = {
      proposal: 1,
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
      await api.proposal(proposal_request);
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  unsubscribeProposal = () => {
    if (this.proposalResponse) {
        connection.removeEventListener("message", this.proposalResponse, false);
      }
  };
}

const apiStore = new ApiStore;

export default apiStore;
