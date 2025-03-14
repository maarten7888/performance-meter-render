import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Button, Box } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/login' as string);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <AppBar position="static" sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', boxShadow: 'none', mb: 2 }}>
      <Toolbar>
        <Box sx={{ flexGrow: 1, display: 'flex', gap: 2 }}>
          <Button
            color="inherit"
            onClick={() => navigate('/dashboard' as string)}
            sx={{
              color: 'white',
              bgcolor: isActive('/dashboard') ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
            }}
          >
            Dashboard
          </Button>
          <Button
            color="inherit"
            onClick={() => navigate('/projects' as string)}
            sx={{
              color: 'white',
              bgcolor: isActive('/projects') ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
            }}
          >
            Projecten
          </Button>
          <Button
            color="inherit"
            onClick={() => navigate('/time-registration' as string)}
            sx={{
              color: 'white',
              bgcolor: isActive('/time-registration') ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
            }}
          >
            Urenregistratie
          </Button>
        </Box>
        <Button color="inherit" onClick={handleLogout} sx={{ color: 'white' }}>
          Uitloggen
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation; 