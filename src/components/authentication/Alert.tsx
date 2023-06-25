// import React from "react";
import { Snackbar } from "@mui/material";
import MuiAlert, { AlertColor } from "@mui/lab/Alert";
// import { useGlobalState } from "../../store/Context";
import authStore from "../../store/AuthStore";
import { observer } from "mobx-react";

const Alert = () => {

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
};

export default observer(Alert);
