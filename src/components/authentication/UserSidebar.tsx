import React, { useState } from "react";
// import { makeStyles } from "@mui/material";
import Drawer from "@mui/material/Drawer";
import { Avatar, Button } from "@mui/material";
import { useGlobalState } from "../../Context";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import '../../styles/main.scss';

// const useStyles = makeStyles({
//   container: {
//     width: 350,
//     padding: 25,
//     height: "100%",
//     display: "flex",
//     flexDirection: "column",
//     fontFamily: "monospace",
//   },
//   profile: {
//     flex: 1,
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     gap: "20px",
//     height: "92%",
//   },
//   logout: {
//     height: "8%",
//     width: "100%",
//     backgroundColor: "#EEBC1D",
//     marginTop: 20,
//   },
//   picture: {
//     width: 200,
//     height: 200,
//     cursor: "pointer",
//     backgroundColor: "#EEBC1D",
//     objectFit: "contain",
//   },
//   watchlist: {
//     flex: 1,
//     width: "100%",
//     backgroundColor: "grey",
//     borderRadius: 10,
//     padding: 15,
//     paddingTop: 10,
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     gap: 12,
//     overflowY: "scroll",
//   },
//   coin: {
//     padding: 10,
//     borderRadius: 5,
//     color: "black",
//     width: "100%",
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     backgroundColor: "#EEBC1D",
//     boxShadow: "0 0 3px black",
//   },
// });

export default function UserSidebar() {
//   const classes = useStyles();
  const [state, setState] = useState({
    right: false,
  });
  const { user, balance, setAlert } = useGlobalState();

  const toggleDrawer = (open: boolean) => (
    event: React.KeyboardEvent | React.MouseEvent
  ) => {
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
    setAlert({
      open: true,
      type: "success",
      message: "Logout Successful!",
    });

    toggleDrawer(false);
  };

  console.log(user);

  const userDisplayName = user?.displayName || "";
  const userEmail = user?.email || "";
  const userPhotoURL = user?.photoURL || "";

  return (
    <div>
          <Avatar
            onClick={toggleDrawer(true)}
            style={{
              height: 38,
              width: 38,
              marginLeft: 15,
              cursor: "pointer",
              backgroundColor: "#EEBC1D",
            }}
            src={userPhotoURL}
            alt={userDisplayName || userEmail}
          />
          <Drawer
            anchor="right"
            open={state.right}
            onClose={toggleDrawer(false)}
          >
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
              <span
  style={{
    width: "100%",
    fontSize: 25,
    textAlign: "center",
    fontWeight: "bolder",
    wordWrap: "break-word",
  }}
>
  Balance: {balance} USD
</span>

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
}
