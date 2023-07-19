import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { Link } from "react-router-dom";
import {
  Box,
  Button,
  Modal,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highstock";
import AccessibilityModule from "highcharts/modules/accessibility";
import "react-alice-carousel/lib/alice-carousel.css";
import chartsStore from "../../store/ChartsStore";
import { MarketName } from "../../arrays/MarketArray";
import { InfoCircle } from "iconsax-react";
import loading from "../../assets/images/commoncents.svg";
import synthetics from "../../assets/images/synthetics.svg";

const LiveData = observer(() => {
  //charts of different synthetic markets for comparison and a link to the trade page
  const theme = useTheme();
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  const openQuoteModal = () => {
    setIsQuoteModalOpen(true);
  };

  const closeQuoteModal = () => {
    setIsQuoteModalOpen(false);
  };

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

  return (
    <Box>
      <Box className="live-data-title">Synthetic Indices
      <Box className="live-data-box" onClick={openQuoteModal}>
        <Tooltip
          title="Learn more"
          placement="right"
          disableFocusListener
          disableTouchListener
          arrow
        >
          <InfoCircle size={40} />
        </Tooltip>
      </Box></Box>
      {isQuoteModalOpen && (
        <Modal open={isQuoteModalOpen} onClose={closeQuoteModal}>
          <Box className="live-data-modal"
            sx={{
              bgcolor: theme.palette.background.paper,
              color: theme.palette.text.secondary,
            }}
          >
            <Typography variant="h6" className="synthetic-title">What are synthetic indices?</Typography>
            <img src={synthetics} alt="synthetic indices"/>
            <Typography className="synthetic-text">
              Synthetic indices are financial instruments that mimic
              the behavior of real-world indices. They are created by
              synthesizing the price movements of various underlying assets such
              as stocks, currencies, and commodities, using a mathematical
              algorithm.
            </Typography>
            <Typography className="synthetic-text">
              Some examples of synthetic indices include Boom and Crash, Step
              Index, Jump Index, Volatility Indices, Daily Reset Indices and
              Range Break.
            </Typography>
          </Box>
        </Modal>
      )}
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
            {chartsStore.ticks.length < 5 ? <Box className="loading-box">
                    <img src={loading} className="loading"></img>
                  </Box> : (<Link
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
            </Link>)}
          </Box>
        ))}
      </Box>
    </Box>
  );
});

export default LiveData;
