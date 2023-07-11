// import React from 'react';
import { Box, Typography } from '@mui/material';
import { motion } from "framer-motion";
import champion from '../../assets/images/champion.png'
// import champion from '../../assets/images/trophy.svg'
import { useNavigate } from 'react-router-dom';
import themeStore from '../../store/ThemeStore';

const TradeIntro = () => {
  // const handleRegisterClick = () => {
  //   console.log('Register button clicked!');
  // };

  const navigate = useNavigate();
  // const darkMode = themeStore.isDarkModeOn

  return (
    <Box className="trade-intro-main" sx={{ backgroundImage: themeStore.darkMode ? "linear-gradient(to bottom, #0000 50%, #202C45 100%)" : "linear-gradient(to bottom, #ffff 50%, #6699ff 100%)"}}>
      <Box className="trade-intro-imgbox" sx={{ flex: 1 }}>
        <img
          src={champion}
          alt="Trading Image" className="trade-intro-img"
        />
      </Box>
      <Box className="trade-intro-box">
        <Typography sx={{width: '25vw'}} variant="h5" component="h5">
        Try our live trading simulation and gain a chance to be ranked on the leaderboard!
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
