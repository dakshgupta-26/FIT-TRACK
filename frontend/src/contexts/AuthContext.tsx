// src/contexts/AuthContext.tsx

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useToast } from "@/components/ui/use-toast";
import api from '@/services/api';

// This interface matches our MongoDB User model
// Ensure optional fields are marked as such
interface UserData {
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
}

interface AuthContextType {
  currentUser: UserData | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, userData: Partial<UserData>) => Promise<void>;
  logout: () => void;
  loginWithGoogle: () => Promise<void>;
  // Add a function to update user data
  updateUserData: (updatedData: Partial<UserData>) => void;
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
    const initializeAuth = () => {
      const token = localStorage.getItem('authToken');
      const userJson = localStorage.getItem('user');

      if (token && userJson) {
        try {
          setCurrentUser(JSON.parse(userJson));
        } catch (error) {
          console.error("Failed to parse user data from localStorage", error);
          // Clear corrupted data
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
      title: "Success!",
      description: `Welcome back, ${data.user.firstName}!`,
    });
  };

  const handleAuthError = (error: any, action: 'login' | 'signup') => {
    const message = error.response?.data?.message || 'An unexpected error occurred.';
    toast({
      title: `${action === 'login' ? 'Login' : 'Registration'} Failed`,
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
      handleAuthError(error, 'login');
    }
  };

  const signup = async (email: string, password: string, userData: Partial<UserData>) => {
    try {
      const { data } = await api.post('/auth/register', { ...userData, email, password });
      handleAuthSuccess(data);
    } catch (error) {
      handleAuthError(error, 'signup');
    }
  };

  const logout = () => {
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
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      // TODO: Send result.user to your backend to create/login the user and get a JWT
      console.log("Logged in with Google (Firebase):", result.user);
      toast({
        title: 'Google Login (Incomplete)',
        description: 'Backend integration for Google Sign-In is pending.'
      })
    } catch (error: any) {
      toast({
        title: 'Google Login Failed',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    }
  };

  // New function to update user data in the context and localStorage
  const updateUserData = (updatedData: Partial<UserData>) => {
    if (!currentUser) return;

    const newUser = { ...currentUser, ...updatedData };
    setCurrentUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const value = {
    currentUser,
    loading,
    login,
    signup,
    logout,
    loginWithGoogle,
    updateUserData, // Expose the new function through the context
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};