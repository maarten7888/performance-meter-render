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
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/consultants`);
      if (!response.ok) {
        throw new Error('Kon consultant gegevens niet ophalen');
      }
      const data = await response.json();
      setConsultants(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Er is een fout opgetreden');
    } finally {
      setLoading(false);
    }
  };

  const handleYearTargetUpdate = async (consultantId: number, newTarget: number) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/consultants/${consultantId}/target`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ yearTarget: newTarget }),
      });

      if (!response.ok) {
        throw new Error('Kon jaartarget niet bijwerken');
      }

      setConsultants(consultants.map(consultant => 
        consultant.id === consultantId 
          ? { ...consultant, yearTarget: newTarget }
          : consultant
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Er is een fout opgetreden bij het bijwerken');
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