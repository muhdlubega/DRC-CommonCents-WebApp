import AliceCarousel from "react-alice-carousel";
import "../../styles/main.scss";
import { TradeType } from "./TradeTypeArray";
import { Box, useTheme } from "@mui/material";

const TradingType = () => {
  const theme = useTheme();
  const responsive = {
    0: {
      items: 3,
    },
  };

  const items = TradeType.map((tradeType, index) => (
    <div style={{ border: `1px solid ${theme.palette.text.primary}` }} className="trade-card" key={index}>
      <div className="title-icon-tradetype">
        <img style={{ filter: theme.palette.mode === "dark" ? 'invert(1)' : 'invert(0)' }} src={tradeType.image} alt={tradeType.title} />
        <h3>{tradeType.title}</h3>
      </div>
      <div style={{ color: theme.palette.text.primary }} className="card-content">
        <p style={{ color: theme.palette.text.primary }}>{tradeType.Description}</p>
      </div>
    </div>
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

