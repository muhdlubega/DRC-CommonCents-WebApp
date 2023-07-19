import { action, makeObservable, observable } from "mobx";
import DerivAPIBasic from "https://cdn.skypack.dev/@deriv/deriv-api/dist/DerivAPIBasic";
import {
  id_array,
  id_jump_index,
  id_volatility_index,
  id_bear_bull,
} from "../arrays/MarketArray";

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

class ChartsStore {
  //contains charts data for live data on the homepage
  activeSymbols: string[] = [];
  data: unknown = null;
  proposalTicks: number = 0;
  proposalData: string[] = [];
  symbols: string[] = [];
  selectedSymbol: string = "1HZ10V";
  marketType: string = "volatility1s";
  ticks: Tick[] = [];
  ticks_history_request: Record<string, number | string> = {
    ticks_history: this.selectedSymbol,
    adjust_start_time: 1,
    count: 10,
    end: "latest",
    start: 1,
    style: "ticks",
  };

  constructor() {
    makeObservable(this, {
      activeSymbols: observable,
      data: observable,
      symbols: observable,
      proposalTicks: observable,
      proposalData: observable,
      selectedSymbol: observable,
      marketType: observable,
      ticks: observable,
      ticks_history_request: observable,
      setProposalTicks: action.bound,
      setSymbolsArray: action,
      setMarketType: action,
      setSelectedSymbol: action.bound,
      subscribeTicksGroup: action,
      unsubscribeTicksGroup: action,
      getTicksHistoryGroup: action,
      tickSubscriberGroup: action,
      ticksHistoryResponse: action,
      tickResponse: action,
      setTicks: action.bound,
    });
  }

  setProposalTicks(proposalTicks: number) {
    this.proposalTicks = proposalTicks;
  }

  setSymbolsArray = async () => {
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

    this.symbols.forEach((id) => {
      this.setSelectedSymbol(id);
      this.subscribeTicksGroup();
    });
  };

  setSelectedSymbol(symbol: string) {
    this.selectedSymbol = symbol;
  }

  setMarketType(marketType: string) {
    this.unsubscribeTicksGroup();
    this.marketType = marketType;
    this.setSymbolsArray();
  }

  subscribeTicksGroup = async () => {
    this.ticks_history_request.ticks_history = this.selectedSymbol;

    this.unsubscribeTicksGroup();
    this.tickSubscriberGroup();
    this.getTicksHistoryGroup();
    connection.addEventListener("message", this.tickResponse);
  };

  unsubscribeTicksGroup = () => {
    connection.removeEventListener("message", this.tickResponse, false);
    this.tickSubscriberGroup().unsubscribe();
  };

  getTicksHistoryGroup = async () => {
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
      console.log("Error : ", data.error.message);
      connection?.removeEventListener(
        "message",
        this.ticksHistoryResponse,
        false
      );
      await api.disconnect();
    }
    if (data.msg_type === "history") {
      const historyTicks = data.history.prices.map(
        (price: number, index: number) => ({
          epoch: data.history.times[index],
          quote: price,
        })
      );
      this.setTicks([...this.ticks, ...historyTicks]);
      connection?.removeEventListener(
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
      connection?.removeEventListener("message", this.tickResponse, false);
      await api.disconnect();
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
}

const chartsStore = new ChartsStore();

export default chartsStore;
