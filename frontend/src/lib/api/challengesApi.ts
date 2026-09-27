import apiClient from './apiClient';
import { CommunityChallenge, LeaderboardEntry } from '@/data/communityData';

export const challengesApi = {
  getChallenges: async (): Promise<{ success: boolean; data: CommunityChallenge[] }> => {
    const { data } = await apiClient.get('/community/challenges');
    return data;
  },

  joinChallenge: async (challengeId: string): Promise<{ success: boolean; isJoined: boolean; participantsCount: number }> => {
    const { data } = await apiClient.post(`/community/challenges/${challengeId}/join`);
    return data;
  },

  getLeaderboard: async (metric: 'steps' | 'calories' = 'steps'): Promise<{ success: boolean; data: LeaderboardEntry[] }> => {
    const { data } = await apiClient.get('/community/leaderboard', { params: { metric } });
    return data;
  },
};

export default challengesApi;
