export const validationRules = {
  fullName: (value: string) => {
    if (!value) return 'Full name is required';
    if (!/^[a-zA-Z\s]{2,50}$/.test(value)) return 'Full name must contain only letters and spaces (2-50 characters)';
    return '';
  },

  idNumber: (value: string) => {
    if (!value) return 'ID number is required';
    if (!/^[0-9]{13}$/.test(value)) return 'ID number must be exactly 13 digits';
    return '';
  },

  accountNumber: (value: string) => {
    if (!value) return 'Account number is required';
    if (!/^[0-9]{10,12}$/.test(value)) return 'Account number must be 10-12 digits';
    return '';
  },

  username: (value: string) => {
    if (!value) return 'Username is required';
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(value)) return 'Username must be 3-20 characters (letters, numbers, underscore only)';
    return '';
  },

  password: (value: string) => {
    if (!value) return 'Password is required';
    if (value.length < 8) return 'Password must be at least 8 characters';
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(value)) {
      return 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character';
    }
    return '';
  },

  confirmPassword: (value: string, password: string) => {
    if (!value) return 'Please confirm your password';
    if (value !== password) return 'Passwords do not match';
    return '';
  },

  amount: (value: string) => {
    if (!value) return 'Amount is required';
    if (!/^\d+(\.\d{1,2})?$/.test(value)) return 'Amount must be a valid number with up to 2 decimal places';
    if (parseFloat(value) <= 0) return 'Amount must be greater than 0';
    return '';
  },

  swiftCode: (value: string) => {
    if (!value) return 'SWIFT code is required';
    if (!/^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(value)) return 'Invalid SWIFT code format';
    return '';
  },

  payeeAccount: (value: string) => {
    if (!value) return 'Payee account number is required';
    if (!/^[A-Z0-9]{8,34}$/.test(value)) return 'Invalid account number format (8-34 alphanumeric characters)';
    return '';
  },

  payeeName: (value: string) => {
    if (!value) return 'Payee name is required';
    if (!/^[a-zA-Z\s]{2,100}$/.test(value)) return 'Payee name must contain only letters and spaces (2-100 characters)';
    return '';
  },
};

export const sanitizeInput = (value: string, field: string): string => {
  switch (field) {
    case 'amount':
      return value.replace(/[^0-9.]/g, '');
    case 'payeeAccount':
    case 'swiftCode':
      return value.replace(/[^A-Z0-9]/g, '').toUpperCase();
    case 'payeeName':
      return value.replace(/[^a-zA-Z\s]/g, '');
    case 'idNumber':
    case 'accountNumber':
      return value.replace(/[^0-9]/g, '');
    case 'username':
      return value.replace(/[^a-zA-Z0-9_]/g, '').toLowerCase();
    case 'fullName':
      return value.replace(/[^a-zA-Z\s]/g, '');
    default:
      return value;
  }
};