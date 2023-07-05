import { Box, Button, TextField } from "@mui/material";
// import { useState } from "react";
// import { useGlobalState } from "../../store/Context";
// import { createUserWithEmailAndPassword } from "firebase/auth";
// import { auth } from "../../firebase";
// import authStore from "../../store/AuthStore";
import { observer } from "mobx-react-lite";
import authStore from "../../store/AuthStore";

interface SignupProps {
  handleClose: () => void;
}

const Signup = observer((
  {  } : SignupProps
  ) => {

  

  return (
    <Box
      p={3}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      <TextField
        variant="outlined"
        type="email"
        label="Enter Email"
        value={authStore.email}
        onChange={(e) => authStore.setEmail(e.target.value)}
        fullWidth
      />
      <TextField
        variant="outlined"
        label="Enter Password"
        type="password"
        value={authStore.password}
        onChange={(e) => authStore.setPassword(e.target.value)}
        fullWidth
      />
      <TextField
        variant="outlined"
        label="Confirm Password"
        type="password"
        value={authStore.confirmPassword}
        onChange={(e) => authStore.setConfirmPassword(e.target.value)}
        fullWidth
      />
      <Button
        variant="contained"
        size="large"
        style={{ backgroundColor: "#0033ff" }}
        onClick={authStore.handleSignUp}
      >
        Sign Up
      </Button>
    </Box>
  );
});

export default Signup;
