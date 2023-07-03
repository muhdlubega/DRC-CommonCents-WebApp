import { ArrowRight2, ArrowUp2, EmptyWallet, LogoutCurve } from "iconsax-react"
import authStore from "../store/AuthStore"
import { Avatar, Box, Button } from "@mui/material"
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import watermark from "../assets/images/watermark.png"
import { useState } from "react";

const AccountPage = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };
    const userDisplayName = authStore.user?.displayName || "";
    const userEmail = authStore.user?.email || "";
    const userPhotoURL = authStore.user?.photoURL || "";

    const logOut = () => {
      signOut(auth);
      authStore.setAlert({
        open: true,
        type: "success",
        message: "Logout Successful!",
      });
    };
  
    const handleResetBalance = () => {
      authStore.setResetBalance(100000);
    };
  return (
    <Box className="account-container">
        <img className="watermark" src={watermark}></img>
        <Box className="account-profile">
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
              className="account-picture"
              src={userPhotoURL}
              alt={userDisplayName || userEmail}
              sx={{marginRight: '0.4vw'}}
            />
              {userDisplayName}
            </span>
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
            >{userEmail}</span>
            <span style={{
                width: "100%",
                fontSize: "1vw",
                textAlign: "center",
                fontFamily: 'Montserrat',
                wordWrap: "break-word", margin: 0}}>
          <EmptyWallet size={22} style={{marginRight: '0.5vw'}}/>
          {authStore.balance?.toFixed(2)} USD
        </span>
        </Box>
        <div className="sidebar-leaderboard">
          <h6 onClick={toggleDropdown}>Change Username{isDropdownOpen ? <ArrowUp2 size={16} style={{marginLeft: '0.5vw'}}/> : <ArrowRight2 size={16} style={{marginLeft: '0.5vw'}}/>}</h6>
      {isDropdownOpen && (
        <Box>
        <input></input>
        <Button>Submit</Button>
        </Box>
      )}
      </div>
      <div className="sidebar-leaderboard">
      <h6>Change Password{isDropdownOpen ? <ArrowUp2 size={16} style={{marginLeft: '0.5vw'}}/> : <ArrowRight2 size={16} style={{marginLeft: '0.5vw'}}/>}</h6>
      </div> <Box sx={{flex: 1}}>
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
    </Box>
  )
}

export default AccountPage