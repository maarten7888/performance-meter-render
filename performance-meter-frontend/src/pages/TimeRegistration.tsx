import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  TextField,
  MenuItem,
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
}

interface TimeEntry {
  id: number;
  projectId: number;
  projectName: string;
  date: string;
  hours: number;
}

const TimeRegistration = () => {
  const { user, isAuthenticated } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [newEntry, setNewEntry] = useState({
    projectId: '',
    date: null as Date | null,
    hours: '',
  });

  useEffect(() => {
    // Debug logging voor auth state
    console.log('=== Auth State in TimeRegistration ===');
    console.log('Is authenticated:', isAuthenticated);
    console.log('Current user:', user);
    console.log('Token in localStorage:', localStorage.getItem('token'));
    console.log('API default headers:', api.defaults.headers);
    console.log('================');

    if (isAuthenticated) {
      fetchProjects();
      fetchTimeEntries();
    }
  }, [isAuthenticated, user]);

  const fetchProjects = async () => {
    try {
      console.log('=== Fetching Projects ===');
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

  const fetchTimeEntries = async () => {
    try {
      console.log('=== Fetching Time Entries ===');
      const response = await api.get<TimeEntry[]>('/api/time-entries');
      console.log('Time entries response:', response.data);
      setTimeEntries(response.data);
    } catch (error) {
      console.error('Error fetching time entries:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
        console.error('Error headers:', error.response.headers);
      }
    }
  };

  const handleSubmit = async () => {
    try {
      console.log('=== Creating Time Entry ===');
      console.log('Entry data:', {
        project_id: parseInt(newEntry.projectId),
        entry_date: newEntry.date?.toISOString().split('T')[0],
        hours: parseFloat(newEntry.hours),
      });

      const response = await api.post('/api/time-entries', {
        project_id: parseInt(newEntry.projectId),
        entry_date: newEntry.date?.toISOString().split('T')[0],
        hours: parseFloat(newEntry.hours),
      });

      console.log('Create response:', response.data);
      
      setNewEntry({
        projectId: '',
        date: null,
        hours: '',
      });
      
      fetchTimeEntries();
    } catch (error) {
      console.error('Error creating time entry:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
        console.error('Error headers:', error.response.headers);
      }
    }
  };

  return (
    <Container>
      <Box mt={4}>
        <Typography variant="h4" color="white" gutterBottom>
          Urenregistratie
        </Typography>
      </Box>

      <StyledPaper>
        <Box mb={4}>
          <Typography variant="h6" color="white" gutterBottom>
            Nieuwe Registratie
          </Typography>
          <Box display="flex" gap={2} alignItems="center">
            <TextField
              select
              label="Project"
              value={newEntry.projectId}
              onChange={(e) => setNewEntry({ ...newEntry, projectId: e.target.value })}
              sx={{
                minWidth: 200,
                '& .MuiInputBase-input': { color: 'white' },
                '& .MuiInputLabel-root': { color: 'white' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'white' },
                  '&:hover fieldset': { borderColor: 'white' },
                },
              }}
            >
              {projects.map((project) => (
                <MenuItem key={project.id} value={project.id}>
                  {project.name}
                </MenuItem>
              ))}
            </TextField>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={nl}>
              <DatePicker
                label="Datum"
                value={newEntry.date}
                onChange={(date) => setNewEntry({ ...newEntry, date })}
              />
            </LocalizationProvider>
            <TextField
              label="Aantal uren"
              type="number"
              value={newEntry.hours}
              onChange={(e) => setNewEntry({ ...newEntry, hours: e.target.value })}
              sx={{
                width: 120,
                '& .MuiInputBase-input': { color: 'white' },
                '& .MuiInputLabel-root': { color: 'white' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'white' },
                  '&:hover fieldset': { borderColor: 'white' },
                },
              }}
            />
            <Button
              variant="contained"
              onClick={handleSubmit}
              sx={{ bgcolor: 'white', color: '#0c2d5a', '&:hover': { bgcolor: '#f5f5f5' } }}
            >
              Toevoegen
            </Button>
          </Box>
        </Box>

        <Typography variant="h6" color="white" gutterBottom>
          Recente Registraties
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell>Project</StyledTableCell>
                <StyledTableCell>Datum</StyledTableCell>
                <StyledTableCell>Uren</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {timeEntries.map((entry) => (
                <TableRow key={entry.id}>
                  <StyledTableCell>{entry.projectName}</StyledTableCell>
                  <StyledTableCell>
                    {new Date(entry.date).toLocaleDateString('nl-NL')}
                  </StyledTableCell>
                  <StyledTableCell>{entry.hours}</StyledTableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </StyledPaper>
    </Container>
  );
};

export default TimeRegistration; 