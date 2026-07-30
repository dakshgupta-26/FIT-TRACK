import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Music as MusicIcon, Play, Pause, Search, Filter, Heart, Shuffle, Repeat, MoreHorizontal, Download, Users, Volume2, Eye, LogIn, LogOut } from 'lucide-react';
import { useSpotifyAuth } from '@/hooks/useSpotifyAuth';
import SpotifyPlayer from '@/components/music/SpotifyPlayer';

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: string;
  preview_url?: string;
  uri?: string;
  album?: {
    name: string;
    images: Array<{ url: string }>;
  };
}

interface Playlist {
  id: string;
  name: string;
  workoutType: string;
  mood: string;
  duration: string;
  trackCount: number;
  tracks: Track[];
  createdAt: string;
  isFavorite: boolean;
  likes?: number;
  coverIcon?: string;
}

// Sample playlists data
const playlistsData: Playlist[] = [
  {
    id: 'p1',
    name: 'HIIT Beast Mode',
    workoutType: 'HIIT',
    mood: 'High Energy',
    duration: '30 min',
    trackCount: 15,
    createdAt: '2025-01-15',
    isFavorite: true,
    likes: 245,
    coverIcon: '⚡',
    tracks: [
      { id: 't1', title: 'Thunder', artist: 'Imagine Dragons', duration: '3:07' },
      { id: 't2', title: 'Titanium', artist: 'David Guetta ft. Sia', duration: '4:05' },
      { id: 't3', title: 'Stronger', artist: 'Kanye West', duration: '5:12' },
      { id: 't4', title: 'Eye of the Tiger', artist: 'Survivor', duration: '4:04' },
      { id: 't5', title: 'Till I Collapse', artist: 'Eminem', duration: '4:57' },
    ]
  },
  {
    id: 'p2',
    name: 'Zen Flow Yoga',
    workoutType: 'Yoga',
    mood: 'Calm',
    duration: '35 min',
    trackCount: 12,
    createdAt: '2025-01-12',
    isFavorite: false,
    likes: 182,
    coverIcon: '🧘',
    tracks: [
      { id: 't6', title: 'Weightless', artist: 'Marconi Union', duration: '8:08' },
      { id: 't7', title: 'Clair de Lune', artist: 'Claude Debussy', duration: '5:25' },
      { id: 't8', title: 'River Flows in You', artist: 'Yiruma', duration: '3:37' },
      { id: 't9', title: 'Samsara', artist: 'Audiomachine', duration: '4:12' },
    ]
  },
  {
    id: 'p3',
    name: 'Strength Power Mix',
    workoutType: 'Strength',
    mood: 'Motivational',
    duration: '45 min',
    trackCount: 18,
    createdAt: '2025-01-10',
    isFavorite: true,
    likes: 387,
    coverIcon: '💪',
    tracks: [
      { id: 't10', title: 'Lose Yourself', artist: 'Eminem', duration: '5:26' },
      { id: 't11', title: 'Remember the Name', artist: 'Fort Minor', duration: '3:29' },
      { id: 't12', title: 'Warriors', artist: 'Imagine Dragons', duration: '2:50' },
      { id: 't13', title: 'Pump It', artist: 'Black Eyed Peas', duration: '3:33' },
    ]
  },
  {
    id: 'p4',
    name: 'Cardio Beats',
    workoutType: 'Cardio',
    mood: 'Upbeat',
    duration: '40 min',
    trackCount: 20,
    createdAt: '2025-01-08',
    isFavorite: false,
    likes: 156,
    coverIcon: '🎶',
    tracks: [
      { id: 't14', title: 'Uptown Funk', artist: 'Mark Ronson ft. Bruno Mars', duration: '4:30' },
      { id: 't15', title: 'Good as Hell', artist: 'Lizzo', duration: '2:39' },
      { id: 't16', title: 'Levitating', artist: 'Dua Lipa', duration: '3:23' },
    ]
  },
];

const workoutTypes = ['All', 'HIIT', 'Strength', 'Cardio', 'Yoga', 'Flexibility'];
const moods = ['All', 'High Energy', 'Motivational', 'Upbeat', 'Calm', 'Focus'];

