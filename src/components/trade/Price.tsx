import { Box, Card } from '@mui/material';
import apiStore from '../../store/ApiStore';
import { useRef } from 'react';
import { observer } from 'mobx-react-lite';

const Price = () => {
  //current price display for market live data
  //if price higher than previous color=green, if lower color=red, if no change useRef is used to retain previous colour
  const prevColorsRef = useRef<{
    close: 'green' | 'red';
    high: 'green' | 'red';
    open: 'green' | 'red';
    low: 'green' | 'red';
    spot: 'green' | 'red';
  }>({
    close: 'red',
    high: 'red',
    open: 'red',
    low: 'red',
    spot: 'red',
  });

  const getColor = (newValue: number, prevValue: number, prevColor:  'green' | 'red') => {
    if (newValue > prevValue) return 'green';
    if (newValue === prevValue) return prevColor;
    return 'red';
  };

  if (!apiStore.isTicks && apiStore.proposalTicks.length > 1) {
    var high = Number(apiStore.proposalTicks[apiStore.proposalTicks.length - 1].high);
    var prevHigh = Number(apiStore.proposalTicks[apiStore.proposalTicks.length - 2].high);

    var close = Number(apiStore.proposalTicks[apiStore.proposalTicks.length - 1].close);
    var prevClose = Number(apiStore.proposalTicks[apiStore.proposalTicks.length - 2].close);

    var open = Number(apiStore.proposalTicks[apiStore.proposalTicks.length - 1].open);
    var prevOpen = Number(apiStore.proposalTicks[apiStore.proposalTicks.length - 2].open);

    var low = Number(apiStore.proposalTicks[apiStore.proposalTicks.length - 1].low);
    var prevLow = Number(apiStore.proposalTicks[apiStore.proposalTicks.length - 2].low);

    const closeColor = getColor(close, prevClose, prevColorsRef.current.close);
    const highColor = getColor(high, prevHigh, prevColorsRef.current.high);
    const openColor = getColor(open, prevOpen, prevColorsRef.current.open);
    const lowColor = getColor(low, prevLow, prevColorsRef.current.low);

    prevColorsRef.current = {
      close: closeColor,
      high: highColor,
      open: openColor,
      low: lowColor,
      spot: prevColorsRef.current.spot,
    };

    return (
      <Box>
        <Box className="pricecandle-container onboarding04">
          <Card className="price-card">
            Close:&ensp; <Box sx={{ color: closeColor }}>{close.toFixed(4)}</Box>
          </Card>
          <Card className="price-card">
            High:&ensp; <Box sx={{ color: highColor }}>{high.toFixed(4)}</Box>
          </Card>
          <Card className="price-card">
            Open:&ensp; <Box sx={{ color: openColor }}>{open.toFixed(4)}</Box>
          </Card>
          <Card className="price-card">
            Low:&ensp; <Box sx={{ color: lowColor }}>{low.toFixed(4)}</Box>
          </Card>
        </Box>
      </Box>
    );
  } else if (apiStore.isTicks && apiStore.ticks.length > 0) {
    var spot = Number(apiStore.ticks[apiStore.ticks.length - 1].quote);
    var prevSpot = Number(apiStore.ticks[apiStore.ticks.length - 2].quote);

    const spotColor = getColor(spot, prevSpot, prevColorsRef.current.spot);

    prevColorsRef.current = {
      close: prevColorsRef.current.close,
      high: prevColorsRef.current.high,
      open: prevColorsRef.current.open,
      low: prevColorsRef.current.low,
      spot: spotColor,
    };

    return (
      <Box>
        <Box className="pricetick-container onboarding04">
          <Card className="price-card">
            Spot Price:&ensp; <Box sx={{ color: spotColor }}>{spot.toFixed(4)}</Box>
          </Card>
        </Box>
      </Box>
    );
  }

  return null;
};

export default observer(Price);
