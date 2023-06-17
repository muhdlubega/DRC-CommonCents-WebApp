// import React from "react";
import { Snackbar } from "@mui/material";
import MuiAlert, { AlertColor } from "@mui/lab/Alert";
// import { useGlobalState } from "../../store/Context";
import globalStore from "../../store/AuthStore";
import { observer } from "mobx-react";

const Alert = () => {
  const { alert, setAlert } = globalStore;

  const handleCloseAlert = (_event: any, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }

    setAlert({ open: false, message: "", type: "" });
  };

  return (
    <Snackbar
      open={alert.open}
      autoHideDuration={3000}
      onClose={handleCloseAlert}
    >
      <MuiAlert
        onClose={handleCloseAlert}
        elevation={10}
        variant="filled"
        severity={alert.type as AlertColor}
      >
        {alert.message}
      </MuiAlert>
    </Snackbar>
  );
};

export default observer(Alert);
