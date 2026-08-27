import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

/**
 * Dynamically resolves the API Base URL for development and production environments.
 * Checks NEXT_PUBLIC_API_URL first, then VITE_API_URL, defaulting to local port 5000.
 */
export const getApiBaseUrl = (): string => {
  const envUrl =
    (typeof import.meta !== 'undefined' && import.meta.env?.NEXT_PUBLIC_API_URL) ||
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) ||
    (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL);

  if (envUrl) {
    const cleanUrl = envUrl.trim().replace(/\/+$/, '');
    return cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`;
  }

  // If in browser and not on localhost, use actual Render backend domain as default fallback
  if (typeof window !== 'undefined' && !window.location.hostname.includes('localhost') && !window.location.hostname.includes('127.0.0.1')) {
    return 'https://fit-track-ayrm.onrender.com/api';
  }

  return 'http://localhost:5000/api';
};

/**
 * Production-ready Axios Client for FitTrack
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 45000, // 45 seconds to accommodate cloud instance cold-starts and SMTP verification
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token and request metadata
apiClient.interceptors.request.use(
  (config) => {
    // Ensure baseURL is dynamically updated if environment variables change
    config.baseURL = getApiBaseUrl();

    // Attach correlation tracking ID and timestamp
    (config as any).metadata = { startTime: Date.now() };

    const token = localStorage.getItem('authToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for centralized, safe error normalization & developer telemetry
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    const startTime = (response.config as any)?.metadata?.startTime;
    const duration = startTime ? Date.now() - startTime : undefined;
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[FitTrack API] ${response.config.method?.toUpperCase()} ${response.config.url} -> ${response.status} (${duration}ms)`);
    }
    return response;
  },
  (error: AxiosError<any>) => {
    const startTime = (error.config as any)?.metadata?.startTime;
    const duration = startTime ? Date.now() - startTime : undefined;
    const method = error.config?.method?.toUpperCase() || 'HTTP';
    const url = error.config?.url || 'endpoint';

    // Structured developer telemetry (safe: never logs sensitive body payload or tokens)
    if (!error.response) {
      const isTimeout = error.code === 'ECONNABORTED' || error.message?.includes('timeout');
      console.error(`[FitTrack Network Error] ${method} ${url} | Code: ${error.code || 'NO_RESPONSE'} | Latency: ${duration}ms | Reason: ${error.message}`);

      let userFacingMessage = 'FitTrack is temporarily unable to connect to its services. Please try again.';
      if (isTimeout) {
        userFacingMessage = 'The request took longer than expected to complete. Please try again.';
      }

      const customError = new Error(userFacingMessage);
      (customError as any).isNetworkError = true;
      (customError as any).isTimeout = isTimeout;
      (customError as any).request = error.request;
      return Promise.reject(customError);
    }

    const { status, data } = error.response;
    console.warn(`[FitTrack API Response] ${method} ${url} -> Status: ${status} | Latency: ${duration}ms | Message: ${data?.message || data?.error || 'Error'}`);

    return Promise.reject(error);
  }
);

export default apiClient;
