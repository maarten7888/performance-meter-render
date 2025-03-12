import React, { useState, useEffect } from 'react';
import { Container, Paper, Typography, Box } from '@mui/material';
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
import axios from 'axios';
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
  month: string;
  hours: number;
  revenue: number;
}

interface YearTargetResponse {
  target: number;
}

const Dashboard = () => {
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [yearTarget, setYearTarget] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const [monthlyResponse, targetResponse] = await Promise.all([
          axios.get<MonthlyData[]>('https://performance-meter-render-6i1b.onrender.com/api/monthly-data', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get<YearTargetResponse>('https://performance-meter-render-6i1b.onrender.com/api/year-target', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        setMonthlyData(monthlyResponse.data as MonthlyData[]);
        setYearTarget((targetResponse.data as YearTargetResponse).target);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
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
        data: monthlyData.map(d => d.revenue),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
      {
        label: 'Target',
        data: months.map(() => yearTarget / 12),
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

  const totalRevenue = monthlyData.reduce((sum, month) => sum + month.revenue, 0);
  const totalHours = monthlyData.reduce((sum, month) => sum + month.hours, 0);
  const progressPercentage = (totalRevenue / yearTarget) * 100;

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
        <Box mb={4}>
          <Typography variant="h6" color="white" gutterBottom>
            Jaar Overzicht
          </Typography>
          <Typography color="white">
            Totaal gefactureerd: €{totalRevenue.toLocaleString()}
          </Typography>
          <Typography color="white">
            Jaardoel: €{yearTarget.toLocaleString()} ({progressPercentage.toFixed(1)}% behaald)
          </Typography>
          <Typography color="white">
            Totaal aantal uren: {totalHours}
          </Typography>
        </Box>
        
        <Box height={400}>
          <Line data={chartData} options={chartOptions} />
        </Box>
      </StyledPaper>
    </Container>
  );
};

export default Dashboard; 