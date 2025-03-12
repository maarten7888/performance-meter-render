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
import axios from 'axios';
import { nl } from 'date-fns/locale';

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
  const [projects, setProjects] = useState<Project[]>([]);
  const [open, setOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    hourlyRate: '',
    startDate: null as Date | null,
    endDate: null as Date | null,
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get<Project[]>('https://performance-meter-render-6i1b.onrender.com/api/projects', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'https://performance-meter-render-6i1b.onrender.com/api/projects',
        {
          name: newProject.name,
          hourlyRate: parseFloat(newProject.hourlyRate),
          startDate: newProject.startDate?.toISOString(),
          endDate: newProject.endDate?.toISOString(),
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
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