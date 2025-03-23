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
  useMediaQuery,
  useTheme,
  Card,
  CardContent,
  CardActions,
  Grid,
  Fab,
  Collapse,
  IconButton,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { nl } from 'date-fns/locale';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
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

interface NewProject {
  name: string;
  hourlyRate: number;
  startDate: Date | null;
  endDate: Date | null;
}

const Projects = () => {
  const { user, isAuthenticated } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProjects, setActiveProjects] = useState<Project[]>([]);
  const [expiredProjects, setExpiredProjects] = useState<Project[]>([]);
  const [open, setOpen] = useState(false);
  const [newProject, setNewProject] = useState<NewProject>({
    name: '',
    hourlyRate: 0,
    startDate: null,
    endDate: null,
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

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
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Er is een fout opgetreden bij het ophalen van de projecten.');
    }
  };

  const handleSubmit = async () => {
    try {
      if (editingProject) {
        // Update bestaand project
        await api.put(`/api/projects/${editingProject.id}`, {
          name: newProject.name,
          hourly_rate: newProject.hourlyRate,
          start_date: newProject.startDate?.toISOString().split('T')[0],
          end_date: newProject.endDate?.toISOString().split('T')[0],
        });

        // Update de projecten lijst met het bijgewerkte project
        setProjects(projects.map(project => 
          project.id === editingProject.id 
            ? {
                ...project,
                name: newProject.name,
                hourlyRate: newProject.hourlyRate,
                startDate: newProject.startDate?.toISOString().split('T')[0] || '',
                endDate: newProject.endDate?.toISOString().split('T')[0] || '',
              }
            : project
        ));

        setSuccess('Project succesvol bijgewerkt');
      } else {
        // Maak nieuw project aan
        const response = await api.post<Project>('/api/projects', {
          name: newProject.name,
          hourlyRate: newProject.hourlyRate,
          startDate: newProject.startDate?.toISOString().split('T')[0],
          endDate: newProject.endDate?.toISOString().split('T')[0],
        });

        const newProjectData: Project = {
          id: response.data.id,
          name: newProject.name,
          hourlyRate: newProject.hourlyRate,
          startDate: newProject.startDate?.toISOString().split('T')[0] || '',
          endDate: newProject.endDate?.toISOString().split('T')[0] || '',
        };

        setProjects([...projects, newProjectData]);
        setSuccess('Project succesvol aangemaakt');
      }

      // Reset formulier en sluit dialoog
      setNewProject({
        name: '',
        hourlyRate: 0,
        startDate: null,
        endDate: null,
      });
      setOpen(false);
      setEditingProject(null);
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Error saving project:', error);
      setError('Er is een fout opgetreden bij het opslaan van het project');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleEditClick = (project: Project) => {
    setEditingProject(project);
    setNewProject({
      name: project.name,
      hourlyRate: project.hourlyRate,
      startDate: new Date(project.startDate),
      endDate: new Date(project.endDate),
    });
    setOpen(true);
  };

  const handleDelete = async (projectId: number) => {
    console.log('=== Delete Project Attempt ===');
    console.log('Project ID:', projectId);
    console.log('Current token:', localStorage.getItem('token'));
    console.log('API headers:', api.defaults.headers);
    
    if (!window.confirm('Weet je zeker dat je dit project wilt verwijderen?')) {
      console.log('Delete cancelled by user');
      return;
    }

    try {
      console.log('Sending delete request to:', `/api/projects/${projectId}`);
      const response = await api.delete(`/api/projects/${projectId}`);
      console.log('Delete response:', response);
      
      setProjects(projects.filter(project => project.id !== projectId));
      setSuccess('Project succesvol verwijderd');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error: any) {
      console.error('Error deleting project:', error);
      console.error('Error response:', error.response);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      
      if (error.response?.status === 400) {
        setError('Dit project kan niet worden verwijderd omdat er tijdregistraties aan gekoppeld zijn');
      } else {
        setError('Er is een fout opgetreden bij het verwijderen van het project');
      }
      setTimeout(() => setError(null), 3000);
    }
  };

  const columnWidths = {
    name: '40%',
    hourlyRate: '20%',
    startDate: '20%',
    endDate: '20%',
  };

  const ProjectsTable = ({ projects, title }: { projects: Project[], title: string }) => (
    <Box mb={4}>
      <Typography variant="h6" color="white" gutterBottom>
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
              <StyledTableCell>Acties</StyledTableCell>
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
                <StyledTableCell>
                  <IconButton 
                    size="small" 
                    onClick={() => handleEditClick(project)}
                    sx={{ color: 'white' }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    onClick={() => handleDelete(project.id)}
                    sx={{ color: 'white' }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </StyledTableCell>
              </TableRow>
            ))}
            {projects.length === 0 && (
              <TableRow>
                <StyledTableCell colSpan={5} align="center" sx={{ py: 3 }}>
                  Geen projecten gevonden
                </StyledTableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  const renderMobileView = () => (
    <Box>
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Fab
          color="primary"
          onClick={() => setShowForm(!showForm)}
          sx={{ bgcolor: 'white', color: '#0c2d5a', '&:hover': { bgcolor: '#f5f5f5' } }}
        >
          <AddIcon />
        </Fab>
      </Box>

      <Collapse in={showForm}>
        <StyledPaper sx={{ mb: 3 }}>
          <Typography variant="h6" color="white" gutterBottom>
            Nieuw Project
          </Typography>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              label="Naam"
              value={newProject.name}
              onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'white' },
                  '&:hover fieldset': { borderColor: 'white' },
                  '&.Mui-focused fieldset': { borderColor: 'white' },
                  '& input': { color: 'white' },
                },
                '& .MuiInputLabel-root': {
                  color: 'white',
                  '&.Mui-focused': { color: 'white' },
                },
              }}
            />
            <TextField
              label="Uurtarief"
              type="number"
              value={newProject.hourlyRate}
              onChange={(e) => setNewProject({ ...newProject, hourlyRate: Number(e.target.value) })}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'white' },
                  '&:hover fieldset': { borderColor: 'white' },
                  '&.Mui-focused fieldset': { borderColor: 'white' },
                  '& input': { color: 'white' },
                },
                '& .MuiInputLabel-root': {
                  color: 'white',
                  '&.Mui-focused': { color: 'white' },
                },
              }}
            />
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={nl}>
              <DatePicker
                label="Startdatum"
                value={newProject.startDate}
                onChange={(date) => setNewProject({ ...newProject, startDate: date })}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    sx: {
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: 'white' },
                        '&:hover fieldset': { borderColor: 'white' },
                        '&.Mui-focused fieldset': { borderColor: 'white' },
                        '& input': { color: 'white' },
                      },
                      '& .MuiInputLabel-root': {
                        color: 'white',
                        '&.Mui-focused': { color: 'white' },
                      },
                    },
                  },
                }}
              />
              <DatePicker
                label="Einddatum"
                value={newProject.endDate}
                onChange={(date) => setNewProject({ ...newProject, endDate: date })}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    sx: {
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: 'white' },
                        '&:hover fieldset': { borderColor: 'white' },
                        '&.Mui-focused fieldset': { borderColor: 'white' },
                        '& input': { color: 'white' },
                      },
                      '& .MuiInputLabel-root': {
                        color: 'white',
                        '&.Mui-focused': { color: 'white' },
                      },
                    },
                  },
                }}
              />
            </LocalizationProvider>
            <Button
              variant="contained"
              onClick={handleSubmit}
              fullWidth
              sx={{ bgcolor: 'white', color: '#0c2d5a', '&:hover': { bgcolor: '#f5f5f5' } }}
            >
              Toevoegen
            </Button>
          </Box>
        </StyledPaper>
      </Collapse>

      <Typography variant="h6" color="white" gutterBottom sx={{ mt: 4 }}>
        Actieve Projecten
      </Typography>
      <Box display="flex" flexDirection="column" gap={2}>
        {activeProjects.map((project) => (
          <Card key={project.id} sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }}>
            <CardContent>
              <Typography variant="h6" color="white" gutterBottom>
                {project.name}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
                    Uurtarief
                  </Typography>
                  <Typography variant="body1" color="white">
                    €{project.hourlyRate}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
                    Startdatum
                  </Typography>
                  <Typography variant="body1" color="white">
                    {new Date(project.startDate).toLocaleDateString('nl-NL')}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
                    Einddatum
                  </Typography>
                  <Typography variant="body1" color="white">
                    {new Date(project.endDate).toLocaleDateString('nl-NL')}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
            <CardActions>
              <IconButton 
                size="small" 
                onClick={() => handleEditClick(project)}
                sx={{ color: 'white' }}
              >
                <EditIcon />
              </IconButton>
              <IconButton 
                size="small" 
                onClick={() => handleDelete(project.id)}
                sx={{ color: 'white' }}
              >
                <DeleteIcon />
              </IconButton>
            </CardActions>
          </Card>
        ))}
      </Box>

      {expiredProjects.length > 0 && (
        <>
          <Typography variant="h6" color="white" gutterBottom sx={{ mt: 4 }}>
            Verlopen Projecten
          </Typography>
          <Box display="flex" flexDirection="column" gap={2}>
            {expiredProjects.map((project) => (
              <Card key={project.id} sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }}>
                <CardContent>
                  <Typography variant="h6" color="white" gutterBottom>
                    {project.name}
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
                        Uurtarief
                      </Typography>
                      <Typography variant="body1" color="white">
                        €{project.hourlyRate}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
                        Startdatum
                      </Typography>
                      <Typography variant="body1" color="white">
                        {new Date(project.startDate).toLocaleDateString('nl-NL')}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
                        Einddatum
                      </Typography>
                      <Typography variant="body1" color="white">
                        {new Date(project.endDate).toLocaleDateString('nl-NL')}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
                <CardActions>
                  <IconButton 
                    size="small" 
                    onClick={() => handleEditClick(project)}
                    sx={{ color: 'white' }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    onClick={() => handleDelete(project.id)}
                    sx={{ color: 'white' }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            ))}
          </Box>
        </>
      )}
    </Box>
  );

  const renderDesktopView = () => (
    <StyledPaper>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h6" color="white">
          Projecten
        </Typography>
        <Button
          variant="contained"
          onClick={() => setOpen(true)}
          sx={{ bgcolor: 'white', color: '#0c2d5a', '&:hover': { bgcolor: '#f5f5f5' } }}
        >
          Nieuw Project
        </Button>
      </Box>

      <ProjectsTable projects={activeProjects} title="Actieve Projecten" />
      {expiredProjects.length > 0 && (
        <ProjectsTable projects={expiredProjects} title="Verlopen Projecten" />
      )}
    </StyledPaper>
  );

  return (
    <Container>
      <Box mt={4}>
        <Typography variant="h4" color="white" gutterBottom>
          Projecten
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}
      </Box>

      {isMobile ? renderMobileView() : renderDesktopView()}

      <StyledDialog open={open} onClose={() => {
        setOpen(false);
        setFormError(null);
      }}>
        <DialogTitle>Nieuw Project</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={2}>
            {formError && (
              <Alert severity="error" sx={{ mb: 2, backgroundColor: 'rgba(211, 47, 47, 0.1)', color: '#ff8785' }}>
                {formError}
              </Alert>
            )}
            <TextField
              label="Naam"
              value={newProject.name}
              onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'white' },
                  '&:hover fieldset': { borderColor: 'white' },
                  '&.Mui-focused fieldset': { borderColor: 'white' },
                  '& input': { color: 'white' },
                },
                '& .MuiInputLabel-root': {
                  color: 'white',
                  '&.Mui-focused': { color: 'white' },
                },
              }}
            />
            <TextField
              label="Uurtarief"
              type="number"
              value={newProject.hourlyRate}
              onChange={(e) => setNewProject({ ...newProject, hourlyRate: Number(e.target.value) })}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'white' },
                  '&:hover fieldset': { borderColor: 'white' },
                  '&.Mui-focused fieldset': { borderColor: 'white' },
                  '& input': { color: 'white' },
                },
                '& .MuiInputLabel-root': {
                  color: 'white',
                  '&.Mui-focused': { color: 'white' },
                },
              }}
            />
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={nl}>
              <DatePicker
                label="Startdatum"
                value={newProject.startDate}
                onChange={(date) => setNewProject({ ...newProject, startDate: date })}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    sx: {
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: 'white' },
                        '&:hover fieldset': { borderColor: 'white' },
                        '&.Mui-focused fieldset': { borderColor: 'white' },
                        '& input': { color: 'white' },
                      },
                      '& .MuiInputLabel-root': {
                        color: 'white',
                        '&.Mui-focused': { color: 'white' },
                      },
                    },
                  },
                }}
              />
              <DatePicker
                label="Einddatum"
                value={newProject.endDate}
                onChange={(date) => setNewProject({ ...newProject, endDate: date })}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    sx: {
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: 'white' },
                        '&:hover fieldset': { borderColor: 'white' },
                        '&.Mui-focused fieldset': { borderColor: 'white' },
                        '& input': { color: 'white' },
                      },
                      '& .MuiInputLabel-root': {
                        color: 'white',
                        '&.Mui-focused': { color: 'white' },
                      },
                    },
                  },
                }}
              />
            </LocalizationProvider>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => {
              setOpen(false);
              setFormError(null);
            }}
            sx={{ color: '#999' }}
          >
            Annuleren
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            sx={{
              bgcolor: '#1976d2',
              '&:hover': { bgcolor: '#1565c0' },
            }}
          >
            Toevoegen
          </Button>
        </DialogActions>
      </StyledDialog>
    </Container>
  );
};

export default Projects; 