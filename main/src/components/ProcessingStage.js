// File: src/components/ProcessingStage.js
import React from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';

const ProcessingStage = ({ message = 'Processing...' }) => {
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      p: 5,
      textAlign: 'center',
    }}>

      <HourglassTopIcon sx={{ fontSize: 80, color: 'primary.main', mb: 3 }} />
      
      {/* Thanh progress */}
      <Box sx={{ width: '100%', mb: 2 }}>
        <LinearProgress
          variant="indeterminate"
          sx={{
            height: 10,
            borderRadius: 5,
          }}
        />
      </Box>

      {/* Text Processing */}
      <Typography variant="h6" fontWeight="bold">
        {message}
      </Typography>
    </Box>
  );
};

export default ProcessingStage;
