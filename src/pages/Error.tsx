import { Box, Typography } from "@mui/material";
import watermark from '../assets/images/error404.svg'
import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";

const Error = observer(() => {
  const navigate = useNavigate();
  const animationControls = useAnimation();

  useEffect(() => {
    animationControls.start({ y: 0, opacity: 1, transition: { duration: 2 } });
  }, [animationControls]);

  return (
    <Box className="error-container" style={{height: '800px', margin:'50px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start'}}>
    <img className="watermark" src={watermark}></img>
    <Typography className="error-title" variant="h4" style={{width: '750px', fontWeight: 700, marginBottom:'20px'}}>Sorry! We’ve looked everywhere but we can’t seem to find the page you are looking for.</Typography>
    <Typography className="error-subtitle" variant="h5">Don’t worry, CommonCents will chain you back to safety.</Typography>
    <motion.button
        className="error-btn"
        onClick={() => navigate("/")}
      >
        Return to Homepage
      </motion.button>
    </Box>
  )
});

export default Error