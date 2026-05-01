import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true, // Importante para enviar e receber cookies (JWT)
});

export default api;
