export interface User {
  _id: string;
  fullName: string;
  idNumber: string;
  accountNumber: string;
  username: string;
  role: 'customer' | 'employee';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  _id: string;
  customer: User;
  amount: number;
  currency: string;
  provider: string;
  payeeAccount: string;
  swiftCode: string;
  payeeName: string;
  payeeBank: string;
  purpose: string;
  status: 'pending' | 'verified' | 'submitted' | 'completed' | 'failed';
  submittedBy?: User;
  submittedAt?: string;
  verifiedAt?: string;
  completedAt?: string;
  failureReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  status: string;
  token: string;
  data: {
    user: User;
  };
}

export interface ApiResponse<T> {
  status: string;
  data: T;
  message?: string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface TransactionsResponse {
  status: string;
  results: number;
  data: {
    transactions: Transaction[];
  };
  pagination: PaginationInfo;
}

export interface LoginFormData {
  username: string;
  password: string;
}

export interface RegisterFormData {
  fullName: string;
  idNumber: string;
  accountNumber: string;
  username: string;
  password: string;
  confirmPassword: string;
}

export interface TransactionFormData {
  amount: string;
  currency: string;
  provider: string;
  payeeAccount: string;
  swiftCode: string;
  payeeName: string;
  payeeBank: string;
  purpose: string;
}