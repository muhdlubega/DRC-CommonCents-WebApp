import { useEffect, useState } from "react";
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
        authStore.setAlert({
          open: true,
          type: "error",
          message: "Unable to fetch latest trades. Try again later",
        });
      }
    };

    fetchLatestTrades();
  }, []);

  const toggleDrawer = (open: boolean) => () => {
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

  return (
    <div>
      <Box className="navbar-auth" onClick={toggleDrawer(true)}>
        <Box className="navbar-balance">
          <EmptyWallet size={22} variant="Bold" className="sidebar-wallet" />
          {userBalance.toFixed(2) || balance.toFixed(2)} USD
        </Box>
        <Avatar
          className="sidebar-picture"
          src={userPhotoURL}
          alt={userDisplayName || userEmail}
        />
      </Box>
      <Drawer anchor="right" open={state.right} onClose={toggleDrawer(false)}>
        <div
          style={{
            backgroundColor: theme.palette.background.default,
            color: theme.palette.text.primary,
          }}
          className="sidebar-container"
        >
          <div className="sidebar-profile">
            <Avatar
              className="sidebar-avatar"
              src={authStore.user?.photoURL || ""}
              alt={authStore.user?.displayName || authStore.user?.email || ""}
            />
            <div className="sidebar-user">
              <div className="sidebar-username">
                {authStore.user?.displayName || authStore.user?.email}
              </div>
              <div className="sidebar-usrbalance">
                {userBalance.toFixed(2) || balance.toFixed(2)} USD
                <EmptyWallet
                  size={20}
                  variant="Bold"
                  className="sidebar-wallet"
                />
              </div>
            </div>
          </div>
          <Typography
            className="sidebar-item"
            onClick={() => navigate("/account")}
          >
            My Account
            <ArrowRight2 size={16} className="sidebar-arrow" />
          </Typography>
          <Typography
            className="sidebar-item"
            onClick={() => navigate("/enquiry")}
          >
            Help and Support
            <ArrowRight2 size={16} className="sidebar-arrow" />
          </Typography>
          <Typography className="sidebar-item" onClick={() => navigate("/FAQ")}>
            FAQs
            <ArrowRight2 size={16} className="sidebar-arrow" />
          </Typography>
          <Typography className="sidebar-block-title">Leaderboard</Typography>
          <Box className="leaderboard-tthree">
            <ol className="sidebar-leaderboard-list">
              {topThreeUsers
                .filter((user) => user.netWorth !== 0)
                .map((user, index) => (
                  <li key={index}>
                    <span className="sidebar-leaderboard-item">
                      <span>{user.displayName || user.email} </span>
                      <span style={{ flex: 1 }}></span>
                      <span>{user?.netWorth?.toFixed(2)} USD</span>
                    </span>
                  </li>
                ))}
            </ol>
          </Box>
          <div className="sidebar-seemore">
            <Typography
              onClick={() => navigate("/leaderboard")}
              className="sidebar-seemore-txt"
            >
              See full leaderboard {">"}
            </Typography>
          </div>

          <Typography className="sidebar-block-title">Trade History</Typography>
          {latestTrades.length > 0 ? (
            <Box>
              {latestTrades
                .filter((trade) => trade.status !== undefined)
                .map((trade, index) => (
                  <div key={index}>
                    <Card
                      onClick={() => navigate("/trade-history")}
                      className="sidebar-trades-card"
                      style={{
                        backgroundColor: theme.palette.background.paper,
                      }}
                    >
                      <CardContent style={{ padding: "8px" }}>
                        <span className="sidebar-trades-span">
                          <img
                            src={MarketSymbols[trade.marketType]}
                            alt={trade.marketType}
                            className="sidebar-trades-img"
                          />
                          <Box className="sidebar-trades-box">
                            <Typography
                              variant="body1"
                              component="p"
                              style={{
                                color: trade.status === "Won" ? "green" : "red",
                              }}
                            >
                              {trade.status === "Won"
                                ? `+${trade.additionalAmount}`
                                : `-${trade.askPrice}`}{" "}
                              USD
                            </Typography>
                            <Typography variant="body1" component="p">
                              {MarketName[trade.marketType]}
                            </Typography>
                            <Typography style={{ fontSize: "9px" }}>
                              {formatTimestamp(trade.timestamp)}
                            </Typography>
                          </Box>
                        </span>
                      </CardContent>
                    </Card>
                  </div>
                ))}
            </Box>
          ) : (
            <Card
              onClick={() => navigate("/trade-history")}
              className="sidebar-trades-empty"
              style={{
                backgroundColor: theme.palette.background.default,
                color: theme.palette.text.primary,
              }}
            >
              <CardContent className="sidebar-trades-emptycontent">
                <div className="sidebar-trades-emptybox">
                  <Clock size={50} className="sidebar-trades-clock" />
                  <Typography>
                    No trade history available. Start trading now!
                  </Typography>
                </div>
              </CardContent>
            </Card>
          )}
          <Box className="sidebar-seemore">
            <Typography
              onClick={() => navigate("/trade-history")}
              className="sidebar-seemore-txt"
            >
              See full trade history {">"}
            </Typography>
          </Box>
          <Box sx={{ flex: 1 }}></Box>
          <Box sx={{ flex: 1 }}>
            <Button
              variant="contained"
              onClick={handleResetBalance}
              style={{
                backgroundColor: "#6699ff",
                borderRadius: "10px",
                marginBottom: "20px",
                width: "100%",
                color: "white",
              }}
            >
              Reset Balance
            </Button>

            <Button
              variant="contained"
              onClick={logOut}
              style={{
                backgroundColor: "#0033ff",
                borderRadius: "10px",
                color: "white",
                width: "100%",
              }}
            >
              <LogoutCurve color="white" className="sidebar-logout-icon" />
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
            Resetting your balance will clear all your trade activities and
            history. Are you sure you would like to continue? This action cannot
            be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={toggleResetConfirmation}
            style={{ color: theme.palette.text.secondary }}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmResetBalance}
            style={{ backgroundColor: "#0033ff", color: "white" }}
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
