import axios, { AxiosInstance, AxiosResponse } from 'axios';
import {
  AuthResponse,
  User,
  Transaction,
  TransactionsResponse,
  ApiResponse,
  LoginFormData,
  RegisterFormData,
  TransactionFormData
} from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      withCredentials: true,
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle errors
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.handleUnauthorized();
        }
        return Promise.reject(error);
      }
    );
  }

  private handleUnauthorized() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }

  // Auth endpoints
  async login(credentials: LoginFormData): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.client.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  }

  async register(userData: RegisterFormData): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.client.post('/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  }

  async logout(): Promise<void> {
    await this.client.post('/auth/logout');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  async getCurrentUser(): Promise<User> {
    const response: AxiosResponse<ApiResponse<{ user: User }>> = await this.client.get('/auth/me');
    return response.data.data.user;
  }

  // Customer endpoints
  async createTransaction(transactionData: Omit<TransactionFormData, 'amount'> & { amount: number }): Promise<ApiResponse<{ transaction: Transaction }>> {
    const response: AxiosResponse<ApiResponse<{ transaction: Transaction }>> = await this.client.post(
      '/customer/transactions',
      transactionData
    );
    return response.data;
  }

  async getMyTransactions(page: number = 1, limit: number = 10): Promise<TransactionsResponse> {
    const response: AxiosResponse<TransactionsResponse> = await this.client.get(
      `/customer/transactions?page=${page}&limit=${limit}`
    );
    return response.data;
  }

  async getTransaction(id: string): Promise<ApiResponse<{ transaction: Transaction }>> {
    const response: AxiosResponse<ApiResponse<{ transaction: Transaction }>> = await this.client.get(
      `/customer/transactions/${id}`
    );
    return response.data;
  }

  // Employee endpoints
  async getPendingTransactions(page: number = 1, limit: number = 20): Promise<TransactionsResponse> {
    const response: AxiosResponse<TransactionsResponse> = await this.client.get(
      `/employee/transactions/pending?page=${page}&limit=${limit}`
    );
    return response.data;
  }

  async verifyTransaction(id: string): Promise<ApiResponse<{ transaction: Transaction }>> {
    const response: AxiosResponse<ApiResponse<{ transaction: Transaction }>> = await this.client.patch(
      `/employee/transactions/${id}/verify`
    );
    return response.data;
  }

  async submitTransaction(id: string): Promise<ApiResponse<{ transaction: Transaction }>> {
    const response: AxiosResponse<ApiResponse<{ transaction: Transaction }>> = await this.client.patch(
      `/employee/transactions/${id}/submit`
    );
    return response.data;
  }

  async bulkSubmitTransactions(transactionIds: string[]): Promise<ApiResponse<any>> {
    const response: AxiosResponse<ApiResponse<any>> = await this.client.post(
      '/employee/transactions/bulk-submit',
      { transactionIds }
    );
    return response.data;
  }

  async getDashboardStats(): Promise<ApiResponse<any>> {
    const response: AxiosResponse<ApiResponse<any>> = await this.client.get('/employee/dashboard/stats');
    return response.data;
  }
}

export const apiService = new ApiService();