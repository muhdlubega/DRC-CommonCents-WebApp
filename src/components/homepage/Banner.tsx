import { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import '../../styles/main.scss'
import { useNavigate } from "react-router-dom";
import { Box, useTheme } from "@mui/material";
// import phone from '../../assets/images/phoneplaceholder.png'

const Banner = () => {
  const animationControls = useAnimation();
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    animationControls.start({ y: 0, opacity: 1, transition: { duration: 2 } });
  }, [animationControls]);

  return (
    <Box className="banner-main">
      <motion.div
        className="banner-text"
        initial={{ y: -50, opacity: 0 }}
        animate={animationControls}
      >
        <Box className="banner-container">
          <motion.h2 className="banner-title" style={{ color: theme.palette.text.primary }}>Trading,</motion.h2>
          <motion.h2 className="banner-title" style={{ color: theme.palette.text.primary }}>all in one place</motion.h2>
          <motion.p className="banner-tagline" style={{ color: theme.palette.text.primary }}>
            Join us and learn more about trading! It's CommonCents!
          </motion.p>
          <motion.button
        className="banner-btn"
        onClick={() => navigate("/trade/1HZ10V")}
      >
        Create an Account
      </motion.button>
        </Box>
      </motion.div>
      {/* <Box sx={{flex: 1}}></Box> */}
      <Box
        className="banner-img-container"
        // initial={{ y: -50, opacity: 0 }}
        // animate={animationControls}
      >
        {/* <motion.img
        initial={{ y: -50, opacity: 0 }}
        animate={animationControls} 
        className="banner-image" src={phone} alt="trading-image" /> */}
      </Box>
    </Box>
  );
};

export default Banner;
