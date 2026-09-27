import apiClient from './apiClient';

export const authApi = {
  login: async (email: string, password: string) => {
    const { data } = await apiClient.post('/auth/login', { email, password });
    return data;
  },

  signup: async (userData: any) => {
    const { data } = await apiClient.post('/auth/signup', userData);
    return data;
  },

  verifyOtp: async (email: string, otp: string) => {
    const { data } = await apiClient.post('/auth/verify-otp', { email, otp });
    return data;
  },

  resendOtp: async (email: string) => {
    const { data } = await apiClient.post('/auth/resend-otp', { email });
    return data;
  },

  getMe: async () => {
    const { data } = await apiClient.get('/auth/me');
    return data;
  },

  logout: async () => {
    const { data } = await apiClient.post('/auth/logout');
    return data;
  },
};

export default authApi;
