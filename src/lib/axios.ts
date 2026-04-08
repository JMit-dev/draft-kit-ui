import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { ERROR_MESSAGES } from '@/shared/constants';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout
});

// Request interceptor - add auth token if available
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Can add auth token here when auth is implemented
    // const token = storage.get(STORAGE_KEYS.AUTH_TOKEN);
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor - handle errors globally
api.interceptors.response.use(
  (response) => response.data,
  (error: AxiosError<{ message?: string; errors?: unknown }>) => {
    // Network error (no response)
    if (!error.response) {
      return Promise.reject(new Error(ERROR_MESSAGES.NETWORK));
    }

    // HTTP errors
    const status = error.response.status;
    const message = error.response.data?.message;

    switch (status) {
      case 401:
        // Could trigger logout/redirect here
        return Promise.reject(new Error(ERROR_MESSAGES.UNAUTHORIZED));
      case 404:
        return Promise.reject(new Error(ERROR_MESSAGES.NOT_FOUND));
      case 500:
      case 502:
      case 503:
        return Promise.reject(new Error(ERROR_MESSAGES.GENERIC));
      default:
        return Promise.reject(new Error(message || ERROR_MESSAGES.GENERIC));
    }
  },
);
