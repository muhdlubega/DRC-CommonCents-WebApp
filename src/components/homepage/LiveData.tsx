import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';
import { Box, Button } from '@mui/material';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts/highstock';
import AccessibilityModule from 'highcharts/modules/accessibility';
// import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';
import chartsStore from '../../store/ChartsStore';

const LiveData = observer(() => {
  // const carouselRef = useRef<AliceCarousel>(null);

  useEffect(() => {
    AccessibilityModule(Highcharts);
    chartsStore.getActiveSymbols();

    chartsStore.symbols.forEach((id) => {
      chartsStore.setSelectedSymbol(id);
      chartsStore.subscribeTicksGroup();
    });

    return () => {
      chartsStore.activeSymbols.forEach((id) => {
        chartsStore.setSelectedSymbol(id);
        chartsStore.unsubscribeTicksGroup();
      });
    };
  }, []);

  const chartData = chartsStore.activeSymbols.map((id) => {
    const filteredTicks = chartsStore.ticks.filter((tick) => tick.symbol === id);
    const latestQuote = filteredTicks[filteredTicks.length - 1]?.quote;
    const previousQuote = filteredTicks[filteredTicks.length - 2]?.quote;
    const isHigher = latestQuote > previousQuote;

    return {
      series: [
        {
          name: id,
          data: filteredTicks.slice(-10).map((tick) => [tick.epoch * 1000, tick.quote]),
          type: 'line',
          color: isHigher ? 'green' : 'red',
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

  // const slideTo = (index: number) => {
  //   if (carouselRef.current) {
  //     carouselRef.current.slideTo(index);
  //   }
  // };

  // const handleSlideChanged = (e: any) => {
  //   const currentIndex = e.item;
  //   chartsStore.setSelectedSymbol(id_array[currentIndex]);
  // };

  // const responsive = {
  //   0: {
  //     items: 2,
  //   },
  //   1024: {
  //     items: 5,
  //   },
  // };

  return (
    <Box>
      {/* <Box>
        <Button hidden id="ticks" className="submitBtn">
          Subscribe Ticks
        </Button>
        <Button hidden id="ticks-unsubscribe" className="resetBtn">
          Unsubscribe Ticks
        </Button>
        <Button hidden id="ticks-history" className="historyBtn">
          Get Tick History
        </Button>
      </Box> */}
      <Box className="live-data-title">Stock Indices Live Data</Box>
      <Box className="live-data-btngroup">
          <Button onClick={() => chartsStore.setMarketType("volatility1s")} style={{ width: '16vw', margin: '2vw', padding: '0.5vw' , borderRadius: '1vw', fontSize: '1vw', backgroundColor: '#3366ff', color: 'white'}} >
            Volatility Index (1s)
          </Button>
          <Button onClick={() => chartsStore.setMarketType("volatility")} style={{ width: '16vw', margin: '2vw', padding: '0.5vw' , borderRadius: '1vw' , fontSize: '1vw', backgroundColor: '#3366ff', color: 'white'}} >
            Volatility Index
          </Button>
          <Button onClick={() => chartsStore.setMarketType("jump")} style={{ width: '16vw', margin: '2vw', padding: '0.5vw' , borderRadius: '1vw' , fontSize: '1vw', backgroundColor: '#3366ff', color: 'white'}} >
            Jump Index
          </Button>
          <Button onClick={() => chartsStore.setMarketType("bear_bull")} style={{ width: '16vw', margin: '2vw', padding: '0.5vw' , borderRadius: '1vw' , fontSize: '1vw', backgroundColor: '#3366ff', color: 'white'}} >
            Bear/Bull Market
          </Button>
      </Box>
      <div style={{display: 'flex'}}
      >
        {chartData.map((data, index) => (
          <Link style={{transform: 'scale(0.75)'}} to={`/trade/${data.series[0].name}`} key={index}>
            <div style={{ width: '20vw'}}>
  <HighchartsReact highcharts={Highcharts} options={data} />
</div>
            <Box sx={{ backgroundColor: data.latestQuote > data.previousQuote ? 'green' : 'red' , width: '100%', display: 'flex', justifyContent: 'center', color: 'white', padding: '1vw', fontWeight: 'bold', fontSize: '2vw', borderRadius: '1vw'}}>
              {data.latestQuote}
            </Box>
          </Link>
        ))}
      </div>
    </Box>
  );
});

export default LiveData;


// import { useEffect, useRef, useCallback } from 'react';
// import { observer } from 'mobx-react-lite';
// import { Link } from 'react-router-dom';
// import { Box, Button } from '@mui/material';
// import HighchartsReact from 'highcharts-react-official';
// import Highcharts from 'highcharts/highstock';
// import AccessibilityModule from 'highcharts/modules/accessibility';
// import AliceCarousel from 'react-alice-carousel';
// import 'react-alice-carousel/lib/alice-carousel.css';
// import chartsStore, { id_array } from '../../store/ChartsStore';
// import React from 'react';

// const LiveData = observer(() => {
//   const carouselRef = useRef<AliceCarousel>(null);

//   useEffect(() => {
//     chartsStore.getActiveSymbols();

//     id_array.forEach((id) => {
//       chartsStore.setSelectedSymbol(id);
//       chartsStore.subscribeTicksGroup();
//     });

//     return () => {
//       id_array.forEach((id) => {
//         chartsStore.setSelectedSymbol(id);
//         chartsStore.unsubscribeTicksGroup();
//       });
//     };
//   }, []);

//   AccessibilityModule(Highcharts);

//   const getChartData = useCallback(() => {
//     return id_array.map((id) => {
//       const filteredTicks = chartsStore.ticks.filter((tick) => tick.symbol === id);
//       const latestQuote = filteredTicks[filteredTicks.length - 1]?.quote;
//       const previousQuote = filteredTicks[filteredTicks.length - 2]?.quote;
//       const isHigher = latestQuote > previousQuote;

//       return {
//         series: [
//           {
//             name: id,
//             data: filteredTicks.slice(-15).map((tick) => [tick.epoch * 1000, tick.quote]),
//             type: 'line',
//             color: isHigher ? 'green' : 'red',
//             lineWidth: 5,
//           },
//         ],
//         title: {
//           text: id,
//         },
//         time: {
//           useUTC: false,
//         },
//         credits: {
//           enabled: false,
//         },
//         accessibility: {
//           enabled: false,
//         },
//         plotOptions: {
//           series: {
//             marker: {
//               enabled: false,
//             },
//           },
//         },
//         xAxis: {
//           labels: {
//             enabled: false,
//           },
//           lineWidth: 0,
//           tickWidth: 0,
//         },
//         yAxis: {
//           labels: {
//             enabled: false,
//           },
//           title: {
//             enabled: false,
//           },
//           gridLineWidth: 0,
//         },
//         latestQuote,
//         previousQuote,
//       };
//     });
//   }, []);

//   const handleSlideChanged = useCallback(
//     (e: any) => {
//       const currentIndex = e.item;
//       chartsStore.setSelectedSymbol(id_array[currentIndex]);
//     },
//     []
//   );
//   const slideTo = useCallback(
//     (index: number) => {
//       if (carouselRef.current) {
//         carouselRef.current.slideTo(index);
//       }
//     },
//     []
//   );

//   const responsive = {
//     0: {
//       items: 2,
//     },
//     1024: {
//       items: 5,
//     },
//   };

//   const MemoizedHighchartsReact = useCallback(
//     React.memo(({ options }: { options: Highcharts.Options }) => (
//       <HighchartsReact highcharts={Highcharts} options={options} />
//     )),
//     []
//   );

//   const chartData = getChartData();

//   return (
//     <Box>
//       <Box>
//         <Button hidden id="ticks" className="submitBtn">
//           Subscribe Ticks
//         </Button>
//         <Button hidden id="ticks-unsubscribe" className="resetBtn">
//           Unsubscribe Ticks
//         </Button>
//         <Button hidden id="ticks-history" className="historyBtn">
//           Get Tick History
//         </Button>
//       </Box>
//       <Box>Stock Indices Live Data</Box>
//       <Box>
//         {id_array.map((id, index) => (
//           <Button
//             style={{ width: '5%', margin: 5 }}
//             key={index}
//             onClick={() => slideTo(index)}
//           >
//             {id}
//           </Button>
//         ))}
//       </Box>
//       <AliceCarousel
//         mouseTracking
//         infinite
//         autoPlay
//         autoPlayInterval={2000}
//         animationDuration={2000}
//         ref={carouselRef}
//         responsive={responsive}
//         onSlideChanged={handleSlideChanged}
//       >
//         {chartData.map((data, index) => (
//           <Link to={`/trade/${data.series[0].name}`} key={index}>
//             <MemoizedHighchartsReact options={data as Highcharts.Options} />
//             <Box sx={{ color: data.latestQuote > data.previousQuote ? 'green' : 'red' }}>
//               {data.latestQuote}
//             </Box>
//           </Link>
//         ))}
//       </AliceCarousel>
//     </Box>
//   );
// });

// export default LiveData;
