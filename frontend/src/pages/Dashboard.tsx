import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Grid, Box, LinearProgress, Paper } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { projectService } from '../services/projects';
import { MonthlyStats, YearlyTargetStats } from '../types/models';
import { AccessTime, TrendingUp, CheckCircle } from '@mui/icons-material';

const Dashboard = () => {
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats[]>([]);
  const [yearlyTargetStats, setYearlyTargetStats] = useState<YearlyTargetStats[]>([]);
  const [currentYearProgress, setCurrentYearProgress] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [monthlyData, yearlyData] = await Promise.all([
          projectService.getMonthlyStats(),
          projectService.getYearlyTargetStats()
        ]);
        setMonthlyStats(monthlyData);
        setYearlyTargetStats(yearlyData);

        // Bereken voortgang voor huidige jaar
        const currentYear = yearlyData.find(stat => stat.year === new Date().getFullYear());
        if (currentYear) {
          const progress = (currentYear.actual_hours / currentYear.target_hours) * 100;
          setCurrentYearProgress(Math.min(progress, 100));
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <Box sx={{ flexGrow: 1, p: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Typography 
        variant="h4" 
        gutterBottom 
        sx={{ 
          fontWeight: 600,
          color: '#0c2d5a',
          mb: 4
        }}
      >
        Dashboard
      </Typography>
      
      {/* Jaardoel Progress Card */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: '16px',
          backgroundColor: 'white',
          border: '1px solid rgba(0, 0, 0, 0.05)'
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <Typography variant="h6" sx={{ color: '#0c2d5a', fontWeight: 600 }}>
              Jaardoel Voortgang
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
              {currentYearProgress.toFixed(1)}% van het doel bereikt
            </Typography>
          </Grid>
          <Grid item xs={12} md={9}>
            <Box sx={{ width: '100%', mr: 1 }}>
              <LinearProgress
                variant="determinate"
                value={currentYearProgress}
                sx={{
                  height: 20,
                  borderRadius: 10,
                  backgroundColor: 'rgba(12, 45, 90, 0.1)',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: '#0c2d5a',
                    borderRadius: 10,
                  },
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={3}>
        {/* Maandelijkse statistieken */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: '16px',
              backgroundColor: 'white',
              border: '1px solid rgba(0, 0, 0, 0.05)',
              height: '100%'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <AccessTime sx={{ color: '#0c2d5a', mr: 1 }} />
              <Typography variant="h6" sx={{ color: '#0c2d5a', fontWeight: 600 }}>
                Maandelijkse Uren
              </Typography>
            </Box>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyStats}>
                  <defs>
                    <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0c2d5a" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#0c2d5a" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white',
                      border: '1px solid #f0f0f0',
                      borderRadius: '8px'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="total_hours" 
                    stroke="#0c2d5a" 
                    fill="url(#colorHours)" 
                    name="Uren"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Jaarlijkse doelen */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: '16px',
              backgroundColor: 'white',
              border: '1px solid rgba(0, 0, 0, 0.05)',
              height: '100%'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <TrendingUp sx={{ color: '#0c2d5a', mr: 1 }} />
              <Typography variant="h6" sx={{ color: '#0c2d5a', fontWeight: 600 }}>
                Jaarlijkse Doelen
              </Typography>
            </Box>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={yearlyTargetStats}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="year" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white',
                      border: '1px solid #f0f0f0',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="target_hours" 
                    stroke="#0c2d5a" 
                    strokeWidth={2}
                    dot={{ stroke: '#0c2d5a', strokeWidth: 2, r: 4 }}
                    name="Doel"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="actual_hours" 
                    stroke="#90caf9" 
                    strokeWidth={2}
                    dot={{ stroke: '#90caf9', strokeWidth: 2, r: 4 }}
                    name="Werkelijk"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 