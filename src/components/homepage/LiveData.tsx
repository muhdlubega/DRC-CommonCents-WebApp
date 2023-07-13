import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Link } from "react-router-dom";
import { Box, Button, useTheme } from "@mui/material";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highstock";
import AccessibilityModule from "highcharts/modules/accessibility";
// import AliceCarousel from 'react-alice-carousel';
import "react-alice-carousel/lib/alice-carousel.css";
import chartsStore from "../../store/ChartsStore";
import { MarketName } from "../../pages/TradeHistoryPage";

const LiveData = observer(() => {
  // const carouselRef = useRef<AliceCarousel>(null);
  const theme = useTheme();

  useEffect(() => {
    AccessibilityModule(Highcharts);
    chartsStore.setSymbolsArray();

    // chartsStore.symbols.forEach((id) => {
    //   chartsStore.setSelectedSymbol(id);
    //   chartsStore.subscribeTicksGroup();
    // });

    return () => {
      chartsStore.activeSymbols.forEach((id) => {
        chartsStore.setSelectedSymbol(id);
        chartsStore.unsubscribeTicksGroup();
      });
    };
  }, []);

  // console.log(chartsStore.symbols);
  // console.log(chartsStore.selectedSymbol);

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
      legend: { // Add this legend object
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
      <Box className="live-data-btngroup">
        <Button
          variant={
            chartsStore.marketType === "volatility1s" ? "contained" : "outlined"
          }
          onClick={() => chartsStore.setMarketType("volatility1s")}
          sx={{
            mx: '10px',
            paddingY: "16px",
            borderRadius: "10px",
            width: "325px",
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
            width: "325px",
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
            width: "325px",
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
            width: "325px",
            backgroundColor:
              chartsStore.marketType === "bear_bull" ? "#3366ff" : theme.palette.background.default,
          }}
        >
          Bear/Bull Market
        </Button>
        {/* <Button onClick={() => chartsStore.setMarketType("volatility1s")} style={{ width: '16vw', margin: '2vw', padding: '0.5vw' , borderRadius: '1vw', fontSize: '1vw', backgroundColor: '#3366ff', color: 'white'}} >
            Volatility Index (1s)
          </Button> */}
        {/* <Button
          onClick={() => chartsStore.setMarketType("volatility")}
          style={{
            width: "16vw",
            margin: "2vw",
            padding: "0.5vw",
            borderRadius: "1vw",
            fontSize: "1vw",
            backgroundColor: "#3366ff",
            color: "white",
          }}
        >
          Volatility Index
        </Button>
        <Button
          onClick={() => chartsStore.setMarketType("jump")}
          style={{
            width: "16vw",
            margin: "2vw",
            padding: "0.5vw",
            borderRadius: "1vw",
            fontSize: "1vw",
            backgroundColor: "#3366ff",
            color: "white",
          }}
        >
          Jump Index
        </Button>
        <Button
          onClick={() => chartsStore.setMarketType("bear_bull")}
          style={{
            width: "16vw",
            margin: "2vw",
            padding: "0.5vw",
            borderRadius: "1vw",
            fontSize: "1vw",
            backgroundColor: "#3366ff",
            color: "white",
          }}
        >
          Bear/Bull Market
        </Button> */}
      </Box>
      <div style={{ display: "flex", justifyContent: "center" }}>
        {chartData.map((data, index) => (
          <Link
            style={{ transform: "scale(0.75)" }}
            to={`/trade/${data.series[0].name}`}
            key={index}
          >
            <div style={{ width: "14vw", margin: "0.4vw" }}> 
              <HighchartsReact highcharts={Highcharts} options={data} />
            </div>
            <Box
              // sx={{
              //   backgroundColor:
              //     data.latestQuote > data.previousQuote ? "green" : "red",
              //   width: "100%",
              //   display: "flex",
              //   justifyContent: "center",
              //   color: "white",
              //   padding: "1vw",
              //   fontWeight: "bold",
              //   fontSize: "2vw",
              //   borderRadius: "1vw",
              // }}
              sx={{
                // Remove backgroundColor property
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
        ))}
      </div>
      <hr className="chart-divider" />
    </Box>
  );
});

export default LiveData;
