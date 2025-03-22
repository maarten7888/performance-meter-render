import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
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
  Button,
  TextField,
  Alert,
  Snackbar
} from '@mui/material';
import { styled } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import api from '../services/api';

interface User {
  id: number;
  email: string;
  name: string;
  yearTarget: number;
}

const StyledPaper = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(4),
  padding: theme.spacing(3),
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
}));

const StyledTableCell = styled(TableCell)({
  color: '#ffffff',
  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
});

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

const Management = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newYearTarget, setNewYearTarget] = useState<string>('');
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/api/users/all-with-targets');
      setUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
      showSnackbar('Er is een fout opgetreden bij het ophalen van de gebruikers', 'error');
    }
  };

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setNewYearTarget(user.yearTarget.toString());
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedUser(null);
    setNewYearTarget('');
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleSave = async () => {
    if (!selectedUser) return;

    try {
      await api.put(`/api/users/year-target/${selectedUser.id}`, {
        target: Number(newYearTarget),
      });

      // Update local state
      setUsers(users.map(user =>
        user.id === selectedUser.id
          ? { ...user, yearTarget: Number(newYearTarget) }
          : user
      ));

      showSnackbar('Jaartarget succesvol bijgewerkt', 'success');
      handleDialogClose();
    } catch (error) {
      console.error('Error updating year target:', error);
      showSnackbar('Er is een fout opgetreden bij het bijwerken van het jaartarget', 'error');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  return (
    <Container>
      <Box mt={4}>
        <Typography variant="h4" color="white" gutterBottom>
          Beheer
        </Typography>

        <StyledPaper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableCell>E-mail</StyledTableCell>
                  <StyledTableCell>Naam</StyledTableCell>
                  <StyledTableCell>Jaartarget</StyledTableCell>
                  <StyledTableCell align="right">Actie</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <StyledTableCell>{user.email}</StyledTableCell>
                    <StyledTableCell>{user.name}</StyledTableCell>
                    <StyledTableCell>{formatCurrency(user.yearTarget)}</StyledTableCell>
                    <StyledTableCell align="right">
                      <IconButton
                        onClick={() => handleEditClick(user)}
                        sx={{ color: 'white' }}
                      >
                        <EditIcon />
                      </IconButton>
                    </StyledTableCell>
                  </TableRow>
                ))}
                {users.length === 0 && (
                  <TableRow>
                    <StyledTableCell colSpan={4} align="center">
                      Geen gebruikers gevonden
                    </StyledTableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </StyledPaper>
      </Box>

      <StyledDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        PaperProps={{
          sx: {
            minWidth: '400px',
          },
        }}
      >
        <DialogTitle>
          Jaartarget Aanpassen
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <StyledTextField
              autoFocus
              label="Jaartarget"
              type="number"
              fullWidth
              value={newYearTarget}
              onChange={(e) => setNewYearTarget(e.target.value)}
              InputProps={{
                inputProps: { min: 0 }
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={handleDialogClose}
            sx={{ color: 'white' }}
          >
            Annuleren
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            sx={{
              bgcolor: 'white',
              color: '#0c2d5a',
              '&:hover': {
                bgcolor: '#f5f5f5',
              },
            }}
          >
            Opslaan
          </Button>
        </DialogActions>
      </StyledDialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Management; 