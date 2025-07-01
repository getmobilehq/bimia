import React, { useState, useEffect } from 'react';
import { 
  Box, 
  CssBaseline, 
  AppBar, 
  Toolbar, 
  Typography, 
  Drawer, 
  List, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Container, 
  Button,
  IconButton,
  Avatar,
  Chip,
  useTheme,
  useMediaQuery,
  Divider,
  Stack
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import TableRowsIcon from '@mui/icons-material/TableRows';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import UploadDataset from './components/UploadDataset';
import ManageDatasets from './components/ManageDatasets';
import LoginPage from './components/LoginPage';
import RestrictedPage from './components/RestrictedPage';
import NotFoundPage from './components/NotFoundPage';
import { AuthProvider, useAuth } from './AuthContext';
import { setupAuthApi, refreshToken as refreshTokenApi } from './api';
import './App.css';

const drawerWidth = 240;

function DashboardApp() {
  const [view, setView] = useState('manage');
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const userRole = user?.user_role || user?.role || 'user';
  const canUpload = userRole === 'admin' || userRole === 'uploader';
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    ...(canUpload ? [
      { id: 'upload', label: 'Upload Dataset', icon: <CloudUploadIcon />, color: '#4CAF50' }
    ] : []),
    { id: 'manage', label: 'Manage Datasets', icon: <TableRowsIcon />, color: '#2196F3' },
  ];

  const drawer = (
    <Box sx={{ height: '100%', background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)' }}>
      <Toolbar sx={{ justifyContent: 'center', py: 2 }}>
        <Stack spacing={1.5} alignItems="center">
          <Box sx={{ 
            bgcolor: 'white', 
            borderRadius: 2, 
            p: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <img src="/bimi-logo.png" alt="Bimi Logo" style={{ width: 50, height: 50 }} />
          </Box>
          <Typography variant="body1" sx={{ color: 'white', fontWeight: 700 }}>
            Bimi Admin
          </Typography>
        </Stack>
      </Toolbar>
      <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
      <List sx={{ px: 1.5, py: 2 }}>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.id}
            selected={view === item.id}
            onClick={() => {
              setView(item.id);
              if (isMobile) setMobileOpen(false);
            }}
            sx={{
              mb: 1,
              borderRadius: 2,
              color: 'white',
              py: 1,
              '&.Mui-selected': {
                bgcolor: 'rgba(255,255,255,0.15)',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.25)',
                },
              },
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.1)',
              },
            }}
          >
            <ListItemIcon sx={{ color: 'white', minWidth: 36 }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.label}
              primaryTypographyProps={{
                fontSize: '0.9rem',
                fontWeight: view === item.id ? 600 : 400
              }}
            />
          </ListItemButton>
        ))}
      </List>
      <Box sx={{ flexGrow: 1 }} />
      <Box sx={{ p: 2 }}>
        <Chip
          icon={<PersonIcon />}
          label={user?.user_role || 'Admin User'}
          sx={{ 
            width: '100%', 
            bgcolor: 'rgba(255,255,255,0.1)', 
            color: 'white',
            '& .MuiChip-icon': { color: 'white' }
          }}
        />
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f5f5f7' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, color: 'text.primary' }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" noWrap sx={{ flexGrow: 1, color: 'text.primary', fontWeight: 600 }}>
            {view === 'upload' ? 'Upload Dataset' : 'Manage Datasets'}
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar sx={{ bgcolor: '#1e3c72', width: 36, height: 36 }}>A</Avatar>
            <Button
              variant="outlined"
              size="small"
              startIcon={<LogoutIcon />}
              onClick={logout}
              sx={{
                borderColor: '#e0e0e0',
                color: 'text.secondary',
                '&:hover': {
                  borderColor: '#d32f2f',
                  bgcolor: '#ffebee',
                  color: '#d32f2f',
                },
              }}
            >
              Logout
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={isMobile ? mobileOpen : true}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              border: 'none',
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          mt: '64px',
        }}
      >
        {view === 'upload' ? (
          canUpload ? (
            <UploadDataset />
          ) : (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" color="error" gutterBottom>
                Restricted: Only admins or uploaders can upload datasets.
              </Typography>
              <Button variant="contained" onClick={() => setView('manage')}>Go to Manage Datasets</Button>
            </Box>
          )
        ) : view === 'manage' ? (
          <ManageDatasets userRole={userRole} />
        ) : (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="error" gutterBottom>
              Unknown view.
            </Typography>
            <Button variant="contained" onClick={() => setView('manage')}>Go to Manage Datasets</Button>
          </Box>
        )}
      </Box>
    </Box>
  );
}

function App() {
  const { accessToken, refreshToken, updateTokens, logout, login } = useAuth();
  const [route, setRoute] = useState(window.location.pathname);

  useEffect(() => {
    if (accessToken) {
      setupAuthApi({
        getAccessToken: () => accessToken,
        getRefreshToken: () => refreshToken,
        updateTokens,
        logout,
        refreshTokenApi,
      });
    }
  }, [accessToken, refreshToken, updateTokens, logout]);

  useEffect(() => {
    const onPopState = () => setRoute(window.location.pathname);
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  if (!accessToken) {
    return <LoginPage onLogin={login} />;
  }

  // Route switch for restricted/404
  if (route === '/restricted') {
    return <RestrictedPage />;
  }
  if (!['/dashboard/manage', '/dashboard/upload', '/restricted'].includes(route)) {
    return <NotFoundPage />;
  }

  return <DashboardApp />;
}

export default function AppWithProvider() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}