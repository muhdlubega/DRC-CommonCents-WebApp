import React from "react";
import { Box, Button, Grid, Typography } from "@mui/material";
import "../../styles/main.scss";
import Image1 from "../../assets/images/google-ps.png";
import SocialMedia1 from "../../assets/images/facebook.png";
import SocialMedia2 from "../../assets/images/ig.png";
import SocialMedia3 from "../../assets/images/twitter.png";
import { ArrowCircleUp } from "iconsax-react";

const Footer: React.FC = () => {
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Box className="footer">
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          margin: "0 auto",
        }}
      >
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
          onClick={handleScrollToTop}
        >
          <ArrowCircleUp size={60} />
        </Button>
      </Box>
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
          </Grid>
          <Grid item md={6} lg={3} className="ft-3">
            <Typography variant="h6" component="h4">
              Contact Us
            </Typography>
            <Typography>
              <i className="fas fa-phone-volume"></i>&nbsp; 0112345678
            </Typography>
            <Typography>
              <i className="fas fa-envelope"></i>&nbsp; commoncents@gmail.com
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
                    width: "53px",
                    marginLeft: -5,
                    marginRight: 3,
                    height: "53px",
                    marginTop: "16px",
                  }}
                />
              </a>
              <a href="/">
              <img
                  src={SocialMedia2}
                  alt="Image Button"
                  style={{
                    width: "38px",
                    height: "38px",
                    marginTop: "11px",
                  }}
                />
              </a>
              <a href="/">
              <img
                  src={SocialMedia3}
                  alt="Image Button"
                  style={{
                    width: "38px",
                    marginRight: 3,
                    height: "38px",
                    marginTop: "11px",
                  }}
                />
              </a>
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
