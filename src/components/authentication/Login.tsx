import { Box, Button, TextField, Dialog,
  DialogActions,
  DialogContent,
  DialogTitle, } from "@mui/material";
// import { useState } from "react";
// import { useGlobalState } from "../../store/Context";
// import { auth } from "../../firebase";
// import { signInWithEmailAndPassword } from "firebase/auth";
// import authStore from "../../store/AuthStore";
import { observer } from "mobx-react-lite";
import authStore from "../../store/AuthStore";
import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebase";

interface LoginProps {
  handleClose: () => void;
}

const Login = observer(({ }: LoginProps) => {
  // const [email, setEmail] = useState<string>("");
  // const [password, setPassword] = useState<string>("");
  const [openForgotPassword, setOpenForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");

  const handleOpenForgotPassword = () => {
    setOpenForgotPassword(true);
  };

  const handleCloseForgotPassword = () => {
    setOpenForgotPassword(false);
  };

  const handleForgotPassword = async () => {
    try {
      const actionCodeSettings = {
        url: "http://localhost:5173/",
        handleCodeInApp: true,
      };
      await sendPasswordResetEmail(auth, forgotPasswordEmail, actionCodeSettings);

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
      <Button
        variant="contained"
        size="large"
        onClick={authStore.handleLogin}
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
          <Button onClick={handleForgotPassword} variant="contained" color="primary">
            Reset Password
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
});

export default Login;
