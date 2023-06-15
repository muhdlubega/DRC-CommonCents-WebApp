import React from "react";
import { Snackbar } from "@mui/material";
import MuiAlert, { AlertProps, AlertColor } from "@mui/lab/Alert";
import { useGlobalState } from "../../Context";

const Alert = () => {
  const { alert, setAlert } = useGlobalState();

  const handleCloseAlert = (event: React.SyntheticEvent<any>, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }

    setAlert({ open: false, message: "", type: "" });
  };

  return (
    <Snackbar
      open={alert.open}
      autoHideDuration={3000}
    //   onClose={handleCloseAlert}
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

export default Alert;
