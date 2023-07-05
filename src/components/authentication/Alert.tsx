// import React from "react";
import { Snackbar } from "@mui/material";
import MuiAlert, { AlertColor } from "@mui/material/Alert";
// import { useGlobalState } from "../../store/Context";
import authStore from "../../store/AuthStore";
import { observer } from "mobx-react-lite";

const Alert = observer(() => {

  const handleCloseAlert = (_event: any, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }

    authStore.setAlert({ open: false, message: "", type: "" });
  };

  return (
    <Snackbar
      open={authStore.alert.open}
      autoHideDuration={3000}
      onClose={handleCloseAlert}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      style={{ marginTop: "64px", marginRight: "16px" }} 
    >
      <MuiAlert
        onClose={handleCloseAlert}
        elevation={10}
        variant="filled"
        severity={authStore.alert.type as AlertColor}
      >
        {authStore.alert.message}
      </MuiAlert>
    </Snackbar>
  );
});

export default Alert;
