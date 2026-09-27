import apiClient from './apiClient';

export interface UserProfileData {
  id: string;
  name: string;
  firstName: string;
  lastName?: string;
  email: string;
  avatar: string;
  badge: string;
  bio: string;
  location: string;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  reelsCount: number;
  workoutStats: {
    totalWorkouts: number;
    totalMinutes: number;
    totalCalories: number;
    streakDays: number;
  };
  fitnessGoals: {
    title: string;
    target: string;
    progress: number;
  }[];
  isOnline: boolean;
  lastSeen: string;
  isFollowing: boolean;
  posts: any[];
  reels: any[];
}

export interface SuggestedAthlete {
  id: string;
  name: string;
  avatar: string;
  badge: string;
  role: string;
  score: string;
  location: string;
  isOnline: boolean;
}

export const usersApi = {
  getProfile: async (userId: string): Promise<{ success: boolean; data: UserProfileData }> => {
    const { data } = await apiClient.get(`/social/users/${userId}/profile`);
    return data;
  },

  getSuggestedUsers: async (): Promise<{ success: boolean; data: SuggestedAthlete[] }> => {
    const { data } = await apiClient.get('/social/users/suggested');
    return data;
  },

  followUser: async (userId: string): Promise<{ success: boolean; isFollowing: boolean; message: string }> => {
    const { data } = await apiClient.post(`/social/users/${userId}/follow`);
    return data;
  },

  unfollowUser: async (userId: string): Promise<{ success: boolean; isFollowing: boolean; message: string }> => {
    const { data } = await apiClient.delete(`/social/users/${userId}/follow`);
    return data;
  },

  getFollowers: async (userId: string): Promise<{ success: boolean; data: any[] }> => {
    const { data } = await apiClient.get(`/social/users/${userId}/followers`);
    return data;
  },

  getFollowing: async (userId: string): Promise<{ success: boolean; data: any[] }> => {
    const { data } = await apiClient.get(`/social/users/${userId}/following`);
    return data;
  },
};

export default usersApi;
