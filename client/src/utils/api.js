import axios from 'axios';
const API_URL = 'http:localhost:8000/api/v1';

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
      window.location.href('/login');
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  register: (userData) => api.post('/auth/register', userData),
  register: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
};

export const userAPI = {
  updateProfile: (data) => api.put('/user/profile', data),
  changePassword: (data) => api.put('/user/password', data),
  uploadAvatar: (formData) => {
    return api.post('/user/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

export const applicationApi = {
  getAll: () => api.get('/application'),
  getOne: (id) => api.get(`/application/${id}`),
  create: (data) => api.post('/application', data),
  update: (id, data) => api.put(`/application/${id}`, data),
  delete: (id) => api.delete(`/application/${id}`),
  getStats: () => api.get(`/application/stats`),
  search: (query) => api.get(`/application/search?q=${query}`),
};

// file upload
export const fileApi = {
  uploadResume: (formData) => {
    return api.post('/upload/resume', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  downloadResume: (fileName) => {
    return api.get(`/download/resume/${fileName}`, {
      responseType: 'blob',
    });
  },
};

export default api;
