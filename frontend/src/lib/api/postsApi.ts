import apiClient from './apiClient';
import { CommunityPost } from '@/data/communityData';

export interface FeedResponse {
  success: boolean;
  data: CommunityPost[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

export const postsApi = {
  getFeed: async (params?: { page?: number; limit?: number; category?: string; search?: string; userId?: string }): Promise<FeedResponse> => {
    const { data } = await apiClient.get('/posts', { params });
    return data;
  },

  getPost: async (id: string): Promise<{ success: boolean; data: CommunityPost }> => {
    const { data } = await apiClient.get(`/posts/${id}`);
    return data;
  },

  createPost: async (formDataOrJson: FormData | any): Promise<{ success: boolean; data: CommunityPost; message: string }> => {
    const isFormData = typeof FormData !== 'undefined' && formDataOrJson instanceof FormData;
    const { data } = await apiClient.post('/posts', formDataOrJson, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
    });
    return data;
  },

  deletePost: async (id: string): Promise<{ success: boolean; message: string }> => {
    const { data } = await apiClient.delete(`/posts/${id}`);
    return data;
  },

  toggleLike: async (id: string): Promise<{ success: boolean; isLiked: boolean; likesCount: number }> => {
    const { data } = await apiClient.post(`/posts/${id}/like`);
    return data;
  },

  toggleBookmark: async (id: string): Promise<{ success: boolean; isBookmarked: boolean }> => {
    const { data } = await apiClient.post(`/posts/${id}/save`);
    return data;
  },

  addComment: async (id: string, text: string): Promise<{ success: boolean; data: any; commentsCount: number }> => {
    const { data } = await apiClient.post(`/posts/${id}/comments`, { text });
    return data;
  },
};

export default postsApi;
