import { makeAutoObservable } from "mobx";
import DerivAPIBasic from "https://cdn.skypack.dev/@deriv/deriv-api/dist/DerivAPIBasic";

const app_id = 1089;

interface Tick {
  epoch: EpochTimeStamp;
  quote?: number;
  symbol?: string;
  high?: number;
  low?: number;
  open?: number;
  close?: number;
}

class ApiStore {
  duration: number = 5;
  payout: number = 100;
  activeSymbols: any[] = [];
  previousSpot: number | null = null;
  currentSpot: number | null = null;
  data: any = null;
  basis: string = "stake";
  chartType: string = "candlestick";
  // proposalTicks: number = 0;
  isDurationEnded: boolean = false;
  proposalData: any[] = [];
  selectedSymbol: string = "";
  ticks: Tick[] = [];
  sellSuccessful: boolean = false;
  additionalAmount: number = 0;
  sellFailed: boolean = false;
  deductedAmount: number = 0;
  totalAmountWon: number = 0;
  totalAmountLost: number = 0;

  ticks_history_request = {
    ticks_history: "",
    adjust_start_time: 1,
    count: 300,
    end: "latest",
    start: 300,
    style: "candles"
  };

  connection: WebSocket | null = null;
  api: any = null;

  constructor() {
    makeAutoObservable(this);
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
      this.connection.close();
      this.connection = null;
    }
  }

  setDuration(duration: number) {
    this.duration = duration;
    // this.unsubscribeProposal();
  }

  setPayout(payout: number) {
    this.payout = payout;
    // this.unsubscribeProposal();
  }

  setBasis(basis: string) {
    this.basis = basis;
  }

  setChartType(chartType: string) {
    this.chartType = chartType;
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

  setSellSuccessful(sellSuccessful: boolean) {
    this.sellSuccessful = sellSuccessful;
  }

  setAdditionalAmount(additionalAmount: number) {
    this.additionalAmount = additionalAmount;
  }

  setSellFailed(sellFailed: boolean) {
    this.sellFailed = sellFailed;
  }

  setDeductedAmount(deductedAmount: number) {
    this.deductedAmount = deductedAmount;
  }

  setTotalAmountWon(totalAmountWon: number) {
    this.totalAmountWon = totalAmountWon;
  }

  setTotalAmountLost(totalAmountLost: number) {
    this.totalAmountLost = totalAmountLost;
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
    if (data.msg_type === "candles") {
      // if (this.chartType === "candlestick"){
      const candles = data.candles;
  
      const candlesticks: Tick[] = [];
      let currentMinute: number | null = null;
      let currentCandle: Tick | null = null;
  
      for (const candle of candles) {
        const epoch = candle.epoch;
        const minute = new Date(epoch * 1000).getMinutes();
  
        if (currentMinute === null || minute !== currentMinute) {
          // Start a new candle
          if (currentCandle !== null) {
            // Add the completed candle to the list
            candlesticks.push(currentCandle);
          }
  
          // Create a new candle
          currentCandle = {
            epoch: epoch,
            open: candle.open,
            high: candle.high,
            low: candle.low,
            close: candle.close,
          };
          currentMinute = minute;
        } else {
          // Update the current candle with new values
          currentCandle!.high = Math.max(currentCandle!.high!, candle.high);
          currentCandle!.low = Math.min(currentCandle!.low!, candle.low);
          currentCandle!.close = candle.close;
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
    // } 
    // else if (this.chartType === "line") {
    //   this.ticks = data.candles;

    //   this.setTicks([...this.ticks]);

    //   this.connection?.removeEventListener(
    //     "message",
    //     this.ticksHistoryResponse,
    //     false
    //   );
    //   }
    }
  };
  
  tickResponse = async (res: MessageEvent) => {
    const data = JSON.parse(res.data);
    if (data.error !== undefined) {
      console.log("Error: ", data.error.message);
      this.connection?.removeEventListener("message", this.tickResponse, false);
      await this.api.disconnect();
    }
    if (data.msg_type === "ohlc") {
      // if(this.chartType === "candlestick") {
        const newTick = {
        epoch: data.ohlc.epoch,
        close: data.ohlc.close,
        open: data.ohlc.open,
        high: data.ohlc.high,
        low: data.ohlc.low,
      };
  
      const currentMinute = new Date(newTick.epoch * 1000).getMinutes();
  
      if (this.ticks.length === 0) {
        // If there are no previous ticks, add the current tick
        this.setTicks([newTick]);
      } else {
        const lastTick = this.ticks[this.ticks.length - 1];
        const lastMinute = new Date(lastTick.epoch * 1000).getMinutes();
  
        if (currentMinute !== lastMinute) {
          // If the current tick belongs to a different minute, add it to the list
          this.setTicks([...this.ticks, newTick]);
        } else {
          // Update the previous tick with the new values
          lastTick.high = Math.max(lastTick.high as number, newTick.high);
          lastTick.low = Math.min(lastTick.low as number, newTick.low);
          lastTick.close = newTick.close;
        }
      }
    // } 
    // else if (this.chartType === "line") {
    //     const newTick = {
    //       epoch: data.ohlc.epoch,
    //       close: data.ohlc.close,
    //     };
    //     this.setTicks([...this.ticks, newTick]);
    //   }
    }
  };
  

  setTicks(ticks: Tick[]) {
    this.ticks = ticks;
  }

  proposalResponse = async (res: MessageEvent) => {
    const data = JSON.parse(res.data);
    if (data.error !== undefined) {
      console.log("Error: ", data.error.message);
      this.connection?.removeEventListener("message", this.proposalResponse, false);
      await this.api.disconnect();
    } else if (data.msg_type === "proposal") {
      this.setPreviousSpot(parseFloat(data.proposal.spot));
      // this.setProposalTicks(data.proposal.duration);
      this.proposalData.push(data.proposal);
      const updatedData = [...this.proposalData, data.proposal];
      // if (this.proposalData.length > 20) {
      //   this.proposalData.splice(14, 1);
      // }
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
      this.connection?.addEventListener("message", this.proposalResponse);
      await this.api.proposal(proposal_request);
    } catch (error) {
      console.log("Error fetching proposal: ", error);
    }
  };

  // subscribeProposal = async () => {
  //   const selectedSymbol = this.selectedSymbol;
  
  //   if (!selectedSymbol) {
  //     return;
  //   }
  
  //   await this.getProposal(selectedSymbol);
  // };

  unsubscribeProposal = async () => {
    this.connection?.removeEventListener("message", this.proposalResponse, false);
    // await this.api.disconnect();
  }
}

const apiStore = new ApiStore();

export default apiStore;
