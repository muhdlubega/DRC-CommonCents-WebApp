
import { Box, Typography, useTheme } from '@mui/material';
import image1 from '../../assets/images/16367269_rm373batch4-07.jpg';
import image2 from '../../assets/images/digital-world-map-hologram-blue-background.jpg';
import image3 from '../../assets/images/business-people-casual-meeting.jpg';

const Header = () => {
  const theme = useTheme();
  return (
    <Box className="header-main">
      <Box className="header-card" >
        <Box
          className="header-card-background"
          style={{ backgroundImage: `url(${image1})` }}
        ></Box>
        <Box className="header-card-content right" style={{ alignItems: 'flex-start',borderRadius: '0 30px 30px 0', backgroundColor: theme.palette.background.default, color: theme.palette.text.primary }}>
          <Typography
            sx={{ 
              fontWeight: 'bold', 
              marginBottom: '0',
              fontSize:'35px' 
            }}
            className="header-name"
          >
            LIVE TRADING SIMULATION
          </Typography>
          <Typography sx={{ fontWeight: '400',fontSize:'20px' }} className="header-content">
            Gain real-time trading experience for free!
          </Typography>
        </Box>
      </Box>
      <Box className="header-card" >
        <Box
          className="header-card-background"
          style={{ backgroundImage: `url(${image2})` }}
        ></Box>
        <Box className="header-card-content left" style={{ alignItems: 'flex-start', justifyContent: 'flex-start',borderRadius: '30px 0 0 30px', backgroundColor: theme.palette.background.default, color: theme.palette.text.primary }}>
          <Typography
            sx={{
               fontWeight: 'bold',
              //  marginBottom: '0',
               fontSize:'35px',
              //  marginRight:"42%"
              }}
            className="header-name"
          >
            TRENDING NEWS
          </Typography>
          <Typography sx={{ fontWeight: '400',fontSize:'20px' }} className="header-content">
            Explore the latest discoveries on trending anytime,anywhere
          </Typography>
        </Box>
      </Box>
      <Box className="header-card">
        <Box
          className="header-card-background"
          style={{ backgroundImage: `url(${image3})` }}
        ></Box>
        <Box className="header-card-content right" style={{ alignItems: 'flex-start',borderRadius: '0 30px 30px 0', backgroundColor: theme.palette.background.default, color: theme.palette.text.primary}}>
          <Typography
            sx={{ 
              fontWeight: 'bold', 
              marginBottom: '0',
              fontSize:'35px',
              lineHeight: 1.5,
              // marginLeft:'48%'
            }}
            className="header-name"
          >
            OPEN FORUMS
          </Typography>
          <Typography sx={{ fontWeight: '400',fontSize:'20px',justifyContent:"right" }} className="header-content">
            Connect and trade knowledge with real users globally.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Header;
