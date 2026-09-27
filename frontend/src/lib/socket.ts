import { io, Socket } from 'socket.io-client';
import { getSocketUrl } from './api/apiClient';

let socket: Socket | null = null;
let connectionListeners: ((connected: boolean) => void)[] = [];

/**
 * Initializes or returns the singleton Socket.IO connection.
 * Automatically authenticates with current user's JWT.
 */
export const getSocket = (): Socket => {
  if (socket && socket.connected) {
    return socket;
  }

  const socketUrl = getSocketUrl();
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('authToken') : null;

  if (!socket) {
    socket = io(socketUrl, {
      auth: {
        token: token || '',
      },
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      transports: ['websocket', 'polling'],
      withCredentials: true,
    });

    socket.on('connect', () => {
      console.log('⚡ [FitTracker Socket] Connected to real-time engine:', socket?.id);
      connectionListeners.forEach((fn) => fn(true));
    });

    socket.on('disconnect', (reason) => {
      console.log('🔌 [FitTracker Socket] Disconnected:', reason);
      connectionListeners.forEach((fn) => fn(false));
    });

    socket.on('connect_error', (err) => {
      console.warn('⚠️ [FitTracker Socket] Connection notice:', err.message);
      connectionListeners.forEach((fn) => fn(false));
    });
  } else if (!socket.connected) {
    if (socket.auth) {
      (socket.auth as any).token = token || '';
    }
    socket.connect();
  }

  return socket;
};

/**
 * Re-authenticates socket when user logs in or token updates
 */
export const updateSocketAuth = (token: string | null) => {
  if (socket) {
    socket.auth = { token: token || '' };
    if (!socket.connected) {
      socket.connect();
    }
  }
};

/**
 * Disconnects socket cleanly on user logout
 */
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

/**
 * Hook or helper to subscribe to connection state changes
 */
export const onSocketConnectionChange = (listener: (connected: boolean) => void) => {
  connectionListeners.push(listener);
  if (socket) {
    listener(socket.connected);
  }
  return () => {
    connectionListeners = connectionListeners.filter((l) => l !== listener);
  };
};

// -------------------------------------------------------------
// MESSAGING REAL-TIME HELPERS
// -------------------------------------------------------------

export const joinConversationRoom = (conversationId: string, cb?: (res: any) => void) => {
  const s = getSocket();
  s.emit('conversation:join', { conversationId }, cb);
};

export const leaveConversationRoom = (conversationId: string) => {
  const s = getSocket();
  s.emit('conversation:leave', { conversationId });
};

export const emitSocketMessage = (
  data: {
    conversationId: string;
    text?: string;
    mediaUrl?: string;
    audioUrl?: string;
    workoutAttachment?: any;
  },
  cb?: (res: any) => void
) => {
  const s = getSocket();
  s.emit('message:send', data, cb);
};

export const emitTypingIndicator = (conversationId: string) => {
  const s = getSocket();
  s.emit('message:typing', { conversationId });
};

export const emitStopTypingIndicator = (conversationId: string) => {
  const s = getSocket();
  s.emit('message:stopTyping', { conversationId });
};

export const emitReadReceipt = (conversationId: string) => {
  const s = getSocket();
  s.emit('message:read', { conversationId });
};

// -------------------------------------------------------------
// LIVE STREAMING REAL-TIME HELPERS
// -------------------------------------------------------------

export const joinLiveStreamRoom = (streamId: string, cb?: (res: any) => void) => {
  const s = getSocket();
  s.emit('live:join', { streamId }, cb);
};

export const leaveLiveStreamRoom = (streamId: string) => {
  const s = getSocket();
  s.emit('live:leave', { streamId });
};

export const emitLiveMessage = (streamId: string, text: string, cb?: (res: any) => void) => {
  const s = getSocket();
  s.emit('live:message', { streamId, text }, cb);
};

export const emitLiveReaction = (streamId: string, reaction: string) => {
  const s = getSocket();
  s.emit('live:reaction', { streamId, reaction });
};

export const emitLiveTelemetry = (streamId: string, telemetry: { avgHeartRate?: number; caloriesBurned?: number }) => {
  const s = getSocket();
  s.emit('live:telemetry', { streamId, telemetry });
};

export default getSocket;
