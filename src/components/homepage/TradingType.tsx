// // import React from "react";
// import AliceCarousel from "react-alice-carousel";
// import "../../styles/main.scss";
// import { TradeType } from "./TradeTypeArray";



import AliceCarousel from "react-alice-carousel";
import "../../styles/main.scss";
import { TradeType } from "./TradeTypeArray";
import { Box } from "@mui/material";

const TradingType = () => {
  const responsive = {
    0: {
      items: 3,
    },
  };

  const items = TradeType.map((tradeType, index) => (
    <div className="trade-card" key={index}>
      <div className="title-icon-tradetype">
        <img src={tradeType.image} alt={tradeType.title} />
        <h3>{tradeType.title}</h3>
      </div>
      <div className="card-content">
        <p>{tradeType.Description}</p>
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

