import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, CircularProgress, Alert } from '@mui/material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import api from '../services/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface MonthlyData {
  month: number;
  total_hours: number;
  total_amount: number;
}

interface YearlyTarget {
  currentAmount: number;
  yearlyTarget: number;
  progressPercentage: number;
}

const Dashboard: React.FC = () => {
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [yearlyTarget, setYearlyTarget] = useState<YearlyTarget | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [monthlyResponse, yearlyResponse] = await Promise.all([
          api.get<MonthlyData[]>('/time-entries/monthly-report'),
          api.get<YearlyTarget>('/time-entries/yearly-target')
        ]);

        setMonthlyData(monthlyResponse.data);
        setYearlyTarget(yearlyResponse.data);
      } catch (error: any) {
        console.error('Error fetching dashboard data:', error);
        console.error('Error response:', error.response);
        console.error('Error status:', error.response?.status);
        console.error('Error headers:', error.response?.headers);
        setError('Er is een fout opgetreden bij het ophalen van de dashboard gegevens');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const chartData = {
    labels: monthlyData.map(data => {
      const date = new Date(2024, data.month - 1);
      return date.toLocaleString('nl-NL', { month: 'long' });
    }),
    datasets: [
      {
        label: 'Uren per maand',
        data: monthlyData.map(data => data.total_hours),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Geregistreerde uren per maand'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Uren'
        }
      }
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      {yearlyTarget && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Jaardoel
          </Typography>
          <Typography>
            Huidig bedrag: €{yearlyTarget.currentAmount.toFixed(2)}
          </Typography>
          <Typography>
            Doel: €{yearlyTarget.yearlyTarget.toFixed(2)}
          </Typography>
          <Typography>
            Voortgang: {yearlyTarget.progressPercentage.toFixed(1)}%
          </Typography>
        </Paper>
      )}

      <Paper sx={{ p: 2 }}>
        <Line options={chartOptions} data={chartData} />
      </Paper>
    </Box>
  );
};

export default Dashboard; 