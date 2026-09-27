import apiClient from './apiClient';

export const likesApi = {
  togglePostLike: async (postId: string): Promise<{ success: boolean; isLiked: boolean; likesCount: number }> => {
    const { data } = await apiClient.post(`/posts/${postId}/like`);
    return data;
  },

  toggleReelLike: async (reelId: string): Promise<{ success: boolean; isLiked: boolean; likesCount: number }> => {
    const { data } = await apiClient.post(`/reels/${reelId}/like`);
    return data;
  },
};

export default likesApi;
