import React, { useEffect, useState } from 'react';
import { userManagementService, User } from '../services/userManagementService';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert
} from '@mui/material';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [editingTarget, setEditingTarget] = useState<{ [key: number]: number | null }>({});

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const usersData = await userManagementService.getAllUsers();
      setUsers(usersData);
      setError(null);
    } catch (err) {
      setError('Er is een fout opgetreden bij het laden van de gebruikers');
      console.error('Error loading users:', err);
    }
  };

  const handleTargetChange = (userId: number, value: string) => {
    const numValue = value === '' ? null : Number(value);
    setEditingTarget(prev => ({
      ...prev,
      [userId]: numValue
    }));
  };

  const handleSaveTarget = async (userId: number) => {
    try {
      const target = editingTarget[userId];
      if (target !== undefined) {
        await userManagementService.updateYearlyTarget(userId, target);
        setSuccess('Jaartarget succesvol bijgewerkt');
        setError(null);
        // Herlaad gebruikers om de laatste data te tonen
        loadUsers();
      }
    } catch (err) {
      setError('Er is een fout opgetreden bij het bijwerken van het jaartarget');
      console.error('Error updating yearly target:', err);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Gebruikersbeheer
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

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Email</TableCell>
              <TableCell>Jaartarget (uren)</TableCell>
              <TableCell>Acties</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    value={editingTarget[user.id] ?? user.yearlyTarget ?? ''}
                    onChange={(e) => handleTargetChange(user.id, e.target.value)}
                    size="small"
                    fullWidth
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleSaveTarget(user.id)}
                    disabled={editingTarget[user.id] === undefined}
                  >
                    Opslaan
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default UserManagement; 