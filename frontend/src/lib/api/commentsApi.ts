import apiClient from './apiClient';

export const commentsApi = {
  addPostComment: async (postId: string, text: string): Promise<{ success: boolean; data: any; commentsCount: number }> => {
    const { data } = await apiClient.post(`/posts/${postId}/comments`, { text });
    return data;
  },

  addReelComment: async (reelId: string, text: string): Promise<{ success: boolean; data: any; commentsCount: number }> => {
    const { data } = await apiClient.post(`/reels/${reelId}/comments`, { text });
    return data;
  },
};

export default commentsApi;
