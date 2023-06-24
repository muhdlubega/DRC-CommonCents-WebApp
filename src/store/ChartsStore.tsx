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

class ChartsStore {
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

  constructor() {
    makeAutoObservable(this);
  }

  setProposalTicks(proposalTicks: number) {
    this.proposalTicks = proposalTicks;
  }

  setIsDurationEnded(isDurationEnded: boolean) {
    this.isDurationEnded = isDurationEnded;
  }

  setActiveSymbols = (symbols: []) => {
    this.activeSymbols = symbols;
  };


  setData(data: any) {
    this.duration = parseInt(data.duration, 10);
    this.payout = parseInt(data.display_value, 10);
    this.basis = data.basis;
    this.previousSpot = parseFloat(data.spot);
    this.currentSpot = parseFloat(data.spot);
    this.proposalTicks = parseInt(data.duration, 10);
  }

  getActiveSymbols = async () => {
    const active_symbols_request = {
      active_symbols: "brief",
      product_type: "basic",
    };

    connection?.addEventListener("message", this.handleActiveSymbolsResponse);
    await api.activeSymbols(active_symbols_request);
  };

  setSelectedSymbol(symbol: string) {
    this.selectedSymbol = symbol;
    this.ticks_history_request.ticks_history = symbol;
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
      console.log("Error : ", data.error.message);
      connection?.removeEventListener(
        "message",
        this.ticksHistoryResponse,
        false
      );
      await api.disconnect();
    }
    if (data.msg_type === "history") {
      const historyTicks = data.history.prices.map((price: number, index: number) => ({
        epoch: data.history.times[index],
        quote: price,
      }));

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