import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { Provider } from "mobx-react";
import { TourProvider } from "@reactour/tour";
import "./index.css";
import themeStore from "./store/ThemeStore.tsx";

const steps = [
  {
    selector: ".onboarding01",
    content:
      "Choose your synthetic market type here. The current market trend from the selected choice will be reflected in the chart with real live data.",
  },
  {
    selector: ".onboarding02",
    content:
      "Here you can choose your chart view. Line chart shows the spot price while the candlestick chart shows the open, high, low and close prices for each time period.",
  },
  {
    selector: ".onboarding03",
    content:
      "Next, you can choose a time interval for the chart here. Available intervals for both charts are minutes, hours and days. Additionally for line charts, interval in ticks are also supported.",
  },
  {
    selector: ".onboarding04",
    content:
      "In this section you can view the details of the asset. Open and close denotes the first and last price of an asset at the beginning and end of the time interval, whereas high and low denotes the highest and lowest price level reached by an asset in between the time interval. Spot price (for ticks) on the other hand denotes the current price of an asset during that particular tick.",
  },
  {
    selector: ".onboarding05",
    content:
      "In this section you can alter the settings for the trade you would like to place and see your trade summary. This is only visible for logged in users.",
  },
  {
    selector: ".onboarding06",
    content:
      "To place a trade, you can first choose a tick duration here. Tick denotes a market's smallest possible price movement to the right of the decimal and can be set in this simulation between 1 to 10 for each market type available.",
  },
  {
    selector: ".onboarding07",
    content:
      "Second, you can choose the basis of your trade here and set your trade either based on stake or payout. Stake means the money that you are willing to lose in order to buy an asset. Payout, on the other hand, means the money that you win from buying an asset.",
  },
  {
    selector: ".onboarding08",
    content:
      "Third, you can enter your buying price for the trade here. For this simulation a maximum buying price of 500 USD is set for each transaction.",
  },
  {
    selector: ".onboarding09",
    content:
      "Lastly, you can choose your strategy between 'Higher' or 'Lower'. Higher delineates the 'RISE' contract, where you will only win if after the specified ticks duration, the current spot price is higher than the open price. Lower delineates the 'FALL' contract, where you will only win if after the specified ticks duration, the current spot price is lower than the open price. Press the icons on the left to quote the price and details of the trade.",
  },
  {
    selector: ".onboarding10",
    content:
      "After the trade duration ends, your trade details will appear here. To see your full trade summary, click on the link below. Happy trading!",
  },
];

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider themeStore={themeStore}>
      <TourProvider steps={steps}>
        <App themeStore={themeStore} />
      </TourProvider>
    </Provider>
  </React.StrictMode>
);
