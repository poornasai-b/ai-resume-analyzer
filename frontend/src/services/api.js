import axios from 'axios';

const API = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    'http://localhost:8080/api',
});

API.interceptors.request.use((config) => {

  const token =
    localStorage.getItem('token');

  if (token) {
    config.headers.Authorization =
      `Bearer ${token}`;
  }

  return config;
});

export const register = (data) =>
  API.post('/auth/register', data);

export const login = (data) =>
  API.post('/auth/login', data);

export const analyzeResume = (formData) =>
  API.post('/resume/analyze', formData);

export const getHistory = () =>
  API.get('/resume/history');

export const getAnalysis = (id) =>
  API.get(`/resume/history/${id}`);