const Music = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isAuthenticated, user, login, logout, getValidToken } = useSpotifyAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWorkoutType, setSelectedWorkoutType] = useState("All");
  const [selectedMood, setSelectedMood] = useState("All");
  const [playingTrack, setPlayingTrack] = useState<string | null>(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const [userPlaylists, setUserPlaylists] = useState<any[]>([]);
  const [trackProgress, setTrackProgress] = useState<Record<string, number>>({});
  const [currentTrackUri, setCurrentTrackUri] = useState<string | undefined>();
  const [spotifyPlayer, setSpotifyPlayer] = useState<any>(null);

  useEffect(() => {
    // Load user playlists from localStorage (would be Supabase in production)
    const savedPlaylists = JSON.parse(localStorage.getItem('userPlaylists') || '[]');
    setUserPlaylists(savedPlaylists);
  }, []);

  const filteredPlaylists = playlistsData.filter(playlist => {
    const matchesSearch = playlist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         playlist.workoutType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesWorkoutType = selectedWorkoutType === 'All' || playlist.workoutType === selectedWorkoutType;
    const matchesMood = selectedMood === 'All' || playlist.mood === selectedMood;
    
    return matchesSearch && matchesWorkoutType && matchesMood;
  });

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
      if (spotifyPlayer) {
        spotifyPlayer.pause();
      }
    } else {
      setPlayingTrack(track.id);
      
      if (track.uri) {
        setCurrentTrackUri(track.uri);
      } else {
        // Fallback to preview URL if no Spotify URI
        if (track.preview_url) {
          const audio = new Audio(track.preview_url);
          audio.play();
          toast({
            title: "Playing Preview",
            description: `Playing preview of "${track.title}"`,
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
    }
  };

  const handleGenreClick = (mood: string) => {
    setSelectedMood(mood);
  };

  const handleShufflePlay = (playlist: Playlist) => {
    toast({
      title: "Shuffle Playing",
      description: `Playing "${playlist.name}" in shuffle mode`,
      duration: 2000,
    });
  };

  const handleGeneratePlaylist = () => {
    navigate('/playlist-creator?type=General&workout=Custom Playlist');
  };

  const handleToggleFavorite = (playlistId: string) => {
    toast({
      title: "Playlist Updated",
      description: "Added to/removed from favorites",
      duration: 2000,
    });
  };

  const handleDownloadPlaylist = (playlist: Playlist) => {
    toast({
      title: "Download Started",
      description: `Downloading "${playlist.name}" for offline use`,
      duration: 3000,
    });
  };

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'High Energy':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      case 'Motivational':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100';
      case 'Upbeat':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      case 'Calm':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      case 'Focus':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="p-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">🎵 Music & Playlists</h1>
          <p className="text-muted-foreground">Manage your workout playlists and discover new music</p>
          {isAuthenticated && user && (
            <div className="flex items-center gap-2 mt-2">
              <img 
                src={user.images?.[0]?.url || '/placeholder.svg'} 
                alt={user.display_name}
                className="w-6 h-6 rounded-full"
              />
              <span className="text-sm text-muted-foreground">
                Connected as {user.display_name}
              </span>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          {isAuthenticated ? (
            <Button variant="outline" onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" />
              Disconnect
            </Button>
          ) : (
            <Button onClick={login}>
              <LogIn className="h-4 w-4 mr-2" />
              Connect Spotify
            </Button>
          )}
          <Button onClick={handleGeneratePlaylist}>
            <MusicIcon className="h-4 w-4 mr-2" />
            Generate Playlist
          </Button>
        </div>
      </div>

      {/* Spotify Player */}
      {isAuthenticated && (
        <SpotifyPlayer 
          trackUri={currentTrackUri}
          onPlayerReady={setSpotifyPlayer}
        />
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search playlists..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Workout: {selectedWorkoutType}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {workoutTypes.map(type => (
                <DropdownMenuItem 
                  key={type}
                  onClick={() => setSelectedWorkoutType(type)}
                >
                  {type}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Mood: {selectedMood}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {moods.map(mood => (
                <DropdownMenuItem 
                  key={mood}
                  onClick={() => setSelectedMood(mood)}
                >
                  {mood}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Tabs defaultValue="my-playlists">
        <TabsList className="mb-6">
          <TabsTrigger value="my-playlists">My Playlists</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
          <TabsTrigger value="recent">Recently Generated</TabsTrigger>
        </TabsList>

        <TabsContent value="my-playlists" className="mt-0">
          {userPlaylists.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Your Saved Playlists</h3>
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-6">
                {userPlaylists.map((playlist, index) => (
                  <Card key={index} className="overflow-hidden">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{playlist.name}</CardTitle>
                        <Badge variant="secondary">{playlist.workoutType}</Badge>
                      </div>
                      <CardDescription>
                        {playlist.tracks.length} tracks • Created {new Date(playlist.createdAt).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 mb-4">
                        {playlist.tracks.slice(0, 3).map((track: any, idx: number) => (
                          <div key={idx} className="text-sm text-muted-foreground">
                            {track.name} - {track.artist}
                          </div>
                        ))}
                        {playlist.tracks.length > 3 && (
                          <div className="text-sm text-muted-foreground">
                            +{playlist.tracks.length - 3} more tracks
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1">
                          <Play className="h-4 w-4 mr-1" />
                          Play
                        </Button>
                        <Button size="sm" variant="outline">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
          
          <h3 className="text-lg font-semibold mb-4">Discover Playlists</h3>
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredPlaylists.map(playlist => (
              <Card key={playlist.id} className="playlist-card flex flex-col">
                <CardHeader className="pb-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="playlist-cover">
                      {playlist.coverIcon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg leading-tight">{playlist.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {playlist.trackCount} tracks • {playlist.duration}
                      </CardDescription>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      <Badge variant="secondary">{playlist.workoutType}</Badge>
                      <Badge 
                        className={`genre-tag ${getMoodColor(playlist.mood)}`}
                        onClick={() => handleGenreClick(playlist.mood)}
                      >
                        {playlist.mood}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Heart className={`h-4 w-4 ${playlist.isFavorite ? 'fill-current text-red-500' : ''}`} />
                        {playlist.likes}
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-background border border-border shadow-lg">
                          <DropdownMenuItem onClick={() => handleToggleFavorite(playlist.id)}>
                            <Heart className="h-4 w-4 mr-2" />
                            {playlist.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDownloadPlaylist(playlist)}>
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleShufflePlay(playlist)}>
                            <Shuffle className="h-4 w-4 mr-2" />
                            Shuffle Play
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 pb-4">
                  <div className="space-y-3">
                    <div className="text-sm text-muted-foreground">
                      Created: {new Date(playlist.createdAt).toLocaleDateString()}
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm flex items-center gap-2">
                        <Volume2 className="h-4 w-4" />
                        Track Preview
                      </h4>
                      {playlist.tracks.slice(0, 3).map(track => (
                        <div 
                          key={track.id} 
                          className={`track-row p-2 ${playingTrack === track.id ? 'playing-track' : ''}`}
                        >
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex-1 min-w-0">
                              <p className="truncate font-medium">{track.title}</p>
                              <p className="truncate text-muted-foreground text-xs">{track.artist}</p>
                              {playingTrack === track.id && (
                                <div className="progress-bar mt-1">
                                  <div 
                                    className="progress-fill" 
                                    style={{ width: `${trackProgress[track.id] || 0}%` }}
                                  />
                                </div>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 ml-2"
                              onClick={() => handlePlayTrack(track)}
                            >
                              {playingTrack === track.id ? 
                                <Pause className="h-3 w-3" /> : 
                                <Play className="h-3 w-3" />
                              }
                            </Button>
                          </div>
                        </div>
                      ))}
                      {playlist.tracks.length > 3 && (
                        <p className="text-sm text-muted-foreground">
                          +{playlist.tracks.length - 3} more tracks
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
                
                <div className="p-6 pt-0 space-y-2">
                  <div className="flex gap-2">
                    <Button className="flex-1" size="sm">
                      <Play className="h-4 w-4 mr-2" />
                      Play
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleShufflePlay(playlist)}
                    >
                      <Shuffle className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        size="sm"
                        onClick={() => setSelectedPlaylist(playlist)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View All Tracks
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <div className="flex items-center gap-3">
                          <div className="playlist-cover">
                            {playlist.coverIcon}
                          </div>
                          <div>
                            <DialogTitle>{playlist.name}</DialogTitle>
                            <DialogDescription>
                              {playlist.trackCount} tracks • {playlist.duration} • {playlist.workoutType}
                            </DialogDescription>
                          </div>
                        </div>
                      </DialogHeader>
                      <div className="space-y-2">
                        {playlist.tracks.map((track, index) => (
                          <div 
                            key={track.id} 
                            className={`track-row flex items-center justify-between p-3 rounded-lg border ${playingTrack === track.id ? 'playing-track' : ''}`}
                          >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <div className="w-8 h-8 rounded bg-muted flex items-center justify-center text-sm font-medium">
                                {index + 1}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium">{track.title}</p>
                                <p className="text-sm text-muted-foreground">{track.artist}</p>
                                {playingTrack === track.id && (
                                  <div className="progress-bar mt-1">
                                    <div 
                                      className="progress-fill" 
                                      style={{ width: `${trackProgress[track.id] || 0}%` }}
                                    />
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-muted-foreground">{track.duration}</span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handlePlayTrack(track)}
                              >
                                {playingTrack === track.id ? 
                                  <Pause className="h-4 w-4" /> : 
                                  <Play className="h-4 w-4" />
                                }
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="favorites" className="mt-0">
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredPlaylists.filter(p => p.isFavorite).map(playlist => (
              <Card key={playlist.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex gap-2">
                      <Badge variant="secondary">{playlist.workoutType}</Badge>
                      <Badge className={getMoodColor(playlist.mood)}>{playlist.mood}</Badge>
                    </div>
                    <Heart className="h-5 w-5 fill-current text-red-500" />
                  </div>
                  <CardTitle className="text-xl">{playlist.name}</CardTitle>
                  <CardDescription>
                    {playlist.trackCount} tracks • {playlist.duration}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">
                    <MusicIcon className="h-4 w-4 mr-2" />
                    Play Favorite
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recent" className="mt-0">
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredPlaylists.slice(0, 3).map(playlist => (
              <Card key={playlist.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex gap-2">
                      <Badge variant="secondary">{playlist.workoutType}</Badge>
                      <Badge className={getMoodColor(playlist.mood)}>{playlist.mood}</Badge>
                    </div>
                    <Badge variant="outline">Recent</Badge>
                  </div>
                  <CardTitle className="text-xl">{playlist.name}</CardTitle>
                  <CardDescription>
                    Generated {new Date(playlist.createdAt).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">
                    <MusicIcon className="h-4 w-4 mr-2" />
                    Play Recent
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Music;