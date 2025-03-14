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
import { startOfWeek, endOfWeek, format } from 'date-fns';
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

interface NewTimeEntry {
  projectId: string;
  weekNumber: string;
  date: Date | null;
  hours: string;
}

const TimeRegistration = () => {
  const { user, isAuthenticated } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [newEntry, setNewEntry] = useState<NewTimeEntry>({
    projectId: '',
    weekNumber: '',
    date: null,
    hours: '',
  });
  const [weekDates, setWeekDates] = useState<{ start: string; end: string } | null>(null);

  useEffect(() => {
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

  const handleWeekChange = (weekNumber: string) => {
    const currentYear = new Date().getFullYear();
    const firstDayOfYear = new Date(currentYear, 0, 1);
    const daysToAdd = (parseInt(weekNumber) - 1) * 7;
    const date = new Date(firstDayOfYear);
    date.setDate(date.getDate() + daysToAdd);
    
    const startDate = startOfWeek(date, { locale: nl });
    const endDate = endOfWeek(date, { locale: nl });
    
    setWeekDates({
      start: format(startDate, 'd MMMM yyyy', { locale: nl }),
      end: format(endDate, 'd MMMM yyyy', { locale: nl })
    });
    
    setNewEntry({
      ...newEntry,
      weekNumber,
      date: startDate
    });
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
        weekNumber: '',
        date: null,
        hours: '',
      });
      
      setWeekDates(null);
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
                <MenuItem key={project.id} value={String(project.id)}>
                  {project.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Weeknummer"
              type="number"
              value={newEntry.weekNumber}
              onChange={(e) => handleWeekChange(e.target.value)}
              inputProps={{ min: 1, max: 53 }}
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
            {weekDates && (
              <Typography variant="body2" color="white" sx={{ minWidth: 200 }}>
                {weekDates.start} - {weekDates.end}
              </Typography>
            )}
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
                <StyledTableCell>Weeknummer</StyledTableCell>
                <StyledTableCell>Datum</StyledTableCell>
                <StyledTableCell>Uren</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {timeEntries.map((entry) => {
                const entryDate = new Date(entry.date);
                const weekNumber = Math.ceil((entryDate.getTime() - new Date(entryDate.getFullYear(), 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000));
                return (
                  <TableRow key={entry.id}>
                    <StyledTableCell>{entry.projectName}</StyledTableCell>
                    <StyledTableCell>{weekNumber}</StyledTableCell>
                    <StyledTableCell>
                      {entryDate.toLocaleDateString('nl-NL')}
                    </StyledTableCell>
                    <StyledTableCell>{entry.hours}</StyledTableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </StyledPaper>
    </Container>
  );
};

export default TimeRegistration; 