import { ArrowRight2, ArrowUp2, EmptyWallet, LogoutCurve } from "iconsax-react";
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
  Modal,
} from "@mui/material";
import {
  signOut,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { auth, db } from "../firebase";
import watermark from "../assets/images/watermark.png";
import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const AccountPage = observer(() => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSecondDropdownOpen, setIsSecondDropdownOpen] = useState(false);
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] =
    useState(false);
  const [updatedName, setUpdatedName] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [userBalance, setUserBalance] = useState(100000);
  const [userName, setUserName] = useState("");

  const [state, setState] = useState({
    resetConfirmationOpen: false,
  });

  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  const toggleSecondDropdown = () => {
    setIsSecondDropdownOpen((prevState) => !prevState);
  };

  // var userDisplayName = updatedName;
  var userEmail = auth.currentUser?.email;

  const getUserBalance = async () => {
    const querySnapshot = await getDocs(collection(db, "users"));
    querySnapshot.forEach((doc) => {
      const { balance } = doc.data();
      if (auth.currentUser && auth.currentUser.uid === doc.id) {
        setUserBalance(balance);
      }
    });
  };


  // var userPhotoURL = auth.currentUser?.photoURL;
  // var balance = 100000;

  // if (auth.currentUser !== null) {
  //   console.log(auth.currentUser.displayName);
  //   console.log(auth.currentUser.email);
  //   userDisplayName = auth.currentUser.displayName || "";
  //   userEmail = auth.currentUser.displayName || auth.currentUser.email || "";
  //   userPhotoURL = auth.currentUser.photoURL || ""; String
  //   balance = Number(authStore.user!.balance?.toFixed(2)) || 100000;
  // }

  // const querySnapshot = await getDocs(collection(db, "users"));
  //     const leaderboardData: User[] = [];
  //     querySnapshot.forEach((doc) => {
  //       const { balance, displayName, email } = doc.data();
  //       leaderboardData.push({ displayName, email, balance });
  //       if (auth.currentUser && auth.currentUser.uid === doc.id) {
  //         this.user!.balance = balance || null;
  //       }
  //     });
  // if (authStore.user !== null) {
  //   console.log(authStore.user.displayName);
  //   userDisplayName = authStore.user?.displayName || "";
  //   userEmail = authStore.user?.displayName || authStore.user?.email || "";
  //   userPhotoURL = authStore.user?.photoURL || "";
  //   balance = Number(authStore.user?.balance?.toFixed(2)) || 100000;
  // }

  const logOut = () => {
    signOut(auth);
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
    toggleDropdown();
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
  }, [authStore.user])

  return (
    <Box className="account-container">
      <img className="watermark" src={watermark}></img>
      <Box className="account-profile">
        <span
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            fontSize: "1.2vw",
            textAlign: "center",
            fontFamily: "Montserrat",
            wordWrap: "break-word",
            margin: 0,
          }}
        >
          <Avatar
            className="account-picture"
            src={auth.currentUser?.photoURL || ""}
            alt={userName || ""}
            sx={{ marginRight: "0.4vw" }}
          />
          {userName}
        </span>
        <span
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            fontSize: "1.2vw",
            textAlign: "center",
            fontFamily: "Montserrat",
            wordWrap: "break-word",
            margin: 0,
          }}
        >
          {userEmail}
        </span>
        <span
          style={{
            width: "100%",
            fontSize: "1vw",
            textAlign: "center",
            fontFamily: "Montserrat",
            wordWrap: "break-word",
            margin: 0,
          }}
        >
          <EmptyWallet size={22} style={{ marginRight: "0.5vw" }} />
          {userBalance.toFixed(2)} USD
        </span>
      </Box>
      <div className="sidebar-leaderboard">
        <h6 onClick={toggleDropdown}>
          Change Username
          {isDropdownOpen ? (
            <ArrowUp2 size={16} style={{ marginLeft: "0.5vw" }} />
          ) : (
            <ArrowRight2 size={16} style={{ marginLeft: "0.5vw" }} />
          )}
        </h6>
        <Modal open={isDropdownOpen} onClose={toggleDropdown}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
            }}
          >
            <input
              type="text"
              value={updatedName}
              onChange={(event) => setUpdatedName(event.target.value)}
            ></input>
            <Button onClick={handleUpdateName}>Submit</Button>
          </Box>
        </Modal>
      </div>
      <div className="sidebar-leaderboard">
        <h6 onClick={toggleSecondDropdown}>
          Change Password
          {isSecondDropdownOpen ? (
            <ArrowUp2 size={16} style={{ marginLeft: "0.5vw" }} />
          ) : (
            <ArrowRight2 size={16} style={{ marginLeft: "0.5vw" }} />
          )}
        </h6>
        <Modal open={isSecondDropdownOpen} onClose={toggleSecondDropdown}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
            }}
          >
            <input
              type="password"
              value={oldPassword}
              onChange={(event) => setOldPassword(event.target.value)}
              placeholder="Old Password"
            />
            <input
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              placeholder="New Password"
            />
            <input
              type="password"
              value={confirmNewPassword}
              onChange={(event) => setConfirmNewPassword(event.target.value)}
              placeholder="Confirm New Password"
            />
            <Button onClick={handleChangePassword}>Change Password</Button>
          </Box>
        </Modal>
      </div>{" "}
      <Box sx={{ flex: 1 }}>
        <Button
          variant="contained"
          className="sidebar-reset-balance"
          onClick={() => navigate("/")}
          style={{
            backgroundColor: "#9F9F9F",
            borderRadius: "0.5vw",
            marginBottom: "1vw",
            width: "100%",
          }}
        >
          Return to Homepage
        </Button>
        <Button
          variant="contained"
          className="sidebar-reset-balance"
          onClick={handleResetBalance}
          style={{
            backgroundColor: "#6699ff",
            borderRadius: "0.5vw",
            marginBottom: "1vw",
            width: "100%",
          }}
        >
          Reset Balance
        </Button>

        <Button
          variant="contained"
          className="sidebar-logout"
          onClick={logOut}
          style={{ backgroundColor: "#0033ff", borderRadius: "0.5vw" }}
        >
          <LogoutCurve color="white" style={{ marginRight: "1vw" }} />
          Log Out
        </Button>
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
            Are you sure you want to reset your balance? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={toggleResetConfirmation} color="primary">
            Cancel
          </Button>
          <Button
            onClick={confirmResetBalance}
            color="primary"
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
            color="primary"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmPasswordChange}
            color="primary"
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
