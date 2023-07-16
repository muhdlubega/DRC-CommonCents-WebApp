import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Link } from "react-router-dom";
import { Box, Button, useTheme } from "@mui/material";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highstock";
import AccessibilityModule from "highcharts/modules/accessibility";
import "react-alice-carousel/lib/alice-carousel.css";
import "../../styles/homepage.scss";
import chartsStore from "../../store/ChartsStore";
import { MarketName } from "../../pages/TradeHistoryPage";

const LiveData = observer(() => {
  const theme = useTheme();

  useEffect(() => {
    AccessibilityModule(Highcharts);
    chartsStore.setSymbolsArray();

    return () => {
      chartsStore.activeSymbols.forEach((id) => {
        chartsStore.setSelectedSymbol(id);
        chartsStore.unsubscribeTicksGroup();
      });
    };
  }, []);

  const chartData = chartsStore.symbols.map((id) => {
    const filteredTicks = chartsStore.ticks.filter(
      (tick) => tick.symbol === id
    );
    const latestQuote = filteredTicks[filteredTicks.length - 1]?.quote;
    const previousQuote = filteredTicks[filteredTicks.length - 2]?.quote;
    const isHigher = latestQuote > previousQuote;

    return {
      chart: {
        backgroundColor: "transparent",
        style: {
          fontFamily: theme.typography.fontFamily,
        },
      },
      series: [
        {
          name: id,
          data: filteredTicks
            .slice(-10)
            .map((tick) => [tick.epoch * 1000, tick.quote]),
          type: "line",
          color: isHigher
            ? theme.palette.success.main
            : theme.palette.error.main,
          lineWidth: 5,
        },
      ],
      title: {
        text: MarketName[id],
        style: {
          color: theme.palette.text.primary,
        },
      },
      time: {
        useUTC: false,
      },
      credits: {
        enabled: false,
      },
      accessibility: {
        enabled: false,
      },
      plotOptions: {
        series: {
          marker: {
            enabled: false,
          },
        },
      },
      xAxis: {
        labels: {
          enabled: false,
        },
        lineWidth: 0,
        tickWidth: 0,
      },
      yAxis: {
        labels: {
          enabled: false,
        },
        title: {
          enabled: false,
        },
        gridLineWidth: 0,
      },
      legend: {
        itemStyle: {
          color: theme.palette.text.secondary,
        },
      },
      latestQuote,
      previousQuote,
    };
  });

  return (
    <Box>
      <Box className="live-data-title">Synthetic Indices</Box>
      <Box className="live-data-btngroup">
        <Button
          className="live-data-btn"
          variant={
            chartsStore.marketType === "volatility1s" ? "contained" : "outlined"
          }
          onClick={() => chartsStore.setMarketType("volatility1s")}
          sx={{
            backgroundColor:
              chartsStore.marketType === "volatility1s"
                ? "#3366ff"
                : theme.palette.background.default,
          }}
        >
          Volatility Index (1s)
        </Button>
        <Button
          className="live-data-btn"
          variant={
            chartsStore.marketType === "volatility" ? "contained" : "outlined"
          }
          onClick={() => chartsStore.setMarketType("volatility")}
          sx={{
            backgroundColor:
              chartsStore.marketType === "volatility"
                ? "#3366ff"
                : theme.palette.background.default,
          }}
        >
          Volatility Index
        </Button>
        <Button
          className="live-data-btn"
          variant={chartsStore.marketType === "jump" ? "contained" : "outlined"}
          onClick={() => chartsStore.setMarketType("jump")}
          sx={{
            backgroundColor:
              chartsStore.marketType === "jump"
                ? "#3366ff"
                : theme.palette.background.default,
          }}
        >
          Jump Index
        </Button>
        <Button
          className="live-data-btn"
          variant={
            chartsStore.marketType === "bear_bull" ? "contained" : "outlined"
          }
          onClick={() => chartsStore.setMarketType("bear_bull")}
          sx={{
            backgroundColor:
              chartsStore.marketType === "bear_bull"
                ? "#3366ff"
                : theme.palette.background.default,
          }}
        >
          Bear/Bull Market
        </Button>
      </Box>
      <Box className="live-data-grid">
        {chartData.map((data, index) => (
          <Box className="live-data-chart">
            <Link
              className="live-data-link"
              to={`/trade/${data.series[0].name}`}
              key={index}
            >
              <Box>
                <HighchartsReact highcharts={Highcharts} options={data} />
              </Box>
              <Box
                className="live-data-price"
                sx={{
                  color:
                    data.latestQuote > data.previousQuote
                      ? theme.palette.success.main
                      : theme.palette.error.main,
                }}
              >
                {data.latestQuote}
              </Box>
            </Link>
          </Box>
        ))}
      </Box>
    </Box>
  );
});

export default LiveData;
