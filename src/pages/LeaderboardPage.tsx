import { Avatar, Box } from "@mui/material";
// import ParticlesBackground from "../components/ParticlesBackground";
import authStore from "../store/AuthStore";
import watermark from "../assets/images/watermark.png"
import { observer } from "mobx-react-lite";

const LeaderboardPage = observer(() => {
  // Sort the leaderboard in descending order based on user balance
  const sortedLeaderboard = authStore.leaderboard.slice().sort(
    (a, b) => (b.netWorth as number) - (a.netWorth as number)
  );

  // Extract the top 3 users from the sorted leaderboard
  const topThreeUsers = sortedLeaderboard.slice(0, 3);

  return (
    <Box className="leaderboard-main">
    <img className="watermark" src={watermark}></img>
      <Box className="leaderboard-tthree">
        <ol>
          {topThreeUsers.filter((user) => user.netWorth !== 0).map((user, index) => (
            <li key={index}>
              <Avatar
                className="sidebar-picture"
                src={user?.photoURL || ""}
                alt={user?.displayName || user?.email || ""}
                sx={{ marginRight: "0.4vw" }}
              />{" "}
              {user.displayName || user.email} - {user?.netWorth?.toFixed(2)} USD
            </li>
          ))}
        </ol>
      </Box>
      <Box className="leaderboard-list">
        <h3>Full Leaderboard</h3>
        <ol>
          {sortedLeaderboard.filter((user) => user.netWorth !== 0).map((user, index) => (
            <li key={index}>
              {user.displayName || user.email} - {user?.netWorth?.toFixed(2)} USD
            </li>
          ))}
        </ol>
      </Box>
    </Box>
  );
});

export default LeaderboardPage;
