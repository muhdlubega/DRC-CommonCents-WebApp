import React from 'react';
import { Box, Button, Grid, Typography } from '@mui/material';
import '../../styles/main.scss';
import Image1 from '../../assets/images/google-ps.png';
import SocialMedia1 from '../../assets/images/facebook.png';
import SocialMedia2 from '../../assets/images/ig.png';
import SocialMedia3 from '../../assets/images/twitter.png';

const Footer: React.FC = () => {
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Box className="footer">
      {/* <div className="scroll-to-top" onClick={handleScrollToTop}>
        <i className="fas fa-chevron-up"></i>
      </div> */}
      <Box className="footer-container">
        <Grid container spacing={2}>
          <Grid item md={6} lg={3} className="ft-1">
            <a href="/">
              <img src={Image1} alt="Image Button" />
            </a>
          </Grid>

          <Grid item md={6} lg={3} className="ft-2">
            <Typography variant="h6" component="h4">
              Useful Links
            </Typography>
            <ul>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Help and Support
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Team
                </a>
              </li>
            </ul>
          </Grid>
          <Grid item md={6} lg={3} className="ft-3">
            <Typography variant="h6" component="h4">
              Contact Us
            </Typography>
            <Typography>
              <i className="fas fa-phone-volume"></i>&nbsp; 0112345678
            </Typography>
            <Typography>
              <i className="fas fa-envelope"></i>&nbsp;
              commoncents@gmail.com
            </Typography>
          </Grid>
          <Grid item md={6} lg={3} className="ft-4">
            <Typography variant="h6" component="h4">
              Socials
            </Typography>
            <Box>
              <a href="/">
                <img
                  src={SocialMedia1}
                  alt="Image Button"
                  style={{
                    width: '70px',
                    marginLeft: -5,
                    marginRight: 3,
                    height: '72px',
                    marginTop: '11px',
                  }}
                />
              </a>
              <a href="/">
                <img src={SocialMedia2} alt="Image Button" />
              </a>
              <a href="/">
                <img src={SocialMedia3} alt="Image Button" />
              </a>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              sx={{
                padding: 1,
                borderRadius: 100,
                backgroundColor: 'blue',
                color: 'white',
                fontWeight: 'bold',
              }}
              onClick={handleScrollToTop}
            >
              Back to Top
            </Button>
          </Grid>
        </Grid>
      </Box>
      <Box className="footer-bottom">
        <Typography>
          &copy; 2023 CommonCents. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default Footer;
