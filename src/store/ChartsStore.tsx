import { action, makeObservable, observable } from "mobx";
import DerivAPIBasic from "https://cdn.skypack.dev/@deriv/deriv-api/dist/DerivAPIBasic";

const app_id = 1089;
const connection = new WebSocket(
  `wss://ws.binaryws.com/websockets/v3?app_id=${app_id}`
);
const api = new DerivAPIBasic({ connection });

export const id_array = [
  '1HZ10V',
  '1HZ25V',
  '1HZ50V',
  '1HZ75V',
  '1HZ100V',
];

export const id_volatility_index = [
  'R_10',
  'R_25',
  'R_50',
  'R_75',
  'R_100',
];

export const id_jump_index = [
  'JD10',
  'JD25',
  'JD50',
  'JD75',
  'JD100',
]

export const id_bear_bull = [
  'RDBEAR',
  'RDBULL',
]

interface Tick {
  epoch: EpochTimeStamp;
  quote: number;
  symbol: string;
}

class ChartsStore {
  activeSymbols: string[] = [];
  data: any = null;
  proposalTicks: number = 0;
  isDurationEnded: boolean = false;
  proposalData: any[] = [];
  symbols: any[] = [];
  selectedSymbol: string = "";
  marketType: string = "volatility1s";
  ticks: Tick[] = [];

  ticks_history_request = {
    ticks_history: "",
    adjust_start_time: 1,
    count: 10,
    end: "latest",
    start: 1,
    style: "ticks",
  };

  constructor() {
    makeObservable(this,{
      activeSymbols: observable,
      data: observable,
      symbols: observable,
      proposalTicks: observable,
      isDurationEnded: observable,
      proposalData: observable,
      selectedSymbol: observable,
      marketType: observable,
      ticks: observable,
      setProposalTicks: action.bound,
      setIsDurationEnded: action.bound,
      setActiveSymbols: action.bound,
      getActiveSymbols: action.bound,
      setSelectedSymbol: action.bound,
      handleActiveSymbolsResponse: action.bound,
      subscribeTicksGroup: action.bound,
      unsubscribeTicksGroup: action.bound,
      getTicksHistoryGroup: action.bound,
      tickSubscriberGroup: action.bound,
      ticksHistoryResponse: action.bound,
      tickResponse: action.bound,
      setTicks: action.bound,
    });
  }

  setProposalTicks(proposalTicks: number) {
    this.proposalTicks = proposalTicks;
  }

  setIsDurationEnded(isDurationEnded: boolean) {
    this.isDurationEnded = isDurationEnded;
  }

  setActiveSymbols = (symbols: string[]) => {
    this.activeSymbols = symbols;
  };

  getActiveSymbols = async () => {
    // let symbols = [];
  
    switch (this.marketType) {
      case "volatility1s":
        this.symbols = id_array;
        break;
      case "volatility":
        this.symbols = id_volatility_index;
        break;
      case "jump":
        this.symbols = id_jump_index;
        break;
      case "bear_bull":
        this.symbols = id_bear_bull;
        break;
      default:
        this.symbols = id_array;
    }
  
    const active_symbols_request = {
      active_symbols: "brief",
      product_type: "basic",
    };
  
    connection?.addEventListener("message", this.handleActiveSymbolsResponse);
    await api.activeSymbols(active_symbols_request);
  
    this.setActiveSymbols(this.symbols);
  };
  

  setSelectedSymbol(symbol: string) {
    this.selectedSymbol = symbol;
    this.ticks_history_request.ticks_history = symbol;
  }

  setMarketType(marketType: string) {
    this.marketType = marketType;
    this.getActiveSymbols();
  }

  handleActiveSymbolsResponse = async (res: MessageEvent) => {
    const data = JSON.parse(res.data);

    if (data.error !== undefined) {
      console.log("Error: ", data.error?.message);
      connection?.removeEventListener(
        "message",
        this.handleActiveSymbolsResponse,
        false
      );
      await api.disconnect();
    }

    if (data.msg_type === "active_symbols") {
      this.setActiveSymbols(data.active_symbols);
      connection?.removeEventListener(
        "message",
        this.handleActiveSymbolsResponse,
        false
      );
    }
  };

  subscribeTicksGroup = async () => {
  this.unsubscribeTicksGroup();
  await this.tickSubscriberGroup();
  await this.getTicksHistoryGroup();
  connection.addEventListener('message', this.tickResponse);
  };

  unsubscribeTicksGroup = () => {
    this.tickSubscriberGroup().unsubscribe();
    connection.removeEventListener('message', this.tickResponse, false);
  };

  getTicksHistoryGroup = async () => {
    this.ticks_history_request.ticks_history = this.selectedSymbol;

    connection.addEventListener("message", this.ticksHistoryResponse);
    await api.ticksHistory(this.ticks_history_request);
  };

  tickSubscriberGroup = () => {
    const ticksSubscriber = api.subscribe(this.ticks_history_request);
    return ticksSubscriber;
  };


  ticksHistoryResponse = async (res: MessageEvent) => {
    const data = JSON.parse(res.data);
    if (data.error !== undefined) {
      // runInAction(() => {
      console.log("Error : ", data.error.message);
      connection?.removeEventListener(
        "message",
        this.ticksHistoryResponse,
        false
      );
    // })
      await api.disconnect();
    }
    if (data.msg_type === "history") {
      // runInAction(() => {
      const historyTicks = data.history.prices.map((price: number, index: number) => ({
        epoch: data.history.times[index],
        quote: price,
      }));

      this.setTicks([...this.ticks, ...historyTicks]);
      // console.log(historyTicks)

      connection?.removeEventListener(
        "message",
        this.ticksHistoryResponse,
        false
      );
    // })
    }
  };

  tickResponse = async (res: MessageEvent) => {
    const data = JSON.parse(res.data);
    if (data.error !== undefined) {
      // runInAction(() => {
      console.log("Error: ", data.error.message);
      connection?.removeEventListener("message", this.tickResponse, false);
      // })
      await api.disconnect();
    }
    if (data.msg_type === "tick") {
      // runInAction(() => {
      const newTick = {
        epoch: data.tick.epoch,
        quote: data.tick.quote,
        symbol: data.tick.symbol,
      };
      this.setTicks([...this.ticks, newTick]);
    // })
    }
  };

  setTicks(ticks: Tick[]) {
    this.ticks = ticks;
  }
}

const chartsStore = new ChartsStore();

export default chartsStore;