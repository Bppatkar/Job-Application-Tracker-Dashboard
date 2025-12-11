import axios from 'axios';
const API_URL = 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_URL,
});

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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.message?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  changePassword: (data) => api.put('/users/password', data),
  uploadAvatar: (formData) =>
    api.post('/users/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  deleteAvatar: () => api.delete('/users/avatar'),
  uploadResume: (formData) =>
    api.post('/users/resume', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  downloadResume: (filename) =>
    api.get(`/users/resume/${filename}`, {
      responseType: 'blob',
    }),
  deleteResume: () => api.delete('/users/resume'),
};

export const applicationApi = {
  getAll: () => api.get('/applications'),
  getOne: (id) => api.get(`/applications/${id}`),
  create: (data) => api.post('/applications', data),
  update: (id, data) => api.put(`/applications/${id}`, data),
  delete: (id) => api.delete(`/applications/${id}`),
  getStats: () => api.get('/applications/stats'),
  search: (query) => api.get(`/applications/search?q=${query}`),
  uploadResume: (id, formData) =>
    api.post(`/applications/${id}/resume`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  uploadCoverLetter: (id, formData) =>
    api.post(`/applications/${id}/cover-letter`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

// file upload
export const fileAPI = {
  download: (type, filename) =>
    api.get(`/files/${type}/${filename}`, {
      responseType: 'blob',
    }),
  delete: (type, filename) => api.delete(`/files/${type}/${filename}`),
};

export default api;
