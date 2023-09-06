import { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Box, Grid, useTheme } from "@mui/material";
// import phone from "../../assets/images/bannerphone.svg";
// import bg from "../../assets/images/banner_bg1.jpg"
import derivapi from "../../assets/images/derivapi.svg";
import authStore from "../../store/AuthStore";

const Banner = () => {
  //intro banner for the homepage
  const theme = useTheme();
  const navigate = useNavigate();
  const animationControls = useAnimation();

  useEffect(() => {
    animationControls.start({ y: 0, opacity: 1, transition: { duration: 2 } });
  }, [animationControls]);

  return (
    <>
    <div className="banner-bg"></div>
    <Grid container className="banner-main">
      {/* <Grid item xs={12} md={6} className="banner-grid"> */}
        <motion.div
          className="banner-text"
          initial={{ y: -50, opacity: 0 }}
          animate={animationControls}
        >
          <Box className="banner-container">
            <motion.h2
              className="banner-title"
              style={{ color: theme.palette.text.primary }}
            >
              Trading,
            </motion.h2>
            <motion.h2
              className="banner-title"
              style={{ color: theme.palette.text.primary }}
            >
              all in one place
            </motion.h2>
            <motion.p
              className="banner-tagline"
              style={{ color: theme.palette.text.primary }}
            >
              Join us and learn more about trading!
            </motion.p>
            <motion.p
              className="banner-tagline"
              style={{ color: theme.palette.text.primary }}
            >
              It's CommonCents!
            </motion.p>
            <motion.button
              className="banner-btn"
              onClick={
                authStore.user
                  ? () => navigate("/trade/1HZ10V")
                  : authStore.handleOpen
              }
            >
              {authStore.user ? "Learn Trading Now!" : "Create an Account"}
            </motion.button>
            <motion.div>
              <motion.p >Powered by
              <motion.img style={{margin:"0 0 10px 10px"}}
            src={derivapi}
            alt="deriv-api-logo"
          />
              </motion.p>
            </motion.div>
          </Box>
        </motion.div>
        {/* <Box className="banner-img-container">
          <motion.img
            initial={{ y: -50, opacity: 0 }}
            animate={animationControls}
            className="banner-image"
            src={bg}
            alt="background-image"
          />
        </Box> */}
      {/* </Grid> */}
      {/* <Grid item xs={12} md={6}>
        <Box className="banner-img-container">
          <motion.img
            initial={{ y: -50, opacity: 0 }}
            animate={animationControls}
            className="banner-image"
            src={phone}
            alt="trading-image"
          />
        </Box>
      </Grid> */}
    </Grid>
    </>
  );
};

export default Banner;
