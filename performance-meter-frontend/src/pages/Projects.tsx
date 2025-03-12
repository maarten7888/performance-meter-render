import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { nl } from 'date-fns/locale';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const StyledPaper = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(4),
  padding: theme.spacing(3),
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
}));

const StyledTableCell = styled(TableCell)({
  color: '#ffffff',
  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
});

interface Project {
  id: number;
  name: string;
  hourlyRate: number;
  startDate: string;
  endDate: string;
}

const Projects = () => {
  const { user, isAuthenticated } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [open, setOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    hourlyRate: '',
    startDate: null as Date | null,
    endDate: null as Date | null,
  });

  useEffect(() => {
    // Debug logging voor auth state
    console.log('=== Auth State ===');
    console.log('Is authenticated:', isAuthenticated);
    console.log('Current user:', user);
    console.log('Token in localStorage:', localStorage.getItem('token'));
    console.log('API default headers:', api.defaults.headers);
    console.log('================');

    if (isAuthenticated) {
      fetchProjects();
    }
  }, [isAuthenticated, user]);

  const fetchProjects = async () => {
    try {
      // Debug logging voor request
      console.log('=== Fetching Projects ===');
      console.log('Making request with headers:', {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      });

      const response = await api.get<Project[]>('/api/projects');
      console.log('Projects response:', response.data);
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
        console.error('Error headers:', error.response.headers);
      }
    }
  };

  const handleSubmit = async () => {
    try {
      // Debug logging voor submit
      console.log('=== Creating Project ===');
      console.log('Project data:', {
        name: newProject.name,
        hourlyRate: parseFloat(newProject.hourlyRate),
        startDate: newProject.startDate?.toISOString(),
        endDate: newProject.endDate?.toISOString(),
      });
      console.log('Using headers:', {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      });

      const response = await api.post('/api/projects', {
        name: newProject.name,
        hourlyRate: parseFloat(newProject.hourlyRate),
        startDate: newProject.startDate?.toISOString(),
        endDate: newProject.endDate?.toISOString(),
      });

      console.log('Create response:', response.data);
      
      setOpen(false);
      setNewProject({
        name: '',
        hourlyRate: '',
        startDate: null,
        endDate: null,
      });
      fetchProjects();
    } catch (error) {
      console.error('Error creating project:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
        console.error('Error headers:', error.response.headers);
      }
    }
  };

  return (
    <Container>
      <Box mt={4} display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4" color="white">
          Projecten
        </Typography>
        <Button
          variant="contained"
          sx={{ bgcolor: 'white', color: '#0c2d5a', '&:hover': { bgcolor: '#f5f5f5' } }}
          onClick={() => setOpen(true)}
        >
          Nieuw Project
        </Button>
      </Box>

      <StyledPaper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell>Naam</StyledTableCell>
                <StyledTableCell>Uurtarief</StyledTableCell>
                <StyledTableCell>Startdatum</StyledTableCell>
                <StyledTableCell>Einddatum</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id}>
                  <StyledTableCell>{project.name}</StyledTableCell>
                  <StyledTableCell>€{project.hourlyRate}</StyledTableCell>
                  <StyledTableCell>
                    {new Date(project.startDate).toLocaleDateString('nl-NL')}
                  </StyledTableCell>
                  <StyledTableCell>
                    {new Date(project.endDate).toLocaleDateString('nl-NL')}
                  </StyledTableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </StyledPaper>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Nieuw Project</DialogTitle>
        <DialogContent>
          <Box mt={2}>
            <TextField
              fullWidth
              label="Projectnaam"
              value={newProject.name}
              onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Uurtarief"
              type="number"
              value={newProject.hourlyRate}
              onChange={(e) => setNewProject({ ...newProject, hourlyRate: e.target.value })}
              margin="normal"
            />
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={nl}>
              <Box mt={2}>
                <DatePicker
                  label="Startdatum"
                  value={newProject.startDate}
                  onChange={(date) => setNewProject({ ...newProject, startDate: date })}
                />
              </Box>
              <Box mt={2}>
                <DatePicker
                  label="Einddatum"
                  value={newProject.endDate}
                  onChange={(date) => setNewProject({ ...newProject, endDate: date })}
                />
              </Box>
            </LocalizationProvider>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Annuleren</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Opslaan
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Projects; 