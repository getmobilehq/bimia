import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Alert, 
  CircularProgress, 
  Paper,
  Stack,
  InputAdornment,
  IconButton,
  Link,
  Container
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import LoginIcon from '@mui/icons-material/Login';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { useLogin } from '../hooks/useAuth';

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const login = useLogin();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (typeof onLogin !== 'function') {
      setError('Login function not available');
      return;
    }
    
    login.mutate(
      { email, password },
      {
        onSuccess: (data) => {
          // API returns { access_token, refresh_token, ...userInfo }
          if (data?.access_token && data?.refresh_token) {
            onLogin(data);
            // Redirect after successful login
            const role = data.user_role || data.role || '';
            const target = role === 'admin' ? '/dashboard/upload' : '/dashboard/manage';
            window.history.pushState({}, '', target);
            window.dispatchEvent(new PopStateEvent('popstate'));
          } else {
            setError('Invalid response from server');
          }
        },
        onError: (err) => {
          const detail = err?.response?.data?.detail || err?.message || 'Login failed';
          setError(detail);
        },
      }
    );
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background decoration */}
      <Box
        sx={{
          position: 'absolute',
          width: '200%',
          height: '200%',
          background: 'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)',
          transform: 'rotate(-45deg)',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          width: '200%',
          height: '200%',
          background: 'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)',
          transform: 'rotate(45deg)',
        }}
      />

      <Container maxWidth="sm" sx={{ display: 'flex', alignItems: 'center', position: 'relative', zIndex: 1 }}>
        <Paper 
          elevation={24}
          sx={{ 
            p: { xs: 4, md: 5 }, 
            borderRadius: 3, 
            width: '100%',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box 
              sx={{ 
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'white',
                borderRadius: 3,
                width: 100,
                height: 100,
                mb: 2,
                boxShadow: '0 8px 32px rgba(30, 60, 114, 0.1)',
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <img src="/bimi-logo.png" alt="Bimi Logo" style={{ width: 80, height: 80 }} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e3c72', mb: 1 }}>
              Welcome Back
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Sign in to access the Bimi Admin Dashboard
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                label="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                type="email"
                required
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
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

              <TextField
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                type={showPassword ? 'text' : 'password'}
                required
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        size="small"
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
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

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={login.isLoading}
                startIcon={!login.isLoading && <LoginIcon />}
                sx={{
                  py: 1.5,
                  mt: 2,
                  background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 600,
                  boxShadow: '0 4px 16px rgba(30, 60, 114, 0.2)',
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
                {login.isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Sign In'
                )}
              </Button>

              {error && (
                <Alert 
                  severity="error" 
                  sx={{ 
                    borderRadius: 2,
                    '& .MuiAlert-icon': {
                      alignItems: 'center'
                    }
                  }}
                >
                  {error}
                </Alert>
              )}

              <Box sx={{ textAlign: 'center', mt: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  Need help?{' '}
                  <Link 
                    href="#" 
                    sx={{ 
                      color: '#1e3c72',
                      textDecoration: 'none',
                      fontWeight: 600,
                      '&:hover': {
                        textDecoration: 'underline'
                      }
                    }}
                  >
                    Contact Support
                  </Link>
                </Typography>
              </Box>
            </Stack>
          </form>
        </Paper>
      </Container>
    </Box>
  );
}