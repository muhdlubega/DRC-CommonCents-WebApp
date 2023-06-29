// import React from 'react';
import { Box, Button, Typography } from '@mui/material';

const TradeIntro = () => {
  const handleRegisterClick = () => {
    console.log('Register button clicked!');
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Box sx={{ flex: 1 }}>
        <img
          src="https://images.pexels.com/photos/7567443/pexels-photo-7567443.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          alt="Trading Image"
        />
      </Box>
      <Box sx={{ flex: 1 }}>
        <Typography variant="h2" component="h2" sx={{ fontWeight: 'bold' }}>
          Try out our Trading Stimulation
        </Typography>
        <Typography>
          Welcome to our trading platform! Here you can explore the world of trading and seize exciting investment opportunities.
        </Typography>
        <Button variant="contained" onClick={handleRegisterClick}>
          Trade Now
        </Button>
      </Box>
    </Box>
  );
};

export default TradeIntro;
