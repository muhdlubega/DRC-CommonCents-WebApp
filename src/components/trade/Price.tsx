import { Box, Card } from '@mui/material'
import apiStore from '../../store/ApiStore'
import { observer } from 'mobx-react-lite';

const Price = () => {
  if (!apiStore.isTicks && apiStore.proposalTicks.length > 1){
    var high = Number(apiStore.proposalTicks[apiStore.proposalTicks.length - 1].high);
    var prevHigh = Number(apiStore.proposalTicks[apiStore.proposalTicks.length - 2].high);
    var highIsHigher = high > prevHigh;
    var highIsEqual = high === prevHigh;
    var close = Number(apiStore.proposalTicks[apiStore.proposalTicks.length - 1].close);
    var prevClose = Number(apiStore.proposalTicks[apiStore.proposalTicks.length - 2].close);
    var closeIsHigher = close > prevClose;
    var closeIsEqual = close === prevClose;
    var open = Number(apiStore.proposalTicks[apiStore.proposalTicks.length - 1].open);
    var prevOpen = Number(apiStore.proposalTicks[apiStore.proposalTicks.length - 2].open);
    var openIsHigher = open > prevOpen;
    var openIsEqual = open === prevOpen;
    var low = Number(apiStore.proposalTicks[apiStore.proposalTicks.length - 1].low);
    var prevLow = Number(apiStore.proposalTicks[apiStore.proposalTicks.length - 2].low);
    var lowIsHigher = low > prevLow;
    var lowIsEqual = low === prevLow;

  return (
    <Box>
      <Box className="pricecandle-container">
        <Card className="price-card">Close:&ensp; <Box sx={{color: closeIsHigher ? 'green' : closeIsEqual ? 'inherit' : 'red'}}>{close.toFixed(4)}</Box></Card>
        <Card className="price-card">High:&ensp; <Box sx={{color: highIsHigher ? 'green' : highIsEqual ? 'inherit' : 'red'}}>{high.toFixed(4)}</Box></Card>
        <Card className="price-card">Open:&ensp; <Box sx={{color: openIsHigher ? 'green' : openIsEqual ? 'inherit' : 'red'}}>{open.toFixed(4)}</Box></Card>
        <Card className="price-card">Low:&ensp; <Box sx={{color: lowIsHigher ? 'green' : lowIsEqual ? 'inherit' : 'red'}}>{low.toFixed(4)}</Box></Card>
      </Box>
    </Box>
  )} else if (apiStore.isTicks && apiStore.ticks.length > 0){
    var spot = Number(apiStore.ticks[apiStore.ticks.length - 1].quote);
    var prevSpot = Number(apiStore.ticks[apiStore.ticks.length - 2].quote);
    var spotIsHigher = spot > prevSpot;
    var spotIsEqual = spot === prevSpot;

  return (
    <Box>
      <Box className="pricetick-container">
        <Card className="price-card">Spot Price:&ensp; <Box sx={{color: spotIsHigher ? 'green' : spotIsEqual ? 'inherit' : 'red'}}>{spot.toFixed(4)}</Box></Card>
      </Box>
    </Box>
  )
  }
}

export default observer(Price)

// import { Box, Card } from '@mui/material'
// import { useState, useEffect } from 'react';
// import apiStore from '../../store/ApiStore'
// import { observer } from 'mobx-react-lite';

// const Price = () => {
//   const [closeColor, setCloseColor] = useState<'green' | 'red'>('red');
//   const [highColor, setHighColor] = useState<'green' | 'red'>('red');
//   const [openColor, setOpenColor] = useState<'green' | 'red'>('red');
//   const [lowColor, setLowColor] = useState<'green' | 'red'>('red');
//   const [spotColor, setSpotColor] = useState<'green' | 'red'>('red');

//   var high = 0;
//   var close = 0;
//   var open = 0;
//   var low = 0;
//   var spot = 0;

//   useEffect(() => {
//     if (!apiStore.isTicks && apiStore.proposalTicks.length > 1) {
//       high = Number(apiStore.proposalTicks[apiStore.proposalTicks.length - 1].high);
//       const prevHigh = Number(apiStore.proposalTicks[apiStore.proposalTicks.length - 2].high);
//       setHighColor(high > prevHigh ? 'green' : high === prevHigh ? highColor : 'red');

//       close = Number(apiStore.proposalTicks[apiStore.proposalTicks.length - 1].close);
//       const prevClose = Number(apiStore.proposalTicks[apiStore.proposalTicks.length - 2].close);
//       setCloseColor(close > prevClose ? 'green' : close === prevClose ? closeColor : 'red');

//       open = Number(apiStore.proposalTicks[apiStore.proposalTicks.length - 1].open);
//       const prevOpen = Number(apiStore.proposalTicks[apiStore.proposalTicks.length - 2].open);
//       setOpenColor(open > prevOpen ? 'green' : open === prevOpen ? openColor : 'red');

//       low = Number(apiStore.proposalTicks[apiStore.proposalTicks.length - 1].low);
//       const prevLow = Number(apiStore.proposalTicks[apiStore.proposalTicks.length - 2].low);
//       setLowColor(low > prevLow ? 'green' : low === prevLow ? lowColor : 'red');
//     } else if (apiStore.isTicks && apiStore.ticks.length > 0) {
//       spot = Number(apiStore.ticks[apiStore.ticks.length - 1].quote);
//       const prevSpot = Number(apiStore.ticks[apiStore.ticks.length - 2].quote);
//       setSpotColor(spot > prevSpot ? 'green' : spot === prevSpot ? spotColor : 'red');
//     }
//   }, [apiStore.isTicks, apiStore.proposalTicks, apiStore.ticks]);

//   return (
//     <Box>
//       {!apiStore.isTicks && apiStore.proposalTicks.length > 1 && (
//         <Box className="pricecandle-container">
//           <Card className="price-card">Close:&ensp; <Box sx={{ color: closeColor }}>{close.toFixed(4)}</Box></Card>
//           <Card className="price-card">High:&ensp; <Box sx={{ color: highColor }}>{high.toFixed(4)}</Box></Card>
//           <Card className="price-card">Open:&ensp; <Box sx={{ color: openColor }}>{open.toFixed(4)}</Box></Card>
//           <Card className="price-card">Low:&ensp; <Box sx={{ color: lowColor }}>{low.toFixed(4)}</Box></Card>
//         </Box>
//       )}
//       {apiStore.isTicks && apiStore.ticks.length > 0 && (
//         <Box className="pricetick-container">
//           <Card className="price-card">Spot Price:&ensp; <Box sx={{ color: spotColor }}>{spot.toFixed(4)}</Box></Card>
//         </Box>
//       )}
//     </Box>
//   );
// };

// export default observer(Price);
