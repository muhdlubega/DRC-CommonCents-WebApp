import { Avatar, Box } from "@mui/material";
import ParticlesBackground from "../components/ParticlesBackground";
import authStore from "../store/AuthStore";

const LeaderboardPage = () => {
  // Sort the leaderboard in descending order based on user balance
  const sortedLeaderboard = authStore.leaderboard.sort(
    (a, b) => (b.balance as number) - (a.balance as number)
  );

  // Extract the top 3 users from the sorted leaderboard
  const topThreeUsers = sortedLeaderboard.slice(0, 3);

  return (
    <Box className="leaderboard-main">
      <div className="ts-particles">
        <ParticlesBackground />
      </div>
      <Box className="leaderboard-tthree">
        <ol>
          {topThreeUsers.map((user, index) => (
            <li key={index}>
              <Avatar
                className="sidebar-picture"
                src={user?.photoURL || ""}
                alt={user?.displayName || user?.email || ""}
                sx={{ marginRight: "0.4vw" }}
              />{" "}
              {user.displayName || user.email} - {user?.balance?.toFixed(2)} USD
            </li>
          ))}
        </ol>
      </Box>
      <Box className="leaderboard-list">
        <h3>Full Leaderboard</h3>
        <ol>
          {sortedLeaderboard.map((user, index) => (
            <li key={index}>
              {user.displayName || user.email} - {user?.balance?.toFixed(2)} USD
            </li>
          ))}
        </ol>
      </Box>
    </Box>
  );
};

export default LeaderboardPage;
