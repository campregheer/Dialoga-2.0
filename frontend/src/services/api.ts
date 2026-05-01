import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ||'/api',
  withCredentials: true, // Importante para enviar e receber cookies (JWT)
});

export default api;
