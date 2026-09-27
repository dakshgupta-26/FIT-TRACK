import apiClient from './apiClient';
import { CommunityGroup } from '@/data/communityData';

export const groupsApi = {
  getGroups: async (): Promise<{ success: boolean; data: CommunityGroup[] }> => {
    const { data } = await apiClient.get('/community/groups');
    return data;
  },

  joinGroup: async (groupId: string): Promise<{ success: boolean; isJoined: boolean; membersCount: number }> => {
    const { data } = await apiClient.post(`/community/groups/${groupId}/join`);
    return data;
  },
};

export default groupsApi;
