import React, { useState } from "react";
import Drawer from "@mui/material/Drawer";
import { Avatar, Button } from "@mui/material";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import "../../styles/main.scss";
import authStore from "../../store/AuthStore";
import { observer } from "mobx-react-lite";

const UserSidebar = observer(() => {
  const [state, setState] = useState({
    right: false,
  });

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
    authStore.setResetBalance(100000);
  };

  const userDisplayName = authStore.user?.displayName || "";
  const userEmail = authStore.user?.email || "";
  const userPhotoURL = authStore.user?.photoURL || "";

  // async initializeUser() {
  //   const querySnapshot = await getDocs(collection(db, "users"));
  //   const leaderboardData = [];
  //   querySnapshot.forEach((doc) => {
  //     const { displayName, email, balance } = doc.data();
  //     leaderboardData.push({ displayName, email, balance });
  //     if (auth.currentUser && auth.currentUser.uid === doc.id) {
  //       this.balance = balance || null;
  //     }
  //   });
    
  //     this.leaderboard = leaderboardData.sort((a, b) => b.balance - a.balance);
  // }

  return (
    <div>
      <Avatar
        onClick={toggleDrawer(true)}
        className="sidebar-picture"
        src={userPhotoURL}
        alt={userDisplayName || userEmail}
      />
      <Drawer anchor="right" open={state.right} onClose={toggleDrawer(false)}>
        <div className="sidebar-container">
          <div className="sidebar-profile">
            <Avatar
              className="sidebar-picture"
              src={userPhotoURL}
              alt={userDisplayName || userEmail}
            />
            <span
              style={{
                width: "100%",
                fontSize: 25,
                textAlign: "center",
                fontWeight: "bolder",
                wordWrap: "break-word",
              }}
            >
              {userDisplayName || userEmail}
            </span>
          </div>
          <div className="sidebar-leaderboard">
            <h2>Leaderboard</h2>
            <ol>
              {authStore.leaderboard.map((user, index) => (
                <li key={index}>
                  {user.displayName || user.email} - {user.balance!.toFixed(2)} USD
                </li>
              ))}
            </ol>
          </div>
          <span
            style={{
              width: "100%",
              fontSize: 20,
              textAlign: "center",
              fontWeight: "bolder",
              wordWrap: "break-word",
            }}
          >
            Balance: {authStore.balance?.toFixed(2)} USD
          </span>
          <Button
            variant="contained"
            className="sidebar-reset-balance"
            onClick={handleResetBalance}
            style={{ marginBottom: 20 }}
          >
            Reset Balance
          </Button>

          <Button
            variant="contained"
            className="sidebar-logout"
            onClick={logOut}
          >
            Log Out
          </Button>
        </div>
      </Drawer>
    </div>
  );
});

export default UserSidebar;
