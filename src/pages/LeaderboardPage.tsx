import {
  Avatar,
  Box,
  Card,
  Modal,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import authStore from "../store/AuthStore";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { InfoCircle, MedalStar } from "iconsax-react";
import leaderboard from "../assets/images/leaderboard-icon-removebg-preview.png";
import Confetti from 'react-confetti';

const LeaderboardPage = observer(() => {
  const theme = useTheme();
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  useEffect(() => {
    authStore.initializeLeaderboard();
  }, []);

  const openQuoteModal = () => {
    setIsQuoteModalOpen(true);
  };

  const closeQuoteModal = () => {
    setIsQuoteModalOpen(false);
  };

  const sortedLeaderboard = authStore.leaderboard
    .slice()
    .sort((a, b) => (b.netWorth as number) - (a.netWorth as number));

  const topThreeUsers = sortedLeaderboard.slice(0, 3);

  return (
    <Box className="leaderboard-main">
      <Typography variant="h6" className="leaderboard-info">
        Leaderboard
        <Box className="leaderboard-info-icon" onClick={openQuoteModal}>
          <Tooltip
            title="Learn more"
            placement="right"
            disableFocusListener
            disableTouchListener
            arrow
          >
            <InfoCircle size={40} />
          </Tooltip>
        </Box>
      </Typography>
      {isQuoteModalOpen && (
        <Modal open={isQuoteModalOpen} onClose={closeQuoteModal}>
          <Box
            className="live-data-modal"
            sx={{
              bgcolor: theme.palette.background.paper,
              color: theme.palette.text.secondary,
            }}
          >
            <Typography variant="h6" className="leaderboard-info-title">
              Get On The Leaderboard Now!
            </Typography>
            <img src={leaderboard} alt="leaderboard" />
            <Typography className="leaderboard-info-text">
              Place yourself on the CommonCents leaderboard where we sort users according to
              their net worth.
            </Typography>
            <Typography className="leaderboard-info-text">
              Net worth is determined by the summation of
              profit deducted by loss summarized from the trading simulation
              with the allocated demo funds. 
            </Typography>
            <a href="/trade/1HZ10V">Start your trading simulation
              now!</a>
          </Box>
        </Modal>
      )}
      <Box className="leaderboard-tthree">
        <ol className="leaderboard-tthree-list">
          {topThreeUsers
            .filter((user) => user.netWorth !== 0)
            .map((user, index) => (
              <li
                key={index}
                style={{
                  transform:
                    index === 1
                      ? "translate(-20vw, -80%)"
                      : index === 2
                      ? "translate(20vw, -180%)"
                      : "0",
                }}
              >
                <Box
                  className="leaderboard-tthree-box"
                  style={{
                    color: theme.palette.text.primary,
                  }}
                >
                  <Typography style={{ fontWeight: 700, fontSize: "1.5vw", marginBottom: '-0.1vw' }}>
                    {user.displayName || user.email}
                  </Typography>
                  <Typography style={{ fontSize: "1.2vw", marginBottom: '-1.5vw' }}>
                    {user?.netWorth?.toFixed(2)} USD
                  </Typography>
                  <Box className="leaderboard-tthree-imgbox">
                    <Avatar
                      src={user?.photoURL || ""}
                      alt={user?.displayName || user?.email || ""}
                      className="leaderboard-tthree-picture"
                    />
                    <MedalStar
                      variant="Bold"
                      style={{
                        color:
                          index === 1
                            ? "#C0C0C0"
                            : index === 2
                            ? "#CD7F32"
                            : "#FFD700",
                      }}
                      className="leaderboard-award"
                    />
                  </Box>
                </Box>
              </li>
            ))}
        </ol>
      </Box>
      <Box className="leaderboard-list bottom">
        <ol start={4}>
          {sortedLeaderboard
            .filter((user) => user.netWorth !== 0)
            .slice(3)
            .map((user, index) => (
              <li key={index}>
                <Card className="leaderboard-list-card">
                  <Box className="leaderboard-list-box">
                    <Avatar
                      src={user?.photoURL || ""}
                      alt={user?.displayName || user?.email || ""}
                      className="leaderboard-list-picture"
                    />
                    {user.displayName || user.email}
                  </Box>
                  {user?.netWorth?.toFixed(2)} USD
                </Card>
              </li>
            ))}
        </ol>
      </Box>
      <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
      />
    </Box>
  );
});

export default LeaderboardPage;
