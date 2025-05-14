// File: src/components/Home.js
import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import FileUpload from './FileUpload';
import ProcessingStage from './ProcessingStage';
import ImageGallery from './ImageGallery';
import OCRResults from './OCRResults';

const Home = () => {
  const [files, setFiles] = useState([]);
  const [processedImages, setProcessedImages] = useState([]);
  const [ocrResults, setOcrResults] = useState(null);
  const [currentStage, setCurrentStage] = useState('upload'); // upload, preprocessing, review, ocr, results
  const [processingProgress, setProcessingProgress] = useState(0);

  const handleFilesAdded = (newFiles) => {
    setFiles(prevFiles => [...prevFiles, ...newFiles]);
  };

  const handleDeleteFile = (indexToDelete) => {
    setFiles((prev) => prev.filter((_, index) => index !== indexToDelete));
  };

  const handleMoveUp = (index) => {
    if (index > 0) {
      const newFiles = [...files];
      [newFiles[index - 1], newFiles[index]] = [newFiles[index], newFiles[index - 1]];
      setFiles(newFiles);
    }
  };
  
  const handleMoveDown = (index) => {
    if (index < files.length - 1) {
      const newFiles = [...files];
      [newFiles[index], newFiles[index + 1]] = [newFiles[index + 1], newFiles[index]];
      setFiles(newFiles);
    }
  };
  

  const handleProcessImages = async () => {
    if (files.length === 0) return;

    setCurrentStage('preprocessing');
    setProcessingProgress(0);

    // Create form data to send files
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append('images', file, `${index}_${file.name}`);
    });

    try {
       // Make API call to preprocess images
      const response = await fetch('http://localhost:5000/api/preprocess', {
        method: 'POST',
        body: formData,
      });

      // clearInterval(progressInterval);
      setProcessingProgress(100);

      if (!response.ok) {
        throw new Error('Failed to preprocess images');
      }

      const result = await response.json();
      setProcessedImages(result.processedImages);
      setCurrentStage('review');
    } catch (error) {
      console.error('Error preprocessing images:', error);
      alert('Error preprocessing images. Please try again.');
      setCurrentStage('upload');
    }
  };
  
  const handleRunOCR = async () => {
    if (processedImages.length === 0) return;
  
    setCurrentStage('ocr');
    setProcessingProgress(0);
  
    try {
      // Make API call to run OCR
      const response = await fetch('http://localhost:5000/api/ocr', {
        method: 'GET',  // Use GET request instead of POST
      });
      setProcessingProgress(100);
  
      if (!response.ok) {
        throw new Error('Failed to run OCR');
      }
  
      const results = await response.json();
      setOcrResults(results);  // Set OCR results
      setCurrentStage('results');
    } catch (error) {
      console.error('Error running OCR:', error);
      alert('Error running OCR. Please try again.');
    }
  };
  
  const handleDownloadResults = () => {
    // API call to download results in the requested format
    window.location.href = 'http://localhost:5000/api/download';
  };

  const renderCurrentStage = () => {
    switch (currentStage) {
      case 'upload':
        return (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column', gap: 3,
              height: '80vh',
              justifyContent: 'center'
            }}>
            <FileUpload
              files={files}
              onFilesAdded={handleFilesAdded}
              onDeleteFile={handleDeleteFile}
              onProcessImages={handleProcessImages}
              onMoveUp={handleMoveUp}
              onMoveDown={handleMoveDown}
            />
          </Box>
        );

      case 'preprocessing':
        return (
          <ProcessingStage
            progress={processingProgress}
            message="Preprocessing images to enhance quality..."
          />
        );

      case 'review':
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <ImageGallery
              images={processedImages}
              onRunOCR={handleRunOCR}
              onBackToUpload={() => setCurrentStage('upload')}
            />
          </Box>
        );

      case 'ocr':
        return (
          <ProcessingStage
            progress={processingProgress}
            message="Performing OCR on processed images..."
          />
        );

      case 'results':
        return (
          <OCRResults
            results={ocrResults}
            onDownload={handleDownloadResults}
          />
        );

      default:
        return <Typography>Unknown stage</Typography>;
    }
  };

  return (
    <Box sx={{ mx: 'auto', width: '100%', height: '90vh' }}>
      {renderCurrentStage()}
    </Box>
  );
};

export default Home;