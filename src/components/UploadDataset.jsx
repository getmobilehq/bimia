import React, { useState, useRef } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Alert, 
  CircularProgress,
  Paper,
  Stack,
  Chip,
  LinearProgress,
  Fade,
  IconButton,
  Tooltip,
  Grid
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DescriptionIcon from '@mui/icons-material/Description';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import { useUploadFile } from '../hooks/useUploads';

export default function UploadDataset({ token }) {
  const [file, setFile] = useState(null);
  const [dataDescription, setDataDescription] = useState('');
  const [tableName, setTableName] = useState('');
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef(null);
  const uploadFile = useUploadFile(token);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file || !dataDescription || !tableName) return;
    
    setSuccess(false);
    uploadFile.mutate(
      { file, data_description: dataDescription, table_name: tableName },
      {
        onSuccess: () => {
          setSuccess(true);
          setFile(null);
          setDataDescription('');
          setTableName('');
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
          setTimeout(() => setSuccess(false), 5000);
        },
      }
    );
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const getFileIcon = (fileName) => {
    const ext = fileName.split('.').pop().toLowerCase();
    const colors = {
      csv: '#4CAF50',
      xlsx: '#2196F3',
      xls: '#2196F3',
      json: '#FF9800'
    };
    return colors[ext] || '#757575';
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Paper elevation={0} sx={{ p: 4, borderRadius: 3, background: 'white' }}>
      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e3c72', mb: 1 }}>
              Upload New Dataset
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Upload your fiscal data files to make them available for the Bimi chatbot
            </Typography>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Dataset Name"
                value={tableName}
                onChange={(e) => setTableName(e.target.value)}
                required
                fullWidth
                variant="outlined"
                helperText="A short, descriptive name (e.g., '2024 Budget Data')"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: '#1e3c72',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#1e3c72',
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Description"
                value={dataDescription}
                onChange={(e) => setDataDescription(e.target.value)}
                required
                fullWidth
                multiline
                rows={1}
                variant="outlined"
                helperText="Briefly describe the dataset contents"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: '#1e3c72',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#1e3c72',
                    },
                  },
                }}
              />
            </Grid>
          </Grid>

          <Box>
            <input
              ref={fileInputRef}
              type="file"
              hidden
              onChange={handleFileSelect}
              accept=".csv,.xlsx,.xls,.json"
              id="file-upload"
            />
            <label htmlFor="file-upload">
              <Button
                variant="outlined"
                component="span"
                fullWidth
                startIcon={<CloudUploadIcon />}
                sx={{
                  py: 4,
                  borderStyle: 'dashed',
                  borderWidth: 2,
                  borderColor: file ? getFileIcon(file.name) : '#e0e0e0',
                  bgcolor: file ? `${getFileIcon(file.name)}08` : 'transparent',
                  '&:hover': {
                    borderColor: '#1e3c72',
                    bgcolor: '#f5f5f7',
                  },
                }}
              >
                {file ? 'Change File' : 'Choose File to Upload'}
              </Button>
            </label>
            
            {file && (
              <Fade in={true}>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    mt: 2, 
                    p: 2, 
                    bgcolor: '#f5f5f7',
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <DescriptionIcon sx={{ color: getFileIcon(file.name), fontSize: 40 }} />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="body1" fontWeight={600}>
                        {file.name}
                      </Typography>
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                        <Chip 
                          size="small" 
                          label={file.name.split('.').pop().toUpperCase()} 
                          sx={{ 
                            bgcolor: getFileIcon(file.name),
                            color: 'white',
                            fontSize: '0.7rem'
                          }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {formatFileSize(file.size)}
                        </Typography>
                      </Stack>
                    </Box>
                    <Tooltip title="Remove file">
                      <IconButton 
                        size="small" 
                        onClick={() => {
                          setFile(null);
                          if (fileInputRef.current) {
                            fileInputRef.current.value = '';
                          }
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </Paper>
              </Fade>
            )}

            <Stack direction="row" spacing={1} sx={{ mt: 2 }} alignItems="center">
              <InfoIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">
                Supported formats: CSV, Excel (.xlsx, .xls), and JSON files
              </Typography>
            </Stack>
          </Box>

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={!file || !dataDescription || !tableName || uploadFile.isLoading}
            sx={{
              mt: 2,
              py: 1.5,
              background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #163057 0%, #1e3c72 100%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 24px rgba(30, 60, 114, 0.3)',
              },
              '&:disabled': {
                background: '#e0e0e0',
              },
              transition: 'all 0.3s ease',
            }}
          >
            {uploadFile.isLoading ? (
              <Stack direction="row" spacing={1} alignItems="center">
                <CircularProgress size={20} color="inherit" />
                <span>Uploading...</span>
              </Stack>
            ) : (
              'Upload Dataset'
            )}
          </Button>

          {uploadFile.isLoading && (
            <Box sx={{ width: '100%' }}>
              <LinearProgress 
                sx={{ 
                  borderRadius: 1,
                  height: 6,
                  bgcolor: '#e0e0e0',
                  '& .MuiLinearProgress-bar': {
                    background: 'linear-gradient(90deg, #1e3c72 0%, #2a5298 100%)',
                  }
                }}
              />
            </Box>
          )}

          {success && (
            <Fade in={true}>
              <Alert 
                severity="success" 
                icon={<CheckCircleIcon />}
                sx={{ 
                  borderRadius: 2,
                  '& .MuiAlert-icon': {
                    color: '#4CAF50'
                  }
                }}
              >
                Dataset uploaded successfully! The data is now available for the Bimi chatbot.
              </Alert>
            </Fade>
          )}

          {uploadFile.isError && (
            <Fade in={true}>
              <Alert 
                severity="error" 
                sx={{ borderRadius: 2 }}
              >
                {uploadFile.error?.response?.data?.detail || uploadFile.error?.message || 'Upload failed. Please try again.'}
              </Alert>
            </Fade>
          )}
        </Stack>
      </Box>
    </Paper>
  );
}