import { Card, Grid, Typography, useTheme } from "@mui/material";
import { Box } from "@mui/system";
import { motion, useAnimation } from "framer-motion";
import member1 from "../assets/images/team1.svg";
import member2 from "../assets/images/cassie.svg";
import member3 from "../assets/images/team3.svg";
import member4 from "../assets/images/team4.svg";
import feature1 from '../assets/images/feature1.svg';
import feature2 from '../assets/images/feature2.svg';
import feature3 from '../assets/images/feature3.svg';
import feature1b from '../assets/images/feature1b.svg';
import feature2b from '../assets/images/feature2b.svg';
import feature3b from '../assets/images/feature3b.svg';
import commoncents from "../assets/images/commoncents.svg";
import commoncents2 from "../assets/images/white-blue-logo.svg";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AboutPage = () => {
  //page containing info on the webpage, features, and the team
  const theme = useTheme();
  const navigate = useNavigate();
  const animationControls = useAnimation();

  useEffect(() => {
    animationControls.start({ y: 0, opacity: 1, transition: { duration: 2 } });
  }, [animationControls]);

  return (
    <Box className="section-aboutus">
      <Box className="background-container">
      <Box className="why-choose-us">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={animationControls} className="aboutus-header">
            <Box className="aboutus-txtbox">
          <Typography variant="h6" style={{ marginTop: '40px', color: theme.palette.text.primary}}>Why choose us?</Typography>
          <p style={{marginTop: "50px", color: theme.palette.text.secondary}}>CommonCents serves as a platform for aspiring traders. We offer live trading simulation using a demo account for options trading on synthetic markets with no real money involved. </p>
          <p style={{color: theme.palette.text.secondary}}>Our main goal is to provide a central hub for beginners to learn basic trading concepts anytime, anywhere. </p>
          </Box>
          <Box className="aboutus-logo">
            <Box className="commoncents-logobox">
        <img src={theme.palette.mode === "dark" ? commoncents2 : commoncents} className="commoncents-logo"></img>
        </Box>
      </Box>
        </motion.div>
      </Box>
      <Box className="feature-about-us">
        <Box className="aboutus-feature-imgbox">
        <img src={theme.palette.mode === "dark" ? feature1b : feature1} className="aboutus-feature-img" onClick={() => navigate("/trade/1HZ10V")}></img>
        <img src={theme.palette.mode === "dark" ? feature2b :feature2} className="aboutus-feature-img" onClick={() => navigate("/news")}></img>
        <img src={theme.palette.mode === "dark" ? feature3b :feature3} className="aboutus-feature-img"  onClick={() => navigate("/forum")}></img>
        </Box>
      </Box>
      <Box className="about-us" sx={{
        backgroundImage:"linear-gradient(to bottom, #0000 20%, #000000 100%)"
      }}>
  <Typography variant="h4" style={{ color: theme.palette.text.primary, margin: "50px 0" }}>Meet our Team</Typography>
  <Grid container spacing={2}>
    <Grid item xs={12} sm={6} md={3}>
      <Card style={{ borderRadius: '25px', margin: '30px' }}>
        <img src={member1} alt="Bega" style={{ width: "100%", height: "30vw", overflow: "hidden", objectFit: "cover" }} />
        <Box className="container">
          <Typography variant="h2">Muhammad Lubega</Typography>
          <Typography className="title">Front-End Developer</Typography>
          <Typography className="about-us-teamtxt">if(brain!==empty){"{keepCoding();}"}else{"{drinkCoffee();}"}</Typography>
        </Box>
      </Card>
    </Grid>
    <Grid item xs={12} sm={6} md={3}>
      <Card style={{ borderRadius: '25px', margin: '30px' }}>
        <img src={member2} alt="CassJ" style={{ width: "100%", height: "30vw", overflow: "hidden", objectFit: "cover" }} />
        <Box className="container">
          <Typography variant="h2">Cassandra Jacklya</Typography>
          <Typography className="title">Product Designer</Typography>
          <Typography className="about-us-teamtxt">Design is how it works, not just what it looks like like</Typography>
        </Box>
      </Card>
    </Grid>
    <Grid item xs={12} sm={6} md={3}>
      <Card style={{ borderRadius: '25px', margin: '30px' }}>
        <img src={member3} alt="Vino" style={{ width: "100%", height: "30vw", overflow: "hidden", objectFit: "cover" }} />
        <Box className="container">
          <Typography variant="h2">Vinothinni Kannan</Typography>
          <Typography className="title">Quality Assurance</Typography>
          <Typography className="about-us-teamtxt">Testing is a sport like hunting, it's bughunting.</Typography>
        </Box>
      </Card>
    </Grid>
    <Grid item xs={12} sm={6} md={3}>
      <Card style={{ borderRadius: '25px', margin: '30px' }}>
        <img src={member4} style={{ width: "100%", height: "30vw", overflow: "hidden", objectFit: "cover"}} alt="Bentley" />
        <Box className="container">
          <Typography variant="h2">Bentley Teh</Typography>
          <Typography className="title">Mobile Developer</Typography>
          <Typography className="about-us-teamtxt">If your plans don't include mobile, it is not finished.</Typography>
        </Box>
      </Card>
    </Grid>
  </Grid>
</Box>
      </Box>
    </Box>
  );
};

export default AboutPage;
