import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  AppBar,
  Toolbar,
  Grid,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

interface Project {
  id: number;
  name: string;
  hourlyRate: number;
  startDate: string;
  endDate: string;
}

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [name, setName] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    fetchProjects();
  }, []);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'https://performance-meter-render.onrender.com/projects',
        {
          name,
          hourlyRate: Number(hourlyRate),
          startDate,
          endDate,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setName('');
      setHourlyRate('');
      setStartDate('');
      setEndDate('');
      fetchProjects();
    } catch (err) {
      setError('Er is een fout opgetreden bij het aanmaken van het project.');
    }
  };

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
          <Button color="inherit" onClick={() => navigate('/time-registration')}>
            Uren Registreren
          </Button>
          <Button color="inherit" onClick={() => { logout(); navigate('/'); }}>
            Uitloggen
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              }}
            >
              <Typography component="h2" variant="h6" color="white" gutterBottom>
                Nieuw Project
              </Typography>
              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="name"
                  label="Projectnaam"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: 'white' },
                      '&:hover fieldset': { borderColor: 'white' },
                    },
                    '& .MuiInputLabel-root': { color: 'white' },
                    '& .MuiOutlinedInput-input': { color: 'white' },
                  }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="hourlyRate"
                  label="Uurtarief"
                  type="number"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: 'white' },
                      '&:hover fieldset': { borderColor: 'white' },
                    },
                    '& .MuiInputLabel-root': { color: 'white' },
                    '& .MuiOutlinedInput-input': { color: 'white' },
                  }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="startDate"
                  label="Startdatum"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: 'white' },
                      '&:hover fieldset': { borderColor: 'white' },
                    },
                    '& .MuiInputLabel-root': { color: 'white' },
                    '& .MuiOutlinedInput-input': { color: 'white' },
                  }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="endDate"
                  label="Einddatum"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
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
                  Project Aanmaken
                </Button>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              }}
            >
              <Typography component="h2" variant="h6" color="white" gutterBottom>
                Projecten
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ color: 'white' }}>Naam</TableCell>
                      <TableCell sx={{ color: 'white' }}>Uurtarief</TableCell>
                      <TableCell sx={{ color: 'white' }}>Startdatum</TableCell>
                      <TableCell sx={{ color: 'white' }}>Einddatum</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {projects.map((project) => (
                      <TableRow key={project.id}>
                        <TableCell sx={{ color: 'white' }}>{project.name}</TableCell>
                        <TableCell sx={{ color: 'white' }}>€{project.hourlyRate}</TableCell>
                        <TableCell sx={{ color: 'white' }}>
                          {new Date(project.startDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell sx={{ color: 'white' }}>
                          {new Date(project.endDate).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Projects; 