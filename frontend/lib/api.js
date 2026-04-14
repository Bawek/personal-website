import axios from 'axios';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-domain.com/api' 
  : '/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (userData) => api.put('/auth/profile', userData),
  changePassword: (passwordData) => api.put('/auth/password', passwordData),
};

// Content API
export const contentAPI = {
  getAll: (params) => api.get('/content', { params }),
  getBySlug: (slug, params) => api.get(`/content/${slug}`, { params }),
  create: (contentData) => api.post('/content', contentData),
  update: (id, contentData) => api.put(`/content/${id}`, contentData),
  delete: (id) => api.delete(`/content/${id}`),
  like: (id) => api.post(`/content/${id}/like`),
  addTranslation: (id, translationData) => api.post(`/content/${id}/translations`, translationData),
};

// Settings API
export const settingsAPI = {
  get: () => api.get('/settings'),
  update: (settingsData) => api.put('/settings', settingsData),
  updateContact: (contactData) => api.put('/settings/contact', contactData),
  updateTheme: (themeData) => api.put('/settings/theme', themeData),
  updateSEO: (seoData) => api.put('/settings/seo', seoData),
  updateFeatures: (featuresData) => api.put('/settings/features', featuresData),
  updateLanguages: (languageData) => api.put('/settings/languages', languageData),
};

// Users API
export const usersAPI = {
  getAll: (params) => api.get('/users', { params }),
  getById: (id) => api.get(`/users/${id}`),
  updateRole: (id, roleData) => api.put(`/users/${id}/role`, roleData),
  updateStatus: (id, statusData) => api.put(`/users/${id}/status`, statusData),
  delete: (id) => api.delete(`/users/${id}`),
};

// Projects API
export const projectsAPI = {
  getAll: () => api.get('/projects'),
  getById: (id) => api.get(`/projects/${id}`),
  create: (projectData) => api.post('/projects', projectData),
  update: (id, projectData) => api.put(`/projects/${id}`, projectData),
  delete: (id) => api.delete(`/projects/${id}`),
  toggleFeatured: (id) => api.patch(`/projects/${id}/toggle-featured`),
};

// Skills API
export const skillsAPI = {
  getAll: () => api.get('/skills'),
  getById: (id) => api.get(`/skills/${id}`),
  create: (skillData) => api.post('/skills', skillData),
  update: (id, skillData) => api.put(`/skills/${id}`, skillData),
  delete: (id) => api.delete(`/skills/${id}`),
};

// Experience API
export const experienceAPI = {
  getAll: () => api.get('/experience'),
  getById: (id) => api.get(`/experience/${id}`),
  create: (experienceData) => api.post('/experience', experienceData),
  update: (id, experienceData) => api.put(`/experience/${id}`, experienceData),
  delete: (id) => api.delete(`/experience/${id}`),
};

// About API
export const aboutAPI = {
  get: () => api.get('/about'),
  update: (aboutData) => api.put('/about', aboutData),
};

// Contact API
export const contactAPI = {
  get: () => api.get('/contact'),
  update: (contactData) => api.put('/contact', contactData),
  getMessages: () => api.get('/contact/messages'),
  sendMessage: (messageData) => api.post('/contact/messages', messageData),
  markMessageAsRead: (id) => api.patch(`/contact/messages/${id}/read`),
  deleteMessage: (id) => api.delete(`/contact/messages/${id}`),
};

export default api;
