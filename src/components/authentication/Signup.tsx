import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  useTheme,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { observer } from "mobx-react-lite";
import authStore from "../../store/AuthStore";
import { useState } from "react";

interface SignupProps {
  handleClose: () => void;
}

const Signup = observer(({}: SignupProps) => {
  //signup structure for auth modal using firebase
  const [showPassword, setShowPassword] = useState(false);
  const theme = useTheme();

  return (
    <Box
      className="login-signup-box"
      p={3}
      style={{
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
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
