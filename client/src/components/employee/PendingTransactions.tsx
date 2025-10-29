import React, { useState, useEffect } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  Box,
  Button,
  Alert,
  CircularProgress,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,

  Pagination,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Verified as VerifiedIcon,
  Send as SendIcon,
  Refresh as RefreshIcon,
  PlaylistAddCheck as BulkIcon,
} from '@mui/icons-material';
import { Transaction } from '../../types';
import { apiService } from '../../services/api';
import { formatCurrency, formatDate, getStatusColor, getStatusText } from '../../utils/helpers';

interface PendingTransactionsProps {
  onRefresh: () => void;
}

const PendingTransactions: React.FC<PendingTransactionsProps> = ({ onRefresh }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>([]);
  const [bulkSubmitOpen, setBulkSubmitOpen] = useState(false);
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchTransactions = async (pageNum: number = page) => {
    try {
      setLoading(true);
      setError('');
      const response = await apiService.getPendingTransactions(pageNum);
      setTransactions(response.data.transactions);
      setTotalPages(response.pagination.pages);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch pending transactions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleRefresh = () => {
    fetchTransactions();
    onRefresh();
    setSuccess('');
  };

  const handleSelectTransaction = (transactionId: string) => {
    setSelectedTransactions(prev =>
      prev.includes(transactionId)
        ? prev.filter(id => id !== transactionId)
        : [...prev, transactionId]
    );
  };

  const handleSelectAll = () => {
    setSelectedTransactions(
      selectedTransactions.length === transactions.length
        ? []
        : transactions.map(t => t._id)
    );
  };

  const handleVerifyTransaction = async (transactionId: string) => {
    try {
      setSubmitting(transactionId);
      await apiService.verifyTransaction(transactionId);
      setSuccess('Transaction verified successfully');
      handleRefresh();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to verify transaction');
    } finally {
      setSubmitting(null);
    }
  };

  const handleSubmitTransaction = async (transactionId: string) => {
    try {
      setSubmitting(transactionId);
      await apiService.submitTransaction(transactionId);
      setSuccess('Transaction submitted to SWIFT successfully');
      handleRefresh();
      setSelectedTransactions(prev => prev.filter(id => id !== transactionId));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit transaction');
    } finally {
      setSubmitting(null);
    }
  };

  const handleBulkSubmit = async () => {
    try {
      setSubmitting('bulk');
      await apiService.bulkSubmitTransactions(selectedTransactions);
      setSuccess(`Successfully submitted ${selectedTransactions.length} transactions to SWIFT`);
      setBulkSubmitOpen(false);
      setSelectedTransactions([]);
      handleRefresh();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit transactions');
    } finally {
      setSubmitting(null);
    }
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    fetchTransactions(value);
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">
          Pending Transactions ({transactions.length})
        </Typography>
        <Box display="flex" gap={1}>
          <Tooltip title="Refresh">
            <IconButton onClick={handleRefresh} disabled={loading}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Button
            variant="outlined"
            onClick={handleSelectAll}
            disabled={transactions.length === 0}
          >
            {selectedTransactions.length === transactions.length ? 'Deselect All' : 'Select All'}
          </Button>
          <Button
            variant="contained"
            startIcon={<BulkIcon />}
            disabled={selectedTransactions.length === 0}
            onClick={() => setBulkSubmitOpen(true)}
          >
            Bulk Submit ({selectedTransactions.length})
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={selectedTransactions.length > 0 && selectedTransactions.length < transactions.length}
                  checked={transactions.length > 0 && selectedTransactions.length === transactions.length}
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Account Number</TableCell>
              <TableCell>ID Number</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Currency</TableCell>
              <TableCell>Payee Details</TableCell>
              <TableCell>SWIFT Code</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction._id} hover>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedTransactions.includes(transaction._id)}
                    onChange={() => handleSelectTransaction(transaction._id)}
                  />
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2" fontWeight="medium">
                      {transaction.customer.fullName}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>{transaction.customer.accountNumber}</TableCell>
                <TableCell>{transaction.customer.idNumber}</TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="bold">
                    {formatCurrency(transaction.amount, transaction.currency)}
                  </Typography>
                </TableCell>
                <TableCell>{transaction.currency}</TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2" fontWeight="medium">
                      {transaction.payeeName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {transaction.payeeBank}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {transaction.payeeAccount}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>{transaction.swiftCode}</TableCell>
                <TableCell>
                  {formatDate(transaction.createdAt)}
                </TableCell>
                <TableCell>
                  <Chip
                    label={getStatusText(transaction.status)}
                    color={getStatusColor(transaction.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Box display="flex" gap={1}>
                    <Tooltip title="Verify Transaction">
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<VerifiedIcon />}
                        onClick={() => handleVerifyTransaction(transaction._id)}
                        disabled={submitting === transaction._id || transaction.status !== 'pending'}
                      >
                        {submitting === transaction._id ? <CircularProgress size={16} /> : 'Verify'}
                      </Button>
                    </Tooltip>
                    <Tooltip title="Submit to SWIFT">
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<SendIcon />}
                        onClick={() => handleSubmitTransaction(transaction._id)}
                        disabled={submitting === transaction._id || !['pending', 'verified'].includes(transaction.status)}
                      >
                        {submitting === transaction._id ? <CircularProgress size={16} /> : 'Submit'}
                      </Button>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {transactions.length === 0 && !loading && (
        <Box textAlign="center" py={4}>
          <Typography variant="body1" color="text.secondary">
            No pending transactions
          </Typography>
        </Box>
      )}

      {totalPages > 1 && (
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}

      {/* Bulk Submit Dialog */}
      <Dialog open={bulkSubmitOpen} onClose={() => setBulkSubmitOpen(false)}>
        <DialogTitle>Confirm Bulk Submission</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to submit {selectedTransactions.length} transactions to SWIFT?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            This action cannot be undone. Transactions will be processed immediately.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBulkSubmitOpen(false)} disabled={!!submitting}>
            Cancel
          </Button>
          <Button
            onClick={handleBulkSubmit}
            variant="contained"
            disabled={!!submitting}
            startIcon={submitting === 'bulk' ? <CircularProgress size={16} /> : <SendIcon />}
          >
            {submitting === 'bulk' ? 'Submitting...' : 'Confirm Submission'}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default PendingTransactions;