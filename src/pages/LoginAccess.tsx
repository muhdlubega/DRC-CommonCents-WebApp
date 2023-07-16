import { Box, Typography } from "@mui/material";
import watermark from '../assets/images/error401.svg'
import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import authStore from "../store/AuthStore";

const LoginAccess = observer(() => {
  const animationControls = useAnimation();

  useEffect(() => {
    animationControls.start({ y: 0, opacity: 1, transition: { duration: 2 } });
  }, [animationControls]);

  return (
    <Box className="error-container">
    <img className="watermark" src={watermark}></img>
    <Typography className="error-title" variant="h3">Hmm...your profile seems to be out of shape.</Typography>
    <Typography className="error-subtitle" variant="h5">Try logging into your account or create an account now!</Typography>
    <motion.button initial={{ y: 50, opacity: 0 }}
          animate={animationControls}
        className="error-btn"
        onClick={authStore.handleOpen}
      >
        Log In
      </motion.button>
    </Box>
  )
});

export default LoginAccess