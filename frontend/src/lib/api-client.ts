import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

/**
 * Dynamically resolves the API Base URL for development and production environments.
 * Checks NEXT_PUBLIC_API_URL first, then VITE_API_URL, defaulting to local port 5000.
 */
export const getApiBaseUrl = (): string => {
  const envUrl =
    (typeof import.meta !== 'undefined' && import.meta.env?.NEXT_PUBLIC_API_URL) ||
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) ||
    (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL) ||
    'http://localhost:5000/api';

  const cleanUrl = envUrl.trim().replace(/\/+$/, '');
  // Ensure the base URL ends with /api if not already specified
  if (!cleanUrl.endsWith('/api')) {
    return `${cleanUrl}/api`;
  }
  return cleanUrl;
};

/**
 * Production-ready Axios Client for ForgeOS / FitTracker AI
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 15000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
apiClient.interceptors.request.use(
  (config) => {
    // Ensure baseURL is dynamically updated if environment variables change
    config.baseURL = getApiBaseUrl();

    const token = localStorage.getItem('authToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for centralized error normalization
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    const currentBaseUrl = getApiBaseUrl();

    if (!error.response) {
      // Network failure, CORS issue, or server unreachable
      const customError = new Error(
        `Unable to reach backend server (${currentBaseUrl}). Please verify network connectivity and backend service status.`
      );
      (customError as any).isNetworkError = true;
      (customError as any).request = error.request;
      return Promise.reject(customError);
    }

    const { status, data } = error.response;

    if (status === 401) {
      console.warn('🔒 401 Unauthorized: Session expired or invalid token.');
    } else if (status === 403) {
      console.warn('⛔ 403 Forbidden: Access denied.');
    } else if (status === 429) {
      console.warn('⏳ 429 Too Many Requests: Rate limit exceeded.');
    } else if (status >= 500) {
      console.error(`💥 ${status} Server Error (${currentBaseUrl}):`, data?.message || 'Internal Server Error');
    }

    return Promise.reject(error);
  }
);

export default apiClient;
