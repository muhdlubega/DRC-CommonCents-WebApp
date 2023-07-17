import { Box, Button, Grid, Typography, useMediaQuery } from "@mui/material";
import Image1 from "../../assets/images/playstore.svg";
import SocialMedia1 from "../../assets/images/fb.svg";
import SocialMedia2 from "../../assets/images/ig-icon.svg";
import SocialMedia3 from "../../assets/images/twitter.svg";
import { ArrowCircleUp } from "iconsax-react";

const Footer = () => {
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const isSmallScreen = useMediaQuery("(max-width: 767px)");

  return (
    <Box className="footer">
      <Box className="footer-back-top-box">
        <Button
          variant="contained"
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "1px",
            borderRadius: "50%",
            backgroundColor: "grey",
            color: "white",
            transform: "translateY(-100%)",
            zIndex: 2,
          }}
          className="back-top-btn"
          onClick={handleScrollToTop}
        >
          <ArrowCircleUp size={isSmallScreen ? 40 : 60} />
        </Button>
      </Box>
      <Box className="footer-container">
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} sm={6} md={4} lg={3} className="ft-1">
            <a href="/">
              <img
                className="footer-download-btn"
                src={Image1}
                alt="Image Button"
              />
            </a>
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={3} className="ft-2">
            <Box className="footer-gridbox">
              <Typography variant="h6" component="h4">
                Useful Links
              </Typography>
              <ul className="footer-list">
                <li className="nav-item">
                  <a className="nav-link" href="/enquiry">
                    Help and Support
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/FAQ">
                    FAQs
                  </a>
                </li>
              </ul>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={3} className="ft-3">
            <Box className="footer-gridbox">
              <Typography variant="h6" component="h4">
                Contact Us
              </Typography>
              <Typography>
                <i className="fas fa-phone-volume"></i>&nbsp; 0112345678
              </Typography>
              <Typography>
                <i className="fas fa-envelope"></i>&nbsp;
                officialcommoncents@gmail.com
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={3} className="ft-4">
            <Box className="footer-gridbox">
              <Typography variant="h6" component="h4">
                Socials
              </Typography>
              <Box>
                <a href="/">
                  <img
                    src={SocialMedia1}
                    alt="Image Button"
                    className="footer-social1"
                  />
                </a>
                <a href="/">
                  <img
                    src={SocialMedia2}
                    alt="Image Button"
                    className="footer-social2"
                  />
                </a>
                <a href="/">
                  <img
                    src={SocialMedia3}
                    alt="Image Button"
                    className="footer-social3"
                  />
                </a>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Box className="footer-bottom">
        <Typography>&copy; 2023 CommonCents. All rights reserved.</Typography>
      </Box>
    </Box>
  );
};

export default Footer;
