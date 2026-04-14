import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 60000,
});

// Attach JWT token to every request if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('admin_token');
      if (window.location.pathname.startsWith('/admin') && !window.location.pathname.includes('/login')) {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(err);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
};

export const photosAPI = {
  getAll: (page = 1, limit = 20) => api.get(`/photos?page=${page}&limit=${limit}`),
  search: (photoNumber) => api.get(`/photos/search/${photoNumber}`),
  upload: (formData, onProgress) =>
    api.post('/photos/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: onProgress,
    }),
  uploadMultiple: (formData, onProgress) =>
    api.post('/photos/upload-multiple', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: onProgress,
    }),
  delete: (id) => api.delete(`/photos/${id}`),
};

export default api;
