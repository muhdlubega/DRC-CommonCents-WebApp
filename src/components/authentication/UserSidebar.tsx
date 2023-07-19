import { useEffect, useState } from "react";
import Drawer from "@mui/material/Drawer";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { signOut } from "firebase/auth";
import { auth, db } from "../../firebase";
import authStore from "../../store/AuthStore";
import { observer } from "mobx-react-lite";
import { Clock, EmptyWallet } from "iconsax-react";
import { LogoutCurve, ArrowRight2 } from "iconsax-react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { Trade } from "../../pages/TradeHistoryPage";
import { MarketName, MarketSymbols } from "../../arrays/MarketArray";
import LogoutConfirmationDialog from "./LogoutDialog";
import ResetBalanceConfirmationDialog from "./ResetBalanceDialog";

const UserSidebar = () => {
  //user sidebar structure for logged in users
  const [userBalance, setUserBalance] = useState(0);
  const [latestTrades, setLatestTrades] = useState<Trade[]>([]);
  const [logoutConfirmationOpen, setLogoutConfirmationOpen] = useState(false);
  const [state, setState] = useState({
    right: false,
    resetConfirmationOpen: false,
  });
  const navigate = useNavigate();
  const theme = useTheme();

  const toggleDrawer = (open: boolean) => () => {
    setState({ ...state, right: open });
  };

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

  //get user balance function to fetch user's balance from firestore
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

  //leaderboard sorting function to display only the top three users sorted by their net worth in the user sidebar
  const sortedLeaderboard = authStore.leaderboard
    .slice()
    .sort((a, b) => (b.netWorth as number) - (a.netWorth as number));
  const topThreeUsers = sortedLeaderboard.slice(0, 3);

  //fetch latest trades function to display only the latest three trades from user's collection
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
        message:
          "Unable to fetch latest trades. Please refresh or try again later",
      });
    }
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-NZ");
  };

  const handleResetBalance = () => {
    toggleResetConfirmation();
  };

  const confirmResetBalance = () => {
    authStore.setResetBalance(100000);
    toggleResetConfirmation();
  };

  const toggleResetConfirmation = () => {
    setState((prevState) => ({
      ...prevState,
      resetConfirmationOpen: !prevState.resetConfirmationOpen,
    }));
  };

  const handleLogoutConfirmation = (confirmed: boolean) => {
    if (confirmed) {
      signOut(auth);
      authStore.setAlert({
        open: true,
        type: "success",
        message: "Logout Successful!",
      });
    }
    setLogoutConfirmationOpen(false);
    toggleDrawer(false);
  };

  useEffect(() => {
    fetchLatestTrades();
  }, []);

  return (
    <div>
      <Box className="navbar-auth" onClick={toggleDrawer(true)}>
        <Box className="navbar-balance">
          <Box>
            <Typography
              style={{
                display: "flex",
                justifyContent: "flex-end",
                fontSize: "10px",
                color: theme.palette.text.secondary,
              }}
            >
              Demo Funds
            </Typography>
            <EmptyWallet size={22} variant="Bold" className="sidebar-wallet" />
            {userBalance.toFixed(2) || balance.toFixed(2)} USD
          </Box>
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
              <Typography
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  fontSize: "10px",
                  color: theme.palette.text.secondary,
                }}
              >
                Demo Funds
              </Typography>
              <Tooltip placement="left-end" title="Demo Funds" arrow>
                <div className="sidebar-usrbalance">
                  <EmptyWallet
                    size={20}
                    variant="Bold"
                    className="sidebar-wallet"
                  />
                  {userBalance.toFixed(2) || balance.toFixed(2)} USD
                </div>
              </Tooltip>
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
                      <span className="sidebar-leaderboard-person">
                        {user.displayName || user.email}
                      </span>
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
              onClick={() => setLogoutConfirmationOpen(true)}
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
      <ResetBalanceConfirmationDialog
        open={state.resetConfirmationOpen}
        onClose={toggleResetConfirmation}
        onConfirm={confirmResetBalance}
      />
      <LogoutConfirmationDialog
        open={logoutConfirmationOpen}
        onClose={handleLogoutConfirmation}
      />
    </div>
  );
};

export default observer(UserSidebar);
