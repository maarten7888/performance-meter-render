import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Button, Box, IconButton, Tooltip } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../contexts/AuthContext';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, logout, user } = useAuth();

  // Debug logging
  console.log('Navigation - User object:', user);
  console.log('Navigation - Is admin?', user?.role === 'admin');

  if (!isAuthenticated) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <AppBar position="static" sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', boxShadow: 'none', mb: 2 }}>
      <Toolbar>
        <Box sx={{ flexGrow: 1, display: 'flex', gap: 2 }}>
          <Button
            color="inherit"
            onClick={() => navigate('/')}
            sx={{
              color: 'white',
              bgcolor: isActive('/') ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
            }}
          >
            Dashboard
          </Button>
          <Button
            color="inherit"
            onClick={() => navigate('/projects')}
            sx={{
              color: 'white',
              bgcolor: isActive('/projects') ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
            }}
          >
            Projecten
          </Button>
          <Button
            color="inherit"
            onClick={() => navigate('/time-registration')}
            sx={{
              color: 'white',
              bgcolor: isActive('/time-registration') ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
            }}
          >
            Urenregistratie
          </Button>
          <Button
            color="inherit"
            onClick={() => navigate('/management')}
            sx={{
              color: 'white',
              bgcolor: isActive('/management') ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
            }}
          >
            Beheer
          </Button>
        </Box>
        <Tooltip title="Uitloggen">
          <IconButton 
            color="inherit" 
            onClick={handleLogout}
            sx={{ 
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            <LogoutIcon />
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation; 