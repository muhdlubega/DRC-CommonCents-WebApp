import { Box } from '@mui/material'
import apiStore from '../../store/ApiStore'

const Price = () => {
    let high = apiStore.ticks[apiStore.ticks.length - 1].high as number;
    let close = apiStore.ticks[apiStore.ticks.length - 1].close as number;
    let open = apiStore.ticks[apiStore.ticks.length - 1].open as number;
    let low = apiStore.ticks[apiStore.ticks.length - 1].low as number;
    console.log(high, close, open, low)
  return (
    <div>
      <Box>
        <Box>High:{high}</Box>
        <Box>Close:{close}</Box>
        <Box>Open:{open}</Box>
        <Box>Low:{low}</Box>
      </Box>
    </div>
  )
}

export default Price