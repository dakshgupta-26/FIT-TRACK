import apiClient from './apiClient';

export interface SearchResults {
  users: Array<{ id: string; name: string; avatar: string; badge: string }>;
  posts: Array<{ id: string; caption: string; authorName: string; media: string }>;
  reels: Array<{ id: string; caption: string; videoUrl: string; coverImage: string }>;
  groups: Array<{ id: string; name: string; category: string; icon: string }>;
  challenges: Array<{ id: string; title: string; rewardXP: number }>;
}

export const searchApi = {
  search: async (query: string): Promise<{ success: boolean; data: SearchResults }> => {
    const { data } = await apiClient.get('/search', { params: { q: query } });
    return data;
  },
};

export default searchApi;
