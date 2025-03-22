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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TablePagination,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { startOfWeek, endOfWeek, format } from 'date-fns';
import { nl } from 'date-fns/locale';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import WeekCalendar from '../components/WeekCalendar';

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

interface TimeEntryResponse {
  id: number;
  project_id: number;
  entry_date: string;
  hours: number;
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
  const [editingEntry, setEditingEntry] = useState<TimeEntry | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState<{
    projectId: string;
    date: string;
    hours: string;
  }>({
    projectId: '',
    date: '',
    hours: '',
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    if (isAuthenticated) {
      fetchProjects();
      fetchTimeEntries();
    }
  }, [isAuthenticated, user]);

  const fetchProjects = async () => {
    try {
      const response = await api.get<Project[]>('/api/projects');
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const fetchTimeEntries = async () => {
    try {
      const response = await api.get<TimeEntry[]>('/api/time-entries');
      setTimeEntries(response.data);
    } catch (error) {
      console.error('Error fetching time entries:', error);
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
      const response = await api.post<TimeEntryResponse>('/api/time-entries', {
        project_id: parseInt(newEntry.projectId),
        entry_date: newEntry.date?.toISOString().split('T')[0],
        hours: parseFloat(newEntry.hours),
      });

      const newTimeEntry: TimeEntry = {
        id: response.data.id,
        projectId: parseInt(newEntry.projectId),
        projectName: projects.find(p => p.id === parseInt(newEntry.projectId))?.name || '',
        date: newEntry.date?.toISOString().split('T')[0] || '',
        hours: parseFloat(newEntry.hours),
      };
      
      setTimeEntries([...timeEntries, newTimeEntry]);
      setNewEntry({
        projectId: '',
        weekNumber: '',
        date: null,
        hours: '',
      });
      
      setWeekDates(null);
    } catch (error) {
      console.error('Error creating time entry:', error);
    }
  };

  const handleEditClick = (entry: TimeEntry) => {
    setEditingEntry(entry);
    setEditForm({
      projectId: String(entry.projectId),
      date: entry.date,
      hours: String(entry.hours),
    });
    setEditDialogOpen(true);
  };

  const handleEditSubmit = async () => {
    if (!editingEntry) return;

    try {
      await api.put(`/api/time-entries/${editingEntry.id}`, {
        project_id: parseInt(editForm.projectId),
        entry_date: editForm.date,
        hours: parseFloat(editForm.hours),
      });

      const updatedEntry: TimeEntry = {
        ...editingEntry,
        projectId: parseInt(editForm.projectId),
        projectName: projects.find(p => p.id === parseInt(editForm.projectId))?.name || '',
        date: editForm.date,
        hours: parseFloat(editForm.hours),
      };

      setTimeEntries(timeEntries.map(entry => 
        entry.id === editingEntry.id ? updatedEntry : entry
      ));
      setEditDialogOpen(false);
      setEditingEntry(null);
    } catch (error) {
      console.error('Error updating time entry:', error);
    }
  };

  const handleDelete = async (entryId: number) => {
    if (!window.confirm('Weet je zeker dat je deze registratie wilt verwijderen?')) return;

    try {
      await api.delete(`/api/time-entries/${entryId}`);
      setTimeEntries(timeEntries.filter(entry => entry.id !== entryId));
    } catch (error) {
      console.error('Error deleting time entry:', error);
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedEntries = timeEntries.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

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
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'white',
                  },
                  '&:hover fieldset': {
                    borderColor: 'white',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'white',
                  },
                  '& .MuiSelect-select': {
                    color: 'white',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'white',
                  '&.Mui-focused': {
                    color: 'white',
                  },
                },
              }}
              SelectProps={{
                MenuProps: {
                  PaperProps: {
                    sx: {
                      bgcolor: '#0c2d5a',
                      color: 'white',
                      '& .MuiMenuItem-root': {
                        color: 'white',
                        '&:hover': {
                          bgcolor: '#1a3d6a',
                        },
                      },
                    }
                  }
                }
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
                <StyledTableCell>Acties</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedEntries.map((entry) => {
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
                    <StyledTableCell>
                      <IconButton 
                        size="small" 
                        onClick={() => handleEditClick(entry)}
                        sx={{ color: 'white' }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        onClick={() => handleDelete(entry.id)}
                        sx={{ color: 'white' }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </StyledTableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={timeEntries.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
            sx={{
              color: 'white',
              '& .MuiTablePagination-select': {
                color: 'white',
              },
              '& .MuiTablePagination-selectIcon': {
                color: 'white',
              },
              '& .MuiTablePagination-selectLabel': {
                color: 'white',
              },
              '& .MuiTablePagination-displayedRows': {
                color: 'white',
              },
            }}
          />
        </TableContainer>
      </StyledPaper>

      <Dialog 
        open={editDialogOpen} 
        onClose={() => setEditDialogOpen(false)}
        PaperProps={{
          sx: {
            bgcolor: '#1a1a1a',
            color: 'white',
            '& .MuiDialogTitle-root': {
              color: 'white',
              borderBottom: '1px solid #333',
            },
            '& .MuiDialogActions-root': {
              borderTop: '1px solid #333',
            },
            '& .MuiTextField-root': {
              '& .MuiOutlinedInput-root': {
                color: 'white',
                '& fieldset': {
                  borderColor: '#333',
                },
                '&:hover fieldset': {
                  borderColor: '#666',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#1976d2',
                },
              },
              '& .MuiInputLabel-root': {
                color: '#999',
                '&.Mui-focused': {
                  color: '#1976d2',
                },
              },
            },
          }
        }}
      >
        <DialogTitle>Urenregistratie Bewerken</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={2}>
            <TextField
              select
              label="Project"
              value={editForm.projectId}
              onChange={(e) => setEditForm({ ...editForm, projectId: e.target.value })}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'white',
                  },
                  '&:hover fieldset': {
                    borderColor: 'white',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'white',
                  },
                  '& .MuiSelect-select': {
                    color: 'white',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'white',
                  '&.Mui-focused': {
                    color: 'white',
                  },
                },
              }}
              SelectProps={{
                MenuProps: {
                  PaperProps: {
                    sx: {
                      bgcolor: '#0c2d5a',
                      color: 'white',
                      '& .MuiMenuItem-root': {
                        color: 'white',
                        '&:hover': {
                          bgcolor: '#1a3d6a',
                        },
                      },
                    }
                  }
                }
              }}
            >
              {projects.map((project) => (
                <MenuItem key={project.id} value={String(project.id)}>
                  {project.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Datum"
              type="date"
              value={editForm.date}
              onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
              fullWidth
              InputLabelProps={{ shrink: true }}
              InputProps={{
                sx: {
                  '& input': {
                    color: 'white',
                  },
                }
              }}
            />
            <TextField
              label="Aantal uren"
              type="number"
              value={editForm.hours}
              onChange={(e) => setEditForm({ ...editForm, hours: e.target.value })}
              fullWidth
              InputProps={{
                sx: {
                  '& input': {
                    color: 'white',
                  },
                }
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setEditDialogOpen(false)}
            sx={{ color: '#999' }}
          >
            Annuleren
          </Button>
          <Button 
            onClick={handleEditSubmit} 
            variant="contained"
            sx={{
              bgcolor: '#1976d2',
              '&:hover': {
                bgcolor: '#1565c0',
              },
            }}
          >
            Opslaan
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TimeRegistration; 