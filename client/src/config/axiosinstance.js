import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:3000/',
});

// ponytail: attach token on every request; skip for auth endpoints
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default instance;
