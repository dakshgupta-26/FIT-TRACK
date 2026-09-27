import apiClient from './apiClient';

export interface ConversationItem {
  id: string;
  isGroup: boolean;
  groupTitle?: string;
  otherUser: {
    id: string;
    name: string;
    avatar: string;
    badge: string;
    isOnline: boolean;
    lastSeen: string;
  };
  lastMessage?: {
    text: string;
    sender: string;
    senderName: string;
    createdAt: string;
  };
  unreadCount: number;
  updatedAt: string;
}

export interface DirectMessageItem {
  id: string;
  conversation: string;
  sender: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  mediaUrl?: string;
  audioUrl?: string;
  workoutAttachment?: {
    workoutType: string;
    calories: number;
    duration: string;
  };
  status: 'sent' | 'delivered' | 'read';
  isMe: boolean;
  time: string;
  createdAt: string;
}

export const messagesApi = {
  getConversations: async (): Promise<{ success: boolean; data: ConversationItem[] }> => {
    const { data } = await apiClient.get('/conversations');
    return data;
  },

  getOrCreateConversation: async (recipientId: string): Promise<{ success: boolean; data: ConversationItem }> => {
    const { data } = await apiClient.post('/conversations', { recipientId });
    return data;
  },

  getMessages: async (conversationId: string, params?: { page?: number; limit?: number }): Promise<{ success: boolean; data: DirectMessageItem[]; total: number }> => {
    const { data } = await apiClient.get(`/conversations/${conversationId}/messages`, { params });
    return data;
  },

  sendMessage: async (conversationId: string, payload: { text?: string; mediaUrl?: string; workoutAttachment?: any }): Promise<{ success: boolean; data: DirectMessageItem }> => {
    const { data } = await apiClient.post(`/conversations/${conversationId}/messages`, payload);
    return data;
  },
};

export default messagesApi;
