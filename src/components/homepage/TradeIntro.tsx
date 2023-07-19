import { Box, Typography, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import champion from "../../assets/images/champion3-1 1.svg";
import { useNavigate } from "react-router-dom";

const TradeIntro = () => {
  //the bottom of the homepage with a call-to-action to link users to the trade page
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Box
      className="trade-intro-main"
      sx={{
        backgroundImage:
          theme.palette.mode === "dark"
            ? "linear-gradient(to bottom, #0000 20%, #1D2540 90%)"
            : "linear-gradient(to bottom, #ffff 50%, #6699ff 100%)",
      }}
    >
      <Box className="trade-intro-imgbox" sx={{ flex: 1 }}>
        <img src={champion} alt="Trading Image" className="trade-intro-img" />
      </Box>
      <Box className="trade-intro-box">
        <Typography className="trade-intro-text" variant="h5">
          Try our live trading simulation and gain a chance to be ranked on the
          leaderboard!
        </Typography>
        <motion.button
          className="trade-intro-btn"
          onClick={() => navigate("/trade/1HZ10V")}
        >
          Start Trading Now!
        </motion.button>
      </Box>
    </Box>
  );
};

export default TradeIntro;
