import { Card, Typography } from "@mui/material";
import { Box } from "@mui/system";
import member1 from "../assets/images/bega.jpeg";
import member2 from "../assets/images/cass.jpeg";
import member3 from "../assets/images/vino2.jpeg";
import member4 from "../assets/images/bentley.jpeg";
import watermark from "../assets/images/watermark.png"
import simulation from "../assets/images/live-trading-onboarding.jpg";
import news from "../assets/images/breaking-news-onboarding.jpg";
import forum from "../assets/images/forums-onboarding.jpeg";
import tradingLaptop from "../assets/images/trading-laptop.svg";
import logo from "../assets/images/commoncents.svg";
import newsLaptop from "../assets/images/news-laptop.svg";
import forumLaptop from "../assets/images/forum-laptop.svg";
import gps from "../assets/images/gps-removebg-preview 1.svg";
import contact from "../assets/images/contact.svg";

const AboutPage = () => {
  return (
    <Box className="section-aboutus">
      <Box className="background-container">
      {/* <img className="watermark" src={watermark} style={{maxHeight: "800px", maxWidth: "800px"}}></img> */}
      <Box className="why-choose-us">
        <img src={logo} className="commoncents-logo"></img>
        <Box>
          <Typography variant="h6" style={{marginLeft: "150px"}}>Why choose us?</Typography>
          <p style={{marginTop: "50px", marginLeft: "150px"}}>CommonCents serves as a platform for aspiring traders. We offer live trading simulation on synthetic markets with no real money involved. </p>
          <p style={{marginLeft: "150px"}}>Our main goal is to provide a central hub for beginners to learn basic trading concepts anytime, anywhere. </p>
        </Box>
      </Box>
      <Box className="feature-about-us">
        <Card className="feature-text-box">
          <Box className="title-box">
            <img className="logo" src={logo}></img>
            <Typography className="text-box-title">LIVE TRADING SIMULATION</Typography>
          </Box>
          <Typography className="text-box-content">Gain real-time trading experience for free.</Typography>
        </Card>
        <Typography className="trading-text" variant="h6">Does trading seem scary to you?</Typography>
        <img className="laptop" src={tradingLaptop}></img>
        <img className="feature-pic" src={simulation}></img>
      </Box>
      <Box className="feature-about-us">
        <Card className="feature-text-box" style={{marginLeft: "200px"}}>
          <Box className="title-box">
            <img className="logo" src={logo}></img>
            <Typography className="text-box-title">EXPLORE TRENDING NEWS</Typography>
          </Box>
          <Typography className="text-box-content">Discover the latest discoveries on trading anytime, anywhere.</Typography>
        </Card>
        <Typography className="trading-text" variant="h6" style={{marginLeft: "225px"}}>Fear of missing out?</Typography>
        <img className="laptop" src={newsLaptop} style={{marginLeft: "115px"}}></img>
        <img className="feature-pic" src={news} style={{marginLeft: "703px"}}></img>
      </Box>
      <Box className="feature-about-us">
        <Card className="feature-text-box">
          <Box className="title-box">
            <img className="logo" style={{marginLeft: "115px"}} src={logo}></img>
            <Typography className="text-box-title">OPEN DISCUSSIONS</Typography>
          </Box>
          <Typography className="text-box-content">Connect and trade knowledge with real users globally.</Typography>
        </Card>
        <Typography className="trading-text" variant="h6">Discussions about trading strategies?</Typography>
        <img className="laptop" src={forumLaptop}></img>
        <img className="feature-pic" src={forum}></img>
      </Box>
      <Box className="contacts">
        <img className="locate-logo" src={gps} style={{maxHeight: "80px"}}></img>
        <Box className="locate-text">
          <Typography variant="h6">Locate Us</Typography>
          <p>3500, Jalan Teknokrat 3, Cyber 4, 63000 Cyberjaya, Selangor</p>
        </Box>
        <img className="contact-logo" src={contact} style={{maxHeight: "80px"}}></img>
        <Box className="contact-text">
          <Typography variant="h6">Contact Us</Typography>
          <p style={{marginBottom: "0px"}}>0112345678</p>
          <p>officialcommoncents@gmail.com</p>
        </Box>
      </Box>
        <Box className="about-us">
          <Typography variant="h4" style={{color: "white"}}>Meet our Team</Typography>
          <Box className="row">
            <Box className="column">
              <Card className="card" style={{borderRadius: '25px'}}>
                <img src={member1} alt="Bega" />
                <Box className="container">
                  <Typography variant="h2">Muhammad Lubega</Typography>
                  <Typography className="title">Front-End Developer</Typography>
                  <Typography> "if(brain!=empty){"{keepCoding();}"}else{"{drinkCoffee();}"}"</Typography>
                </Box>
              </Card>
            </Box>
            <Box className="column">
              <Card className="card" style={{borderRadius: '25px'}}>
                <img src={member2} alt="CassJ" />
                <Box className="container">
                  <Typography variant="h2">Cassandra Jacklya</Typography>
                  <Typography className="title">Product Designer</Typography>
                  <Typography> "Quotes"</Typography>
                </Box>
              </Card>
            </Box>
            <Box className="column">
              <Card className="card" style={{borderRadius: '25px'}}>
                <img
                  src={member3}
                  alt="Vino"
                  style={{ width: "100%", height: "220px" }}
                />
                <Box className="container">
                  <Typography variant="h2">Vinothinni Kannan</Typography>
                  <Typography className="title">Quality Assurance</Typography>
                  <Typography> "Quotes"</Typography>
                </Box>
              </Card>
            </Box>
            <Box className="column">
              <Card className="card" style={{borderRadius: '25px'}}>
                <img src={member4} alt="Bentley" />
                <Box className="container">
                  <Typography variant="h2">Bentley Teh</Typography>
                  <Typography className="title">Mobile Developer</Typography>
                  <Typography> "Quotes"</Typography>
                </Box>
              </Card>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AboutPage;
