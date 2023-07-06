import { Box } from '@mui/material'
import apiStore from '../../store/ApiStore'
import { observer } from 'mobx-react-lite';

const Price = () => {
  if (!apiStore.isTicks && apiStore.ticks.length > 0){
    var high = Number(apiStore.ticks[apiStore.ticks.length - 1].high);
    var prevHigh = Number(apiStore.ticks[apiStore.ticks.length - 2].high);
    var highIsHigher = high > prevHigh;
    var close = Number(apiStore.ticks[apiStore.ticks.length - 1].close);
    var prevClose = Number(apiStore.ticks[apiStore.ticks.length - 2].close);
    var closeIsHigher = close > prevClose;
    var open = Number(apiStore.ticks[apiStore.ticks.length - 1].open);
    var prevOpen = Number(apiStore.ticks[apiStore.ticks.length - 2].open);
    var openIsHigher = open > prevOpen;
    var low = Number(apiStore.ticks[apiStore.ticks.length - 1].low);
    var prevLow = Number(apiStore.ticks[apiStore.ticks.length - 2].low);
    var lowIsHigher = low > prevLow;
    // console.log(high, close, open, low)

  return (
    <div>
      <Box className="pricecandle-container">
        <Box className="pricecandle-card">Close: <Box sx={{color: closeIsHigher ? 'green' : 'red'}}>{close.toFixed(4)}</Box></Box>
        <Box className="pricecandle-card">High: <Box sx={{color: highIsHigher ? 'green' : 'red'}}>{high.toFixed(4)}</Box></Box>
        <Box className="pricecandle-card">Open: <Box sx={{color: openIsHigher ? 'green' : 'red'}}>{open.toFixed(4)}</Box></Box>
        <Box className="pricecandle-card">Low: <Box sx={{color: lowIsHigher ? 'green' : 'red'}}>{low.toFixed(4)}</Box></Box>
      </Box>
    </div>
  )} else if (apiStore.isTicks && apiStore.ticks.length > 0){
    var spot = Number(apiStore.ticks[apiStore.ticks.length - 1].quote);
    var prevSpot = Number(apiStore.ticks[apiStore.ticks.length - 2].quote);
    var spotIsHigher = spot > prevSpot;
    // console.log(spot)

  return (
    <div>
      <Box className="pricetick-container">
        <Box className="pricetick-card">Spot Price: <Box sx={{color: spotIsHigher ? 'green' : 'red'}}>{spot.toFixed(4)}</Box></Box>
      </Box>
    </div>
  )
  }
}

export default observer(Price)