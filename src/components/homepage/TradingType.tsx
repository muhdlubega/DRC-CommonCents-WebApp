// // import React from "react";
// import AliceCarousel from "react-alice-carousel";
// import "../../styles/main.scss";
// import { TradeType } from "./TradeTypeArray";



import AliceCarousel from "react-alice-carousel";
import "../../styles/main.scss";
import { TradeType } from "./TradeTypeArray";
import { Box } from "@mui/material";
import themeStore from "../../store/ThemeStore";

const TradingType = () => {
  const responsive = {
    0: {
      items: 3,
    },
  };

  const items = TradeType.map((tradeType, index) => (
    <div style={{border: themeStore.darkMode  ? '1px solid #ffffff' : '1px solid #000000'}} className="trade-card" key={index}>
      <div className="title-icon-tradetype">
        <img style={{filter: themeStore.darkMode  ? 'invert(1)' : 'invert(0)'}} src={tradeType.image} alt={tradeType.title} />
        <h3>{tradeType.title}</h3>
      </div>
      <div style={{color: themeStore.darkMode  ? '#ffffff' : '#000000'}} className="card-content">
        <p style={{color: themeStore.darkMode  ? '#ffffff' : '#000000'}} >{tradeType.Description}</p>
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

