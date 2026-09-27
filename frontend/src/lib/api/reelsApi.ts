import apiClient from './apiClient';

export interface ReelData {
  id: string;
  author: {
    _id: string;
    firstName: string;
    lastName?: string;
    profileImageUrl?: string;
    badge?: string;
  };
  authorName: string;
  authorAvatar: string;
  authorBadge: string;
  videoUrl: string;
  coverImage: string;
  caption: string;
  audioTitle: string;
  workoutType: string;
  caloriesBurned: number;
  heartRate: number;
  likesCount: number;
  commentsCount: number;
  viewsCount: number;
  sharesCount: number;
  isLiked: boolean;
  isBookmarked: boolean;
  createdAt: string;
}

export const reelsApi = {
  getReels: async (params?: { page?: number; limit?: number }): Promise<{ success: boolean; data: ReelData[] }> => {
    const { data } = await apiClient.get('/reels', { params });
    return data;
  },

  createReel: async (formData: FormData): Promise<{ success: boolean; data: ReelData; message: string }> => {
    const { data } = await apiClient.post('/reels', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  toggleLikeReel: async (id: string): Promise<{ success: boolean; isLiked: boolean; likesCount: number }> => {
    const { data } = await apiClient.post(`/reels/${id}/like`);
    return data;
  },

  trackReelView: async (id: string): Promise<{ success: boolean; viewsCount: number }> => {
    const { data } = await apiClient.post(`/reels/${id}/view`);
    return data;
  },

  addReelComment: async (id: string, text: string): Promise<{ success: boolean; data: any; commentsCount: number }> => {
    const { data } = await apiClient.post(`/reels/${id}/comments`, { text });
    return data;
  },
};

export default reelsApi;
