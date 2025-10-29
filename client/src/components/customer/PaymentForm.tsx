import React, { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  Grid,
  MenuItem,
  Alert,
  CircularProgress,
  Typography,
} from '@mui/material';
import { Send as SendIcon, Cancel as CancelIcon } from '@mui/icons-material';
import { TransactionFormData, Transaction } from '../../types';
import { apiService } from '../../services/api';
import { validationRules, sanitizeInput } from '../../utils/validation';

interface PaymentFormProps {
  onSuccess: (transaction: Transaction) => void;
  onCancel: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState<TransactionFormData>({
    amount: '',
    currency: 'USD',
    provider: 'SWIFT',
    payeeAccount: '',
    swiftCode: '',
    payeeName: '',
    payeeBank: '',
    purpose: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const currencies = [
    { value: 'USD', label: 'US Dollar (USD)' },
    { value: 'EUR', label: 'Euro (EUR)' },
    { value: 'GBP', label: 'British Pound (GBP)' },
    { value: 'ZAR', label: 'South African Rand (ZAR)' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const sanitizedValue = sanitizeInput(value, name);
    
    setFormData(prev => ({
      ...prev,
      [name]: sanitizedValue,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
    setApiError('');
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    newErrors.amount = validationRules.amount(formData.amount);
    newErrors.swiftCode = validationRules.swiftCode(formData.swiftCode);
    newErrors.payeeAccount = validationRules.payeeAccount(formData.payeeAccount);
    newErrors.payeeName = validationRules.payeeName(formData.payeeName);

    // Remove empty error messages
    Object.keys(newErrors).forEach(key => {
      if (!newErrors[key]) {
        delete newErrors[key];
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const response = await apiService.createTransaction({
        ...formData,
        amount: parseFloat(formData.amount),
      });
      onSuccess(response.data.transaction);
    } catch (error: any) {
      setApiError(error.response?.data?.message || 'Failed to create transaction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      {apiError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {apiError}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="Amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            error={!!errors.amount}
            helperText={errors.amount}
            disabled={loading}
            placeholder="0.00"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            select
            label="Currency"
            name="currency"
            value={formData.currency}
            onChange={handleChange}
            disabled={loading}
          >
            {currencies.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            label="Payee Account Number"
            name="payeeAccount"
            value={formData.payeeAccount}
            onChange={handleChange}
            error={!!errors.payeeAccount}
            helperText={errors.payeeAccount}
            disabled={loading}
            inputProps={{ maxLength: 34 }}
            placeholder="Enter IBAN or account number"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="SWIFT/BIC Code"
            name="swiftCode"
            value={formData.swiftCode}
            onChange={handleChange}
            error={!!errors.swiftCode}
            helperText={errors.swiftCode}
            disabled={loading}
            inputProps={{ maxLength: 11 }}
            placeholder="AAAA BB CC DDD"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="Payee Name"
            name="payeeName"
            value={formData.payeeName}
            onChange={handleChange}
            error={!!errors.payeeName}
            helperText={errors.payeeName}
            disabled={loading}
            placeholder="Full name of recipient"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            label="Payee Bank"
            name="payeeBank"
            value={formData.payeeBank}
            onChange={handleChange}
            disabled={loading}
            placeholder="Bank name of recipient"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Payment Purpose"
            name="purpose"
            value={formData.purpose}
            onChange={handleChange}
            disabled={loading}
            multiline
            rows={2}
            placeholder="Purpose of payment (optional)"
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button
          variant="outlined"
          onClick={onCancel}
          disabled={loading}
          startIcon={<CancelIcon />}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
        >
          {loading ? 'Processing...' : 'Submit Payment'}
        </Button>
      </Box>

      <Typography variant="body2" sx={{ color: '#ffffff', mt: 2 }}>
        Note: All payments are subject to verification and may take 1-2 business days to process.
      </Typography>
    </Box>
  );
};

export default PaymentForm;