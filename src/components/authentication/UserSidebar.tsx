import React, { useState } from "react";
import Drawer from "@mui/material/Drawer";
import { Avatar, Box, Button } from "@mui/material";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import "../../styles/main.scss";
import authStore from "../../store/AuthStore";
import { observer } from "mobx-react-lite";
import { EmptyWallet } from "iconsax-react";
import { LogoutCurve, ArrowRight2 } from "iconsax-react";
import { useNavigate } from "react-router-dom";

const UserSidebar = observer(() => {
  const navigate = useNavigate();
  const [state, setState] = useState({
    right: false,
  });
  // const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // const toggleDropdown = () => {
  //   setIsDropdownOpen((prevState) => !prevState);
  // };

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
//   const userRank = authStore.leaderboard
//   .map((user, index) => {
//     // if (user.displayName === userDisplayName) {
//     return (
//       <li key={index}>{`(No. ${index + 1}) in the Leaderboard`}</li>
//     );
//   // }
//   // return null
// });

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
      <Box className="navbar-auth" onClick={toggleDrawer(true)}>
        <Box className="navbar-balance">
          <EmptyWallet color="#3366ff" variant="Bulk" size={26} style={{marginRight: '0.5vw'}}/>
          {authStore.balance?.toFixed(2)} USD
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
            <Avatar
              className="sidebar-picture"
              src={userPhotoURL}
              alt={userDisplayName || userEmail}
              sx={{marginRight: '0.4vw'}}
            />
              {userDisplayName || userEmail}
            </span>
            <span style={{
                width: "100%",
                fontSize: "1vw",
                textAlign: "center",
                fontFamily: 'Montserrat',
                wordWrap: "break-word", margin: 0}}>
          <EmptyWallet size={22} style={{marginRight: '0.5vw'}}/>
          {authStore.balance?.toFixed(2)} USD
        </span>
        {/* <span>
  <ol>
    {userRank}
  </ol>
</span> */}
          </div>
          <h6 className="sidebar-item" onClick={() => navigate("/account")}>My Account<ArrowRight2 size={16} style={{marginLeft: '0.5vw'}}/></h6>
          <h6 className="sidebar-item" onClick={() => navigate("/leaderboard")}>Leaderboard<ArrowRight2 size={16} style={{marginLeft: '0.5vw'}}/></h6>
          {/* <div className="sidebar-leaderboard">
          <h6 onClick={toggleDropdown}>Leaderboard{<ArrowRight2 size={16} style={{marginLeft: '0.5vw'}}/>}</h6>
      {isDropdownOpen && (
        <ol>
        {authStore.leaderboard.map((user, index) => (
          <li key={index}>
            {user.displayName || user.email} - {user.balance!.toFixed(2)} USD
            {user.displayName === userDisplayName && ` (Position: ${index + 1})`}
          </li>
        ))}
      </ol>
      )}
      </div> */}
          <h6 className="sidebar-item">Trade History<ArrowRight2 size={16} style={{marginLeft: '0.5vw'}}/></h6>
          <h6 className="sidebar-item">Help and Support<ArrowRight2 size={16} style={{marginLeft: '0.5vw'}}/></h6>
          <h6 className="sidebar-item">FAQs<ArrowRight2 size={16} style={{marginLeft: '0.5vw'}}/></h6>
          {/* <span
            style={{
              width: "100%",
              fontSize: 20,
              textAlign: "center",
              fontWeight: "bolder",
              wordWrap: "break-word",
            }}
          >
            Balance: {authStore.balance?.toFixed(2)} USD
          </span> */}
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
    </div>
  );
});

export default UserSidebar;
