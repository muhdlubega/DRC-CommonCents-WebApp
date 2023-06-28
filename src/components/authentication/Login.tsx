import { Box, Button, TextField } from "@mui/material";
import { useState } from "react";
// import { useGlobalState } from "../../store/Context";
import { auth } from "../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import authStore from "../../store/AuthStore";
import { observer } from "mobx-react-lite";

interface LoginProps {
  handleClose: () => void;
}

const Login = observer(({ handleClose }: LoginProps) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSubmit = async () => {
    if (!email || !password) {
      authStore.setAlert({
        open: true,
        message: "Please fill all the Fields",
        type: "error",
      });
      return;
    }

    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      authStore.setAlert({
        open: true,
        message: `Sign Up Successful. Welcome ${result.user.email}`,
        type: "success",
      });
      console.log(alert);

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
      <Button
        variant="contained"
        size="large"
        onClick={handleSubmit}
        style={{ backgroundColor: "#0033ff" }}
      >
        Login
      </Button>
    </Box>
  );
});

export default Login;
