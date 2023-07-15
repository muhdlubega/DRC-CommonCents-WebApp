import { Avatar, Box, Card, Typography, useTheme } from "@mui/material";
import authStore from "../store/AuthStore";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import award from "../assets/images/leaderboard.png";

const LeaderboardPage = observer(() => {
  const theme = useTheme();
  useEffect(() => {
    authStore.initializeLeaderboard();
  }, []);
  const sortedLeaderboard = authStore.leaderboard
    .slice()
    .sort((a, b) => (b.netWorth as number) - (a.netWorth as number));

  const topThreeUsers = sortedLeaderboard.slice(0, 3);

  return (
    <Box className="leaderboard-main">
      <Box className="backgroundCircleBottomRight"></Box>
      <img className="leaderboard-award" src={award}></img>
      <Typography
        variant="h6"
        sx={{
          fontFamily: "Roboto",
          borderBottom: "1px solid #888",
          margin: "20px",
        }}
      >
        Leaderboard
      </Typography>
      <Box
        className="leaderboard-tthree"
        style={{ padding: "1vw", margin: "1vw" }}
      >
        <ol style={{ listStyleType: "none", paddingInlineStart: "0" }}>
          {topThreeUsers
            .filter((user) => user.netWorth !== 0)
            .map((user, index) => (
              <li
                key={index}
                style={{
                  transform:
                    index === 1
                      ? "translate(-13.9vw, -9.3vw)"
                      : index === 2
                      ? "translate(13.9vw, -23.9vw)"
                      : "0",
                }}
              >
                <Box
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    color: theme.palette.text.primary
                  }}
                >
                  <Typography style={{fontWeight:700}}>{user.displayName || user.email}</Typography>
                  <Typography style={{ marginBottom: "1vw" }}>
                    {user?.netWorth?.toFixed(2)} USD
                  </Typography>
                  <Avatar
                    src={user?.photoURL || ""}
                    alt={user?.displayName || user?.email || ""}
                    sx={{ width: "11vw", height: "11vw" }}
                  />
                </Box>
              </li>
            ))}
        </ol>
      </Box>
      <Box className="leaderboard-list">
        <ol start={4}>
          {sortedLeaderboard
            .filter((user) => user.netWorth !== 0)
            .slice(3)
            .map((user, index) => (
              <li key={index}>
                <Card
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent:'space-between',
                    padding: "10px",
                    margin: "10px",
                  }}
                ><Box style={{
                  display: "flex",
                  flexDirection: 'row',
                  alignItems: "center",
                }}>
                  <Avatar
                    src={user?.photoURL || ""}
                    alt={user?.displayName || user?.email || ""}
                    sx={{ marginRight: "0.4vw", width: "30px", height: "30px" }}
                  />
                  {user.displayName || user.email}
                  </Box>
                  {user?.netWorth?.toFixed(2)} USD
                </Card>
              </li>
            ))}
        </ol>
      </Box>
    </Box>
  );
});

export default LeaderboardPage;
