import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import { Button, Tab, Tabs, AppBar, Box, Typography, useTheme } from "@mui/material";
import Signup from "./Signup";
import Login from "./Login";
import { useState } from "react";
import GoogleButton from "react-google-button";
import { observer } from "mobx-react-lite";
import authStore from "../../store/AuthStore";
import { LoginCurve } from "iconsax-react";
import '../../styles/components.scss';

const AuthModal = observer(() => {

  const [value, setValue] = useState(0);
  const theme = useTheme();

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div>
      <Button
        variant="contained"
        style={{
          borderRadius: '10px',
          height: '40px',
          margin: '10px',
          backgroundColor: "#0033ff",
          color: 'white', 
        }}
        onClick={authStore.handleOpen}
      >
        <LoginCurve size={26} color="white" className="auth-modal-login"/>
        <Typography 
        className="navbar-login-btn">Login</Typography>
      </Button>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className="auth-modal-modal"
        open={authStore.open}
        onClose={authStore.handleClose}
        closeAfterTransition
      >
        <Fade in={authStore.open}>
          <div className="auth-modal-box">
            <AppBar
              position="static"
              className="auth-modal-appbar"
            >
              <Tabs
                value={value}
                onChange={handleChange}
                variant="fullWidth"
                style={{  
                  backgroundColor: theme.palette.background.default, color: theme.palette.text.primary}}
              >
                <Tab label="Login" />
                <Tab label="Sign Up" />
              </Tabs>
            </AppBar>
            {value === 0 && <Login handleClose={authStore.handleClose} />}
            {value === 1 && <Signup handleClose={authStore.handleClose} />}
            <Box className="auth-modal-google"
        style={{backgroundColor: theme.palette.background.default, color: theme.palette.text.primary}}>
              <span
        style={{color: theme.palette.text.secondary}}>OR</span>
              <GoogleButton
              className="auth-modal-googlebtn"
                style={{ width: "100%", outline: "none" }}
                onClick={authStore.signInWithGoogle}
              />
            </Box>
          </div>
        </Fade>
      </Modal>
    </div>
  );
});

export default AuthModal;