import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Link } from "react-router-dom";
import { Box, Button } from "@mui/material";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highstock";
import AccessibilityModule from "highcharts/modules/accessibility";
// import AliceCarousel from 'react-alice-carousel';
import "react-alice-carousel/lib/alice-carousel.css";
import chartsStore from "../../store/ChartsStore";

const LiveData = observer(() => {
  // const carouselRef = useRef<AliceCarousel>(null);

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
      },
      series: [
        {
          name: id,
          data: filteredTicks
            .slice(-10)
            .map((tick) => [tick.epoch * 1000, tick.quote]),
          type: "line",
          color: isHigher ? "green" : "red",
          lineWidth: 5,
        },
      ],
      title: {
        text: id,
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
            mx: 1,
            paddingY: "1vw",
            border: "0.2vw solid #3366ff",
            borderRadius: "1vw",
            width: "17vw",
            backgroundColor:
              chartsStore.marketType === "volatility1s" ? "#3366ff" : "#ffffff",
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
            mx: 1,
            paddingY: "1vw",
            border: "0.2vw solid #3366ff",
            borderRadius: "1vw",
            width: "17vw",
            backgroundColor:
              chartsStore.marketType === "volatility" ? "#3366ff" : "#ffffff",
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
            mx: 1,
            paddingY: "1vw",
            border: "0.2vw solid #3366ff",
            borderRadius: "1vw",
            width: "17vw",
            backgroundColor:
              chartsStore.marketType === "jump" ? "#3366ff" : "#ffffff",
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
            mx: 1,
            paddingY: "1vw",
            border: "0.2vw solid #3366ff",
            borderRadius: "1vw",
            width: "17vw",
            backgroundColor:
              chartsStore.marketType === "bear_bull" ? "#3366ff" : "#ffffff",
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
                color: data.latestQuote > data.previousQuote ? "green" : "red",
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
