import apiClient from './apiClient';

export interface NotificationItem {
  id: string;
  recipient: string;
  sender?: string;
  senderName?: string;
  senderAvatar?: string;
  type: 'like' | 'comment' | 'reply' | 'follow' | 'message' | 'mention' | 'live' | 'system';
  title: string;
  message: string;
  referenceId?: string;
  referenceType?: string;
  read: boolean;
  timeAgo: string;
  createdAt: string;
}

export const notificationsApi = {
  getNotifications: async (params?: { page?: number; limit?: number }): Promise<{ success: boolean; data: NotificationItem[]; unreadCount: number }> => {
    const { data } = await apiClient.get('/notifications', { params });
    return data;
  },

  markRead: async (id: string): Promise<{ success: boolean; unreadCount: number }> => {
    const { data } = await apiClient.patch(`/notifications/${id}/read`);
    return data;
  },

  markAllRead: async (): Promise<{ success: boolean; unreadCount: number }> => {
    const { data } = await apiClient.patch('/notifications/read-all');
    return data;
  },
};

export default notificationsApi;
