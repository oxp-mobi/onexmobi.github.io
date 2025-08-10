import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

interface ApiResponse<T = any> {
  data: T;
  success: boolean;
  message?: string;
}

class ApiClient {
  private client: AxiosInstance;
  private retryAttempts: number = 3;
  private retryDelay: number = 1000;

  constructor() {
    this.client = axios.create({
      baseURL: BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        const timestamp = new Date().toISOString();
        config.headers['X-Timestamp'] = timestamp;
        
        console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        console.log(`✅ API Response: ${response.status} ${response.config.url}`);
        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as any;

        // Handle network errors with retry
        if (error.code === 'NETWORK_ERROR' || error.code === 'ECONNABORTED') {
          console.warn('🔄 Network issues detected, attempting retry...');
          
          if (originalRequest && !originalRequest._retry && this.retryAttempts > 0) {
            originalRequest._retry = true;
            
            await this.delay(this.retryDelay);
            this.retryDelay *= 2; // Exponential backoff
            this.retryAttempts--;
            
            return this.client(originalRequest);
          }
        }

        // Handle 401 unauthorized
        if (error.response?.status === 401) {
          // Clear auth data and redirect to login
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_user');
          
          if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin') {
            window.location.href = '/admin';
          }
        }

        console.error('❌ API Error:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          url: error.config?.url,
          method: error.config?.method,
        });

        return Promise.reject(error);
      }
    );
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  setAuthToken(token: string | null): void {
    if (token) {
      this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete this.client.defaults.headers.common['Authorization'];
    }
  }

  // HTTP Methods
  async get<T = any>(url: string, config = {}): Promise<AxiosResponse<T>> {
    return this.client.get<T>(url, config);
  }

  async post<T = any>(url: string, data = {}, config = {}): Promise<AxiosResponse<T>> {
    return this.client.post<T>(url, data, config);
  }

  async put<T = any>(url: string, data = {}, config = {}): Promise<AxiosResponse<T>> {
    return this.client.put<T>(url, data, config);
  }

  async delete<T = any>(url: string, config = {}): Promise<AxiosResponse<T>> {
    return this.client.delete<T>(url, config);
  }
}

export const apiClient = new ApiClient();

// Specific API functions
export const paymentApi = {
  // eSIM Plans
  getPlans: async () => {
    const response = await apiClient.get('/esim-plans');
    return response.data;
  },

  // Payment Processing
  createPayment: async (paymentData: any) => {
    const response = await apiClient.post('/payments/create', paymentData);
    return response.data;
  },

  getPaymentStatus: async (transactionId: string) => {
    const response = await apiClient.get(`/payments/${transactionId}/status`);
    return response.data;
  },

  // Contact Form
  submitContactForm: async (contactData: any) => {
    const response = await apiClient.post('/contact', contactData);
    return response.data;
  },
};

export const adminApi = {
  // Authentication
  login: async (email: string, password: string) => {
    const response = await apiClient.post('/admin/login', { email, password });
    return response.data;
  },

  // Dashboard
  getDashboardData: async () => {
    const response = await apiClient.get('/admin/dashboard');
    return response.data;
  },

  // Payment Gateway Configuration
  getPaymentConfig: async () => {
    const response = await apiClient.get('/admin/payment-gateway/config');
    return response.data;
  },

  updatePaymentConfig: async (config: any) => {
    const response = await apiClient.post('/admin/payment-gateway/config', config);
    return response.data;
  },
};

export default apiClient;