import AliceCarousel from "react-alice-carousel";
import "../../styles/main.scss";
import { TradeType } from "./TradeTypeArray";
import { Box, Typography, useTheme } from "@mui/material";

const TradingType = () => {
  const theme = useTheme();
  const responsive = {
    0: {
      items: 1,
    },
    425: {
      items: 2
    },
    768: {
      items: 3
    }
  };

  const items = TradeType.map((tradeType, index) => (
    <Box style={{ border: `1px solid ${theme.palette.text.primary}` }} className="trade-card" key={index}>
      <Box className="title-icon-tradetype">
        <img style={{ filter: theme.palette.mode === "dark" ? 'invert(1)' : 'invert(0)' }} src={tradeType.image} alt={tradeType.title} />
        <Typography className="card-title" variant="h3" style={{ color: theme.palette.text.primary }}>{tradeType.title}</Typography>
      </Box>
      <Box style={{ color: theme.palette.text.primary }} className="card-content">
        <Typography variant="body1" style={{ color: theme.palette.text.secondary }}>{tradeType.Description}</Typography>
      </Box>
    </Box>
  ));

  return (
    <Box>
      <Box className="trade-title">Trading Markets</Box>
      <Box className="trade-carousel">
        <AliceCarousel
          mouseTracking
          infinite
          autoPlay
          autoPlayInterval={1800}
          animationDuration={1500}
          disableButtonsControls
          responsive={responsive}
          items={items}
        />
      </Box>
    </Box>
  );
};

export default TradingType;

