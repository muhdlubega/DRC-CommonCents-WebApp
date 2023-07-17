import { EmptyWallet, LogoutCurve } from "iconsax-react";
import authStore from "../store/AuthStore";
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  InputAdornment,
  Modal,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import {
  signOut,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { auth, db } from "../firebase";
import watermark from "../assets/images/watermark 2.svg";
import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const AccountPage = observer(() => {
  const navigate = useNavigate();
  const [isSecondDropdownOpen, setIsSecondDropdownOpen] = useState(false);
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] =
    useState(false);
  const [updatedName, setUpdatedName] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [userBalance, setUserBalance] = useState(100000);
  const [userName, setUserName] = useState("");
  const theme = useTheme();

  const [state, setState] = useState({
    resetConfirmationOpen: false,
  });

  const toggleSecondDropdown = () => {
    setIsSecondDropdownOpen((prevState) => !prevState);
  };

  const getUserBalance = async () => {
    const querySnapshot = await getDocs(collection(db, "users"));
    querySnapshot.forEach((doc) => {
      const { balance } = doc.data();
      if (auth.currentUser && auth.currentUser.uid === doc.id) {
        setUserBalance(balance);
      }
    });
  };

  const logOut = () => {
    signOut(auth);
    navigate("/");
    authStore.setAlert({
      open: true,
      type: "success",
      message: "Logout Successful!",
    });
  };

  const toggleResetConfirmation = () => {
    setState((prevState) => ({
      ...prevState,
      resetConfirmationOpen: !prevState.resetConfirmationOpen,
    }));
  };
  const handleResetBalance = () => {
    toggleResetConfirmation();
  };

  const confirmResetBalance = () => {
    authStore.setResetBalance(100000);
    toggleResetConfirmation();
  };

  const handleUpdateName = () => {
    authStore.setUpdateName(updatedName);
    authStore.setAlert({
      open: true,
      message: "Display name updated!",
      type: "success",
    });
  };

  const getUserName = async () => {
    const querySnapshot = await getDocs(collection(db, "users"));
    querySnapshot.forEach((doc) => {
      const { displayName } = doc.data();
      if (auth.currentUser && auth.currentUser.uid === doc.id) {
        setUserName(displayName);
      }
    });
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmNewPassword) {
      authStore.setAlert({
        open: true,
        message: "Passwords do not match",
        type: "error",
      });
      return;
    }

    const lengthTest = /^.{8,}$/;

    if (!lengthTest.test(newPassword)) {
      authStore.setAlert({
        open: true,
        message: "Password must be at least 8 characters long",
        type: "error",
      });
      return;
    }

    const caseTest = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[.!@#$%^&*]).{8,}$/;

    if (!caseTest.test(newPassword)) {
      authStore.setAlert({
        open: true,
        message:
          "Password must contain at least one uppercase and lowercase letter, a special character and a number",
        type: "error",
      });
      return;
    }

    setIsConfirmationDialogOpen(true);
  };

  const handleConfirmPasswordChange = async () => {
    try {
      const credential = EmailAuthProvider.credential(
        auth.currentUser!.email!,
        oldPassword
      );
      await reauthenticateWithCredential(auth.currentUser!, credential);
      await updatePassword(auth.currentUser!, newPassword);
      authStore.setAlert({
        open: true,
        message: "Password successfully updated!",
        type: "success",
      });
      setIsConfirmationDialogOpen(false);
    } catch (error) {
      authStore.setAlert({
        open: true,
        message: (error as { message: string }).message,
        type: "error",
      });
    }
  };

  useEffect(() => {
    getUserBalance();
    getUserName();
  }, [authStore.user]);

  return (
    <Box>
      <img className="watermark" src={watermark}></img>
      <Typography variant="h6" className="account-title">
        Account Details
      </Typography>
      <Box className="account-container">
        <Box className="account-profile">
          <Avatar
            className="account-picture"
            src={auth.currentUser?.photoURL || ""}
            alt={userName || ""}
          />
          <Box className="account-userbox">
            <Typography>{userName}</Typography>
            <Typography
              component="span"
              style={{
                fontSize: "12px",
              }}
            >
              <EmptyWallet variant="Bold" size={16} />
              {userBalance.toFixed(2)} USD
            </Typography>
          </Box>
          <Button
            variant="contained"
            className="account-reset-balance"
            onClick={handleResetBalance}
            style={{
              backgroundColor: "#6699ff",
              borderRadius: "10px",
              width: "190px",
              fontSize: "9px",
              color: "white",
            }}
          >
            Reset Balance
          </Button>
        </Box>
        <TextField
          variant="outlined"
          label="Username"
          type="text"
          value={updatedName}
          onChange={(event) => setUpdatedName(event.target.value)}
          fullWidth
          className="account-user-txtfield"
          required
          id="username"
          inputProps={{
            maxLength: 50,
          }}
        />
        <Box className="account-save-btn">
          <Button
            style={{
              backgroundColor: "#6699ff",
              borderRadius: "10px",
              marginBottom: "1vw",
              width: "100px",
              fontSize: "9px",
              color: "white",
            }}
            onClick={handleUpdateName}
          >
            Save
          </Button>
        </Box>
        <Box className="account-emailbox">
          <Typography variant="body2">
            This is the email associated with CommonCents
          </Typography>
        </Box>
        <Typography component="span" className="account-email">
          {auth.currentUser?.email}
        </Typography>
        <Box className="sidebar-leaderboard">
          <Button
            style={{
              backgroundColor: "#0033ff",
              borderRadius: "10px",
              marginTop: "20px",
              width: "180px",
              fontSize: "12px",
              color: "white",
            }}
            onClick={toggleSecondDropdown}
          >
            Change Password
          </Button>
          <Modal open={isSecondDropdownOpen} onClose={toggleSecondDropdown}>
            <Box
              className="change-pwd-modal"
              sx={{
                bgcolor: theme.palette.background.paper,
              }}
            >
              <Typography className="change-pwd-modal-header">
                Enter your current password to continue
              </Typography>
              <Box className="change-pwd-modal-box">
                <TextField
                  variant="outlined"
                  className="change-pwd-modal-txtfield"
                  label="Enter Your Current Password"
                  type={showPassword ? "text" : "password"}
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  variant="outlined"
                  className="change-pwd-modal-txtfield"
                  label="Enter Your New Password"
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  variant="outlined"
                  className="change-pwd-modal-txtfield"
                  label="Confirm Your New Password"
                  type={showPassword ? "text" : "password"}
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Button
                  style={{
                    backgroundColor: "#0033ff",
                    borderRadius: "10px",
                    marginTop: "20px",
                    width: "180px",
                    padding: "10px 0",
                    alignItems: "flex-end",
                    fontSize: "12px",
                    color: "white",
                  }}
                  onClick={handleChangePassword}
                >
                  Continue
                </Button>
              </Box>
            </Box>
          </Modal>
        </Box>
        <Box sx={{ flex: 1 }}>
          <Button
            variant="contained"
            className="sidebar-logout"
            onClick={logOut}
            style={{
              backgroundColor: "#0033ff",
              borderRadius: "10px",
              width: "120px",
              fontSize: "12px",
              color: "white",
            }}
          >
            <LogoutCurve
              size={20}
              color="white"
              style={{ marginRight: "5px" }}
            />
            Log Out
          </Button>
        </Box>
      </Box>
      <Dialog
        open={state.resetConfirmationOpen}
        onClose={toggleResetConfirmation}
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
            onClick={toggleResetConfirmation}
            style={{ color: theme.palette.text.secondary }}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmResetBalance}
            style={{ backgroundColor: "#0033ff", color: "white" }}
            variant="contained"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={isConfirmationDialogOpen}
        onClose={() => setIsConfirmationDialogOpen(false)}
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
            onClick={() => setIsConfirmationDialogOpen(false)}
            style={{ color: theme.palette.text.secondary }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmPasswordChange}
            style={{ backgroundColor: "#0033ff", color: "white" }}
            variant="contained"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
});

export default AccountPage;
