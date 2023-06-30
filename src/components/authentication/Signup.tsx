import { Box, Button, TextField } from "@mui/material";
import { useState } from "react";
// import { useGlobalState } from "../../store/Context";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import authStore from "../../store/AuthStore";
import { observer } from "mobx-react-lite";

interface SignupProps {
  handleClose: () => void;
}

const Signup = observer(({ handleClose } : SignupProps) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const handleSubmit = async () => {
    if (password !== confirmPassword) {
      authStore.setAlert({
        open: true,
        message: "Passwords do not match",
        type: "error",
      });
      return;
    }

    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      authStore.initializeUser(100000, email, email, '')
      authStore.setAlert({
        open: true,
        message: `Sign Up Successful. Welcome ${result.user.email}`,
        type: "success",
      });

      handleClose();
    } catch (error: any) {
      authStore.setAlert({
        open: true,
        message: error.message,
        type: "error",
      });
      return;
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
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
      />
      <TextField
        variant="outlined"
        label="Enter Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
      />
      <TextField
        variant="outlined"
        label="Confirm Password"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        fullWidth
      />
      <Button
        variant="contained"
        size="large"
        style={{ backgroundColor: "#0033ff" }}
        onClick={handleSubmit}
      >
        Sign Up
      </Button>
    </Box>
  );
});

export default Signup;
