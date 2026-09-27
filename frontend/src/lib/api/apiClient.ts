import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

/**
 * Dynamically resolves the API Base URL for development and production environments.
 * Prioritizes NEXT_PUBLIC_API_URL, then VITE_API_URL.
 * In production non-localhost environments, defaults to production Render domain.
 */
export const getApiBaseUrl = (): string => {
  const envUrl =
    (typeof import.meta !== 'undefined' && (import.meta as any).env?.NEXT_PUBLIC_API_URL) ||
    (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_API_URL) ||
    (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL);

  if (envUrl) {
    const cleanUrl = envUrl.trim().replace(/\/+$/, '');
    return cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`;
  }

  // Production fallback for deployed domains (never use localhost in production)
  if (
    typeof window !== 'undefined' &&
    !window.location.hostname.includes('localhost') &&
    !window.location.hostname.includes('127.0.0.1')
  ) {
    return 'https://fit-track-ayrm.onrender.com/api';
  }

  return 'http://localhost:5000/api';
};

/**
 * Dynamically resolves the Socket.IO Base URL.
 */
export const getSocketUrl = (): string => {
  const envWs =
    (typeof import.meta !== 'undefined' && (import.meta as any).env?.NEXT_PUBLIC_SOCKET_URL) ||
    (typeof import.meta !== 'undefined' && (import.meta as any).env?.NEXT_PUBLIC_WS_URL) ||
    (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_SOCKET_URL);

  if (envWs) {
    return envWs.trim().replace(/\/+$/, '').replace(/\/api$/, '');
  }

  const apiBase = getApiBaseUrl();
  return apiBase.replace(/\/api$/, '');
};

/**
 * Production Centralized API Client
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 30000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT token
apiClient.interceptors.request.use(
  (config) => {
    config.baseURL = getApiBaseUrl();
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('authToken') : null;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Safe Error Normalization
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError<any>) => {
    if (!error.response) {
      const isTimeout = error.code === 'ECONNABORTED' || error.message?.includes('timeout');
      const userMessage = isTimeout
        ? 'The request took longer than expected. Please check your connection and retry.'
        : 'Unable to connect to FitTracker services. Please try again.';

      const customError = new Error(userMessage);
      (customError as any).isNetworkError = true;
      (customError as any).isTimeout = isTimeout;
      return Promise.reject(customError);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
