import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'https://codex2-indol.vercel.app', // 👈 Make sure this is your backend API, not frontend
  withCredentials: true,  // only needed if you're using cookies-based auth
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Automatically attach token to every request
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // token saved at login
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default axiosClient;
