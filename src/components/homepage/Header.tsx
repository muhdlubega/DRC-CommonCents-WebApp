import { Box, Typography, useTheme } from "@mui/material";
import image1 from "../../assets/images/live-trading-homepage.svg";
import image2 from "../../assets/images/breaking-news-about.svg";
import image3 from "../../assets/images/forum-homepage.svg";

const Header = () => {
  const theme = useTheme();
  return (
    <Box className="header-main">
      <Box className="header-card">
        <Box
          className="header-card-background"
          style={{ backgroundImage: `url(${image1})` }}
        ></Box>
        <Box
          className="header-card-content right"
          style={{
            backgroundColor: theme.palette.background.default,
            color: theme.palette.text.primary,
          }}
        >
          <Typography className="header-name">
            LIVE TRADING SIMULATION
          </Typography>
          <Typography className="header-content">
            Gain real-time trading experience for free!
          </Typography>
        </Box>
      </Box>
      <Box className="header-card">
        <Box
          className="header-card-background"
          style={{ backgroundImage: `url(${image2})` }}
        ></Box>
        <Box
          className="header-card-content left"
          style={{
            backgroundColor: theme.palette.background.default,
            color: theme.palette.text.primary,
          }}
        >
          <Typography className="header-name">TRENDING NEWS</Typography>
          <Typography className="header-content">
            Explore the latest discoveries on trending anytime,anywhere
          </Typography>
        </Box>
      </Box>
      <Box className="header-card">
        <Box
          className="header-card-background"
          style={{ backgroundImage: `url(${image3})` }}
        ></Box>
        <Box
          className="header-card-content right"
          style={{
            backgroundColor: theme.palette.background.default,
            color: theme.palette.text.primary,
          }}
        >
          <Typography className="header-name">OPEN FORUMS</Typography>
          <Typography className="header-content">
            Connect and trade knowledge with real users globally.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Header;
