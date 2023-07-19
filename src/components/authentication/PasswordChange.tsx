import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  useTheme,
} from "@mui/material";

interface PasswordChangeConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const PasswordChangeConfirmationDialog = ({ open, onClose, onConfirm }: PasswordChangeConfirmationDialogProps) => {
    //password change confirmation dialog structure on click of change password button in accounts page
  const theme = useTheme();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="confirm-password-change-dialog-title"
      aria-describedby="confirm-password-change-dialog-description"
    >
      <DialogTitle id="confirm-password-change-dialog-title">
        Confirm Password Change
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="confirm-password-change-dialog-description">
          Are you sure you want to change your password? This action cannot be
          undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          style={{ color: theme.palette.text.secondary }}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          style={{ backgroundColor: "#0033ff", color: "white" }}
          variant="contained"
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PasswordChangeConfirmationDialog;
