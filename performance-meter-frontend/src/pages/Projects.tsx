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
  Alert,
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

const StyledTableCell = styled(TableCell)(({ width }) => ({
  color: '#ffffff',
  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  width: width,
  '@media (max-width: 600px)': {
    width: '100%',
  },
}));

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    backgroundColor: '#0c2d5a',
    color: 'white',
  },
  '& .MuiDialogTitle-root': {
    color: 'white',
  },
  '& .MuiDialogContent-root': {
    color: 'white',
  },
}));

const StyledTextField = styled(TextField)({
  '& label': {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  '& label.Mui-focused': {
    color: 'white',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: 'white',
  },
  '& .MuiOutlinedInput-root': {
    color: 'white',
    '& fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.5)',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'white',
    },
  },
  '& input[type=number]': {
    color: 'white',
  },
});

const StyledDatePicker = styled(DatePicker)({
  '& .MuiInputBase-root': {
    color: 'white',
    '& fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.5)',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'white',
    },
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(255, 255, 255, 0.7)',
    '&.Mui-focused': {
      color: 'white',
    },
  },
  '& .MuiIconButton-root': {
    color: 'white',
  },
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
  const [activeProjects, setActiveProjects] = useState<Project[]>([]);
  const [expiredProjects, setExpiredProjects] = useState<Project[]>([]);
  const [open, setOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    hourlyRate: '',
    startDate: null as Date | null,
    endDate: null as Date | null,
  });
  const [formError, setFormError] = useState<string | null>(null);

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

  useEffect(() => {
    // Split projects into active and expired
    const now = new Date();
    const active: Project[] = [];
    const expired: Project[] = [];

    projects.forEach(project => {
      const endDate = new Date(project.endDate);
      if (endDate > now) {
        active.push(project);
      } else {
        expired.push(project);
      }
    });

    // Sort expired projects by end date (newest first)
    expired.sort((a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime());

    setActiveProjects(active);
    setExpiredProjects(expired);
  }, [projects]);

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
    // Validate dates
    if (newProject.startDate && newProject.endDate) {
      if (newProject.endDate < newProject.startDate) {
        setFormError('De einddatum kan niet vroeger zijn dan de startdatum');
        return;
      }
    }

    setFormError(null);

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
      setFormError('Er is een fout opgetreden bij het opslaan van het project');
      if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
        console.error('Error headers:', error.response.headers);
      }
    }
  };

  const columnWidths = {
    name: '40%',
    hourlyRate: '20%',
    startDate: '20%',
    endDate: '20%',
  };

  const ProjectsTable: React.FC<{ projects: Project[]; title: string }> = ({ projects, title }) => (
    <StyledPaper sx={{ mt: 3 }}>
      <Typography variant="h6" color="white" sx={{ mb: 2 }}>
        {title}
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell width={columnWidths.name}>Naam</StyledTableCell>
              <StyledTableCell width={columnWidths.hourlyRate}>Uurtarief</StyledTableCell>
              <StyledTableCell width={columnWidths.startDate}>Startdatum</StyledTableCell>
              <StyledTableCell width={columnWidths.endDate}>Einddatum</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id}>
                <StyledTableCell width={columnWidths.name}>{project.name}</StyledTableCell>
                <StyledTableCell width={columnWidths.hourlyRate}>€{project.hourlyRate}</StyledTableCell>
                <StyledTableCell width={columnWidths.startDate}>
                  {new Date(project.startDate).toLocaleDateString('nl-NL')}
                </StyledTableCell>
                <StyledTableCell width={columnWidths.endDate}>
                  {new Date(project.endDate).toLocaleDateString('nl-NL')}
                </StyledTableCell>
              </TableRow>
            ))}
            {projects.length === 0 && (
              <TableRow>
                <StyledTableCell colSpan={4} align="center" sx={{ py: 3 }}>
                  Geen projecten gevonden
                </StyledTableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </StyledPaper>
  );

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

      <ProjectsTable projects={activeProjects} title="Actieve Projecten" />
      {expiredProjects.length > 0 && (
        <ProjectsTable projects={expiredProjects} title="Verlopen Projecten" />
      )}

      <StyledDialog 
        open={open} 
        onClose={() => {
          setOpen(false);
          setFormError(null);
        }}
        PaperProps={{
          sx: {
            minWidth: '400px',
          },
        }}
      >
        <DialogTitle>Nieuw Project</DialogTitle>
        <DialogContent>
          <Box mt={2}>
            {formError && (
              <Alert severity="error" sx={{ mb: 2, backgroundColor: 'rgba(211, 47, 47, 0.1)', color: '#ff8785' }}>
                {formError}
              </Alert>
            )}
            <StyledTextField
              fullWidth
              label="Projectnaam"
              value={newProject.name}
              onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
              margin="normal"
            />
            <StyledTextField
              fullWidth
              label="Uurtarief"
              type="number"
              value={newProject.hourlyRate}
              onChange={(e) => setNewProject({ ...newProject, hourlyRate: e.target.value })}
              margin="normal"
            />
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={nl}>
              <Box mt={2} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <StyledDatePicker
                  label="Startdatum"
                  value={newProject.startDate}
                  onChange={(date) => {
                    setNewProject({ 
                      ...newProject, 
                      startDate: date,
                      endDate: date && newProject.endDate && newProject.endDate < date ? null : newProject.endDate 
                    });
                    setFormError(null);
                  }}
                />
                <StyledDatePicker
                  label="Einddatum"
                  value={newProject.endDate}
                  minDate={newProject.startDate || undefined}
                  onChange={(date) => {
                    setNewProject({ ...newProject, endDate: date });
                    setFormError(null);
                  }}
                />
              </Box>
            </LocalizationProvider>
          </Box>
        </DialogContent>
        <DialogActions sx={{ padding: 2 }}>
          <Button 
            onClick={() => {
              setOpen(false);
              setFormError(null);
            }}
            sx={{ 
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            Annuleren
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            disabled={!newProject.name || !newProject.hourlyRate || !newProject.startDate || !newProject.endDate}
            sx={{ 
              bgcolor: 'white', 
              color: '#0c2d5a',
              '&:hover': {
                bgcolor: '#f5f5f5'
              },
              '&.Mui-disabled': {
                bgcolor: 'rgba(255, 255, 255, 0.3)',
                color: 'rgba(12, 45, 90, 0.7)'
              }
            }}
          >
            Opslaan
          </Button>
        </DialogActions>
      </StyledDialog>
    </Container>
  );
};

export default Projects; 