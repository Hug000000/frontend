import axios from 'axios';

const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_BACK_URL}`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
