import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  MenuItem,
  Grid,
  AppBar,
  Toolbar,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

interface Project {
  id: number;
  name: string;
  hourlyRate: number;
}

const TimeRegistration: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [hours, setHours] = useState('');
  const [month, setMonth] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          'https://performance-meter-render.onrender.com/projects',
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setProjects(response.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'https://performance-meter-render.onrender.com/hours',
        {
          projectId: selectedProject,
          hours: Number(hours),
          month: Number(month),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      navigate('/dashboard');
    } catch (err) {
      setError('Er is een fout opgetreden bij het registreren van de uren.');
    }
  };

  const months = [
    { value: 1, label: 'Januari' },
    { value: 2, label: 'Februari' },
    { value: 3, label: 'Maart' },
    { value: 4, label: 'April' },
    { value: 5, label: 'Mei' },
    { value: 6, label: 'Juni' },
    { value: 7, label: 'Juli' },
    { value: 8, label: 'Augustus' },
    { value: 9, label: 'September' },
    { value: 10, label: 'Oktober' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: '#0c2d5a' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Performance Meter
          </Typography>
          <Button color="inherit" onClick={() => navigate('/dashboard')}>
            Dashboard
          </Button>
          <Button color="inherit" onClick={() => navigate('/projects')}>
            Projecten
          </Button>
          <Button color="inherit" onClick={() => { logout(); navigate('/'); }}>
            Uitloggen
          </Button>
        </Toolbar>
      </AppBar>
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
            elevation={3}
            sx={{
              padding: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              width: '100%',
            }}
          >
            <Typography component="h1" variant="h5" color="white">
              Uren Registreren
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
              <TextField
                margin="normal"
                required
                fullWidth
                select
                id="project"
                label="Project"
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: 'white' },
                    '&:hover fieldset': { borderColor: 'white' },
                  },
                  '& .MuiInputLabel-root': { color: 'white' },
                  '& .MuiOutlinedInput-input': { color: 'white' },
                  '& .MuiSelect-icon': { color: 'white' },
                }}
              >
                {projects.map((project) => (
                  <MenuItem key={project.id} value={project.id}>
                    {project.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                margin="normal"
                required
                fullWidth
                select
                id="month"
                label="Maand"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: 'white' },
                    '&:hover fieldset': { borderColor: 'white' },
                  },
                  '& .MuiInputLabel-root': { color: 'white' },
                  '& .MuiOutlinedInput-input': { color: 'white' },
                  '& .MuiSelect-icon': { color: 'white' },
                }}
              >
                {months.map((month) => (
                  <MenuItem key={month.value} value={month.value}>
                    {month.label}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                margin="normal"
                required
                fullWidth
                id="hours"
                label="Aantal uren"
                type="number"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: 'white' },
                    '&:hover fieldset': { borderColor: 'white' },
                  },
                  '& .MuiInputLabel-root': { color: 'white' },
                  '& .MuiOutlinedInput-input': { color: 'white' },
                }}
              />
              {error && (
                <Typography color="error" sx={{ mt: 1 }}>
                  {error}
                </Typography>
              )}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, backgroundColor: '#ffffff', color: '#0c2d5a' }}
              >
                Registreren
              </Button>
            </Box>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default TimeRegistration; 