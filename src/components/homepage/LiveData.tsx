import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Link } from "react-router-dom";
import { Box, Button, useTheme } from "@mui/material";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highstock";
import AccessibilityModule from "highcharts/modules/accessibility";
import "react-alice-carousel/lib/alice-carousel.css";
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
        backgroundColor: 'transparent',
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
          color: isHigher ? theme.palette.success.main : theme.palette.error.main,
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
          color: theme.palette.text.secondary
        },
      },
      latestQuote,
      previousQuote,
    };
  });

  return (
    <Box>
      <Box className="live-data-title">Synthetic Indices</Box>
      <Box className="live-data-btngroup" style={{ display: "grid", gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',gridGap: '20px'}}>
        <Button
          variant={
            chartsStore.marketType === "volatility1s" ? "contained" : "outlined"
          }
          onClick={() => chartsStore.setMarketType("volatility1s")}
          sx={{
            mx: '10px',
            paddingY: "16px",
            borderRadius: "10px",
            height: "75px",
            backgroundColor:
              chartsStore.marketType === "volatility1s" ? "#3366ff" : theme.palette.background.default,
          }}
        >
          Volatility Index (1s)
        </Button>
        <Button
          variant={
            chartsStore.marketType === "volatility" ? "contained" : "outlined"
          }
          onClick={() => chartsStore.setMarketType("volatility")}
          sx={{
            mx: '10px',
            paddingY: "16px",
            borderRadius: "10px",
            height: "75px",
            backgroundColor:
              chartsStore.marketType === "volatility" ? "#3366ff" : theme.palette.background.default,
          }}
        >
          Volatility Index
        </Button>
        <Button
          variant={
            chartsStore.marketType === "jump" ? "contained" : "outlined"
          }
          onClick={() => chartsStore.setMarketType("jump")}
          sx={{
            mx: '10px',
            paddingY: "16px",
            borderRadius: "10px",
            height: "75px",
            backgroundColor:
              chartsStore.marketType === "jump" ? "#3366ff" : theme.palette.background.default,
          }}
        >
          Jump Index
        </Button>
        <Button
          variant={
            chartsStore.marketType === "bear_bull" ? "contained" : "outlined"
          }
          onClick={() => chartsStore.setMarketType("bear_bull")}
          sx={{
            mx: '10px',
            paddingY: "16px",
            borderRadius: "10px",
            height: "75px",
            backgroundColor:
              chartsStore.marketType === "bear_bull" ? "#3366ff" : theme.palette.background.default,
          }}
        >
          Bear/Bull Market
        </Button>
      </Box>
      <Box style={{ display: "grid", gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))'}}>
        {chartData.map((data, index) => (
          <Box style={{display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '10px'}}>
          <Link
            style={{ transform: "scale(0.8)", width: "240px" }} className="livedata-link"
            to={`/trade/${data.series[0].name}`}
            key={index}
          >
            <Box> 
              <HighchartsReact highcharts={Highcharts} options={data}/>
            </Box>
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                color: data.latestQuote > data.previousQuote ? theme.palette.success.main : theme.palette.error.main,
                padding: "1vw",
                fontWeight: "bold",
                fontSize: "2vw",
                borderRadius: "1vw",
                
              }}
            >
              {data.latestQuote}
            </Box>
          </Link>
          </Box>
        ))}
      </Box>
      {/* <hr className="chart-divider" /> */}
    </Box>
  );
});

export default LiveData;
