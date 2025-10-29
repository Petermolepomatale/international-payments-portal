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
      <Typography variant="h4" gutterBottom>
        Welcome, {user?.fullName}!
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        International Payments Dashboard
      </Typography>

      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMessage}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h5">
                Make International Payment
              </Typography>
              <Button
                variant={showPaymentForm ? "outlined" : "contained"}
                startIcon={<AddIcon />}
                onClick={() => setShowPaymentForm(!showPaymentForm)}
              >
                {showPaymentForm ? 'Cancel' : 'New Payment'}
              </Button>
            </Box>

            {showPaymentForm && (
              <PaymentForm
                onSuccess={handlePaymentSuccess}
                onCancel={() => setShowPaymentForm(false)}
              />
            )}
          </Paper>
        </Grid>

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