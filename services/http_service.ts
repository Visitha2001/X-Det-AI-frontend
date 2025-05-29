// http_service.ts
import axios from 'axios';

const http = axios.create({
  baseURL: 'http://127.0.0.1:8002',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor to handle errors
http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      return Promise.reject(error.response.data);
    } else if (error.request) {
      return Promise.reject(new Error('No response from server'));
    } else {
      return Promise.reject(error);
    }
  }
);

export default http;