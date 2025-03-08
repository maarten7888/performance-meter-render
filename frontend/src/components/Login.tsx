import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Box, Button, TextField, Typography, Container, Paper, InputAdornment } from '@mui/material';
import { Email, Lock } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Inloggen mislukt. Controleer uw gegevens.');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={6}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <Typography 
            component="h1" 
            variant="h4" 
            color="white" 
            sx={{ 
              mb: 4, 
              fontWeight: 600,
              textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
            }}
          >
            Performance Meter
          </Typography>
          <Typography 
            variant="subtitle1" 
            color="white" 
            sx={{ 
              mb: 3,
              opacity: 0.8,
              textAlign: 'center'
            }}
          >
            Log in om uw uren en projecten te beheren
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="E-mailadres"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email sx={{ color: 'white' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#0c2d5a',
                  borderRadius: '12px',
                  '& fieldset': { 
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    borderRadius: '12px',
                  },
                  '&:hover fieldset': { 
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'white',
                  },
                  '& input:-webkit-autofill': {
                    WebkitBoxShadow: '0 0 0 1000px #0c2d5a inset',
                    WebkitTextFillColor: '#90caf9',
                    caretColor: '#90caf9',
                  },
                  '& input:-webkit-autofill:focus': {
                    WebkitBoxShadow: '0 0 0 1000px #0c2d5a inset',
                    WebkitTextFillColor: '#90caf9',
                    caretColor: '#90caf9',
                  },
                },
                '& .MuiInputLabel-root': { 
                  color: 'rgba(255, 255, 255, 0.7)',
                  '&.Mui-focused': {
                    color: 'white',
                  },
                  transform: 'translate(48px, 16px) scale(1)',
                  '&.Mui-focused, &.MuiFormLabel-filled': {
                    transform: 'translate(48px, -9px) scale(0.75)',
                  },
                },
                '& .MuiOutlinedInput-input': { 
                  color: '#90caf9',
                  padding: '16px 14px 16px 48px',
                },
                '& .MuiInputAdornment-root': {
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none',
                  '& .MuiSvgIcon-root': {
                    color: '#90caf9',
                  },
                },
                mb: 2,
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Wachtwoord"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: 'white' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#0c2d5a',
                  borderRadius: '12px',
                  '& fieldset': { 
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    borderRadius: '12px',
                  },
                  '&:hover fieldset': { 
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'white',
                  },
                  '& input:-webkit-autofill': {
                    WebkitBoxShadow: '0 0 0 1000px #0c2d5a inset',
                    WebkitTextFillColor: '#90caf9',
                    caretColor: '#90caf9',
                  },
                  '& input:-webkit-autofill:focus': {
                    WebkitBoxShadow: '0 0 0 1000px #0c2d5a inset',
                    WebkitTextFillColor: '#90caf9',
                    caretColor: '#90caf9',
                  },
                },
                '& .MuiInputLabel-root': { 
                  color: 'rgba(255, 255, 255, 0.7)',
                  '&.Mui-focused': {
                    color: 'white',
                  },
                  transform: 'translate(48px, 16px) scale(1)',
                  '&.Mui-focused, &.MuiFormLabel-filled': {
                    transform: 'translate(48px, -9px) scale(0.75)',
                  },
                },
                '& .MuiOutlinedInput-input': { 
                  color: '#90caf9',
                  padding: '16px 14px 16px 48px',
                },
                '& .MuiInputAdornment-root': {
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none',
                  '& .MuiSvgIcon-root': {
                    color: '#90caf9',
                  },
                },
                mb: 3,
              }}
            />
            {error && (
              <Typography 
                color="error" 
                sx={{ 
                  mt: 1, 
                  mb: 2,
                  textAlign: 'center',
                  backgroundColor: 'rgba(211, 47, 47, 0.1)',
                  padding: '8px',
                  borderRadius: '8px',
                }}
              >
                {error}
              </Typography>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ 
                mt: 2, 
                mb: 3, 
                backgroundColor: '#ffffff', 
                color: '#0c2d5a',
                padding: '12px',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                },
              }}
            >
              Inloggen
            </Button>
            <Link to="/register" style={{ textDecoration: 'none' }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  textAlign: 'center', 
                  color: 'white',
                  opacity: 0.8,
                  transition: 'opacity 0.2s',
                  '&:hover': {
                    opacity: 1,
                  },
                }}
              >
                Nog geen account? Registreer hier
              </Typography>
            </Link>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login; 