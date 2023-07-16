import { Box, Card } from '@mui/material'
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

  return (
    <Box>
      <Box className="pricecandle-container">
        <Card className="price-card">Close:&ensp; <Box sx={{color: closeIsHigher ? 'green' : 'red'}}>{close.toFixed(4)}</Box></Card>
        <Card className="price-card">High:&ensp; <Box sx={{color: highIsHigher ? 'green' : 'red'}}>{high.toFixed(4)}</Box></Card>
        <Card className="price-card">Open:&ensp; <Box sx={{color: openIsHigher ? 'green' : 'red'}}>{open.toFixed(4)}</Box></Card>
        <Card className="price-card">Low:&ensp; <Box sx={{color: lowIsHigher ? 'green' : 'red'}}>{low.toFixed(4)}</Box></Card>
      </Box>
    </Box>
  )} else if (apiStore.isTicks && apiStore.ticks.length > 0){
    var spot = Number(apiStore.ticks[apiStore.ticks.length - 1].quote);
    var prevSpot = Number(apiStore.ticks[apiStore.ticks.length - 2].quote);
    var spotIsHigher = spot > prevSpot;

  return (
    <Box>
      <Box className="pricetick-container">
        <Card className="price-card">Spot Price:&ensp; <Box sx={{color: spotIsHigher ? 'green' : 'red'}}>{spot.toFixed(4)}</Box></Card>
      </Box>
    </Box>
  )
  }
}

export default observer(Price)