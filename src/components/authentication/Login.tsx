import {
  Box,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  useTheme,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { observer } from "mobx-react-lite";
import authStore from "../../store/AuthStore";
import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebase";
import { Visibility, VisibilityOff } from "@mui/icons-material";

interface LoginProps {
  handleClose: () => void;
}

const Login = observer(({ handleClose }: LoginProps) => {
  //login structure for auth modal using firebase
  const [openForgotPassword, setOpenForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const theme = useTheme();

  const handleOpenForgotPassword = () => {
    setOpenForgotPassword(true);
  };

  const handleCloseForgotPassword = () => {
    setOpenForgotPassword(false);
  };

  //forgot password function sends an email for password reset to user via firebase
  const handleForgotPassword = async () => {
    try {
      const actionCodeSettings = {
        url: "http://localhost:5173/",
        handleCodeInApp: true,
      };
      await sendPasswordResetEmail(
        auth,
        forgotPasswordEmail,
        actionCodeSettings
      );

      authStore.setAlert({
        open: true,
        message: "Password reset email sent. Please check your inbox.",
        type: "success",
      });
      handleCloseForgotPassword();
    } catch (error: unknown) {
      authStore.setAlert({
        open: true,
        message: (error as { message: string }).message,
        type: "error",
      });
    }
  };

  return (
    <Box
      className="login-signup-box"
      p={3}
      style={{
        backgroundColor: theme.palette.background.paper,
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
      <Button
        variant="contained"
        size="large"
        onClick={() => {
          authStore.handleLogin();
          handleClose();
        }}
        style={{ backgroundColor: "#0033ff" }}
      >
        Login
      </Button>
      <Button variant="text" onClick={handleOpenForgotPassword}>
        Forgot Password?
      </Button>

      <Dialog open={openForgotPassword} onClose={handleCloseForgotPassword}>
        <DialogTitle>Forgot Password</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            value={forgotPasswordEmail}
            onChange={(e) => setForgotPasswordEmail(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseForgotPassword}>Cancel</Button>
          <Button
            onClick={handleForgotPassword}
            variant="contained"
            color="primary"
          >
            Reset Password
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
});

export default Login;
