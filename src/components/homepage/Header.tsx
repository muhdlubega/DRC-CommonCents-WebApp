
import { Box, Typography } from '@mui/material';
import image1 from '../../assets/images/16367269_rm373batch4-07.jpg';
import image2 from '../../assets/images/digital-world-map-hologram-blue-background.jpg';
import image3 from '../../assets/images/business-people-casual-meeting.jpg';

const Header = () => {
  return (
    <Box className="header-main">
      <Box className="header-card" >
        <div
          className="header-card-background"
          style={{ backgroundImage: `url(${image1})` }}
        ></div>
        <div className="header-card-content" style={{ alignItems: 'flex-start',marginRight:'65%',borderRadius: '0 30px 30px 0' }}>
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
        </div>
      </Box>
      <Box className="header-card" >
        <div
          className="header-card-background"
          style={{ backgroundImage: `url(${image2})` }}
        ></div>
        <div className="header-card-content" style={{ alignItems: 'flex-end',marginLeft:'65%',borderRadius: '30px 0 0 30px' }}>
          <Typography
            sx={{
               fontWeight: 'bold',
               marginBottom: '0',
               fontSize:'35px',
               marginRight:"42%"
              }}
            className="header-name"
          >
            TRENDING NEWS
          </Typography>
          <Typography sx={{ fontWeight: '400',fontSize:'20px' }} className="header-content">
            Explore the latest discoveries on trending anytime,anywhere
          </Typography>
        </div>
      </Box>
      <Box className="header-card">
        <div
          className="header-card-background"
          style={{ backgroundImage: `url(${image3})` }}
        ></div>
        <div className="header-card-content" style={{ alignItems: 'flex-start',marginRight:'65%',borderRadius: '0 30px 30px 0'}}>
          <Typography
            sx={{ 
              fontWeight: 'bold', 
              marginBottom: '0',
              fontSize:'35px',
              lineHeight: 1.5,
              marginLeft:'48%'
            }}
            className="header-name"
          >
            OPEN FORUMS
          </Typography>
          <Typography sx={{ fontWeight: '400',fontSize:'20px',marginLeft:"32%",justifyContent:"right" }} className="header-content">
            Connect and trade knowledge with real users globally.
          </Typography>
        </div>
      </Box>
    </Box>
  );
};

export default Header;
