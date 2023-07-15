import React, { useEffect, useState } from "react";
import Drawer from "@mui/material/Drawer";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
  useTheme,
} from "@mui/material";
import { signOut } from "firebase/auth";
import { auth, db } from "../../firebase";
import "../../styles/main.scss";
import authStore from "../../store/AuthStore";
import { observer } from "mobx-react-lite";
import { Clock, EmptyWallet } from "iconsax-react";
import { LogoutCurve, ArrowRight2 } from "iconsax-react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { MarketName, MarketSymbols, Trade } from "../../pages/TradeHistoryPage";

const UserSidebar = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [state, setState] = useState({
    right: false,
    resetConfirmationOpen: false,
  });
  const [userBalance, setUserBalance] = useState(0);
  const [latestTrades, setLatestTrades] = useState<Trade[]>([]);

  useEffect(() => {
    const fetchLatestTrades = async () => {
      try {
        const tradesQuery = query(
          collection(db, "users", auth.currentUser!.uid, "tradeHistory"),
          orderBy("timestamp", "desc"),
          limit(4)
        );
        const snapshot = await getDocs(tradesQuery);
        const data = snapshot.docs.map((doc) => doc.data() as Trade);
        setLatestTrades(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchLatestTrades();
  }, []);

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
    });
  };
  getUserBalance();

  // const sortedLeaderboard = authStore.leaderboard.slice().sort(
  //   (a, b) => (b.balance as number) - (a.balance as number)
  // );

  const sortedLeaderboard = authStore.leaderboard
    .slice()
    .sort((a, b) => (b.netWorth as number) - (a.netWorth as number));

  const topThreeUsers = sortedLeaderboard.slice(0, 3);

  var userDisplayName = "";
  var userEmail = "";
  var userPhotoURL = "";
  var balance = 0;

  if (authStore.user !== null) {
    userDisplayName = authStore.user?.displayName || "";
    userEmail = authStore.user?.email || "";
    userPhotoURL = authStore.user?.photoURL || "";
    balance = Number(authStore.user?.balance?.toFixed(2)) || 100000;
  }

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  // console.log("rerender");
  // console.log(authStore.user)

  return (
    <div>
      <Box className="navbar-auth" onClick={toggleDrawer(true)}>
        <Box className="navbar-balance">
          <EmptyWallet
            size={22}
            variant="Bold"
            style={{ marginRight: "5px" }}
          />
          {userBalance.toFixed(2) || balance.toFixed(2)} USD
        </Box>
        <Avatar
          className="sidebar-picture"
          src={userPhotoURL}
          alt={userDisplayName || userEmail}
        />
      </Box>
      <Drawer anchor="right" open={state.right} onClose={toggleDrawer(false)}>
        <div  style={{backgroundColor: theme.palette.background.default, color: theme.palette.text.primary }} className="sidebar-container">
          <div className="sidebar-profile">
            <Avatar
              className="sidebar-picture"
              src={authStore.user?.photoURL || ""}
              alt={authStore.user?.displayName || authStore.user?.email || ""}
              sx={{ margin: "5px 10px 10px 0", height: "60px", width: "60px" }}
            />
<div style={{display: 'flex', flexDirection: 'column', justifyContent: 'flex-start'}}>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
                width: "100%",
                fontSize: "20px",
                textAlign: "center",
                fontFamily: "Roboto",
                wordWrap: "break-word",
                margin: 0,
              }}
            >
              {authStore.user?.displayName || authStore.user?.email}
            </div>
            <div
              style={{
                width: "100%",
                fontSize: "16px",
                textAlign: "center",
                fontFamily: "Roboto",
                wordWrap: "break-word",
                margin: 0,
              }}
            >
              {userBalance.toFixed(2) || balance.toFixed(2)} USD
              <EmptyWallet
                size={20}
                variant="Bold"
                style={{ marginLeft: "5px" }}
              />
            </div>
            </div>
          </div>
          <Typography
            style={{fontWeight: 500}}
            className="sidebar-item"
            onClick={() => navigate("/account")}
          >
            My Account
            <ArrowRight2 size={16} style={{ marginLeft: "0.5vw" }} />
          </Typography>
          <Typography
            style={{fontWeight: 500}}
            className="sidebar-item"
            onClick={() => navigate("/enquiry")}
          >
            Help and Support
            <ArrowRight2 size={16} style={{ marginLeft: "0.5vw" }} />
          </Typography>
          <Typography
            style={{fontWeight: 500}}
            className="sidebar-item"
            onClick={() => navigate("/FAQ")}
          >
            FAQs
            <ArrowRight2 size={16} style={{ marginLeft: "0.5vw" }} />
          </Typography>
          <Typography
            style={{fontWeight: 500, display:'flex', justifyContent: 'center', backgroundColor: '#0033ff', width: '100%', color: 'white', marginBottom: '10px'}}
            className="sidebar-item"
            // onClick={() => navigate("/leaderboard")}
          >
            Leaderboard
          </Typography>
          <Box className="leaderboard-tthree">
            <ol style={{display: 'flex', justifyContent: 'flex-start', flexDirection: 'column', width: '100%', padding: 0, margin: '0 0 0 20px'}}>
              {topThreeUsers
                .filter((user) => user.netWorth !== 0)
                .map((user, index) => (
                  <li key={index}>
                    <span style={{display: 'flex', justifyContent: 'flex-start'}}>
                    <span>{user.displayName || user.email} </span>
                    <span style={{flex: 1}}></span>
                    <span>{user?.netWorth?.toFixed(2)} USD</span>
                    </span>
                  </li>
                ))}
            </ol>
          </Box>
        <div style={{display: 'flex', justifyContent: 'flex-end', color: '#0033ff', margin: '5px'}}>
        <Typography onClick={() => navigate('/leaderboard')} style={{fontSize: '14px', cursor: 'pointer'}}>See full leaderboard {">"}</Typography></div>
          
          <Typography
            style={{fontWeight: 500, display:'flex', justifyContent: 'center', backgroundColor: '#0033ff', width: '100%', color: 'white', 
            padding: '5px 0'}}
            // className="sidebar-item"
            // onClick={() => navigate("/trade-history")}
          >
            Trade History
          </Typography>
          {latestTrades.length > 0 ? (
            <div>
              {/* <Typography variant="h6" sx={{ margin: "1rem 0" }}>
                Latest Trades:
              </Typography> */}
              {latestTrades
                .filter((trade) => trade.status !== undefined)
                .map((trade, index) => (
                  <div key={index}>
                    {/* {trade.marketType}: {trade.status}{" "}
                    {trade.status === "Won"
                       ? trade.additionalAmount
                       : `-${trade.askPrice}`}{" "}
                     USD */}
                  <Card onClick={() => navigate('/trade-history')} style={{cursor: 'pointer', height: '80px', width: '100%', margin: '10px 0', padding: '0 auto', border: '1px solid #000000', borderRadius: '10px', backgroundColor: theme.palette.mode === "dark"  ? '#C6C6C6' : '#FFFFFF'}}>
            <CardContent style={{padding: '8px'}}>
            <span style={{display: 'flex', justifyContent: 'center'}}><img
          src={MarketSymbols[trade.marketType]}
          alt={trade.marketType}
          style={{ width: '50px', height: '50px', margin: '0 10px' }}
        />
        <div style={{margin: '0 10px'}}>
              <Typography variant="body1" sx={{color: trade.status === "Won" ? "green" : "red"}}>{trade.status === "Won" ? `+${trade.additionalAmount}` : `-${trade.askPrice}`} USD</Typography>
              <Typography variant="body1">{MarketName[trade.marketType]}</Typography>
              <Typography style={{fontSize: '10px'}}>{formatTimestamp(trade.timestamp)}</Typography></div>
              </span>
            </CardContent>
          </Card>
                  </div>
                ))}
            </div>
          ): <Card onClick={() => navigate('/trade-history')} style={{cursor: 'pointer', height: '85px', width: '100%', margin: '10px 0', padding: '0 auto', border: '1px solid #000000', borderRadius: '10px', backgroundColor: theme.palette.background.default, color: theme.palette.text.primary}}>
          <CardContent style={{padding: '5px 10px'}}>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <Clock size={50} style={{ margin: "10px", color: 'gray' }} />
            <Typography>No trade history available. Start trading now!</Typography>
            </div>
          </CardContent>
        </Card>}
        <div style={{display: 'flex', justifyContent: 'flex-end', color: '#0033ff', margin: '5px'}}>
        <Typography onClick={() => navigate('/trade-history')} style={{fontSize: '14px', cursor: 'pointer'}}>See full trade history {">"}</Typography></div>
          <Box sx={{ flex: 1 }}></Box>
          <Box sx={{ flex: 1 }}>
            <Button
              variant="contained"
              className="sidebar-reset-balance"
              onClick={handleResetBalance}
              style={{
                backgroundColor: "#6699ff",
                borderRadius: "10px",
                marginBottom: "10px",
                width: "100%", color: 'white'
              }}
            >
              Reset Balance
            </Button>

            <Button
              variant="contained"
              className="sidebar-logout"
              onClick={logOut}
              style={{ backgroundColor: "#0033ff", borderRadius: "10px", color: 'white' }}
            >
              <LogoutCurve color="white" style={{ marginRight: "20px" }} />
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
          <Button onClick={toggleResetConfirmation}  style={{color: theme.palette.text.secondary}}>
            Cancel
          </Button>
          <Button
            onClick={confirmResetBalance}
            style={{backgroundColor:"#0033ff", color: 'white'}}
            variant="contained"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default observer(UserSidebar);
