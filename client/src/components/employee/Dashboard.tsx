import React, { useState, useEffect } from 'react';
import {
  Typography,
  Grid,
  Box,
  Card,
  CardContent,
  Alert,
} from '@mui/material';
import {
  PendingActions as PendingIcon,
  CheckCircle as CompletedIcon,
  AttachMoney as MoneyIcon,
  TrendingUp as TrendingIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import PendingTransactions from './PendingTransactions';
import { apiService } from '../../services/api';

interface DashboardStats {
  totalTransactions: Array<{ count: number }>;
  pendingTransactions: Array<{ count: number }>;
  todayTransactions: Array<{ count: number }>;
  transactionsByStatus: Array<{ _id: string; count: number }>;
  transactionsByCurrency: Array<{ _id: string; totalAmount: number; count: number }>;
}

const EmployeeDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await apiService.getDashboardStats();
      setStats(response.data.stats);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const StatCard = ({ title, value, icon, color }: any) => (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography sx={{ color: '#ffffff' }} gutterBottom variant="overline">
              {title}
            </Typography>
            <Typography variant="h4" component="div">
              {loading ? '...' : value}
            </Typography>
          </Box>
          <Box color={color}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Employee Dashboard
      </Typography>
      <Typography variant="body1" sx={{ color: '#ffffff' }} gutterBottom>
        Welcome, {user?.fullName}! Manage international payments and verify transactions.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Transactions"
            value={stats?.totalTransactions?.[0]?.count || 0}
            icon={<TrendingIcon fontSize="large" />}
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pending Review"
            value={stats?.pendingTransactions?.[0]?.count || 0}
            icon={<PendingIcon fontSize="large" />}
            color="#ed6c02"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Today's Transactions"
            value={stats?.todayTransactions?.[0]?.count || 0}
            icon={<MoneyIcon fontSize="large" />}
            color="#2e7d32"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Completed Today"
            value="0" // You might want to add this to your stats
            icon={<CompletedIcon fontSize="large" />}
            color="#9c27b0"
          />
        </Grid>
      </Grid>

      {/* Pending Transactions */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <PendingTransactions onRefresh={fetchStats} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default EmployeeDashboard;