import { useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import apiClient from '@/lib/api-client';

export const useEmailNotifications = () => {
  const { toast } = useToast();

  // Send welcome email after signup
  const sendWelcomeEmail = useCallback(async (userData: {
    firstName?: string;
    lastName?: string;
    email: string;
    birthDate?: string;
  }) => {
    try {
      const { data: result } = await apiClient.post('/send-welcome-email', { userData });
      console.log('Welcome email sent:', result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error: any) {
      console.error('Error sending welcome email:', error);
      return { success: false, error: error.response?.data?.error || error.message };
    }
  }, []);

  // Send login notification
  const sendLoginNotification = useCallback(async (userData: {
    firstName?: string;
    lastName?: string;
    email: string;
  }) => {
    try {
      const { data: result } = await apiClient.post('/send-login-notification', { userData });
      console.log('Login notification sent:', result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error: any) {
      console.error('Error sending login notification:', error);
      return { success: false, error: error.response?.data?.error || error.message };
    }
  }, []);

  // Send welcome email with toast notification
  const sendWelcomeEmailWithToast = useCallback(async (userData: {
    firstName?: string;
    lastName?: string;
    email: string;
    birthDate?: string;
  }) => {
    const result = await sendWelcomeEmail(userData);
    
    if (result.success) {
      toast({
        title: "Welcome Email Sent! 📧",
        description: "Check your inbox for a personalized welcome message.",
        duration: 5000,
      });
    } else {
      toast({
        title: "Email Failed",
        description: "Couldn't send welcome email. Please try again later.",
        variant: "destructive",
        duration: 3000,
      });
    }
    
    return result;
  }, [sendWelcomeEmail, toast]);

  // Send login notification with toast
  const sendLoginNotificationWithToast = useCallback(async (userData: {
    firstName?: string;
    lastName?: string;
    email: string;
  }) => {
    const result = await sendLoginNotification(userData);
    
    if (result.success) {
      toast({
        title: "Login Notification Sent! 🔐",
        description: "Security notification sent to your email.",
        duration: 4000,
      });
    } else {
      // Don't show error toast for login notifications to avoid spam
      console.log('Login notification failed:', result.error);
    }
    
    return result;
  }, [sendLoginNotification, toast]);

  return {
    sendWelcomeEmail,
    sendLoginNotification,
    sendWelcomeEmailWithToast,
    sendLoginNotificationWithToast,
  };
};
