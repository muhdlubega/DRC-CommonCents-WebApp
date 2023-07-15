import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { observer } from "mobx-react-lite";
import {
  Box,
  MenuItem,
  Select,
  Skeleton,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highstock";
import AccessibilityModule from "highcharts/modules/accessibility";
import { Chart1, Candle, VideoPlay } from "iconsax-react";
import onboarding from "../../assets/images/onboarding.png";
import apiStore from "../../store/ApiStore";
// import themeStore from "../../store/ThemeStore";

const Chart = observer(() => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery("(max-width: 767px)");
  const [isLoading, setIsLoading] = useState(false);

  const theme = useTheme();

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
      labels: {
        style: {
          color: theme.palette.text.secondary,
        },
      },
    },
    yAxis: {
      opposite: false,
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
        data:
          apiStore.chartType === "candlestick"
            ? apiStore.ticks.slice(-1000).map((tick) => ({
                x: tick.epoch * 1000,
                open: Number(tick.open),
                high: Number(tick.high),
                low: Number(tick.low),
                close: Number(tick.close),
              }))
            : apiStore.ticks.slice(-1000).map((tick) => ({
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

  useEffect(() => {
    apiStore.getActiveSymbols();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    await apiStore.subscribeTicks();
    setIsLoading(false);
  };

  useEffect(() => {
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
      {apiStore.showOnboarding && (
        <Box className="screenshot-popup">
          <img
            src={onboarding}
            onClick={() => apiStore.setShowOnboarding(false)}
          ></img>
          <button onClick={() => apiStore.setShowOnboarding(false)}>X</button>
        </Box>
      )}
      <Box
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        }}
      >
        <Select
          className="symbols-dropdown"
          value={apiStore.selectedSymbol || ""}
          onChange={(e) => handleSelect(e.target.value)}
          style={{
            backgroundColor: theme.palette.background.default,
            color: theme.palette.text.primary,
          }}
        >
          {apiStore.activeSymbols.map(
            (symbol) =>
              symbol.market === "synthetic_index" &&
              symbol.symbol_type === "stockindex" &&
              symbol.allow_forward_starting === 1 && (
                <MenuItem key={symbol.symbol} value={symbol.symbol}>
                  {symbol.display_name}
                </MenuItem>
              )
          )}
        </Select>
        <Select
          className="symbols-dropdown"
          value={apiStore.chartType}
          onChange={(e) => handleChartTypeChange(e.target.value)}
          style={{
            backgroundColor: theme.palette.background.default,
            color: theme.palette.text.primary,
          }}
        >
          <MenuItem value="line" onClick={() => handleChartTypeChange("line")}>
            <Chart1 color="#0033ff" variant="Bulk" size={24} /> Line
          </MenuItem>
          <MenuItem
            disabled={apiStore.isTicks}
            value="candlestick"
            onClick={() => handleChartTypeChange("candlestick")}
          >
            <Candle color="#0033ff" variant="Bulk" size={24} /> Candle
          </MenuItem>
        </Select>
        <Select
          className="symbols-dropdown"
          style={{
            backgroundColor: theme.palette.background.default,
            color: theme.palette.text.primary,
          }}
          value={apiStore.isTicks ? 1 : apiStore.granularity}
          onChange={(e) => handleGranularityChange(e.target.value as number)}
        >
          <MenuItem
            disabled={apiStore.chartType === "candlestick"}
            value={1}
            onClick={() => handleGranularityChange(1)}
          >
            Ticks
          </MenuItem>
          <MenuItem value={60} onClick={() => handleGranularityChange(60)}>
            Minutes
          </MenuItem>
          <MenuItem value={3600} onClick={() => handleGranularityChange(3600)}>
            Hours
          </MenuItem>
          <MenuItem
            value={86400}
            onClick={() => handleGranularityChange(86400)}
          >
            Days
          </MenuItem>
        </Select>
        <Box
          component="span"
          style={{
            margin: "10px 30px 0 30px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
            cursor: "pointer",
          }}
          onClick={() => apiStore.setShowOnboarding(true)}
        >
          <VideoPlay color="#0033ff" size={36} style={{ marginLeft: "8px" }} />
          <Typography
            style={{ fontSize: "10px", color: "#0033ff", marginLeft: "12px" }}
          >
            Show
          </Typography>
          <Typography style={{ fontSize: "10px", color: "#0033ff" }}>
            Onboarding
          </Typography>
          {/* <Typography  style={{color:"#0033ff", marginLeft: '5px', fontFamily: 'Roboto', fontWeight: 500}}>Check Onboarding</Typography> */}
        </Box>
      </Box>
      <Box className="charts-area">
        {isLoading ? (
          <Box>
          <Skeleton variant="rectangular" width="100%" height={400} />
          Loading..
          </Box>
        ) : (
          <HighchartsReact
            highcharts={Highcharts}
            constructorType={"stockChart"}
            options={chartData}
          />
        )}
      </Box>
    </Box>
  );
});

export default Chart;
