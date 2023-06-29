// import React from 'react';
import { Box, Typography } from '@mui/material';
import Navbar from '../components/navbar/Navbar';
import member1 from '../assets/images/bega.jpeg';
import member2 from '../assets/images/cass.jpeg';
import member3 from '../assets/images/vino2.jpeg';
import member4 from '../assets/images/bentley.jpeg';
import Footer from '../components/homepage/Footer';

type TeamMemberProps = {
   name: string;
   title: string;
   image: string;
 };

const AboutPage = () => {
  return (
    <Box className="section-aboutus">
      <Navbar />
      <Box sx={{ padding: '2rem' }}>
        <Typography variant="h2" align="center" sx={{ mb: 4 }}>
          MEET OUR TEAM
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
          <TeamMember name="Muhammad Lubega" title="Front-End Developer" image={member1} />
          <TeamMember name="Cassandra Jacklyn" title="Product Designer" image={member2} />
          <TeamMember name="Vinothinni Kannan" title="Quality Assurance" image={member3} />
          <TeamMember name="Bentley Teh" title="Mobile Developer" image={member4} />
        </Box>
      </Box>
      <Footer />
    </Box>
  );
};

const TeamMember = ({ name, title, image }: TeamMemberProps) => {
  return (
    <Box sx={{ width: 300, mx: 2, mb: 4 }}>
      <Box
        component="img"
        src={image}
        alt={name}
        sx={{ width: '100%', height: '220px', objectFit: 'cover', mb: 2 }}
      />
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h5">{name}</Typography>
        <Typography variant="subtitle1">{title}</Typography>
        <Typography variant="body1">"Quotes"</Typography>
      </Box>
    </Box>
  );
};

export default AboutPage;
