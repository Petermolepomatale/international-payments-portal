import React, { useState } from 'react';
import {
  Typography,
  Grid,
  Paper,
  Box,
  Alert,
  Button,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import PaymentForm from './PaymentForm';
import TransactionHistory from './TransactionHistory';
import { Transaction } from '../../types';

const CustomerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [refreshTransactions, setRefreshTransactions] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');

  const handlePaymentSuccess = (transaction: Transaction) => {
    setShowPaymentForm(false);
    setSuccessMessage(`Payment of ${transaction.amount} ${transaction.currency} submitted successfully!`);
    setRefreshTransactions(prev => prev + 1);
    setTimeout(() => setSuccessMessage(''), 5000);
  };

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: 4,
          p: 4,
          mb: 4,
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: -50,
            right: -50,
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -30,
            left: -30,
            width: 150,
            height: 150,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.05)',
          }}
        />
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
            Welcome back, {user?.fullName?.split(' ')[0]}! 👋
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9, mb: 3 }}>
            Manage your international payments with confidence
          </Typography>
          <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  backgroundColor: '#10b981',
                }}
              />
              <Typography variant="body2">Secure Connection</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  backgroundColor: '#f59e0b',
                }}
              />
              <Typography variant="body2">Bank-Grade Encryption</Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {successMessage && (
        <Alert 
          severity="success" 
          sx={{ 
            mb: 3,
            borderRadius: 2,
            '& .MuiAlert-icon': {
              fontSize: '1.5rem',
            },
          }}
        >
          {successMessage}
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* Payment Section */}
        <Grid item xs={12}>
          <Paper 
            sx={{ 
              p: 4, 
              mb: 3,
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
              border: '1px solid rgba(0, 0, 0, 0.05)',
            }}
          >
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
                  💸 International Payments
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Send money worldwide with competitive rates and fast processing
                </Typography>
              </Box>
              <Button
                variant={showPaymentForm ? "outlined" : "contained"}
                startIcon={<AddIcon />}
                onClick={() => setShowPaymentForm(!showPaymentForm)}
                size="large"
                sx={{
                  px: 3,
                  py: 1.5,
                  borderRadius: 3,
                  fontWeight: 600,
                  background: showPaymentForm ? 'transparent' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  '&:hover': {
                    background: showPaymentForm ? 'rgba(102, 126, 234, 0.1)' : 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                  },
                }}
              >
                {showPaymentForm ? 'Cancel Payment' : 'New Payment'}
              </Button>
            </Box>

            {showPaymentForm && (
              <Box
                sx={{
                  background: 'rgba(102, 126, 234, 0.02)',
                  borderRadius: 3,
                  p: 3,
                  border: '1px solid rgba(102, 126, 234, 0.1)',
                }}
              >
                <PaymentForm
                  onSuccess={handlePaymentSuccess}
                  onCancel={() => setShowPaymentForm(false)}
                />
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Transaction History */}
        <Grid item xs={12}>
          <TransactionHistory
            refreshTrigger={refreshTransactions}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default CustomerDashboard;