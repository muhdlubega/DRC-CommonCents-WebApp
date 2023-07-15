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
import watermark from "../assets/images/watermark.png";
import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const AccountPage = observer(() => {
  const navigate = useNavigate();
  // const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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
  const theme = useTheme()


  const [state, setState] = useState({
    resetConfirmationOpen: false,
  });

  // const toggleDropdown = () => {
  //   setIsDropdownOpen((prevState) => !prevState);
  // };

  const toggleSecondDropdown = () => {
    setIsSecondDropdownOpen((prevState) => !prevState);
  };

  // var userDisplayName = updatedName;
  // var userEmail = auth.currentUser?.email;

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
    navigate('/');
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
    // toggleDropdown();
    authStore.setAlert({
      open: true,
      message:
        "Display name updated!",
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
        message:
          "Password successfully updated!",
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
  }, [authStore.user])

  return (
    <Box>
      <img className="watermark" src={watermark}></img>
      <Typography variant="h6" sx={{fontFamily: 'Roboto', 
    borderBottom: '1px solid #888', margin: '20px'}}>
        Account Details
      </Typography>
      <Box  className="account-container">
      <Box className="account-profile">
        <Avatar
            className="account-picture"
            src={auth.currentUser?.photoURL || ""}
            alt={userName || ""}
            sx={{ marginRight: "0.4vw", width: '60px', height:'60px' }}
          />
        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            flexDirection: 'column',
            width: "100%",
            fontFamily: "Roboto",
            wordWrap: "break-word",
            margin: '10px',
          }}
        >
          <Typography>{userName}</Typography>
          <Typography component="span"
          style={{
            fontSize: "12px"
          }}
        >
          <EmptyWallet variant="Bold" size={16} style={{ marginRight: "0.5vw" }} />
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
            width: '190px',
            fontSize: '9px', color: 'white'
          }}
        >
          Reset Balance
        </Button>
      </Box>
      {/* <div className="sidebar-leaderboard">
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
      </div> */}
      <TextField
                  variant="outlined"
                  label="Username"
                  type="text"
                  value={updatedName}
              onChange={(event) => setUpdatedName(event.target.value)}
                  fullWidth
                  style={{
                    // width: "30vw",
                    // height: "97px",
                    margin: '30px 0 10px',
                    borderRadius: "20px",
                  }}
                  required
                  id="username"
                  inputProps={{
                    maxLength: 50,
                  }}
                />
                <Box style={{display: 'flex', justifyContent: 'flex-end'}}>
      <Button style={{
            backgroundColor: "#6699ff",
            borderRadius: "10px",
            marginBottom: "1vw",
            width: '100px',
            fontSize: '9px', color: 'white'
          }} onClick={handleUpdateName}>Save</Button>
          </Box>
          <Box style={{marginTop: '30px', display: 'flex', justifyContent: 'flex-start'}}>
            <Typography variant="body2">
              This is the email associated with CommonCents
            </Typography>
          </Box>
      <Typography component="span"
          style={{
            width: "100%",
            fontSize: "12px", fontWeight: 500,
            fontFamily: "Roboto",
            margin: 0,
          }}
        >
          {auth.currentUser?.email}
        </Typography>
      <Box className="sidebar-leaderboard">
        <Button style={{
            backgroundColor: "#0033ff",
            borderRadius: "10px",
            marginTop: "20px",
            width: '180px',
            fontSize: '12px', color: 'white'
          }} onClick={toggleSecondDropdown}>
          Change Password
        </Button>
        <Modal open={isSecondDropdownOpen} onClose={toggleSecondDropdown}>
          <Box  className="change-pwd-modal"
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              alignItems: 'flex-end',
              display: 'flex',
              flexDirection: 'column',
              borderRadius: '10px',
              boxShadow: 24,
              paddingBottom: '20px',
            }}
          >
            {/* <input
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
            /> */}
            <Typography style={{marginBottom: '30px', alignSelf: 'center', backgroundColor: '#0033ff', width: '100%', borderTopRightRadius: '10px', borderTopLeftRadius: '10px',
          padding: '15px 20px', fontWeight: 700, color: 'white'}}>Enter your current password to continue</Typography>
          <Box style={{margin: '0 20px', alignItems: 'flex-end',
              display: 'flex',
              flexDirection: 'column', width: '90%'}}>
            <TextField
        variant="outlined"
        style={{margin: '10px 0'}}
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
        style={{margin: '10px 0'}}
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
        style={{margin: '10px 0'}}
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
            <Button style={{
            backgroundColor: "#0033ff",
            borderRadius: "10px",
            marginTop: "20px",
            width: '180px',
            padding: '10px 0', 
            alignItems: 'flex-end',
            fontSize: '12px', color: 'white'
          }}  onClick={handleChangePassword}>Continue</Button></Box>
          </Box>
        </Modal>
      </Box>
      <Box sx={{ flex: 1 }}>
        {/* <Button
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
        </Button> */}
        <Button
          variant="contained"
          className="sidebar-logout"
          onClick={logOut}
          style={{ backgroundColor: "#0033ff",
          borderRadius: "10px",
          width: '120px',
          fontSize: '12px', color: 'white'}}
        >
          <LogoutCurve size={20} color="white" style={{ marginRight: "5px" }} />
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
            Are you sure you want to reset your balance? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={toggleResetConfirmation} style={{color: theme.palette.text.secondary}}>
            Cancel
          </Button>
          <Button
            onClick={confirmResetBalance}
            style={{backgroundColor: '#0033ff', color: 'white'}}
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
            style={{color: theme.palette.text.secondary}}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmPasswordChange}
            style={{backgroundColor: '#0033ff', color: 'white'}}
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
