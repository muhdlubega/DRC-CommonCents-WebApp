import { EmptyWallet, LogoutCurve } from "iconsax-react";
import authStore from "../store/AuthStore";
import {
  Avatar,
  Box,
  Button,
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
import LogoutConfirmationDialog from "../components/authentication/LogoutDialog";
import ResetBalanceConfirmationDialog from "../components/authentication/ResetBalanceDialog";
import PasswordChangeConfirmationDialog from "../components/authentication/PasswordChange";

const AccountPage = observer(() => {
  //account page structure and functions
  const [userName, setUserName] = useState("");
  const [userBalance, setUserBalance] = useState(100000);
  const [isGoogleUser, setIsGoogleUser] = useState(false);
  const [updatedName, setUpdatedName] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isSecondDropdownOpen, setIsSecondDropdownOpen] = useState(false);
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false);
  const [logoutConfirmationOpen, setLogoutConfirmationOpen] = useState(false);
  const [state, setState] = useState({
    right: false,
    resetConfirmationOpen: false,
  });
  const navigate = useNavigate();
  const theme = useTheme();

  const toggleDrawer = (open: boolean) => () => {
    setState({ ...state, right: open });
  };
  const toggleSecondDropdown = () => {
    setIsSecondDropdownOpen((prevState) => !prevState);
  };

  //get username function to retrieve user's display name from firebase
  const getUserName = async () => {
    const querySnapshot = await getDocs(collection(db, "users"));
    querySnapshot.forEach((doc) => {
      const { displayName } = doc.data();
      if (auth.currentUser && auth.currentUser.uid === doc.id) {
        setUserName(displayName);
      }
    });
  };

  //get user balance function to retrieve user's balance from firebase
  const getUserBalance = async () => {
    const querySnapshot = await getDocs(collection(db, "users"));
    querySnapshot.forEach((doc) => {
      const { balance } = doc.data();
      if (auth.currentUser && auth.currentUser.uid === doc.id) {
        setUserBalance(balance);
      }
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

  const handleLogoutConfirmation = (confirmed: boolean) => {
    if (confirmed) {
      signOut(auth);
      navigate("/");
      authStore.setAlert({
        open: true,
        type: "success",
        message: "Logout Successful!",
      });
    }
    setLogoutConfirmationOpen(false);
    toggleDrawer(false);
  };

  //change display name function to handle user's display name with correct length
  const handleUpdateName = () => {
    if (updatedName.length < 3 || updatedName.length > 15) {
      authStore.setAlert({
        open: true,
        message: "Display name should be between 3 to 15 characters",
        type: "error",
      });
      return;
    } else {
    authStore.setAlert({
      open: true,
      message: "Display name updated!",
      type: "success",
    });
    authStore.setUpdateName(updatedName);
  }
  };

  //change password function to handle user's password change
  const handleChangePassword = async () => {
    //error check to ensure passwords match
    if (newPassword !== confirmNewPassword) {
      authStore.setAlert({
        open: true,
        message: "Passwords do not match",
        type: "error",
      });
      return;
    }

    //error check to ensure password is atleast 8 characters long using regexp
    const lengthTest = /^.{8,}$/;
    if (!lengthTest.test(newPassword)) {
      authStore.setAlert({
        open: true,
        message: "Password must be at least 8 characters long",
        type: "error",
      });
      return;
    }

    //error check to ensure password meets criteria using regexp
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

  //confirm password change function which changes password when firebase credentials match
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

  //useEffect automatically updates user display name and balance when user details are updated
  useEffect(() => {
    getUserBalance();
    getUserName();

    //check provider, if google then set state to hide the change password button
    if (auth.currentUser && auth.currentUser.providerData) {
      const googleProvider = auth.currentUser.providerData.find(
        (provider) => provider.providerId === "google.com"
      );
      setIsGoogleUser(!!googleProvider);
    }
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
        {!isGoogleUser && (
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
          </Button>)}
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
            onClick={() => setLogoutConfirmationOpen(true)}
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
      <ResetBalanceConfirmationDialog
        open={state.resetConfirmationOpen}
        onClose={toggleResetConfirmation}
        onConfirm={confirmResetBalance}
      />
      <PasswordChangeConfirmationDialog
        open={isConfirmationDialogOpen}
        onClose={() => setIsConfirmationDialogOpen(false)}
        onConfirm={handleConfirmPasswordChange}
      />
      <LogoutConfirmationDialog
        open={logoutConfirmationOpen}
        onClose={handleLogoutConfirmation}
      />
    </Box>
  );
});

export default AccountPage;
