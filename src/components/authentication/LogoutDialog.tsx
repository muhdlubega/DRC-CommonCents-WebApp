import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useTheme,
} from "@mui/material";

interface LogoutConfirmationDialogProps {
  open: boolean;
  onClose: (confirmed: boolean) => void;
}

const LogoutConfirmationDialog = ({
  open,
  onClose,
}: LogoutConfirmationDialogProps) => {
  const theme = useTheme();

  return (
    <Dialog
      open={open}
      onClose={() => onClose(false)}
      aria-labelledby="logout-confirmation-dialog-title"
      aria-describedby="logout-confirmation-dialog-description"
    >
      <DialogTitle id="logout-confirmation-dialog-title">
        Logout Confirmation
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="logout-confirmation-dialog-description">
          Are you sure you want to log out?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => onClose(false)}
          style={{ color: theme.palette.text.secondary }}
        >
          Cancel
        </Button>
        <Button
          onClick={() => onClose(true)}
          style={{ backgroundColor: "#0033ff", color: "white" }}
          variant="contained"
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LogoutConfirmationDialog;
