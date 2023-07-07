import React, { useState } from "react";
import Drawer from "@mui/material/Drawer";
import { Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { signOut } from "firebase/auth";
import { auth, db } from "../../firebase";
import "../../styles/main.scss";
import authStore from "../../store/AuthStore";
import { observer } from "mobx-react-lite";
import { EmptyWallet } from "iconsax-react";
import { LogoutCurve, ArrowRight2 } from "iconsax-react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";

const UserSidebar = () => {
  const navigate = useNavigate();
  const [state, setState] = useState({
    right: false,
    resetConfirmationOpen: false,
  });
  const [userBalance, setUserBalance] = useState(null);

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setState({ ...state, right: open });
    };

  const toggleResetConfirmation = () => {
    setState((prevState) => ({
      ...prevState,
      resetConfirmationOpen: !prevState.resetConfirmationOpen,
    }));
  };

  const logOut = () => {
    signOut(auth);
    authStore.setAlert({
      open: true,
      type: "success",
      message: "Logout Successful!",
    });

    toggleDrawer(false);
  };

  const handleResetBalance = () => {
    toggleResetConfirmation();
  };

  const confirmResetBalance = () => {
    authStore.setResetBalance(100000);
    toggleResetConfirmation();
  };

  const getUserBalance = async () => {
    const querySnapshot = await getDocs(collection(db, "users"));
      querySnapshot.forEach((doc) => {
        const { balance } = doc.data();
        if (auth.currentUser && auth.currentUser.uid === doc.id) {
          setUserBalance(balance);
        }
      }
    );
  }

  getUserBalance();

  const sortedLeaderboard = authStore.leaderboard.slice().sort(
    (a, b) => (b.balance as number) - (a.balance as number)
  );

  // Extract the top 3 users from the sorted leaderboard
  const topThreeUsers = sortedLeaderboard.slice(0, 3);

  var userDisplayName = "";
  var userEmail = "";
  var userPhotoURL = "";
  // var balance = 100000;

  if (authStore.user !== null) {
  userDisplayName = authStore.user?.displayName || "";
  userEmail = authStore.user?.email || "";
  userPhotoURL = authStore.user?.photoURL || "";
  // balance = Number(authStore.user?.balance?.toFixed(2)) || 100000;
  }

  // console.log("rerender");
  // console.log(authStore.user)

  return (
    <div>
      <Box className="navbar-auth" onClick={toggleDrawer(true)}>
        <Box className="navbar-balance">
          <EmptyWallet color="#3366ff" variant="Bulk" size={26} style={{marginRight: '0.5vw'}}/>
          {userBalance} USD
        </Box>
        <Avatar
          className="sidebar-picture"
          src={userPhotoURL}
          alt={userDisplayName || userEmail}
        />
      </Box>
      <Drawer anchor="right" open={state.right} onClose={toggleDrawer(false)}>
        <div className="sidebar-container">
          <div className="sidebar-profile">
          <Avatar
                className="sidebar-picture"
                src={authStore.user?.photoURL || ""}
                alt={authStore.user?.displayName || authStore.user?.email || ""}
                sx={{marginRight: '0.4vw', height: '8vw', width: '8vw'}}
              />
            <span
              style={{
                display: 'flex',
                justifyContent: 'center', alignItems: 'center',
                width: "100%",
                fontSize: "1.2vw",
                textAlign: "center",
                fontFamily: 'Montserrat',
                wordWrap: "break-word", margin: 0
              }}
            >
              
              {authStore.user?.displayName || authStore.user?.email}
            </span>
            <span style={{
                width: "100%",
                fontSize: "1vw",
                textAlign: "center",
                fontFamily: 'Montserrat',
                wordWrap: "break-word", margin: 0}}>
              <EmptyWallet size={22} style={{marginRight: '0.5vw'}}/>
              {userBalance} USD
            </span>
          </div>
          <h6 className="sidebar-item" onClick={() => navigate("/account")}>My Account<ArrowRight2 size={16} style={{marginLeft: '0.5vw'}}/></h6>
          <h6 className="sidebar-item" onClick={() => navigate("/leaderboard")}>Leaderboard<ArrowRight2 size={16} style={{marginLeft: '0.5vw'}}/></h6>
          <Box className="leaderboard-tthree">
        <ol>
          {topThreeUsers.map((user, index) => (
            <li key={index}>
              {user.displayName || user.email} - {user?.balance?.toFixed(2)} USD
            </li>
          ))}
        </ol>
      </Box>
          <h6 className="sidebar-item" onClick={() => navigate("/trade-history")}>Trade History<ArrowRight2 size={16} style={{marginLeft: '0.5vw'}}/></h6>
          <h6 className="sidebar-item">Help and Support<ArrowRight2 size={16} style={{marginLeft: '0.5vw'}}/></h6>
          <h6 className="sidebar-item">FAQs<ArrowRight2 size={16} style={{marginLeft: '0.5vw'}}/></h6>
          <Box sx={{flex: 1}}>
            <Button
              variant="contained"
              className="sidebar-reset-balance"
              onClick={handleResetBalance}
              style={{backgroundColor:"#6699ff", borderRadius: '0.5vw', marginBottom: '1vw', width: '100%'}}
            >
              Reset Balance
            </Button>

            <Button
              variant="contained"
              className="sidebar-logout"
              onClick={logOut}
              style={{backgroundColor:"#0033ff", borderRadius: '0.5vw'}}
            >
              <LogoutCurve color="white" style={{marginRight: '1vw'}}/>
              Log Out
            </Button>
          </Box>
        </div>
      </Drawer>

      <Dialog
        open={state.resetConfirmationOpen}
        onClose={toggleResetConfirmation}
        aria-labelledby="reset-confirmation-dialog-title"
        aria-describedby="reset-confirmation-dialog-description"
      >
        <DialogTitle id="reset-confirmation-dialog-title">Reset Balance Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText id="reset-confirmation-dialog-description">
            Are you sure you want to reset your balance? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={toggleResetConfirmation} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmResetBalance} color="primary" variant="contained">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default observer(UserSidebar);
