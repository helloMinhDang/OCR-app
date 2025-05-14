import React, { useRef, useState } from 'react';
import { Box, Typography, Paper, Button, Avatar, Dialog, DialogContent } from '@mui/material';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import { motion, AnimatePresence } from 'framer-motion';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';


const FileUpload = ({ files, onFilesAdded, onProcessImages, onDeleteFile, onMoveUp, onMoveDown }) => {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState(null);


  const handleFileSelect = (e) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      const existingNames = new Set(files.map(file => file.name));
      const renamedFiles = selectedFiles.map(file => {
        const uniqueName = getUniqueFileName(file.name, existingNames);
        existingNames.add(uniqueName);
        return new File([file], uniqueName, { type: file.type });
      });
      onFilesAdded(renamedFiles);
      e.target.value = null;
    }
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      const existingNames = new Set(files.map(file => file.name));
      const renamedFiles = droppedFiles.map(file => {
        const uniqueName = getUniqueFileName(file.name, existingNames);
        existingNames.add(uniqueName);
        return new File([file], uniqueName, { type: file.type });
      });
      onFilesAdded(renamedFiles);
    }
  };
  

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  

  const handleOpenFullscreen = (file) => {
    setFullscreenImage(URL.createObjectURL(file));
  };

  const getUniqueFileName = (name, existingNames) => {
    if (!existingNames.has(name)) return name;
  
    const extIndex = name.lastIndexOf('.');
    const base = extIndex !== -1 ? name.slice(0, extIndex) : name;
    const ext = extIndex !== -1 ? name.slice(extIndex) : '';
    let i = 1;
    let newName;
  
    do {
      newName = `${base}(${i})${ext}`;
      i++;
    } while (existingNames.has(newName));
  
    return newName;
  };

  

  return (
    <>
      <Paper
        elevation={5}
        sx={{
          display: 'flex',
          flexDirection: files.length > 0 ? 'row' : 'column',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '20px',
          height: '60%',
          p: 2,
          border: `2px dashed `,
          background: isDragging
            ? 'linear-gradient(145deg, rgba(74,144,226,0.1) 0%, rgba(255,255,255,1) 100%)'
            : 'linear-gradient(145deg, rgba(245,245,245,1) 0%, rgba(255,255,255,1) 100%)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0,0,0,0.05)',
          '&:hover': {
            boxShadow: '0 12px 40px rgba(0,0,0,0.1)'
          }
        }}
      >


        {/* Drop Zone */}
        <Box
          sx={{
            flex: files.length > 0 ? '0 0 50%' : 1,
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            p: 4,
            cursor: 'pointer',
            position: 'relative',
            '&:before': {
              content: '""',
              position: 'absolute',
              inset: 0,
              borderRadius: '16px',
              border: `2px dashed `,
              opacity: isDragging ? 1 : 0,
              transition: 'opacity 0.3s ease'
            }
          }}
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Box sx={{
            position: 'relative',
            mb: 2,
            '&:hover svg': {
              transform: 'translateY(-3px)'
            }
          }}>
            <Box sx={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              background: 'radial-gradient(rgba(74,144,226,0.15) 0%, transparent 70%)',
              opacity: isDragging ? 1 : 0,
              transition: 'opacity 0.3s ease'
            }} />
            <UploadFileIcon sx={{
              fontSize: 56,
              color: isDragging ? 'primary.main' : 'text.secondary',
              transition: 'all 0.3s ease',
              transform: isDragging ? 'scale(1.1)' : 'scale(1)'
            }} />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,application/pdf"
              onChange={handleFileSelect}
              multiple
              style={{ display: 'none' }}
            />
          </Box>

          <Typography variant="h6" sx={{
            fontWeight: 600,
            color: isDragging ? 'primary.main' : 'text.primary',
            mb: 0.5
          }}>
            Select/Drop files here
          </Typography>

          <Typography variant="body2" sx={{
            color: 'text.secondary',
            maxWidth: '260px',
            lineHeight: 1.5,
            mb: 1.5
          }}>
            Supported formats: JPEG, PNG, PDF
          </Typography>
        </Box>

        {/* Preview Zone */}
        {files.length > 0 && (
          <Box sx={{
            flex: '0 0 50%',
            height: '100%',
            overflowY: 'auto',
            p: 2,
            bgcolor: 'rgba(245, 248, 255, 0.5)',

            '&::-webkit-scrollbar': {
              width: '6px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(0,0,0,0.1)',
              borderRadius: '3px',
            }
          }}>
            <Typography
              variant="subtitle1"
              sx={{ mb: 1, fontWeight: 'bold', color: 'text.secondary' }}
            >
              {files.length} file{files.length > 1 ? 's' : ''} selected
            </Typography>
            <AnimatePresence>
              {files.map((file, index) => (
                <motion.div
                  key={file.name}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <Paper
                    key={index}
                    elevation={0}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      p: 1.5,
                      mb: 1,
                      borderRadius: '8px',
                      bgcolor: 'grey.100',
                      transition: 'transform 0.2s ease',
                      '&:hover': {
                        // transform: 'translateX(4px)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                      }
                    }}
                  >
                    {/* Nút ↑ ↓ bên trái avatar */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <Tooltip title="Move up" >
                        <IconButton
                          size="small"
                          onClick={() => onMoveUp(index)}
                          disabled={index === 0}
                          sx={{ p: 0.5, mb: 0.5, '&:disabled': { opacity: 0.3 } }}
                        >
                          <ArrowUpwardIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Move down">
                        <IconButton
                          size="small"
                          onClick={() => onMoveDown(index)}
                          disabled={index === files.length - 1}
                          sx={{ p: 0.5, '&:disabled': { opacity: 0.3 } }}
                        >
                          <ArrowDownwardIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                    <Box sx={{
                      position: 'relative',
                      '&:hover .fullscreen-icon': {
                        display: 'inline-flex'
                      }
                    }}>
                      <Avatar
                        variant="rounded"
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        sx={{
                          width: 48,
                          height: 48,
                          bgcolor: 'grey.50',
                          borderRadius: '6px',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                          cursor: 'pointer'
                        }}
                      />
                      <Tooltip title="Full screen">
                        <IconButton
                          size="small"
                          onClick={() => handleOpenFullscreen(file)}
                          sx={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            bgcolor: 'rgba(255,255,255,0.8)',
                            display: 'none',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              bgcolor: 'rgba(255,255,255,1)',
                            }
                          }}
                          className="fullscreen-icon"
                        >
                          <ZoomInIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>

                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="body2" noWrap sx={{
                        fontWeight: 500,
                        color: 'text.primary'
                      }}>
                        {file.name}
                      </Typography>
                      <Typography variant="caption" sx={{
                        color: 'text.secondary',
                        display: 'block'
                      }}>
                        {(file.size / 1024).toFixed(1)} KB
                      </Typography>
                    </Box>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        onClick={() => onDeleteFile(index)}
                        sx={{
                          ml: 'auto',
                          color: 'error.main',
                          '&:hover': {
                            bgcolor: 'rgba(244, 67, 54, 0.08)'
                          }
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Paper>
                </motion.div>
              ))}
            </AnimatePresence>
          </Box>
        )}

      </Paper >

      {/* Process Button */}
      {
        files.length > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={onProcessImages}
            >
              Process Images
            </Button>
          </Box>
        )
      }

      {fullscreenImage && (
        <Dialog
          open={Boolean(fullscreenImage)}
          onClose={() => setFullscreenImage(null)}
          sx={{
            '& .MuiDialog-paper': {
              backgroundColor: 'transparent',
              boxShadow: 'none',
              borderRadius: 2,
              p: 0,
              overflow: 'hidden',
              display: 'inline-block', // chỉ rộng đúng theo nội dung
              maxHeight: '100vh'
            }
          }}
        >
          <DialogContent
            sx={{
              position: 'relative',
              p: 0,
              m: 0,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'black',
            }}
          >
            <Tooltip title="Close">
              <IconButton
                onClick={() => setFullscreenImage(null)}
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  color: 'white',
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  '&:hover': { backgroundColor: 'rgba(0,0,0,0.8)' }
                }}
              >
                <CloseIcon />
              </IconButton>
            </Tooltip>
            <img
              src={fullscreenImage}
              alt="Full preview"
              style={{
                maxHeight: '98vh',
                maxWidth: '100%',
                objectFit: 'contain',
              }}
            />
          </DialogContent>
        </Dialog>
      )}

    </>
  );
};

export default FileUpload;
