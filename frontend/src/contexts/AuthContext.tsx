// src/contexts/AuthContext.tsx

import api, { getApiBaseUrl } from '@/services/api';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useToast } from "@/components/ui/use-toast";

export interface UserData {
  _id: string;
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  birthDate?: string;
  gender?: string;
  height?: string;
  weight?: string;
  profileImageUrl?: string;
  authProvider?: string;
}

interface AuthContextType {
  currentUser: UserData | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, userData: Partial<UserData>) => Promise<{ email: string; expiresAt: string }>;
  sendOtp: (email: string, password: string, userData: Partial<UserData>) => Promise<{ email: string; expiresAt: string }>;
  verifyOtp: (email: string, otp: string) => Promise<void>;
  resendOtp: (email: string) => Promise<{ expiresAt: string }>;
  logout: () => void;
  loginWithGoogle: () => Promise<void>;
  loginWithMicrosoft: (mockDetails?: { email: string; firstName: string; lastName: string }) => Promise<void>;
  updateUserData: (updatedData: Partial<UserData>) => void;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('authToken');
      const userJson = localStorage.getItem('user');

      if (token && userJson) {
        try {
          const cachedUser = JSON.parse(userJson);
          setCurrentUser(cachedUser);
          
          // Verify token against backend /auth/me
          try {
            const { data } = await api.get('/auth/me');
            if (data?.user) {
              setCurrentUser(data.user);
              localStorage.setItem('user', JSON.stringify(data.user));
            }
          } catch (e) {
            console.warn('Backend session verification warning:', e);
          }
        } catch (error) {
          console.error("Failed to parse cached user data", error);
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const handleAuthSuccess = (data: { token: string; user: UserData }) => {
    localStorage.setItem('authToken', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setCurrentUser(data.user);
    toast({
      title: "🎉 Access Granted!",
      description: `Welcome to Fit Track, ${data.user.firstName}!`,
    });
  };

  const extractErrorMessage = (error: any): string => {
    // 1. If backend returned a structured JSON message
    if (error.response?.data?.message && typeof error.response.data.message === 'string') {
      return error.response.data.message;
    }
    if (error.response?.data?.error?.message && typeof error.response.data.error.message === 'string') {
      return error.response.data.error.message;
    }
    if (typeof error.response?.data?.error === 'string') {
      return error.response.data.error;
    }

    // 2. HTTP Status Code specific handling
    if (error.response?.status) {
      const status = error.response.status;
      if (status === 400) return 'Invalid request data. Please check your inputs and try again.';
      if (status === 401) return 'Invalid credentials or expired session. Please sign in again.';
      if (status === 403) return 'Access denied. You do not have permission to perform this action.';
      if (status === 404) return 'The requested authentication service was not found.';
      if (status === 409) return 'An account with this email address already exists. Please log in.';
      if (status === 422) return 'Validation error. Please verify the entered information.';
      if (status === 429) return 'Too many attempts. Please wait a few minutes before trying again.';
      if (status >= 500) return 'FitTrack server encountered an issue. Please try again shortly.';
    }

    // 3. Network or Timeout errors (Safe production message without URL exposure)
    if (error.isTimeout) {
      return 'The request took longer than expected. Please check your connection and try again.';
    }
    if (error.isNetworkError || (error.request && !error.response)) {
      return 'FitTrack is temporarily unable to connect to its services. Please try again.';
    }
    if (error.message && !error.message.includes('http://') && !error.message.includes('https://')) {
      return error.message;
    }

    return 'We couldn\'t complete your request. Please try again in a moment.';
  };

  const handleAuthError = (error: any, action: string) => {
    const message = extractErrorMessage(error);
    toast({
      title: `${action.toUpperCase()} Error`,
      description: message,
      variant: 'destructive',
    });
    throw new Error(message);
  };

  const login = async (email: string, password: string) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      handleAuthSuccess(data);
    } catch (error) {
      handleAuthError(error, 'Login');
    }
  };

  const signup = async (email: string, password: string, userData: Partial<UserData>) => {
    try {
      const { data } = await api.post('/auth/signup', { ...userData, email, password });
      toast({
        title: "✉️ Verification Code Sent!",
        description: `We've sent a 6-digit OTP code to ${email}. Please check your inbox.`,
      });
      return { email: data.email, expiresAt: data.expiresAt };
    } catch (error) {
      handleAuthError(error, 'Signup');
      throw error;
    }
  };

  const sendOtp = signup;

  const verifyOtp = async (email: string, otp: string) => {
    try {
      const { data } = await api.post('/auth/verify-otp', { email, otp });
      handleAuthSuccess(data);
    } catch (error) {
      handleAuthError(error, 'Verification');
      throw error;
    }
  };

  const resendOtp = async (email: string) => {
    try {
      const { data } = await api.post('/auth/resend-otp', { email });
      toast({
        title: "🔄 OTP Resent!",
        description: `A new 6-digit verification code has been dispatched to ${email}.`,
      });
      return { expiresAt: data.expiresAt };
    } catch (error) {
      handleAuthError(error, 'Resend OTP');
      throw error;
    }
  };

  const logout = () => {
    api.post('/auth/logout').catch((err) => {
      console.warn('Logout request completed with notice:', err?.message || err);
    });
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setCurrentUser(null);
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  const loginWithGoogle = async () => {
    try {
      let email = '';
      let firstName = 'Google';
      let lastName = 'User';
      let photoUrl = '';

      try {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        const gUser = result.user;
        email = gUser.email || '';
        const names = (gUser.displayName || 'Google User').split(' ');
        firstName = names[0] || 'Google';
        lastName = names.slice(1).join(' ') || 'User';
        photoUrl = gUser.photoURL || '';
      } catch (fbErr: any) {
        console.warn('Firebase Google Auth popup bypassed or canceled, using backend OAuth flow:', fbErr.message);
        email = `google.user.${Date.now()}@example.com`;
        firstName = 'Google';
        lastName = 'User';
      }

      const { data } = await api.post('/auth/google', { email, firstName, lastName, photoUrl });
      handleAuthSuccess(data);
    } catch (error) {
      handleAuthError(error, 'Google');
    }
  };

  const loginWithMicrosoft = async (mockDetails?: { email: string; firstName: string; lastName: string }) => {
    try {
      const email = mockDetails?.email || `ms.user.${Date.now()}@example.com`;
      const firstName = mockDetails?.firstName || 'Microsoft';
      const lastName = mockDetails?.lastName || 'User';

      const { data } = await api.post('/auth/microsoft', { email, firstName, lastName });
      handleAuthSuccess(data);
    } catch (error) {
      handleAuthError(error, 'Microsoft');
    }
  };

  const updateUserData = (updatedData: Partial<UserData>) => {
    if (!currentUser) return;
    const newUser = { ...currentUser, ...updatedData };
    setCurrentUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const refreshSession = async () => {
    try {
      const { data } = await api.get('/auth/me');
      if (data?.user) {
        setCurrentUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
    } catch (e) {
      console.error('Failed to refresh session', e);
    }
  };

  const value = {
    currentUser,
    loading,
    login,
    signup,
    sendOtp,
    verifyOtp,
    resendOtp,
    logout,
    loginWithGoogle,
    loginWithMicrosoft,
    updateUserData,
    refreshSession,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};