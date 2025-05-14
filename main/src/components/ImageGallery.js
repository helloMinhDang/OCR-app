// File: src/components/ImageGallery.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  IconButton,
  Typography,
  Card,
  useMediaQuery,
  Fade,
  Slide,
  Button
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const ImageGallery = ({ images = [], onBackToUpload, onRunOCR }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [currentPage, setCurrentPage] = useState(0);
  const [transition, setTransition] = useState(true);
  const [direction, setDirection] = useState('left');

  // Điều chỉnh số lượng ảnh hiển thị
  const IMAGES_PER_PAGE = isSmallScreen ? 1 : 2;

  const handlePrevious = () => {
    setTransition(false);
    setDirection('right');
    setTimeout(() => {
      setCurrentPage(prev => Math.max(0, prev - 1));
      setTransition(true);
    }, 300);
  };

  const handleNext = () => {
    setTransition(false);
    setDirection('left');
    setTimeout(() => {
      const maxPages = Math.ceil(images.length / IMAGES_PER_PAGE);
      setCurrentPage(prev => Math.min(maxPages - 1, prev + 1));
      setTransition(true);
    }, 300);
  };

  useEffect(() => {
    setCurrentPage(0);
  }, [IMAGES_PER_PAGE]);

  const startIndex = currentPage * IMAGES_PER_PAGE;
  const visibleImages = images.slice(startIndex, startIndex + IMAGES_PER_PAGE);
  const totalPages = Math.max(1, Math.ceil(images.length / IMAGES_PER_PAGE));
  const canGoNext = images.length > 0 && currentPage < totalPages - 1;
  const canGoPrevious = currentPage > 0;

  return (
    <Box sx={{ width: '100%', position: 'relative', py: 4 }}>
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
        px: { xs: 2, sm: 4 },
        py: 2
      }}>
        {/* Back to Upload Button */}
        <Button
          onClick={onBackToUpload}
          variant="outlined"
          color="primary"
          sx={{
            borderRadius: 3,
            px: 3,
            borderWidth: 2,
            fontWeight: 'bold',
            textTransform: 'none',
            boxShadow: 2,
            
          }}
        >
          ← Add/Delete Files
        </Button>

        {/* Perform OCR Button */}
        <Button
          onClick={onRunOCR}
          variant="contained"
          color="primary"
          sx={{
            borderRadius: 3,
            px: 3,
            py: 1.5,
            fontWeight: 'bold',
            textTransform: 'none',
            border: '2px solid white',
            boxShadow: 2,
            '&:hover': {
              bgcolor: 'primary.dark',
              boxShadow: 3,
            }
          }}
        >
          Perform OCR →
        </Button>
      </Box>



      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        position: 'relative',
        minHeight: {
          xs: '60vh',
          sm: '70vh'
        }
      }}>

        {/* Navigation Arrows */}
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

        {/* Image Cards */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          gap: 4,
          width: '100%',
          px: { xs: 2, sm: 4 },
          overflow: 'hidden'
        }}>
          {visibleImages.map((image, index) => (
            <Slide
              key={`${currentPage}-${index}`}
              direction={direction}
              in={transition}
              timeout={500}
            >
              <Fade in={transition} timeout={800}>
                <Card
                  sx={{
                    display: 'inline-block',
                    p: 1,
                    boxShadow: 6,
                    borderRadius: 4,
                    backgroundColor: '#fff', // đảm bảo có nền
                  }}
                >
                  <Box
                    component="img"
                    sx={{
                      width: 'auto',
                      height: '80vh',
                      display: 'block',
                      borderRadius: 4,
                    }}
                    src={`data:image/png;base64,${image}`}
                    alt={`Image ${startIndex + index + 1}`}
                  />
                </Card>

              </Fade>
            </Slide>
          ))}
        </Box>
      </Box>

      {/* Page Indicators */}
      {/* Compact Page Indicators */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          gap: 0.5,        // tighter spacing
          mt: 2,           // less top margin
          position: 'relative',
          zIndex: 2,
        }}
      >
        {Array.from({ length: totalPages }).map((_, index) => (
          <Box
            key={index}
            onClick={() => {
              setDirection(index > currentPage ? 'left' : 'right');
              setTransition(false);
              setTimeout(() => {
                setCurrentPage(index);
                setTransition(true);
              }, 300);
            }}
            sx={{
              width: 12,     // smaller dot
              height: 12,
              borderRadius: '50%',
              bgcolor: currentPage === index ? 'primary.main' : 'grey.300',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              transform: currentPage === index ? 'scale(1.2)' : 'scale(1)',
              '&:hover': {
                transform: currentPage === index ? 'scale(1.4)' : 'scale(1.2)',
                bgcolor: currentPage === index ? 'primary.dark' : 'grey.500',
              },
            }}
          />
        ))}
      </Box>


      <Typography
        variant="h6"
        align="center"
        sx={{
          mt: 1,
          color: 'text.secondary',
          fontWeight: 'light',
          letterSpacing: 0.5,
          fontSize: { xs: '0.75rem', sm: '0.95rem' }
        }}
      >
        {currentPage + 1} of {totalPages}
      </Typography>

    </Box>
  );
};

export default ImageGallery;