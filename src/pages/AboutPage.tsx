import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import member1 from "../assets/images/bega.jpeg";
import member2 from "../assets/images/cass.jpeg";
import member3 from "../assets/images/vino2.jpeg";
import member4 from "../assets/images/bentley.jpeg";
// import ParticlesBackground from "../components/ParticlesBackground";
import watermark from "../assets/images/watermark.png"
import '../styles/main.scss'

const AboutPage = () => {
  return (
    <Box className="section-aboutus">
      <Box className="background-container">
      <img className="watermark" src={watermark}></img>
      {/* <div className="ts-particles">
          <ParticlesBackground />
        </div> */}
        {/* <Box className="backgroundCircleTopLeft"></Box> */}
        {/* <Box className="backgroundCircleBottomRight"></Box> */}
        <Box className="about-us">
          <Typography variant="h2">Meet our Team</Typography>
          <Box className="row">
            <Box className="column">
              <Box className="card">
                <img src={member1} alt="Bega" />
                <Box className="container">
                  <Typography variant="h2">Muhammad Lubega</Typography>
                  <Typography className="title">Front-End Developer</Typography>
                  <Typography> "Quotes"</Typography>
                </Box>
              </Box>
            </Box>
            <Box className="column">
              <Box className="card">
                <img src={member2} alt="CassJ" />
                <Box className="container">
                  <Typography variant="h2">Cassandra Jacklya</Typography>
                  <Typography className="title">Product Designer</Typography>
                  <Typography> "Quotes"</Typography>
                </Box>
              </Box>
            </Box>
            <Box className="column">
              <Box className="card">
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
              </Box>
            </Box>
            <Box className="column">
              <Box className="card">
                <img src={member4} alt="Bentley" />
                <Box className="container">
                  <Typography variant="h2">Bentley Teh</Typography>
                  <Typography className="title">Mobile Developer</Typography>
                  <Typography> "Quotes"</Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AboutPage;
