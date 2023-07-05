import { Box, Button, TextField } from "@mui/material";
// import { useState } from "react";
// import { useGlobalState } from "../../store/Context";
// import { auth } from "../../firebase";
// import { signInWithEmailAndPassword } from "firebase/auth";
// import authStore from "../../store/AuthStore";
import { observer } from "mobx-react-lite";
import authStore from "../../store/AuthStore";

interface LoginProps {
  handleClose: () => void;
}

const Login = observer(({ }: LoginProps) => {
  // const [email, setEmail] = useState<string>("");
  // const [password, setPassword] = useState<string>("");


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
    </Box>
  );
});

export default Login;
