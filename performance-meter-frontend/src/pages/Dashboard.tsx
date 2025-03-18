import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, CircularProgress, Alert, Container, LinearProgress, Grid } from '@mui/material';
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
import { styled } from '@mui/material/styles';

// Verplaats Chart.js registratie naar een try-catch block
try {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );
} catch (error) {
  console.error('Error registering Chart.js:', error);
}

const StyledPaper = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(4),
  padding: theme.spacing(3),
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
}));

interface MonthlyData {
  month: number;
  total_hours: number;
  total_amount: number;
}

interface YearlyTarget {
  currentAmount: string;
  yearlyTarget: number;
  progressPercentage: number;
}

const Dashboard: React.FC = () => {
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [yearlyTarget, setYearlyTarget] = useState<YearlyTarget | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isChartReady, setIsChartReady] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        setIsChartReady(false);

        const [monthlyResponse, yearlyResponse] = await Promise.all([
          api.get<MonthlyData[]>('/api/time-entries/monthly-report'),
          api.get<YearlyTarget>('/api/time-entries/yearly-target')
        ]);

        console.log('Yearly Target Response:', yearlyResponse.data);
        console.log('Monthly Data Response:', monthlyResponse.data);
        
        // Convert string values to numbers
        const yearlyData = {
          currentAmount: yearlyResponse.data.currentAmount,
          yearlyTarget: Number(yearlyResponse.data.yearlyTarget),
          progressPercentage: Number(yearlyResponse.data.progressPercentage)
        };
        
        setMonthlyData(monthlyResponse.data);
        setYearlyTarget(yearlyData);
        setIsChartReady(true);
      } catch (error: any) {
        console.error('Error fetching dashboard data:', error);
        setError('Er is een fout opgetreden bij het ophalen van de dashboard gegevens');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const calculatePredictions = () => {
    if (!yearlyTarget || !monthlyData.length) return null;

    const currentMonth = new Date().getMonth() + 1; // 1-12
    const remainingMonths = 12 - currentMonth;
    
    // Berekenen gemiddelde per maand tot nu toe
    const currentAmount = parseFloat(yearlyTarget.currentAmount.replace(/[^0-9.-]+/g, ""));
    const averagePerMonth = currentAmount / currentMonth;
    
    // Voorspeld jaarbedrag
    const predictedYearTotal = averagePerMonth * 12;
    
    // Berekenen wanneer target wordt gehaald
    const monthsNeededForTarget = yearlyTarget.yearlyTarget / averagePerMonth;
    const targetDate = new Date();
    targetDate.setMonth(targetDate.getMonth() + (monthsNeededForTarget - currentMonth));
    
    // Berekenen wat er nog per maand nodig is om target te halen
    const remainingTarget = yearlyTarget.yearlyTarget - currentAmount;
    const requiredPerMonth = remainingTarget / remainingMonths;

    return {
      targetDate: targetDate.toLocaleDateString('nl-NL', { month: 'long', year: 'numeric' }),
      predictedYearTotal: predictedYearTotal.toLocaleString('nl-NL', { style: 'currency', currency: 'EUR' }),
      requiredPerMonth: requiredPerMonth.toLocaleString('nl-NL', { style: 'currency', currency: 'EUR' }),
      isOnTrack: predictedYearTotal >= yearlyTarget.yearlyTarget
    };
  };

  const chartData = {
    labels: Array.from({ length: 12 }, (_, i) => {
      const date = new Date(2024, i);
      return date.toLocaleString('nl-NL', { month: 'long' });
    }),
    datasets: [
      {
        label: 'Gefactureerd bedrag',
        data: Array.from({ length: 12 }, (_, i) => {
          const monthData = monthlyData.find(data => data.month === i + 1);
          return monthData ? monthData.total_amount : 0;
        }),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
        yAxisID: 'y',
      },
      {
        label: 'Gefactureerde uren',
        data: Array.from({ length: 12 }, (_, i) => {
          const monthData = monthlyData.find(data => data.month === i + 1);
          return monthData ? monthData.total_hours : 0;
        }),
        borderColor: 'rgb(255, 159, 64)',
        tension: 0.1,
        yAxisID: 'y1',
      },
      {
        label: 'Target',
        data: Array.from({ length: 12 }, () => yearlyTarget?.yearlyTarget ? yearlyTarget.yearlyTarget / 12 : 0),
        borderColor: 'rgb(255, 99, 132)',
        borderDash: [5, 5],
        yAxisID: 'y',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
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
      tooltip: {
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.dataset.label === 'Gefactureerd bedrag' || context.dataset.label === 'Target') {
              label += '€' + context.parsed.y.toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            } else {
              label += context.parsed.y.toLocaleString('nl-NL', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + ' uur';
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#ffffff',
        },
        title: {
          display: true,
          text: 'Bedrag (€)',
          color: '#ffffff',
        }
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        beginAtZero: true,
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          color: '#ffffff',
        },
        title: {
          display: true,
          text: 'Uren',
          color: '#ffffff',
        }
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#ffffff',
        }
      }
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Box p={3}>
          <Alert severity="error">{error}</Alert>
        </Box>
      </Container>
    );
  }

  const totalRevenue = monthlyData.reduce((sum, month) => sum + (month.total_amount || 0), 0);

  return (
    <Container maxWidth="lg" sx={{ 
      minHeight: '100vh',
      background: 'transparent',
      py: 4
    }}>
      <Box mt={4}>
        <Typography variant="h4" color="white" gutterBottom>
          Jaaroverzicht
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <StyledPaper sx={{ height: '100%' }}>
            <Box>
              <Typography variant="h6" color="white" gutterBottom>
                Voortgang Jaardoel
              </Typography>
              {yearlyTarget && (
                <>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ width: '100%', mr: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={Math.min(yearlyTarget.progressPercentage, 100)}
                        sx={{
                          height: 10,
                          borderRadius: 5,
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: 'rgb(75, 192, 192)',
                            borderRadius: 5,
                          },
                        }}
                      />
                    </Box>
                    <Box sx={{ minWidth: 35 }}>
                      <Typography variant="body2" color="white">
                        {`${Math.round(yearlyTarget.progressPercentage)}%`}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="body2" color="white">
                    €{Number(yearlyTarget.currentAmount).toLocaleString()} / €{yearlyTarget.yearlyTarget.toLocaleString()}
                  </Typography>
                </>
              )}
            </Box>
          </StyledPaper>
        </Grid>

        <Grid item xs={12} md={6}>
          <StyledPaper sx={{ height: '100%' }}>
            <Box>
              <Typography variant="h6" color="white" gutterBottom>
                Target Voorspelling
              </Typography>
              {yearlyTarget && (
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Box sx={{ textAlign: 'center', mb: 2 }}>
                      <Typography variant="subtitle1" color="white">
                        Target bereikt op
                      </Typography>
                      <Typography variant="h5" color="rgb(75, 192, 192)">
                        {calculatePredictions()?.targetDate || 'Niet beschikbaar'}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ textAlign: 'center', mb: 2 }}>
                      <Typography variant="subtitle1" color="white">
                        Voorspeld jaarbedrag
                      </Typography>
                      <Typography 
                        variant="h5" 
                        color={calculatePredictions()?.isOnTrack ? 'rgb(75, 192, 192)' : 'rgb(255, 99, 132)'}
                      >
                        {calculatePredictions()?.predictedYearTotal || 'Niet beschikbaar'}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="subtitle1" color="white">
                        Nog nodig per maand
                      </Typography>
                      <Typography variant="h5" color="white">
                        {calculatePredictions()?.requiredPerMonth || 'Niet beschikbaar'}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              )}
            </Box>
          </StyledPaper>
        </Grid>
      </Grid>

      <StyledPaper sx={{ mt: 6 }}>
        <Box height={400}>
          <Line options={chartOptions} data={chartData} />
        </Box>
      </StyledPaper>
    </Container>
  );
};

export default Dashboard; 