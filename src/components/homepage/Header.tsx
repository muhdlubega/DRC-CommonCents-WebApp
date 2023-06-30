import { Box, Typography } from '@mui/material';

const Header = () => {

  return (
    <Box className="header-main">
      <Box className="header-title">Why CommonCents?</Box>
      <Box className="header-container">
      <Box className="header-card">
        <Typography sx={{fontWeight: 'bold', marginBottom: '3vw'}} className="header-name">
          Live Trading Simulation
        </Typography>
        <Typography sx={{fontWeight: '400'}} className="header-content">
          Zero real money. Experience real trading.
        </Typography>
      </Box>
      <Box className="header-card">
        <Typography sx={{fontWeight: 'bold', marginBottom: '3vw'}} className="header-name">
          Latest News
        </Typography>
        <Typography className="header-content">
          Discover the latest trading news.
        </Typography>
      </Box>
      <Box className="header-card">
        <Typography sx={{fontWeight: 'bold', marginBottom: '3vw'}} className="header-name">
          Open Forums
        </Typography>
        <Typography className="header-content">
          Connect with real users globally.
        </Typography>
      </Box>
      </Box>
    </Box>
  );
};

export default Header;
