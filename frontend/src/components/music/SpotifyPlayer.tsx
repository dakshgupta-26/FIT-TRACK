import React, { useEffect, useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';

interface SpotifyPlayerProps {
  trackUri?: string;
  onTrackEnd?: () => void;
  onPlayerReady?: (player: any) => void;
}

interface TrackInfo {
  name: string;
  artist: string;
  album: string;
  image: string;
  duration: number;
}

declare global {
  interface Window {
    Spotify: any;
    onSpotifyWebPlaybackSDKReady: () => void;
  }
}

const SpotifyPlayer: React.FC<SpotifyPlayerProps> = ({ 
  trackUri, 
  onTrackEnd, 
  onPlayerReady 
}) => {
  const { toast } = useToast();
  const [player, setPlayer] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<TrackInfo | null>(null);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(50);
  const [isReady, setIsReady] = useState(false);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const playerRef = useRef<any>(null);

  // Load Spotify Web Playback SDK
  useEffect(() => {
    if (window.Spotify) {
      initializePlayer();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;
    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      initializePlayer();
    };

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  const initializePlayer = async () => {
    try {
      // Get access token (you'll need to implement this)
      const token = await getSpotifyAccessToken();
      
      const spotifyPlayer = new window.Spotify.Player({
        name: 'Health Bloom Dashboard',
        getOAuthToken: (cb: (token: string) => void) => {
          cb(token);
        },
        volume: volume / 100
      });

      // Error handling
      spotifyPlayer.addListener('initialization_error', ({ message }: { message: string }) => {
        console.error('Failed to initialize:', message);
        toast({
          title: "Player Error",
          description: "Failed to initialize Spotify player",
          variant: "destructive",
        });
      });

      spotifyPlayer.addListener('authentication_error', ({ message }: { message: string }) => {
        console.error('Failed to authenticate:', message);
        toast({
          title: "Authentication Error",
          description: "Please log in to Spotify to play music",
          variant: "destructive",
        });
      });

      spotifyPlayer.addListener('account_error', ({ message }: { message: string }) => {
        console.error('Failed to validate Spotify account:', message);
      });

      spotifyPlayer.addListener('playback_error', ({ message }: { message: string }) => {
        console.error('Failed to perform playback:', message);
      });

      // Playback status updates
      spotifyPlayer.addListener('player_state_changed', (state: any) => {
        if (!state) return;

        setIsPlaying(!state.paused);
        setPosition(state.position);
        setDuration(state.duration);

        if (state.track_window?.current_track) {
          const track = state.track_window.current_track;
          setCurrentTrack({
            name: track.name,
            artist: track.artists[0]?.name || 'Unknown Artist',
            album: track.album.name,
            image: track.album.images[0]?.url || '',
            duration: track.duration_ms
          });
        }
      });

      // Ready
      spotifyPlayer.addListener('ready', ({ device_id }: { device_id: string }) => {
        console.log('Ready with Device ID', device_id);
        setDeviceId(device_id);
        setIsReady(true);
        setPlayer(spotifyPlayer);
        playerRef.current = spotifyPlayer;
        
        if (onPlayerReady) {
          onPlayerReady(spotifyPlayer);
        }

        toast({
          title: "Spotify Player Ready",
          description: "You can now play music from your playlists",
        });
      });

      // Not Ready
      spotifyPlayer.addListener('not_ready', ({ device_id }: { device_id: string }) => {
        console.log('Device ID has gone offline', device_id);
        setIsReady(false);
      });

      // Connect to the player
      spotifyPlayer.connect();

    } catch (error) {
      console.error('Error initializing Spotify player:', error);
      toast({
        title: "Player Error",
        description: "Failed to initialize Spotify player",
        variant: "destructive",
      });
    }
  };

  const getSpotifyAccessToken = async (): Promise<string> => {
    // This should be implemented to get user's access token
    // For now, we'll use a placeholder
    try {
      const response = await fetch('/supabase/functions/v1/spotify-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: 'test',
          type: 'track',
          limit: 1
        }),
      });
      
      // This is a workaround - in production, you'd need proper OAuth flow
      return 'placeholder_token';
    } catch (error) {
      console.error('Error getting access token:', error);
      throw error;
    }
  };

  const playTrack = async (uri: string) => {
    if (!player || !deviceId) {
      toast({
        title: "Player Not Ready",
        description: "Please wait for the Spotify player to initialize",
        variant: "destructive",
      });
      return;
    }

    try {
      await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
        method: 'PUT',
        body: JSON.stringify({ uris: [uri] }),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await getSpotifyAccessToken()}`
        },
      });
    } catch (error) {
      console.error('Error playing track:', error);
      toast({
        title: "Playback Error",
        description: "Failed to play track",
        variant: "destructive",
      });
    }
  };

  const togglePlayPause = () => {
    if (!player) return;
    
    if (isPlaying) {
      player.pause();
    } else {
      player.resume();
    }
  };

  const skipToNext = () => {
    if (!player) return;
    player.nextTrack();
  };

  const skipToPrevious = () => {
    if (!player) return;
    player.previousTrack();
  };

  const handleVolumeChange = (newVolume: number[]) => {
    const vol = newVolume[0];
    setVolume(vol);
    if (player) {
      player.setVolume(vol / 100);
    }
  };

  const handleSeek = (newPosition: number[]) => {
    const pos = newPosition[0];
    if (player) {
      player.seek(pos);
    }
  };

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Auto-play when trackUri changes
  useEffect(() => {
    if (trackUri && isReady) {
      playTrack(trackUri);
    }
  }, [trackUri, isReady]);

  if (!isReady) {
    return (
      <Card className="w-full">
        <CardContent className="p-6 text-center">
          <div className="space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-sm text-muted-foreground">
              Initializing Spotify Player...
            </p>
            <p className="text-xs text-muted-foreground">
              Make sure you have Spotify open in another tab
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Track Info */}
          {currentTrack && (
            <div className="flex items-center gap-4">
              <img 
                src={currentTrack.image} 
                alt={currentTrack.album}
                className="w-12 h-12 rounded object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{currentTrack.name}</p>
                <p className="text-sm text-muted-foreground truncate">
                  {currentTrack.artist} • {currentTrack.album}
                </p>
              </div>
            </div>
          )}

          {/* Progress Bar */}
          <div className="space-y-2">
            <Slider
              value={[position]}
              max={duration}
              step={1000}
              onValueChange={handleSeek}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatTime(position)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4">
            <Button variant="ghost" size="icon" onClick={skipToPrevious}>
              <SkipBack className="h-5 w-5" />
            </Button>
            
            <Button 
              size="icon" 
              onClick={togglePlayPause}
              className="h-12 w-12"
            >
              {isPlaying ? (
                <Pause className="h-6 w-6" />
              ) : (
                <Play className="h-6 w-6" />
              )}
            </Button>
            
            <Button variant="ghost" size="icon" onClick={skipToNext}>
              <SkipForward className="h-5 w-5" />
            </Button>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-2">
            <Volume2 className="h-4 w-4 text-muted-foreground" />
            <Slider
              value={[volume]}
              max={100}
              step={1}
              onValueChange={handleVolumeChange}
              className="flex-1"
            />
            <span className="text-xs text-muted-foreground w-8">
              {volume}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SpotifyPlayer;
