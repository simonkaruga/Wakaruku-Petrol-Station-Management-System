import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
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
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getCurrentUser: () => api.get('/auth/me'),
};

// Dashboard endpoints
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
  getRecentActivity: () => api.get('/dashboard/recent'),
};

// Product endpoints
export const productAPI = {
  getAll: () => api.get('/products'),
  getById: (id) => api.get(`/products/${id}`),
  create: (productData) => api.post('/products', productData),
  update: (id, productData) => api.put(`/products/${id}`, productData),
  delete: (id) => api.delete(`/products/${id}`),
  updatePrice: (id, priceData) => api.patch(`/products/${id}/price`, priceData),
};

// Sale endpoints
export const saleAPI = {
  getAll: (params) => api.get('/sales', { params }),
  getById: (id) => api.get(`/sales/${id}`),
  create: (saleData) => api.post('/sales', saleData),
  update: (id, saleData) => api.put(`/sales/${id}`, saleData),
  delete: (id) => api.delete(`/sales/${id}`),
  getDailyTotals: (date) => api.get(`/sales/daily-totals/${date}`),
};

// Delivery endpoints
export const deliveryAPI = {
  getAll: (params) => api.get('/deliveries', { params }),
  getById: (id) => api.get(`/deliveries/${id}`),
  create: (deliveryData) => api.post('/deliveries', deliveryData),
  update: (id, deliveryData) => api.put(`/deliveries/${id}`, deliveryData),
  delete: (id) => api.delete(`/deliveries/${id}`),
};

// Credit endpoints
export const creditAPI = {
  getAll: (params) => api.get('/credit', { params }),
  getById: (id) => api.get(`/credit/${id}`),
  create: (creditData) => api.post('/credit', creditData),
  recordPayment: (id, paymentData) => api.post(`/credit/${id}/payment`, paymentData),
  getCustomerBalance: (customerId) => api.get(`/credit/customer/${customerId}/balance`),
};

// Expense endpoints
export const expenseAPI = {
  getAll: (params) => api.get('/expenses', { params }),
  getById: (id) => api.get(`/expenses/${id}`),
  create: (expenseData) => api.post('/expenses', expenseData),
  update: (id, expenseData) => api.put(`/expenses/${id}`, expenseData),
  delete: (id) => api.delete(`/expenses/${id}`),
};

// Shift endpoints
export const shiftAPI = {
  getAll: () => api.get('/shifts'),
  getById: (id) => api.get(`/shifts/${id}`),
  start: () => api.post('/shifts/start'),
  end: (id) => api.patch(`/shifts/${id}/end`),
  getCurrent: () => api.get('/shifts/current'),
};

// Report endpoints
export const reportAPI = {
  generateSalesReport: (params) => api.get('/reports/sales', { params }),
  generateDeliveryReport: (params) => api.get('/reports/deliveries', { params }),
  generateExpenseReport: (params) => api.get('/reports/expenses', { params }),
  generateCreditReport: (params) => api.get('/reports/credit', { params }),
  generateInventoryReport: (params) => api.get('/reports/inventory', { params }),
};

// Settings endpoints
export const settingsAPI = {
  get: () => api.get('/settings'),
  update: (settingsData) => api.put('/settings', settingsData),
};

export default api;