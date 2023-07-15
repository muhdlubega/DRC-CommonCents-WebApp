import { Box, Typography } from "@mui/material";
import watermark from '../assets/images/error401.svg'
import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import { observer } from "mobx-react-lite";

const LoginAccess = observer(() => {
  const animationControls = useAnimation();

  useEffect(() => {
    animationControls.start({ y: 0, opacity: 1, transition: { duration: 2 } });
  }, [animationControls]);

  return (
    <Box className="error-container" style={{height: '800px', margin:'50px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start'}}>
    <img className="watermark" src={watermark}></img>
    <Typography className="error-title" variant="h3" style={{width: '750px', fontWeight: 700, marginBottom:'20px'}}>Hmm...your profile seems to be out of shape.</Typography>
    <Typography className="error-subtitle" variant="h5">Try logging into your account or create an account now!</Typography>
    <motion.button
        className="error-btn"
        // onClick={null}
      >
        Log In
      </motion.button>
    </Box>
  )
});

export default LoginAccess