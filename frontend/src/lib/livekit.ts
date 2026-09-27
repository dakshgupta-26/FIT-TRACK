import { Room, RoomEvent, createLocalTracks, Track, RemoteTrack, RemoteParticipant } from 'livekit-client';

export interface LiveKitSession {
  room: Room;
  localVideoTrack?: any;
  localAudioTrack?: any;
  disconnect: () => void;
  toggleAudio: (enabled: boolean) => void;
  toggleVideo: (enabled: boolean) => void;
}

/**
 * Connects to a LiveKit WebRTC room as a Host (publisher) or Viewer (subscriber).
 */
export const connectLiveKitRoom = async ({
  wsUrl,
  token,
  isHost,
  onRemoteTrackSubscribed,
  onRemoteTrackUnsubscribed,
  onDisconnected,
}: {
  wsUrl: string;
  token: string;
  isHost: boolean;
  onRemoteTrackSubscribed?: (track: RemoteTrack, participant: RemoteParticipant) => void;
  onRemoteTrackUnsubscribed?: (track: RemoteTrack, participant: RemoteParticipant) => void;
  onDisconnected?: () => void;
}): Promise<LiveKitSession> => {
  const room = new Room({
    adaptiveStream: true,
    dynacast: true,
    publishDefaults: {
      simulcast: true,
    },
  });

  room.on(RoomEvent.TrackSubscribed, (track, publication, participant) => {
    if (onRemoteTrackSubscribed) {
      onRemoteTrackSubscribed(track, participant);
    }
  });

  room.on(RoomEvent.TrackUnsubscribed, (track, publication, participant) => {
    if (onRemoteTrackUnsubscribed) {
      onRemoteTrackUnsubscribed(track, participant);
    }
  });

  room.on(RoomEvent.Disconnected, () => {
    if (onDisconnected) {
      onDisconnected();
    }
  });

  let localVideoTrack: any = null;
  let localAudioTrack: any = null;

  try {
    // Connect to room using LiveKit WebRTC
    await room.connect(wsUrl, token);

    if (isHost) {
      try {
        const tracks = await createLocalTracks({
          audio: true,
          video: {
            resolution: {
              width: 1280,
              height: 720,
              frameRate: 30,
            },
          },
        });

        for (const track of tracks) {
          if (track.kind === Track.Kind.Video) {
            localVideoTrack = track;
            await room.localParticipant.publishTrack(track);
          } else if (track.kind === Track.Kind.Audio) {
            localAudioTrack = track;
            await room.localParticipant.publishTrack(track);
          }
        }
      } catch (mediaErr: any) {
        console.warn('⚠️ [LiveKit Notice] Local camera/mic permission notice:', mediaErr.message);
      }
    }
  } catch (connErr: any) {
    console.error('❌ [LiveKit Connection Error]:', connErr);
    throw connErr;
  }

  const disconnect = () => {
    if (localVideoTrack) {
      localVideoTrack.stop();
    }
    if (localAudioTrack) {
      localAudioTrack.stop();
    }
    room.disconnect();
  };

  const toggleAudio = (enabled: boolean) => {
    if (localAudioTrack) {
      if (enabled) {
        localAudioTrack.unmute();
      } else {
        localAudioTrack.mute();
      }
    }
  };

  const toggleVideo = (enabled: boolean) => {
    if (localVideoTrack) {
      if (enabled) {
        localVideoTrack.unmute();
      } else {
        localVideoTrack.mute();
      }
    }
  };

  return {
    room,
    localVideoTrack,
    localAudioTrack,
    disconnect,
    toggleAudio,
    toggleVideo,
  };
};
