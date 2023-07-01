import { action, makeObservable, observable } from "mobx";
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
  granularity: number = 60;
  activeSymbols: any[] = [];
  previousSpot: number = 0;
  currentSpot: number = 0;
  data: any = null;
  basis: string = "stake";
  chartType: string = "candlestick";
  isDurationEnded: boolean = false;
  showOnboarding: boolean = false;
  isTicks: boolean = false;
  proposalData: any[] = [];
  selectedSymbol: string = "";
  ticks: Tick[] = [];
  sellSuccessful: boolean = false;
  additionalAmount: number = 0;
  sellFailed: boolean = false;
  deductedAmount: number = 0;
  totalAmountWon: number = 0;
  totalAmountLost: number = 0;

  connection: WebSocket | null = null;
  api: any = null;

  constructor() {
    makeObservable(this, {
      duration: observable,
      payout: observable,
      granularity: observable,
      activeSymbols: observable,
      previousSpot: observable,
      currentSpot: observable,
      data: observable,
      basis: observable,
      chartType: observable,
      isDurationEnded: observable,
      showOnboarding: observable,
      isTicks: observable,
      proposalData: observable,
      selectedSymbol: observable,
      ticks: observable,
      sellSuccessful: observable,
      additionalAmount: observable,
      sellFailed: observable,
      deductedAmount: observable,
      totalAmountWon: observable,
      totalAmountLost: observable,
      connectWebSocket: action.bound,
      disconnectWebSocket: action.bound,
      setDuration: action.bound,
      setPayout: action.bound,
      setBasis: action.bound,
      setChartType: action.bound,
      setActiveSymbols: action.bound,
      setPreviousSpot: action.bound,
      setCurrentSpot: action.bound,
      setIsDurationEnded: action.bound,
      setShowOnboarding: action.bound,
      setSellSuccessful: action.bound,
      setAdditionalAmount: action.bound,
      setSellFailed: action.bound,
      setDeductedAmount: action.bound,
      setTotalAmountLost: action.bound,
      setTotalAmountWon: action.bound,
      setGranularity: action.bound,
      toggleTicks: action.bound,
      handleActiveSymbolsResponse: action.bound,
      getActiveSymbols: action.bound,
      setSelectedSymbol: action.bound,
      subscribeTicks: action.bound,
      unsubscribeTicks: action.bound,
      getTicksHistory: action.bound,
      tickSubscriber:action.bound,
      ticksHistoryResponse: action.bound,
      tickResponse: action.bound,
      setTicks: action.bound,
      proposalResponse: action.bound,
      getProposal: action.bound,
      unsubscribeProposal: action.bound,
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
    this.payout = payout;
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

  setIsDurationEnded(isDurationEnded: boolean) {
    this.isDurationEnded = isDurationEnded;
  }

  setShowOnboarding(showOnboarding: boolean) {
    this.showOnboarding = showOnboarding;
  }

  setSellSuccessful(sellSuccessful: boolean) {
    // runInAction(() => {
    this.sellSuccessful = sellSuccessful;
    // })
  }

  setAdditionalAmount(additionalAmount: number) {
    // runInAction(() => {
    this.additionalAmount = additionalAmount;
    // })
  }

  setSellFailed(sellFailed: boolean) {
    // runInAction(() => {
    this.sellFailed = sellFailed;
    // })
  }

  setDeductedAmount(deductedAmount: number) {
    // runInAction(() => {
    this.deductedAmount = deductedAmount;
    // })
  }

  setTotalAmountWon(totalAmountWon: number) {
    // runInAction(() => {
    this.totalAmountWon = totalAmountWon;
    // })
  }

  setTotalAmountLost(totalAmountLost: number) {
    // runInAction(() => {
    this.totalAmountLost = totalAmountLost;
    // })
  }

  // toggleGranularity() {
  //   this.isHourlyGranularity = !this.isHourlyGranularity;
  //   this.ticks_history_request.granularity = this.isHourlyGranularity
  //     ? 3600
  //     : 60;
  // }

  setGranularity(granularity: number){
    this.granularity = granularity
    this.ticks_history_request.granularity = granularity
  }

  toggleTicks(isTicks: boolean){
    this.isTicks = isTicks;
  }

  handleActiveSymbolsResponse = async (res: MessageEvent) => {
    const data = JSON.parse(res.data);

    if (data.error !== undefined) {
      // runInAction(() => {
        console.log("Error: ", data.error?.message);
        this.connection?.removeEventListener(
          "message",
          this.handleActiveSymbolsResponse,
          false
        );
      // });
      await this.api.disconnect();
    }

    if (data.msg_type === "active_symbols") {
      // runInAction(() => {
        this.setActiveSymbols(data.active_symbols);
        this.connection?.removeEventListener(
          "message",
          this.handleActiveSymbolsResponse,
          false
        );
      // });
    }
  };

  getActiveSymbols = async () => {
    const active_symbols_request = {
      active_symbols: "brief",
      product_type: "basic",
    };

    // runInAction(() => {
      this.connection?.addEventListener(
        "message",
        this.handleActiveSymbolsResponse
      );
    // });
    await this.api.activeSymbols(active_symbols_request);
  };

  setSelectedSymbol(symbol: string) {
    // runInAction(() => {
      this.selectedSymbol = symbol;
      this.ticks_history_request.ticks_history = symbol;
    // });
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

  ticks_history_request = 
  this.isTicks ? {
    ticks_history: "",
    adjust_start_time: 1,
    count: 1000,
    end: "latest",
    start: 1,
    style: "ticks",
  } : 
  {
    ticks_history: "",
    adjust_start_time: 1,
    count: 1000,
    granularity: this.granularity,
    end: "latest",
    start: this.granularity = 86400 ? 1680040550 : 1,
    style: "candles",
  };

  getTicksHistory = async () => {
    // runInAction(() => {
      this.ticks_history_request.ticks_history = this.selectedSymbol;

      this.connection?.addEventListener("message", this.ticksHistoryResponse);
    // });
    await this.api.ticksHistory(this.ticks_history_request);
  };

  tickSubscriber = () => {
    const ticksSubscriber = this.api.subscribe(this.ticks_history_request);
    return ticksSubscriber;
  };

  ticksHistoryResponse = async (res: MessageEvent) => {
    const data = JSON.parse(res.data);
    
    if (data.error !== undefined) {
      // runInAction(() => {
        console.log("Error : ", data.error.message);
        this.connection?.removeEventListener(
          "message",
          this.ticksHistoryResponse,
          false
        );
      // });
      await this.api.disconnect();
    }
    else if (data.msg_type === "candles") {
      // runInAction(() => {
        // if (this.chartType === "candlestick"){
        const candles = data.candles;

        const candlesticks: Tick[] = [];
        let currentTime: number | null = null;
        let currentCandle: Tick | null = null;

        for (const candle of candles) {
          const epoch = candle.epoch;
          // let time = 0;
          // // const time = this.isHourlyGranularity ? new Date(epoch * 1000).getHours() : new Date(epoch * 1000).getMinutes();
          // if(this.granularity = 60){
          //   time = new Date(epoch * 1000).getMinutes();
          // } else if (this.granularity = 3600){
          //   time = new Date(epoch * 1000).getHours();
          // } else if (this.granularity = 86400){
          //   time = new Date(epoch * 1000).getDay();
          // }

          if (currentTime === null || (epoch * 1000) !== currentTime) {
            // Start a new candle
            if (currentCandle !== null) {
              // Add the completed candle to the list
              candlesticks.push(currentCandle);
            }

            // Create a new candle
            currentCandle = {
              epoch: epoch,
              open: Number(candle.open),
              high: Number(candle.high),
              low: Number(candle.low),
              close: Number(candle.close),
            };
            currentTime = epoch * 1000;
          } else {
            // Update the current candle with new values
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
      // });
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
    } else if (data.msg_type === 'history') {
      const historyTicks = data.history.prices.map((price: number, index: number) => ({
        epoch: data.history.times[index],
        quote: Number(price),
      }));

      this.setTicks([...this.ticks, ...historyTicks]);
      // this.loadedTicks += historyTicks.length;

      this.connection?.removeEventListener('message', this.ticksHistoryResponse, false);
    }
  };

  tickResponse = async (res: MessageEvent) => {
    const data = JSON.parse(res.data);
    if (data.error !== undefined) {
      // runInAction(() => {
        console.log("Error: ", data.error.message);
        this.connection?.removeEventListener(
          "message",
          this.tickResponse,
          false
        );
      // });
      await this.api.disconnect();
    }
    else if (data.msg_type === "ohlc") {
      // runInAction(() => {
        // if(this.chartType === "candlestick") {
        const newTick = {
          epoch: data.ohlc.epoch,
          close: Number(data.ohlc.close),
          open: Number(data.ohlc.open),
          high: Number(data.ohlc.high),
          low: Number(data.ohlc.low),
        };

        // const currentTime = this.isHourlyGranularity ? new Date(newTick.epoch * 1000).getHours() : new Date(newTick.epoch * 1000).getMinutes();
        let currentTime = 0;
        if(this.granularity = 60){
          if (this.isTicks){
            currentTime = newTick.epoch * 1000;  
          } else{
          currentTime = new Date(newTick.epoch * 1000).getMinutes();
          }
        } else if (this.granularity = 3600){
          currentTime = new Date(newTick.epoch * 1000).getHours();
        } else if (this.granularity = 86400){
          currentTime = new Date(newTick.epoch * 1000).getDay();
        }     
        // const currentTime = newTick.epoch * 1000;   

        if (this.ticks.length === 0) {
          // If there are no previous ticks, add the current tick
          this.setTicks([newTick]);
        } else {
          const lastTick = this.ticks[this.ticks.length - 1];
          // const lastTime = this.isHourlyGranularity ? new Date(lastTick.epoch * 1000).getHours() : new Date(lastTick.epoch * 1000).getMinutes();
          let lastTime = 0;
        if(this.granularity = 60){
          if (this.isTicks){
            lastTime = lastTick.epoch * 1000;  
          } else{
          lastTime = new Date(lastTick.epoch * 1000).getMinutes();
          }
        } else if (this.granularity = 3600){
          lastTime = new Date(lastTick.epoch * 1000).getHours();
        } else if (this.granularity = 86400){
          lastTime = new Date(lastTick.epoch * 1000).getDay();
        }
        // const lastTime = lastTick.epoch * 1000;

          if (currentTime !== lastTime) {
            // If the current tick belongs to a different minute, add it to the list
            // console.log(this.ticks, "before");
            this.setTicks([...this.ticks, newTick]);
            // console.log(this.ticks, "after");
          } else {
            // Update the previous tick with the new values
            lastTick.high = Math.max(lastTick.high as number, newTick.high);
            lastTick.low = Math.min(lastTick.low as number, newTick.low);
            lastTick.close = Number(newTick.close);
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

      // });
    } else if (data.msg_type === 'tick') {
      const newTick = {
        epoch: data.tick.epoch,
        quote: Number(data.tick.quote),
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
        this.connection?.removeEventListener(
          "message",
          this.proposalResponse,
          false
        );
      await this.api.disconnect();
    } else if (data.msg_type === "proposal") {
        this.setPreviousSpot(parseFloat(data.proposal.spot));
        // this.setProposalTicks(data.proposal.duration);
        // this.proposalData.push(data.proposal);
        // console.log(data.proposal.spot);

        const updatedData = [...this.proposalData, data.proposal];
        this.proposalData = updatedData;
        // console.log(this.proposalData);
        
        // if (this.proposalData.length > 20) {
        //   this.proposalData.splice(0, 1);
        // }
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

    const keepAlive = () => proposal_request;

    const keepAliveRes = async (res: any) => {
      const data = JSON.parse(res.data);
      if (data.error !== undefined) {
        // runInAction(() => {
          console.log("Error: %s ", data.error.message);
          this.connection?.removeEventListener(
            "message",
            keepAliveRes,
            false
          );
        // });
        await this.api.disconnect();
      } else if (data.msg_type === "ping") {
        // runInAction(() => {
          console.log(data.msg_type);
          console.log("ping");
        // });
      }
    };
  
    const checkSignal = async () => {
      keepAlive();
      this.connection?.addEventListener("message", keepAliveRes);
    };

    try {
      checkSignal();
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
    this.connection?.removeEventListener(
      "message",
      this.proposalResponse,
      false
    );
    this.proposalData = [];
    // await this.api.disconnect();
  };


  
}

const apiStore = new ApiStore();

export default apiStore;
