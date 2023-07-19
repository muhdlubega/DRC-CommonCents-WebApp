import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useTheme,
} from "@mui/material";

interface ResetBalanceConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ResetBalanceConfirmationDialog = ({
  open,
  onClose,
  onConfirm,
}: ResetBalanceConfirmationDialogProps) => {
  //reset balance confirmation dialog structure on click of reset balance button in accounts page and user sidebar
  const theme = useTheme();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="reset-confirmation-dialog-title"
      aria-describedby="reset-confirmation-dialog-description"
    >
      <DialogTitle id="reset-confirmation-dialog-title">
        Reset Balance Confirmation
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="reset-confirmation-dialog-description">
          Resetting your balance will clear all your trade activities and
          history. Are you sure you would like to continue? This action cannot
          be undone.
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

export default ResetBalanceConfirmationDialog;
