import { Snackbar } from "@mui/material";
import MuiAlert, { AlertColor } from "@mui/material/Alert";
import authStore from "../../store/AuthStore";
import { observer } from "mobx-react-lite";
import { SyntheticEvent } from "react";

const Alert = observer(() => {
  const handleCloseAlert = (
    _event: Event | SyntheticEvent<Element, Event>,
    reason?: string
  ) => {
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
      className="alert-snackbar"
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
