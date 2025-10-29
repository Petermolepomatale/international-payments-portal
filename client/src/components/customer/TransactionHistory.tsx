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
  Pagination,
  Alert,
  CircularProgress,

} from '@mui/material';
import { Transaction } from '../../types';
import { apiService } from '../../services/api';
import { formatCurrency, formatDate, getStatusColor, getStatusText } from '../../utils/helpers';

interface TransactionHistoryProps {
  refreshTrigger: number;
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ refreshTrigger }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [rowsPerPage] = useState(10);

  const fetchTransactions = async (pageNum: number = page, limit: number = rowsPerPage) => {
    try {
      setLoading(true);
      setError('');
      const response = await apiService.getMyTransactions(pageNum, limit);
      setTransactions(response.data.transactions);
      setTotalPages(response.pagination.pages);
      setTotalCount(response.pagination.total);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [refreshTrigger]); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    fetchTransactions(value, rowsPerPage);
  };



  if (loading && transactions.length === 0) {
    return (
      <Paper sx={{ p: 3 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
          <CircularProgress />
        </Box>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Transaction History
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Currency</TableCell>
              <TableCell>Payee</TableCell>
              <TableCell>SWIFT Code</TableCell>
              <TableCell>Purpose</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction._id} hover>
                <TableCell>
                  {formatDate(transaction.createdAt)}
                </TableCell>
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
                  {transaction.purpose || '-'}
                </TableCell>
                <TableCell>
                  <Chip
                    label={getStatusText(transaction.status)}
                    color={getStatusColor(transaction.status)}
                    size="small"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {transactions.length === 0 && !loading && (
        <Box textAlign="center" py={4}>
          <Typography variant="body1" color="text.secondary">
            No transactions found
          </Typography>
        </Box>
      )}

      {totalPages > 1 && (
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Total: {totalCount} transactions
          </Typography>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}
    </Paper>
  );
};

export default TransactionHistory;