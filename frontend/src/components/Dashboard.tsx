import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  AppBar,
  Toolbar,
  Button,
  Grid,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

interface MonthlyData {
  month: string;
  hours: number;
  revenue: number;
  target: number;
}

const Dashboard: React.FC = () => {
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [yearTarget, setYearTarget] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          'https://performance-meter-render.onrender.com/hours/monthly',
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        
        const monthNames = [
          'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
          'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'
        ];

        const data = response.data.map((item: any) => ({
          month: monthNames[item.month - 1],
          hours: item.hours,
          revenue: item.revenue,
          target: item.target,
        }));

        setMonthlyData(data);
        setYearTarget(response.data[0]?.yearTarget || 0);
        setTotalRevenue(response.data.reduce((acc: number, curr: any) => acc + curr.revenue, 0));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: '#0c2d5a' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Performance Meter
          </Typography>
          <Button color="inherit" onClick={() => navigate('/time-registration')}>
            Uren Registreren
          </Button>
          <Button color="inherit" onClick={() => navigate('/projects')}>
            Projecten
          </Button>
          <Button color="inherit" onClick={handleLogout}>
            Uitloggen
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              }}
            >
              <Typography component="h2" variant="h6" color="white" gutterBottom>
                Jaaroverzicht
              </Typography>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart
                  data={monthlyData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" stroke="white" />
                  <YAxis stroke="white" />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    name="Omzet"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="target"
                    name="Target"
                    stroke="#82ca9d"
                    strokeDasharray="5 5"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              }}
            >
              <Typography component="h2" variant="h6" color="white" gutterBottom>
                Jaardoel
              </Typography>
              <Typography component="p" variant="h4" color="white">
                €{yearTarget.toLocaleString()}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              }}
            >
              <Typography component="h2" variant="h6" color="white" gutterBottom>
                Totaal Gefactureerd
              </Typography>
              <Typography component="p" variant="h4" color="white">
                €{totalRevenue.toLocaleString()}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard; 