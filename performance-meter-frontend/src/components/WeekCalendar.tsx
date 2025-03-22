import React from 'react';
import {
  Paper,
  Grid,
  Typography,
  Box,
  IconButton,
  Button,
  TextField,
  MenuItem,
  Alert,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { startOfWeek, endOfWeek, eachDayOfInterval, format, isSameDay } from 'date-fns';
import { nl } from 'date-fns/locale';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  marginBottom: theme.spacing(2),
}));

const DayCell = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  minHeight: '150px',
  display: 'flex',
  flexDirection: 'column',
  border: '1px solid rgba(255, 255, 255, 0.1)',
}));

const DayHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(1),
  color: '#ffffff',
}));

const StyledTextField = styled(TextField)({
  '& .MuiInputBase-input': { color: '#ffffff' },
  '& .MuiInputLabel-root': { color: '#ffffff' },
  '& .MuiOutlinedInput-root': {
    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
  },
});

const StyledButton = styled(Button)({
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  color: '#ffffff',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
});

const StyledContainedButton = styled(Button)({
  backgroundColor: '#ffffff',
  color: '#0c2d5a',
  '&:hover': {
    backgroundColor: '#f5f5f5',
  },
});

interface Project {
  id: number;
  name: string;
}

interface TimeEntry {
  id: number;
  projectId: number;
  projectName: string;
  date: string;
  hours: number;
}

interface WeekCalendarProps {
  projects: Project[];
  timeEntries: TimeEntry[];
  onAddTimeEntry: (date: Date, projectId: number, hours: number) => void;
}

const WeekCalendar: React.FC<WeekCalendarProps> = ({ projects, timeEntries, onAddTimeEntry }) => {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null);
  const [newEntry, setNewEntry] = React.useState({
    projectId: '',
    hours: '',
  });
  const [error, setError] = React.useState<string | null>(null);

  const weekStart = startOfWeek(currentDate, { locale: nl });
  const weekEnd = endOfWeek(currentDate, { locale: nl });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const handlePrevWeek = () => {
    setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() - 7)));
  };

  const handleNextWeek = () => {
    setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() + 7)));
  };

  const handleAddTimeEntry = (date: Date) => {
    setSelectedDate(date);
    setError(null);
  };

  const calculateTotalHoursForDate = (date: Date) => {
    return getTimeEntriesForDate(date).reduce((total, entry) => total + entry.hours, 0);
  };

  const handleSubmitTimeEntry = () => {
    if (selectedDate && newEntry.projectId && newEntry.hours) {
      const hours = parseFloat(newEntry.hours);
      const currentTotalHours = calculateTotalHoursForDate(selectedDate);
      const newTotalHours = currentTotalHours + hours;

      if (newTotalHours > 24) {
        setError(`Je kunt niet meer dan 24 uur per dag registreren. Huidige uren: ${currentTotalHours}`);
        return;
      }

      onAddTimeEntry(
        selectedDate,
        parseInt(newEntry.projectId),
        hours
      );
      setNewEntry({ projectId: '', hours: '' });
      setSelectedDate(null);
      setError(null);
    }
  };

  const getTimeEntriesForDate = (date: Date) => {
    return timeEntries.filter(entry => 
      isSameDay(new Date(entry.date), date)
    );
  };

  return (
    <StyledPaper>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ color: '#ffffff' }}>
          Week {format(weekStart, 'w', { locale: nl })}
        </Typography>
        <Box>
          <IconButton onClick={handlePrevWeek} sx={{ color: '#ffffff' }}>
            <ChevronLeft />
          </IconButton>
          <IconButton onClick={handleNextWeek} sx={{ color: '#ffffff' }}>
            <ChevronRight />
          </IconButton>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={2}>
        {weekDays.map((day) => {
          const dayEntries = getTimeEntriesForDate(day);
          const totalHours = dayEntries.reduce((total, entry) => total + entry.hours, 0);
          
          return (
            <Grid item xs={12} sm={6} md={4} lg={2} key={day.toISOString()}>
              <DayCell>
                <DayHeader>
                  <Typography variant="subtitle1">
                    {format(day, 'EEEE', { locale: nl })}
                  </Typography>
                  <Typography variant="body2">
                    {format(day, 'd MMM', { locale: nl })}
                  </Typography>
                </DayHeader>

                <Box sx={{ flexGrow: 1 }}>
                  {dayEntries.map((entry) => (
                    <Box key={entry.id} sx={{ mb: 1 }}>
                      <Typography variant="body2" sx={{ color: '#ffffff' }}>
                        {entry.projectName}: {entry.hours} uur
                      </Typography>
                    </Box>
                  ))}
                  {totalHours > 0 && (
                    <Typography variant="body2" sx={{ color: '#ffffff', mt: 1, fontWeight: 'bold' }}>
                      Totaal: {totalHours} uur
                    </Typography>
                  )}
                </Box>

                {selectedDate && isSameDay(selectedDate, day) ? (
                  <Box sx={{ mt: 1 }}>
                    <StyledTextField
                      select
                      fullWidth
                      size="small"
                      value={newEntry.projectId}
                      onChange={(e) => setNewEntry({ ...newEntry, projectId: e.target.value })}
                      sx={{ mb: 1 }}
                    >
                      {projects.map((project) => (
                        <MenuItem key={project.id} value={project.id}>
                          {project.name}
                        </MenuItem>
                      ))}
                    </StyledTextField>
                    <StyledTextField
                      fullWidth
                      size="small"
                      type="number"
                      value={newEntry.hours}
                      onChange={(e) => setNewEntry({ ...newEntry, hours: e.target.value })}
                      sx={{ mb: 1 }}
                    />
                    <StyledContainedButton
                      fullWidth
                      variant="contained"
                      onClick={handleSubmitTimeEntry}
                      disabled={!newEntry.projectId || !newEntry.hours}
                    >
                      Toevoegen
                    </StyledContainedButton>
                  </Box>
                ) : (
                  <StyledButton
                    fullWidth
                    variant="outlined"
                    onClick={() => handleAddTimeEntry(day)}
                    sx={{ mt: 1 }}
                  >
                    Uren toevoegen
                  </StyledButton>
                )}
              </DayCell>
            </Grid>
          );
        })}
      </Grid>
    </StyledPaper>
  );
};

export default WeekCalendar; 