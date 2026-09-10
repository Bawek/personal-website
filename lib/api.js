import axios from 'axios';

export const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || '';

/**
 * Axios instance configured for API calls
 * Automatically adds auth token from localStorage
 */
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL || '',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Only run on client side
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
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
      // Token expired or invalid - redirect to login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

// API helper functions
export const settingsAPI = {
  get: () => api.get('/api/settings'),
  update: (data) => api.put('/api/settings', data),
};

export const projectsAPI = {
  getAll: () => api.get('/api/projects'),
  get: (id) => api.get(`/api/projects/${id}`),
  create: (data) => api.post('/api/projects', data),
  update: (id, data) => api.put(`/api/projects/${id}`, data),
  delete: (id) => api.delete(`/api/projects/${id}`),
};

export const skillsAPI = {
  getAll: () => api.get('/api/skills'),
  get: (id) => api.get(`/api/skills/${id}`),
  create: (data) => api.post('/api/skills', data),
  update: (id, data) => api.put(`/api/skills/${id}`, data),
  delete: (id) => api.delete(`/api/skills/${id}`),
};

export const experienceAPI = {
  getAll: () => api.get('/api/experience'),
  get: (id) => api.get(`/api/experience/${id}`),
  create: (data) => api.post('/api/experience', data),
  update: (id, data) => api.put(`/api/experience/${id}`, data),
  delete: (id) => api.delete(`/api/experience/${id}`),
};

export const aboutAPI = {
  get: () => api.get('/api/about'),
  update: (data) => api.put('/api/about', data),
};

export const contactAPI = {
  get: () => api.get('/api/contact'),
  sendMessage: (data) => api.post('/api/contact', data),
  submit: (data) => api.post('/api/contact', data),
  getDefaultAdmin: () => api.get('/api/contact/admin'),
};

export const authAPI = {
  login: (credentials) => api.post('/api/auth/login', credentials),
  register: (userData) => api.post('/api/auth/register', userData),
  me: () => api.get('/api/auth/me'),
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  },
};

export const contentAPI = {
  getAll: () => api.get('/api/content'),
  get: (id) => api.get(`/api/content/${id}`),
  create: (data) => api.post('/api/content', data),
  update: (id, data) => api.put(`/api/content/${id}`, data),
  delete: (id) => api.delete(`/api/content/${id}`),
};

export const chatAPI = {
  send: (message) => api.post('/api/chat', { message }),
};

export const syncAPI = {
  github: () => api.post('/api/sync/github'),
  linkedin: () => api.post('/api/sync/linkedin'),
};

export const uploadAPI = {
  upload: (file, folder) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    return api.post('/api/uploads', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

export default api;
