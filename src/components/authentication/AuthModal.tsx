import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import { Button, Tab, Tabs, AppBar, Box } from "@mui/material";
import Signup from "./Signup";
import Login from "./Login";
import { useState } from "react";
// import { auth } from "../../firebase";
import GoogleButton from "react-google-button";
// import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
// import authStore from "../../store/AuthStore";
import { observer } from "mobx-react-lite";
import authStore from "../../store/AuthStore";

const AuthModal = observer(() => {

  const [value, setValue] = useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div>
      <Button
        variant="contained"
        style={{
          width: 85,
          height: 40,
          margin: 10,
          backgroundColor: "#0033ff",
          color: 'white'
        }}
        onClick={authStore.handleOpen}
      >
        Login
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
          <div className="auth-modal-paper">
            <AppBar
              position="static"
              style={{
                backgroundColor: "transparent",
                color: "white",
              }}
            >
              <Tabs
                value={value}
                onChange={handleChange}
                variant="fullWidth"
                style={{ borderRadius: 10 }}
              >
                <Tab label="Login" />
                <Tab label="Sign Up" />
              </Tabs>
            </AppBar>
            {value === 0 && <Login handleClose={authStore.handleClose} />}
            {value === 1 && <Signup handleClose={authStore.handleClose} />}
            <Box className="auth-modal-google">
              <span>OR</span>
              <GoogleButton
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