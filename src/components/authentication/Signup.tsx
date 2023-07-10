import { Box, Button, IconButton, InputAdornment, TextField } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
// import { useState } from "react";
// import { useGlobalState } from "../../store/Context";
// import { createUserWithEmailAndPassword } from "firebase/auth";
// import { auth } from "../../firebase";
// import authStore from "../../store/AuthStore";
import { observer } from "mobx-react-lite";
import authStore from "../../store/AuthStore";
import { useState } from "react";

interface SignupProps {
  handleClose: () => void;
}

const Signup = observer((
  {} : SignupProps
  ) => {
    const [showPassword, setShowPassword] = useState(false);

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
        type={showPassword ? "text" : "password"}
        value={authStore.password}
        onChange={(e) => authStore.setPassword(e.target.value)}
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <TextField
        variant="outlined"
        label="Confirm Password"
        type={showPassword ? "text" : "password"}
        value={authStore.confirmPassword}
        onChange={(e) => authStore.setConfirmPassword(e.target.value)}
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
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
