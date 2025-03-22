import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Container,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';

interface User {
  id: number;
  email: string;
  name: string;
  yearTarget: number;
}

interface ApiResponse {
  users: User[];
}

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://performance-meter-render-6i1b.onrender.com';

// Axios instance met default configuratie
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor om de token toe te voegen
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const StyledPaper = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(4),
  padding: theme.spacing(3),
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
}));

const StyledTableCell = styled(TableCell)(({ width }: { width?: string }) => ({
  color: '#ffffff',
  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  width: width,
  '@media (max-width: 600px)': {
    width: '100%',
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

const columnWidths = {
  name: '40%',
  email: '40%',
  target: '20%',
};

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [editingTarget, setEditingTarget] = useState<{ [key: number]: number }>({});

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      console.log('Fetching users...');
      const response = await api.get<ApiResponse>('/api/users/all-with-targets');
      console.log('Response:', response.data);
      console.log('Response type:', typeof response.data);
      console.log('Response has users:', 'users' in response.data);
      console.log('Users array:', response.data.users);
      
      if (response.data && response.data.users) {
        setUsers(response.data.users);
        console.log('Users set to:', response.data.users);
      } else {
        console.log('No users found in response');
        setUsers([]);
        setError('Geen gebruikers gevonden');
      }
      setLoading(false);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      console.error('Error response:', error.response);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      setError(error.response?.data?.message || 'Er is een fout opgetreden bij het ophalen van de gebruikers');
      setUsers([]);
      setLoading(false);
    }
  };

  const handleTargetChange = (userId: number, value: string) => {
    setEditingTarget(prev => ({
      ...prev,
      [userId]: Number(value) || 0
    }));
  };

  const handleSaveTarget = async (userId: number) => {
    try {
      console.log('Saving target for user:', userId, 'target:', editingTarget[userId]);
      const response = await api.put(`/api/users/year-target/${userId}`, {
        target: editingTarget[userId]
      });
      console.log('Save response:', response.data);
      setSuccess('Jaartarget succesvol bijgewerkt');
      fetchUsers();
      setEditingTarget(prev => {
        const newState = { ...prev };
        delete newState[userId];
        return newState;
      });
    } catch (error: any) {
      console.error('Error updating target:', error);
      setError(error.response?.data?.message || 'Er is een fout opgetreden bij het bijwerken van het jaartarget');
    }
  };

  if (loading) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container>
      <Box mt={4}>
        <Typography variant="h4" color="white" gutterBottom>
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
        <StyledPaper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableCell width={columnWidths.name}>Naam</StyledTableCell>
                  <StyledTableCell width={columnWidths.email}>E-mail</StyledTableCell>
                  <StyledTableCell width={columnWidths.target}>Jaartarget (uren)</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <StyledTableCell width={columnWidths.name}>{user.name}</StyledTableCell>
                    <StyledTableCell width={columnWidths.email}>{user.email}</StyledTableCell>
                    <StyledTableCell width={columnWidths.target}>
                      <Box display="flex" alignItems="center" gap={1}>
                        {editingTarget[user.id] !== undefined ? (
                          <>
                            <StyledTextField
                              size="small"
                              type="number"
                              value={editingTarget[user.id]}
                              onChange={(e) => handleTargetChange(user.id, e.target.value)}
                              sx={{ width: '100px' }}
                            />
                            <Button
                              variant="contained"
                              size="small"
                              onClick={() => handleSaveTarget(user.id)}
                              sx={{ bgcolor: 'white', color: '#0c2d5a', '&:hover': { bgcolor: '#f5f5f5' } }}
                            >
                              Opslaan
                            </Button>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => {
                                setEditingTarget(prev => {
                                  const newState = { ...prev };
                                  delete newState[user.id];
                                  return newState;
                                });
                              }}
                              sx={{ color: 'white', borderColor: 'white', '&:hover': { borderColor: '#f5f5f5' } }}
                            >
                              Annuleren
                            </Button>
                          </>
                        ) : (
                          <>
                            <Typography>{user.yearTarget}</Typography>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => setEditingTarget(prev => ({ ...prev, [user.id]: user.yearTarget }))}
                              sx={{ color: 'white', borderColor: 'white', '&:hover': { borderColor: '#f5f5f5' } }}
                            >
                              Bewerken
                            </Button>
                          </>
                        )}
                      </Box>
                    </StyledTableCell>
                  </TableRow>
                ))}
                {users.length === 0 && (
                  <TableRow>
                    <StyledTableCell colSpan={3} align="center" sx={{ py: 3 }}>
                      Geen gebruikers gevonden
                    </StyledTableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </StyledPaper>
      </Box>
    </Container>
  );
};

export default UserManagement; 