import apiClient from './apiClient';

export interface LiveStreamSession {
  id: string;
  host: string;
  hostName: string;
  hostAvatar: string;
  title: string;
  description: string;
  thumbnail: string;
  roomName: string;
  status: 'SCHEDULED' | 'LIVE' | 'ENDED';
  startedAt: string;
  viewerCount: number;
  peakViewers: number;
  telemetry: {
    workoutType: string;
    avgHeartRate: number;
    caloriesBurned: number;
  };
}

export interface LiveSessionJoinResponse {
  success: boolean;
  data: {
    token: string;
    roomName: string;
    stream: LiveStreamSession;
    livekitWsUrl: string;
  };
}

export const liveApi = {
  createStream: async (payload: {
    title: string;
    description?: string;
    workoutType?: string;
    avgHeartRate?: number;
    caloriesBurned?: number;
    thumbnail?: string;
  }): Promise<LiveSessionJoinResponse> => {
    const { data } = await apiClient.post('/live/create', payload);
    return data;
  },

  getActiveStreams: async (): Promise<{ success: boolean; data: LiveStreamSession[] }> => {
    const { data } = await apiClient.get('/live/active');
    return data;
  },

  getStream: async (id: string): Promise<{ success: boolean; data: LiveStreamSession }> => {
    const { data } = await apiClient.get(`/live/${id}`);
    return data;
  },

  joinStream: async (id: string): Promise<LiveSessionJoinResponse> => {
    const { data } = await apiClient.post(`/live/${id}/join`);
    return data;
  },

  endStream: async (id: string): Promise<{ success: boolean; message: string }> => {
    const { data } = await apiClient.post(`/live/${id}/end`);
    return data;
  },
};

export default liveApi;
