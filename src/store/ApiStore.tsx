import { action, makeObservable, observable } from "mobx";
import DerivAPIBasic from "https://cdn.skypack.dev/@deriv/deriv-api/dist/DerivAPIBasic";
// import { MarketName } from "../arrays/MarketArray";
// import 

const app_id = 1089;

export interface Tick {
  epoch: EpochTimeStamp;
  quote?: number;
  symbol?: string;
  high?: number;
  low?: number;
  open?: number;
  close?: number;
}

class ApiStore {
  //contains main trading data from the Deriv API for charts and buy/sell function
  granularity: number = 60;
  activeSymbols: any[] = [];
  data: unknown = null;
  chartType: string = "candlestick";
  isDurationEnded: boolean = false;
  showOnboarding: boolean = false;
  isTicks: boolean = false;
  selectedSymbol: string = "1HZ10V";
  ticks: Tick[] = [];
  proposalTicks: Tick[] = [];
  ticks_history_request: Record<string, number | string> = {
    ticks_history: this.selectedSymbol,
    adjust_start_time: 1,
    count: 100,
    granularity: this.granularity,
    end: "latest",
    start: 1680040550,
    style: "candles",
  };
  connection: WebSocket | null = null;
  api: typeof DerivAPIBasic | null = null;

  constructor() {
    makeObservable(this, {
      granularity: observable,
      activeSymbols: observable,
      data: observable,
      chartType: observable,
      isDurationEnded: observable,
      showOnboarding: observable,
      isTicks: observable,
      selectedSymbol: observable,
      ticks: observable,
      proposalTicks: observable,
      ticks_history_request: observable,
      connectWebSocket: action.bound,
      disconnectWebSocket: action.bound,
      setChartType: action.bound,
      setActiveSymbols: action.bound,
      setIsDurationEnded: action.bound,
      setShowOnboarding: action.bound,
      setGranularity: action.bound,
      toggleTicks: action.bound,
      handleActiveSymbolsResponse: action,
      getActiveSymbols: action,
      setSelectedSymbol: action.bound,
      subscribeTicks: action,
      unsubscribeTicks: action,
      getTicksHistory: action,
      tickSubscriber: action,
      ticksHistoryResponse: action,
      tickResponse: action,
      setTicks: action.bound,
      setProposalTicks: action.bound,
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

  setChartType(chartType: string) {
    this.chartType = chartType;
  }

  setActiveSymbols = (symbols: []) => {
    this.activeSymbols = symbols;
  };

  setIsDurationEnded(isDurationEnded: boolean) {
    this.isDurationEnded = isDurationEnded;
  }

  setShowOnboarding(showOnboarding: boolean) {
    this.showOnboarding = showOnboarding;
  }

  setGranularity(granularity: number) {
    this.granularity = granularity;
    this.ticks_history_request.granularity = granularity;
  }

  toggleTicks(isTicks: boolean) {
    this.isTicks = isTicks;
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

    this.connection?.addEventListener(
      "message",
      this.handleActiveSymbolsResponse
    );
    await this.api.activeSymbols(active_symbols_request);
  };

  setSelectedSymbol(symbol: string) {
    this.selectedSymbol = symbol;
    this.ticks_history_request.ticks_history = symbol;
  }

  // setSelectedSymbol(marketName: string) {
  //   const symbol = Object.keys(MarketName).find(
  //     key => MarketName[key] === marketName
  //   );
  
  //   if (symbol) {
  //     this.selectedSymbol = symbol;
  //     this.ticks_history_request.ticks_history = symbol;
  //   }
  // }
  
  subscribeTicks = async () => {
    //subscribe ticks logic sends a different request for ticks chart
    this.ticks_history_request = this.isTicks
      ? {
          ticks_history: this.selectedSymbol,
          adjust_start_time: 1,
          count: 100,
          end: "latest",
          start: 1680040550,
          style: "ticks",
        }
      : {
          ticks_history: this.selectedSymbol,
          adjust_start_time: 1,
          count: 100,
          granularity: this.granularity,
          end: "latest",
          start: 1680040550,
          style: "candles",
        };

    //unsubscribe first before subscribing and reconnecting to websocket to clear the previous data
    this.unsubscribeTicks();
    this.connectWebSocket();

    this.tickSubscriber();
    this.getTicksHistory();
    this.connection?.addEventListener("message", this.tickResponse);
  };

  unsubscribeTicks = () => {
    this.connection?.removeEventListener("message", this.tickResponse, false);
    this.ticks = [];
    this.proposalTicks = [];
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
    } else if (data.msg_type === "candles") {
      const candles = data.candles;

      const candlesticks: Tick[] = [];
      let currentTime: number | null = null;
      let currentCandle: Tick | null = null;

      //if data.msg.type received is candles (for candlestick request) add candles into the candlesticks array
      //candlestick request receives candles in terms of time period based off the granularity
      for (const candle of candles) {
        const epoch = candle.epoch;

        //check is added to ensure push to array is done when epoch is not current time and is candlesticks from history
        if (currentTime === null || epoch * 1000 !== currentTime) {
          if (currentCandle !== null) {
            candlesticks.push(currentCandle);
          }

          currentCandle = {
            epoch: epoch,
            open: Number(candle.open),
            high: Number(candle.high),
            low: Number(candle.low),
            close: Number(candle.close),
          };
          currentTime = epoch * 1000;
        } else {
          //if epoch equals to current time then data not pushed into array and values for high, low and close are retrieved from calculations
          currentCandle!.high = Math.max(currentCandle!.high!, candle.high);
          currentCandle!.low = Math.min(currentCandle!.low!, candle.low);
          currentCandle!.close = Number(candle.close);
        }
      }

      if (currentCandle !== null) {
        // Add the last completed candle to the list
        candlesticks.push(currentCandle);
      }

      this.setTicks(candlesticks);

      this.connection?.removeEventListener(
        "message",
        this.ticksHistoryResponse,
        false
      );
    } else if (data.msg_type === "history") {
      const historyTicks = data.history.prices.map(
        (price: number, index: number) => ({
          epoch: data.history.times[index],
          quote: price,
        })
      );

      //if data.msg.type received is history (for tick request) add ticks into the tick array
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
    } else if (data.msg_type === "ohlc") {
      //if data.msg.type received is ohlc (for candlestick request) add latest subscribed ticks into the ticks array
      const newTick = {
        epoch: data.ohlc.epoch,
        close: Number(data.ohlc.close),
        open: Number(data.ohlc.open),
        high: Number(data.ohlc.high),
        low: Number(data.ohlc.low),
      };

      //subscribed ticks added to a separate array for proposal to avoid conflicts
      this.setProposalTicks([...this.proposalTicks, newTick]);

      //current time is declared in terms of ticks, minutes, hours and days based on granularity
      let currentTime = 0;
      if (this.granularity === 60) {
        if (this.isTicks) {
          currentTime = newTick.epoch * 1000;
        } else {
          currentTime = new Date(newTick.epoch * 1000).getMinutes();
        }
      } else if (this.granularity === 3600) {
        currentTime = new Date(newTick.epoch * 1000).getHours();
      } else if (this.granularity === 86400) {
        currentTime = new Date(newTick.epoch * 1000).getDay();
      }

      if (this.ticks.length === 0) {
        // current tick is added into the ticks array if there are no previous ticks
        this.setTicks([newTick]);
      } else {
        //if previous ticks exist previous time is declared in terms of ticks, minutes, hours and days based on granularity in a similar fashion to current time
        const lastTick = this.ticks[this.ticks.length - 1];
        let lastTime = 0;
        if (this.granularity === 60) {
          if (this.isTicks) {
            lastTime = lastTick.epoch * 1000;
          } else {
            lastTime = new Date(lastTick.epoch * 1000).getMinutes();
          }
        } else if (this.granularity === 3600) {
          lastTime = new Date(lastTick.epoch * 1000).getHours();
        } else if (this.granularity === 86400) {
          lastTime = new Date(lastTick.epoch * 1000).getDay();
        }

        //current time is compared to previous time
        if (currentTime !== lastTime) {
          //if current time differs from previous time based on the epoch then tick is pushed into the array as a candle
          this.setTicks([...this.ticks, newTick]);
        } else {
          //if previous time equals to current time then data not pushed into array and values for high, low and close are retrieved from calculations
          lastTick.high = Math.max(lastTick.high as number, newTick.high);
          lastTick.low = Math.min(lastTick.low as number, newTick.low);
          lastTick.close = Number(newTick.close);
        }        
      }
    } else if (data.msg_type === "tick") {
      //if data.msg.type received is tick (for tick request) add latest subscribed ticks into the tick array
      const newTick = {
        epoch: data.tick.epoch,
        quote: data.tick.quote,
      };
      this.setProposalTicks([...this.proposalTicks, newTick]);
      this.setTicks([...this.ticks, newTick]);
    }
  };

  setTicks(ticks: Tick[]) {
    this.ticks = ticks;
  }

  setProposalTicks(proposalTicks: Tick[]) {
    this.proposalTicks = proposalTicks;
  }
}

const apiStore = new ApiStore();

export default apiStore;
