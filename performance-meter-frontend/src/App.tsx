import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import TimeRegistration from './pages/TimeRegistration';
import Projects from './pages/Projects';
import Dashboard from './pages/Dashboard';
import Layout from './components/Layout';
import UserManagement from './pages/UserManagement';
import ConsultantProfilePage from './pages/ConsultantProfile';

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

const PrivateRoute: React.FC<{ children: React.ReactNode; requireAdmin?: boolean }> = ({ children, requireAdmin }) => {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={
              <PrivateRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </PrivateRoute>
            } />
            <Route path="/time-registration" element={
              <PrivateRoute>
                <Layout>
                  <TimeRegistration />
                </Layout>
              </PrivateRoute>
            } />
            <Route path="/projects" element={
              <PrivateRoute>
                <Layout>
                  <Projects />
                </Layout>
              </PrivateRoute>
            } />
            <Route path="/consultant-profile" element={
              <PrivateRoute>
                <Layout>
                  <ConsultantProfilePage />
                </Layout>
              </PrivateRoute>
            } />
            <Route path="/management" element={
              <PrivateRoute>
                <Layout>
                  <UserManagement />
                </Layout>
              </PrivateRoute>
            } />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
