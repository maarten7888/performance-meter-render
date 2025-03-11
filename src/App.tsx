import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { AuthProvider } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';

// Import Montserrat font
import '@fontsource/montserrat';

// Create theme with Montserrat font
const theme = createTheme({
  typography: {
    fontFamily: 'Montserrat, Arial',
  },
  palette: {
    primary: {
      main: '#0c2d5a',
    },
    background: {
      default: '#0c2d5a',
    },
    text: {
      primary: '#ffffff',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#0c2d5a',
          color: '#ffffff',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App; 