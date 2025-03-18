import React, { useState, useEffect } from 'react';
import {
  Container,
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
  Box
} from '@mui/material';
import api from '../services/api';

interface Consultant {
  id: number;
  email: string;
  yearTarget?: number;
}

const Management = () => {
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchConsultants();
  }, []);

  const fetchConsultants = async () => {
    try {
      const { data } = await api.get<Consultant[]>('/api/consultants');
      setConsultants(data);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching consultants:', err);
      setError(err.response?.data?.message || 'Er is een fout opgetreden bij het ophalen van consultants');
    } finally {
      setLoading(false);
    }
  };

  const handleYearTargetUpdate = async (consultantId: number, newTarget: number) => {
    try {
      await api.put(`/api/consultants/${consultantId}/target`, {
        yearTarget: newTarget
      });

      setConsultants(consultants.map(consultant => 
        consultant.id === consultantId 
          ? { ...consultant, yearTarget: newTarget }
          : consultant
      ));
      setError(null);
    } catch (err: any) {
      console.error('Error updating year target:', err);
      setError(err.response?.data?.message || 'Er is een fout opgetreden bij het bijwerken');
    }
  };

  if (loading) {
    return <Typography>Laden...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Container>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Beheer Consultants
        </Typography>
      </Box>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>E-mail</TableCell>
              <TableCell>Jaartarget</TableCell>
              <TableCell>Actie</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {consultants.map((consultant) => (
              <TableRow key={consultant.id}>
                <TableCell>{consultant.email}</TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    defaultValue={consultant.yearTarget}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={(e) => {
                      const target = (e.currentTarget.parentElement?.parentElement?.querySelector('input') as HTMLInputElement)?.value;
                      if (target) {
                        handleYearTargetUpdate(consultant.id, Number(target));
                      }
                    }}
                  >
                    Opslaan
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default Management; 