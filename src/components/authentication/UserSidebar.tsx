import React, { useState } from "react";
import Drawer from "@mui/material/Drawer";
import { Avatar, Button } from "@mui/material";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import '../../styles/main.scss';
import authStore from "../../store/AuthStore";
import { observer } from "mobx-react";


function UserSidebar() {
  const [state, setState] = useState({
    right: false,
  });

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
    authStore.setAlert({
      open: true,
      type: "success",
      message: "Logout Successful!",
    });

    toggleDrawer(false);
  };

  const userDisplayName = authStore.user?.displayName || "";
  const userEmail = authStore.user?.email || "";
  const userPhotoURL = authStore.user?.photoURL || "";

  return (
    <div>
          <Avatar
            onClick={toggleDrawer(true)}
            style={{
              height: 38,
              width: 38,
              margin: 10,
              cursor: "pointer",
              backgroundColor: "#0033ff",
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
    fontSize: 20,
    textAlign: "center",
    fontWeight: "bolder",
    wordWrap: "break-word",
  }}
>
  Balance: {authStore.balance} USD
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

export default observer(UserSidebar);