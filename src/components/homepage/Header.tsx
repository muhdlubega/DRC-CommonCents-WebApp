// import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import bitcoin from '../../assets/bitcoin.gif';

const Header = () => {
  const handleRegisterClick = () => {
    console.log('Register button clicked!');
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Box sx={{ flex: 1 }}>
        <img src={bitcoin} alt="Trading Image(Coin)" />
      </Box>

      <Box sx={{ flex: 1 }}>
        <Typography>
          Welcome to our trading platform! Here you can explore the world of trading and seize exciting investment opportunities.
        </Typography>
        <Button className="register-button1" onClick={handleRegisterClick}>
          Trade Now
        </Button>
      </Box>
    </Box>
  );
};

export default Header;
