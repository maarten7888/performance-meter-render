import React, { useState, useEffect } from 'react';
import { Container, Paper, Typography, Box, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const StyledPaper = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(4),
  padding: theme.spacing(3),
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
}));

interface MonthlyData {
  month: number;
  total_hours: number;
  total_amount: number;
}

interface YearlyTargetResponse {
  currentAmount: number;
  yearlyTarget: number;
  progressPercentage: number;
}

interface TotalHoursResponse {
  totalHours: number;
}

const Dashboard = () => {
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [yearlyTarget, setYearlyTarget] = useState<YearlyTargetResponse | null>(null);
  const [totalHours, setTotalHours] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching dashboard data...');
        
        const token = localStorage.getItem('token');
        console.log('Token present:', !!token);
        
        const [monthlyResponse, targetResponse, hoursResponse] = await Promise.all([
          api.get<MonthlyData[]>('/api/time-entries/monthly-report'),
          api.get<YearlyTargetResponse>('/api/time-entries/yearly-target'),
          api.get<TotalHoursResponse>('/api/time-entries/total-hours')
        ]);

        console.log('Monthly data response:', monthlyResponse);
        console.log('Yearly target response:', targetResponse);
        console.log('Total hours response:', hoursResponse);

        setMonthlyData(monthlyResponse.data);
        setYearlyTarget(targetResponse.data);
        setTotalHours(hoursResponse.data.totalHours);
      } catch (error: any) {
        console.error('Error fetching dashboard data:', error);
        console.error('Error response:', error.response?.data);
        console.error('Error status:', error.response?.status);
        console.error('Error headers:', error.response?.headers);
        setError('Er is een fout opgetreden bij het ophalen van de dashboard data. Probeer het later opnieuw.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'];
  
  const chartData = {
    labels: months,
    datasets: [
      {
        label: 'Gefactureerd bedrag',
        data: months.map((_, index) => {
          const monthData = monthlyData.find(d => d.month === index + 1);
          return monthData ? monthData.total_amount : 0;
        }),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
      {
        label: 'Target',
        data: months.map(() => yearlyTarget ? yearlyTarget.yearlyTarget / 12 : 0),
        borderColor: 'rgb(255, 99, 132)',
        borderDash: [5, 5],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#ffffff',
        },
      },
      title: {
        display: true,
        text: 'Jaaroverzicht Facturatie',
        color: '#ffffff',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#ffffff',
        },
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#ffffff',
        },
      },
    },
  };

  const totalRevenue = monthlyData.reduce((sum, month) => sum + month.total_amount, 0);

  return (
    <Container>
      <Box mt={4}>
        <Typography variant="h4" color="white" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="subtitle1" color="white" gutterBottom>
          Welkom terug, {user?.email}
        </Typography>
      </Box>

      <StyledPaper>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
            <Typography color="error">{error}</Typography>
          </Box>
        ) : (
          <>
            <Box mb={4}>
              <Typography variant="h6" color="white" gutterBottom>
                Jaar Overzicht
              </Typography>
              <Typography color="white">
                Totaal gefactureerd: €{totalRevenue.toLocaleString()}
              </Typography>
              {yearlyTarget && (
                <>
                  <Typography color="white">
                    Jaardoel: €{yearlyTarget.yearlyTarget.toLocaleString()} ({yearlyTarget.progressPercentage.toFixed(1)}% behaald)
                  </Typography>
                </>
              )}
              <Typography color="white">
                Totaal aantal uren: {totalHours.toFixed(2)}
              </Typography>
            </Box>
            
            <Box height={400}>
              <Line data={chartData} options={chartOptions} />
            </Box>
          </>
        )}
      </StyledPaper>
    </Container>
  );
};

export default Dashboard; 