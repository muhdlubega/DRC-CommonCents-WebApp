import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { observer } from "mobx-react-lite";
import {
  Box,
  Button,
  MenuItem,
  Modal,
  Select,
  Tooltip,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highstock";
import AccessibilityModule from "highcharts/modules/accessibility";
import {
  Candle,
  ArrowCircleLeft,
  ArrowCircleRight,
  MessageQuestion,
} from "iconsax-react";
import apiStore from "../../store/ApiStore";
import sc1 from "../../assets/images/onboarding/sc1.svg";
import sc2 from "../../assets/images/onboarding/sc2.svg";
import sc3 from "../../assets/images/onboarding/sc3.svg";
import sc4 from "../../assets/images/onboarding/sc4.svg";
import sc5 from "../../assets/images/onboarding/sc5.svg";
import sc6 from "../../assets/images/onboarding/sc6.svg";
import sc7 from "../../assets/images/onboarding/sc7.svg";
import loading from "../../assets/images/commoncents.svg";
import loading2 from "../../assets/images/white-blue-logo.svg";
import contractStore from "../../store/ContractStore";
import { ShowChart } from "@mui/icons-material";
import { useTour } from "@reactour/tour";
import authStore from "../../store/AuthStore";
// import { MarketName } from "../../arrays/MarketArray";

const Chart = observer(() => {
  //chart logic for the trading simulation with market type, chart type, and duration choices using data from the Deriv API
  const { id } = useParams();
  const theme = useTheme();
  const navigate = useNavigate();
  const { setIsOpen } = useTour();
  const isSmallScreen = useMediaQuery("(max-width: 767px)");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(sc1);
  AccessibilityModule(Highcharts);

  const latestQuote = apiStore.ticks[apiStore.ticks.length - 1]
    ?.close as number;
  const previousQuote = apiStore.ticks[apiStore.ticks.length - 2]
    ?.close as number;
  const isHigher = latestQuote > previousQuote;

  const latestQuoteTicks = apiStore.ticks[apiStore.ticks.length - 1]
    ?.quote as number;
  const previousQuoteTicks = apiStore.ticks[apiStore.ticks.length - 2]
    ?.quote as number;
  const isHigherTicks = latestQuoteTicks > previousQuoteTicks;

  //chart properties for market data from Deriv API using HighCharts
  const chartData = {
    time: {
      useUTC: false,
    },
    credits: {
      enabled: false,
    },
    rangeSelector: {
      enabled: false,
    },
    xAxis: {
      type: "datetime",
      labels: {
        style: {
          color: theme.palette.text.secondary,
        },
      },
    },
    yAxis: {
      opposite: false,
      gridLineColor: theme.palette.mode === "dark" ? "#3F3F3F" : "#D8D8D8",
      labels: {
        style: {
          color: theme.palette.text.secondary,
        },
      },
    },
    plotOptions: {
      candlestick: {
        color: theme.palette.error.dark,
        upColor: theme.palette.success.dark,
        lineColor: theme.palette.error.dark,
        upLineColor: theme.palette.success.dark,
      },
    },
    chart: {
      height: isSmallScreen ? `${(4 / 3) * 100}%` : `${(9 / 16) * 100}%`,
      backgroundColor: "transparent",
      style: {
        fontFamily: theme.typography.fontFamily,
      },
    },
    series: [
      {
        name: apiStore.selectedSymbol,
        //data is displayed using high, low, close and open for all charts except for ticks
        //data for ticks displayed using quote (spot price)
        data:
          apiStore.chartType === "candlestick"
            ? apiStore.ticks.slice(-100).map((tick) => ({
                x: tick.epoch * 1000,
                open: Number(tick.open),
                high: Number(tick.high),
                low: Number(tick.low),
                close: Number(tick.close),
              }))
            : apiStore.ticks.slice(-100).map((tick) => ({
                x: tick.epoch * 1000,
                y: apiStore.isTicks ? tick.quote : tick.close,
                open: Number(tick.open),
                high: Number(tick.high),
                low: Number(tick.low),
                close: Number(tick.close),
              })),
        type: apiStore.chartType,
        color:
          apiStore.chartType === "candlestick"
            ? theme.palette.error.dark
            : apiStore.isTicks
            ? isHigherTicks
              ? theme.palette.success.dark
              : theme.palette.error.dark
            : isHigher
            ? theme.palette.success.dark
            : theme.palette.error.dark,
        upColor: theme.palette.success.dark,
        lineWidth: apiStore.chartType === "candlestick" ? 1 : 2.5,
        tooltip: {
          pointFormat: apiStore.isTicks
            ? '<span style="color:{point.color}">\u25CF</span> {series.name}<br/>' +
              "Spot Price: <b>{point.y}</b><br/>"
            : '<span style="color:{point.color}">\u25CF</span> {series.name}<br/>' +
              "Open: <b>{point.open}</b><br/>" +
              "High: <b>{point.high}</b><br/>" +
              "Low: <b>{point.low}</b><br/>" +
              "Close: <b>{point.close}</b><br/>",
        },
        accessibility: {
          enabled: false,
        },
      },
    ],
  };

  const handleChartTypeChange = (newChartType: string) => {
    apiStore.toggleTicks(false);
    apiStore.setChartType(newChartType);
  };

  const handleGranularityChange = async (newGranularity: number) => {
    if (newGranularity === 1) {
      apiStore.toggleTicks(true);
      await apiStore.subscribeTicks();
    } else {
      apiStore.toggleTicks(false);
      apiStore.setGranularity(newGranularity);
      await apiStore.subscribeTicks();
    }
  };

  const handleSelect = (symbol: string) => {
    navigate(`/trade/${symbol}`);
  };

  const handleImageNavigation = (direction: "next" | "previous") => {
    const imageArray = [sc1, sc2, sc3, sc4, sc5, sc6, sc7];
    const currentIndex = imageArray.indexOf(currentImage);
    let newIndex = currentIndex;

    if (direction === "next") {
      newIndex = currentIndex + 1;
      if (newIndex >= imageArray.length) {
        setIsModalOpen(false);
        return;
      }
    } else if (direction === "previous") {
      newIndex = currentIndex - 1;
      if (newIndex < 0) {
        return;
      }
    }

    setCurrentImage(imageArray[newIndex]);
  };

  // const handleOpenModal = () => {
  //   setIsModalOpen(true);
  //   setCurrentImage(sc1);
  // };

  const fetchData = async () => {
    await apiStore.subscribeTicks();
  };

  useEffect(() => {
    apiStore.getActiveSymbols();

    if (id) {
      apiStore.setSelectedSymbol(id);
    }

    fetchData();

    return () => {
      apiStore.unsubscribeTicks();
    };
  }, [id]);

  return (
    <Box>
      <Box className="chart-main">
        <Select
          className="symbols-dropdown onboarding01"
          value={apiStore.selectedSymbol || ""}
          onChange={(e) => handleSelect(e.target.value)}
          style={{
            backgroundColor: contractStore.isProcessing
              ? "#888"
              : theme.palette.background.default,
            color: theme.palette.text.primary,
          }}
          disabled={contractStore.isProcessing}
        >
          {apiStore.activeSymbols.map(
            (symbol) =>
              symbol.market === "synthetic_index" &&
              symbol.symbol_type === "stockindex" &&
              symbol.allow_forward_starting === 1 && (
                <MenuItem key={symbol.symbol} value={symbol.symbol}>
                  {symbol.display_name}
                </MenuItem>
                // <MenuItem
                //   key={symbol.symbol}
                //   value={MarketName[symbol.display_name]}
                // >
                //   {symbol.display_name}
                // </MenuItem>
              )
          )}
        </Select>
        <Select
          className="symbols-dropdown onboarding02"
          value={apiStore.chartType}
          onChange={(e) => handleChartTypeChange(e.target.value)}
          style={{
            backgroundColor: contractStore.isProcessing
              ? "#888"
              : theme.palette.background.default,
            color: theme.palette.text.primary,
          }}
          disabled={contractStore.isProcessing}
        >
          <MenuItem value="line" onClick={() => handleChartTypeChange("line")}>
            <ShowChart style={{ color: "#0033ff" }} /> Line
          </MenuItem>
          <MenuItem
            disabled={apiStore.isTicks}
            value="candlestick"
            onClick={() => handleChartTypeChange("candlestick")}
          >
            <Candle color="#0033ff" variant="Bulk" size={24} />
            {apiStore.isTicks ? "Candle (N/A for ticks)" : "Candle"}
          </MenuItem>
        </Select>
        <Box className="symbols-last-item">
          <Select
            className="symbols-dropdown onboarding03"
            style={{
              backgroundColor: contractStore.isProcessing
                ? "#888"
                : theme.palette.background.default,
              color: theme.palette.text.primary,
            }}
            value={apiStore.isTicks ? 1 : apiStore.granularity}
            onChange={(e) => handleGranularityChange(e.target.value as number)}
            disabled={contractStore.isProcessing}
          >
            <MenuItem
              disabled={apiStore.chartType === "candlestick"}
              value={1}
              onClick={() => handleGranularityChange(1)}
            >
              {apiStore.chartType === "line"
                ? "Ticks"
                : "Ticks (N/A for candle chart)"}
            </MenuItem>
            <MenuItem value={60} onClick={() => handleGranularityChange(60)}>
              Minutes
            </MenuItem>
            <MenuItem
              value={3600}
              onClick={() => handleGranularityChange(3600)}
            >
              Hours
            </MenuItem>
            <MenuItem
              value={86400}
              onClick={() => handleGranularityChange(86400)}
            >
              Days
            </MenuItem>
          </Select>
          {authStore.user && (
            <Box
              component="span"
              className="chart-onboarding"
              onClick={() => setIsOpen(true)}
            >
              <Tooltip
                title="Show Onboarding"
                disableFocusListener
                disableTouchListener
                arrow
              >
                <MessageQuestion
                  style={{ color: theme.palette.text.primary }}
                  size={40}
                  className="chart-onboarding-icon"
                />
              </Tooltip>
            </Box>
          )}
        </Box>
      </Box>
      <Box className="chart-area">
        {apiStore.ticks.length === 0 ? (
          <Box className="loading-box">
            <img
              src={theme.palette.mode === "dark" ? loading2 : loading}
              className="loading"
            ></img>
          </Box>
        ) : (
          <HighchartsReact
            highcharts={Highcharts}
            constructorType={"stockChart"}
            options={chartData}
          />
        )}
      </Box>
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Box>
          <Button
            className="onboarding-modal-btn left"
            sx={{
              position: "absolute",
              top: "50%",
              left: "30px",
              zIndex: 2,
            }}
            onClick={() => handleImageNavigation("previous")}
          >
            <ArrowCircleLeft
              style={{ height: "100%", width: "100%" }}
              color="white"
            />
          </Button>
          <Box className="onboarding-modal-imgbox">
            <img
              className="onboarding-modal-img"
              src={currentImage}
              alt="Modal Image"
              onClick={() => handleImageNavigation("next")}
            />
          </Box>
          <Button
            className="onboarding-modal-btn right"
            sx={{
              position: "absolute",
              top: "50%",
              right: "30px",
              zIndex: 2,
            }}
            onClick={() => handleImageNavigation("next")}
          >
            <ArrowCircleRight
              style={{ height: "100%", width: "100%" }}
              color="white"
            />
          </Button>
        </Box>
      </Modal>
    </Box>
  );
});

export default Chart;
