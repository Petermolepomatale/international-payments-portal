export const formatCurrency = (amount: number, currency: string): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getStatusColor = (status: string): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
  switch (status) {
    case 'pending':
      return 'warning';
    case 'verified':
      return 'info';
    case 'submitted':
      return 'primary';
    case 'completed':
      return 'success';
    case 'failed':
      return 'error';
    default:
      return 'default';
  }
};

export const getStatusText = (status: string): string => {
  switch (status) {
    case 'pending':
      return 'Pending Review';
    case 'verified':
      return 'Verified';
    case 'submitted':
      return 'Submitted to SWIFT';
    case 'completed':
      return 'Completed';
    case 'failed':
      return 'Failed';
    default:
      return status;
  }
};