import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Button
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DownloadIcon from '@mui/icons-material/Download';

const OCRResults = ({ results, onDownload }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : results.length - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex < results.length - 1 ? prevIndex + 1 : 0
    );
  };

  const canGoPrevious = currentIndex > 0;
  const canGoNext = currentIndex < results.length - 1;

  if (!results || results.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', p: 5, bgcolor: '#f7f9fc', borderRadius: 2 }}>
        <Typography variant="h6" color="text.secondary">Không tìm thấy kết quả OCR</Typography>
      </Box>
    );
  }

  const currentResult = results[currentIndex];

  return (
    <Box sx={{ p: 3, borderRadius: 2 }}>
      {/* Header with Download Button */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" fontWeight="500" color="primary.dark">
          Page {currentIndex + 1}/{results.length}
        </Typography>

        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          onClick={() => onDownload()}
          sx={{
            boxShadow: 1,
            '&:hover': { boxShadow: 2 }
          }}
        >
          Download (.txt)
        </Button>
      </Box>

      {/* Navigation Buttons */}
      <IconButton
        onClick={handlePrevious}
        disabled={!canGoPrevious}
        sx={{
          position: 'absolute',
          left: { xs: 8, sm: 16 },
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 10,
          bgcolor: 'primary.main',
          color: 'white',
          '&:hover': { bgcolor: 'primary.dark' },
          boxShadow: 3,
          '&:disabled': { opacity: 0.5, bgcolor: 'grey.400' }
        }}
      >
        <ArrowBackIcon fontSize="large" />
      </IconButton>

      <IconButton
        onClick={handleNext}
        disabled={!canGoNext}
        sx={{
          position: 'absolute',
          right: { xs: 8, sm: 16 },
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 10,
          bgcolor: 'primary.main',
          color: 'white',
          '&:hover': { bgcolor: 'primary.dark' },
          boxShadow: 3,
          '&:disabled': { opacity: 0.5, bgcolor: 'grey.400' }
        }}
      >
        <ArrowForwardIcon fontSize="large" />
      </IconButton>

      {/* Image and OCR Text Display */}
      <Paper sx={{
        display: 'flex',
        p: 3,
        borderRadius: 2,
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        bgcolor: 'white',
        overflow: 'hidden'
      }}>
        {/* Image */}
        <Box
          sx={{
            width: '50%',
            maxHeight: '100vh',
            overflow: 'hidden',
            border: '1px solid #e0e0e0',
            borderRadius: 2,
            position: 'relative'
          }}
        >
          <img
            src={`data:image/jpeg;base64,${currentResult.imageBase64}`}
            alt={`Page ${currentIndex + 1}`}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              borderRadius: 8,
            }}
          />
        </Box>

        {/* OCR Text */}
        <Box
          sx={{
            flex: 1,
            maxHeight: '100vh',
            overflowY: 'auto',
            p: 3,
            ml: 2,
            border: '1px solid #e0e0e0',
            borderRadius: 2,
            backgroundColor: '#fafafa',
          }}
        >
          <Typography variant="subtitle1" sx={{ mb: 2, color: '#444', fontWeight: 500 }}>
            {currentResult.filename}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              whiteSpace: 'pre-wrap',
              lineHeight: 1.6,
              color: '#333',
              letterSpacing: '0.01em'
            }}
          >
            {currentResult.ocrText || 'Not found text.'}
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default OCRResults;
