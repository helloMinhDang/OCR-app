import React from 'react';
import { AppBar, IconButton, Toolbar, Typography } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';

const CustomAppBar = () => {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#6482AD' }}>
      <Toolbar>
        <IconButton edge="start" color="inherit" onClick={handleRefresh}>
          <HomeIcon />
        </IconButton>
            <Typography variant="h4" sx={{ flexGrow: 1, textAlign: 'center', fontWeight: 'bold' }}>
            OCR Document Scanner
            </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default CustomAppBar;
