import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Search, Music, Plus, Save, ArrowLeft, Play, Pause, LogIn } from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useSpotifyAuth } from '@/hooks/useSpotifyAuth';
import SpotifyPlayer from '@/components/music/SpotifyPlayer';

interface Track {
  id: string;
  name: string;
  artist: string;
  duration: number;
  preview_url?: string;
  uri?: string;
  album?: {
    name: string;
    images: Array<{ url: string }>;
  };
}

interface Artist {
  id: string;
  name: string;
  followers: number;
  image?: string;
}


const PlaylistCreator = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated, login, getValidToken } = useSpotifyAuth();
  
  const workoutType = searchParams.get('type') || 'General';
  const workoutName = searchParams.get('workout') || 'Custom Workout';
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'track' | 'artist'>('track');
  const [selectedTracks, setSelectedTracks] = useState<Track[]>([]);
  const [playlistName, setPlaylistName] = useState(`${workoutName} Mix`);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [playingTrack, setPlayingTrack] = useState<string | null>(null);
  const [currentTrackUri, setCurrentTrackUri] = useState<string | undefined>();

  const searchSpotify = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/supabase/functions/v1/spotify-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: searchQuery,
          type: searchType,
          limit: 20
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Search failed');
      }

      if (searchType === 'track') {
        const spotifyTracks = data.tracks?.items?.map((track: any) => ({
          id: track.id,
          name: track.name,
          artist: track.artists[0]?.name || 'Unknown Artist',
          duration: track.duration_ms,
          preview_url: track.preview_url,
          uri: track.uri,
          album: {
            name: track.album.name,
            images: track.album.images
          }
        })) || [];
        setTracks(spotifyTracks);
        setArtists([]);
      } else {
        const spotifyArtists = data.artists?.items?.map((artist: any) => ({
          id: artist.id,
          name: artist.name,
          followers: artist.followers?.total || 0,
          image: artist.images?.[0]?.url
        })) || [];
        setArtists(spotifyArtists);
        setTracks([]);
      }
    } catch (error) {
      toast({
        title: "Search Error",
        description: "Failed to search Spotify. Please check your API configuration.",
        variant: "destructive",
      });
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };


  const addTrack = (track: Track) => {
    if (!selectedTracks.find(t => t.id === track.id)) {
      setSelectedTracks([...selectedTracks, track]);
      toast({
        title: "Track added",
        description: `${track.name} by ${track.artist} added to playlist`,
      });
    }
  };

  const handlePlayTrack = async (track: Track) => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please connect to Spotify to play music",
        variant: "destructive",
      });
      return;
    }

    if (playingTrack === track.id) {
      setPlayingTrack(null);
      setCurrentTrackUri(undefined);
    } else {
      setPlayingTrack(track.id);
      
      if (track.uri) {
        setCurrentTrackUri(track.uri);
      } else if (track.preview_url) {
        const audio = new Audio(track.preview_url);
        audio.play();
        toast({
          title: "Playing Preview",
          description: `Playing preview of "${track.name}"`,
          duration: 2000,
        });
      } else {
        toast({
          title: "No Preview Available",
          description: "This track doesn't have a preview available",
          variant: "destructive",
        });
      }
    }
  };

  const removeTrack = (trackId: string) => {
    setSelectedTracks(selectedTracks.filter(t => t.id !== trackId));
  };

  const savePlaylist = () => {
    if (selectedTracks.length === 0) {
      toast({
        title: "No tracks selected",
        description: "Please add some tracks to your playlist",
        variant: "destructive",
      });
      return;
    }

    // Here you would save to Supabase
    const playlist = {
      name: playlistName,
      workoutType,
      tracks: selectedTracks,
      createdAt: new Date().toISOString(),
    };

    // Store in localStorage for now (would be Supabase in production)
    const existingPlaylists = JSON.parse(localStorage.getItem('userPlaylists') || '[]');
    existingPlaylists.push(playlist);
    localStorage.setItem('userPlaylists', JSON.stringify(existingPlaylists));

    toast({
      title: "Playlist saved!",
      description: `${playlistName} has been saved to your music library`,
    });

    navigate('/music');
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Create Playlist</h1>
            <p className="text-muted-foreground">
              Building playlist for {workoutName} • {workoutType}
            </p>
          </div>
        </div>
        {!isAuthenticated && (
          <Button onClick={login}>
            <LogIn className="h-4 w-4 mr-2" />
            Connect Spotify
          </Button>
        )}
      </div>

      {/* Spotify Player */}
      {isAuthenticated && (
        <div className="mb-6">
          <SpotifyPlayer 
            trackUri={currentTrackUri}
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Search Section */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search songs, artists..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && searchSpotify()}
                className="pl-10"
              />
            </div>
            <Button onClick={searchSpotify} disabled={isLoading}>
              {isLoading ? 'Searching...' : 'Search'}
            </Button>
            <Button
              variant={searchType === 'track' ? 'default' : 'outline'}
              onClick={() => setSearchType('track')}
            >
              Songs
            </Button>
            <Button
              variant={searchType === 'artist' ? 'default' : 'outline'}
              onClick={() => setSearchType('artist')}
            >
              Artists
            </Button>
          </div>

          {/* Search Results */}
          <div className="space-y-2">
            {isLoading && (
              <div className="text-center py-8 text-muted-foreground">
                Searching Spotify...
              </div>
            )}
            {searchType === 'track' ? (
              tracks.map((track) => (
                <Card key={track.id} className="p-4">
                  <div className="flex items-center gap-4">
                    {track.album?.images?.[0] && (
                      <img 
                        src={track.album.images[0].url} 
                        alt={track.album.name}
                        className="w-12 h-12 rounded object-cover"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{track.name}</h4>
                      <p className="text-sm text-muted-foreground truncate">
                        {track.artist} • {track.album?.name} • {formatDuration(track.duration)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handlePlayTrack(track)}
                        disabled={!isAuthenticated}
                      >
                        {playingTrack === track.id ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => addTrack(track)}
                        disabled={selectedTracks.some(t => t.id === track.id)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              artists.map((artist) => (
                <Card key={artist.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{artist.name}</h4>
                      <p className="text-sm text-muted-foreground">{(artist.followers / 1000000).toFixed(1)}M followers</p>
                    </div>
                    <Button size="sm" variant="outline">
                      View Songs
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </div>

          {!isLoading && (searchType === 'track' ? tracks : artists).length === 0 && searchQuery && (
            <div className="text-center py-8 text-muted-foreground">
              No {searchType}s found for "{searchQuery}"
            </div>
          )}
        </div>

        {/* Playlist Builder */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Music className="h-5 w-5" />
                Your Playlist
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Playlist Name</label>
                <Input
                  value={playlistName}
                  onChange={(e) => setPlaylistName(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Badge variant="secondary">{workoutType}</Badge>
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedTracks.length} tracks selected
                </p>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {selectedTracks.map((track, index) => (
                  <div key={track.id} className="flex items-center justify-between p-2 bg-muted rounded">
                    <div className="text-sm">
                      <div className="font-medium">{track.name}</div>
                      <div className="text-muted-foreground">{track.artist}</div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeTrack(track.id)}
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>

              <Button 
                onClick={savePlaylist}
                className="w-full"
                disabled={selectedTracks.length === 0}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Playlist
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PlaylistCreator;