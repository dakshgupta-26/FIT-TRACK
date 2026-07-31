import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Square,
  Music,
  Clock,
  Target,
  Zap,
} from 'lucide-react';
import { cn } from "@/lib/utils";

// Add YT and onYouTubeIframeAPIReady to the global window interface for the API
declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: any;
  }
}

export interface Exercise { name: string; sets: number; reps: number; duration?: number; animation?: string; description?: string; targetMuscles?: string[]; }
export interface WorkoutSessionProps { workout: { id: string; title: string; duration: number; type: string; difficulty: 'Easy' | 'Medium' | 'Hard'; exercises: Exercise[]; estimatedCalories?: number; targetMuscles?: string[]; }; onEndWorkout: () => void; onClose: () => void; }
interface SessionState { currentExerciseIndex: number; currentSet: number; isPlaying: boolean; timeRemaining: number; totalTimeElapsed: number; isResting: boolean; restTimeRemaining: number; }

const exerciseAnimations: Record<string, string> = { 'Squats': 'https://media.giphy.com/media/3o7btPCcdNniyf0ArS/giphy.gif', /* ... other animations */ };

const workoutMusicPlaylist = [
  { videoId: '8afBXZawfQw', title: 'Pop Workout Music Mix' },
  { videoId: '8jhC9xnJGYU', title: 'Hip Hop Workout Music Mix' },
  { videoId: 'Dixb0ck-90M', title: 'High Energy Rock Mix' },
];

const WorkoutSession: React.FC<WorkoutSessionProps> = ({ workout, onEndWorkout, onClose }) => {
  const [sessionState, setSessionState] = useState<SessionState>({ currentExerciseIndex: 0, currentSet: 1, isPlaying: false, timeRemaining: 0, totalTimeElapsed: 0, isResting: false, restTimeRemaining: 30, });
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // --- YouTube API Integration ---
  const playerRef = useRef<any>(null); // Ref to hold the YouTube player instance

  // --- Updated Music Controls ---
  const handleNextTrack = React.useCallback((shouldPlay = false) => {
    setCurrentTrackIndex(prev => {
      const nextIndex = (prev + 1) % workoutMusicPlaylist.length;
      if (playerRef.current) {
        playerRef.current.loadVideoById(workoutMusicPlaylist[nextIndex].videoId);
        if (!shouldPlay) playerRef.current.pauseVideo();
      }
      return nextIndex;
    });
  }, []);

  useEffect(() => {
    // This function initializes the YouTube player
    const initializePlayer = () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
      playerRef.current = new window.YT.Player('youtube-player-container', {
        videoId: workoutMusicPlaylist[currentTrackIndex].videoId,
        playerVars: {
          'playsinline': 1, // Important for mobile
          'controls': 1,    // Show YouTube controls
        },
        events: {
          'onReady': (event: any) => {
            // The player is ready, mute it initially
            event.target.mute();
          },
          // Auto-play next track when one ends
          'onStateChange': (event: any) => {
            if (event.data === window.YT.PlayerState.ENDED) {
              handleNextTrack(true); // pass true to auto-play next
            }
          }
        }
      });
    };

    // Load the YouTube Iframe API script if it's not already loaded
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      window.onYouTubeIframeAPIReady = initializePlayer;
      document.body.appendChild(tag);
    } else {
      initializePlayer();
    }

    // Cleanup function to destroy the player when the component unmounts
    return () => {
      playerRef.current?.destroy();
    };
  }, [currentTrackIndex, handleNextTrack]);

  const handlePrevTrack = () => {
    setCurrentTrackIndex(prev => {
      const prevIndex = (prev - 1 + workoutMusicPlaylist.length) % workoutMusicPlaylist.length;
      if (playerRef.current) {
        playerRef.current.loadVideoById(workoutMusicPlaylist[prevIndex].videoId);
        playerRef.current.pauseVideo();
      }
      return prevIndex;
    });
  };

  const formatTime = (seconds: number) => `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;

  // --- THE KEY CHANGE ---
  // This function now controls BOTH the workout timer and the music.
  const handlePlayPause = () => {
    const isNowPlaying = !sessionState.isPlaying;
    setSessionState(prev => ({ ...prev, isPlaying: isNowPlaying }));

    if (playerRef.current) {
      if (isNowPlaying) {
        playerRef.current.unMute(); // Unmute the player
        playerRef.current.playVideo(); // Play the video
      } else {
        playerRef.current.pauseVideo(); // Pause the video
      }
    }
  };

  const handleNextExercise = () => { if (sessionState.currentExerciseIndex < workout.exercises.length - 1) setSessionState(prev => ({ ...prev, currentExerciseIndex: prev.currentExerciseIndex + 1, currentSet: 1, isPlaying: false, isResting: false, timeRemaining: 0, restTimeRemaining: 30 })); };
  const handlePreviousExercise = () => { if (sessionState.currentExerciseIndex > 0) setSessionState(prev => ({ ...prev, currentExerciseIndex: prev.currentExerciseIndex - 1, currentSet: 1, isPlaying: false, isResting: false, timeRemaining: 0, restTimeRemaining: 30 })); };
  const handleSkipExercise = () => handleNextExercise();
  const handleCompleteSet = () => { sessionState.currentSet < currentExercise.sets ? setSessionState(prev => ({ ...prev, isResting: true, isPlaying: true, restTimeRemaining: 30, timeRemaining: 0 })) : handleNextExercise(); };
  const handleEndWorkout = () => { if (intervalRef.current) clearInterval(intervalRef.current); onEndWorkout(); };

  const currentExercise = workout.exercises[sessionState.currentExerciseIndex];
  const totalSets = workout.exercises.reduce((sum, exercise) => sum + exercise.sets, 0);
  const completedSets = workout.exercises.slice(0, sessionState.currentExerciseIndex).reduce((sum, exercise) => sum + exercise.sets, 0) + (sessionState.currentSet - 1);
  const sessionProgress = (completedSets / totalSets) * 100;
  const exerciseProgress = ((sessionState.currentSet - 1) / currentExercise.sets) * 100;
  const nextExercise = sessionState.currentExerciseIndex < workout.exercises.length - 1 ? workout.exercises[sessionState.currentExerciseIndex + 1] : null;
  const currentTrack = workoutMusicPlaylist[currentTrackIndex];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-background rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in-0 zoom-in-95 duration-300">
        <div className="bg-gradient-to-r from-primary to-accent p-6 text-white flex-shrink-0">
          {/* Header remains the same */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">{workout.title}</h1>
              <div className="flex items-center gap-4 mt-2">
                <Badge className={cn("text-white")}>{workout.difficulty}</Badge>
                <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{workout.duration} min</span>
                <span className="flex items-center gap-1"><Target className="h-4 w-4" />{workout.exercises.length} exercises</span>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20"><Square className="h-4 w-4" /></Button>
          </div>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* Main workout content remains the same */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm"><span>Session Progress</span><span>{Math.round(sessionProgress)}%</span></div>
            <Progress value={sessionProgress} className="h-3" />
            <div className="flex justify-between text-xs text-muted-foreground"><span>Exercise {sessionState.currentExerciseIndex + 1} of {workout.exercises.length}</span><span>Set {sessionState.currentSet} of {currentExercise.sets}</span></div>
          </div>
          <div key={sessionState.currentExerciseIndex} className="animate-in slide-in-from-right-5 fade-in-0 duration-300">
            <Card className="overflow-hidden"><CardContent className="p-0"><div className="grid md:grid-cols-2"><div className="relative bg-gradient-to-br from-primary/10 to-accent/10 p-6 flex items-center justify-center"><div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center overflow-hidden">{exerciseAnimations[currentExercise.name] ? <img src={exerciseAnimations[currentExercise.name]} alt={currentExercise.name} className="w-full h-full object-cover rounded-lg" /> : <div className="text-center"><div className="text-6xl mb-4">💪</div><p className="text-muted-foreground">Exercise Animation</p></div>}</div></div><div className="p-6 space-y-4"><div><h2 className="text-2xl font-bold mb-2">{currentExercise.name}</h2><div className="flex items-center gap-4 text-sm text-muted-foreground"><span className="flex items-center gap-1"><Zap className="h-4 w-4" />{currentExercise.sets} sets</span><span>{currentExercise.reps} reps</span></div></div><div className="space-y-2"><div className="flex justify-between text-sm"><span>Exercise Progress</span><span>{Math.round(exerciseProgress)}%</span></div><Progress value={exerciseProgress} className="h-2" /></div>{sessionState.isResting ? <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg"><h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200">Rest Time</h3><div className="text-3xl font-mono font-bold text-yellow-600 dark:text-yellow-400 mt-2">{formatTime(sessionState.restTimeRemaining)}</div><p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">Get ready for the next set!</p></div> : <div className="text-center p-4 bg-primary/10 rounded-lg"><h3 className="text-lg font-semibold">Set {sessionState.currentSet} of {currentExercise.sets}</h3><div className="text-3xl font-mono font-bold text-primary mt-2">{formatTime(sessionState.timeRemaining)}</div><p className="text-sm text-muted-foreground mt-1">Complete {currentExercise.reps} reps</p></div>}</div></div></CardContent></Card>
          </div>

          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-20 w-20 flex-shrink-0 bg-black rounded-md overflow-hidden">
                {/* This div is now the container for the YouTube player */}
                <div id="youtube-player-container" className="w-full h-full"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold truncate">{currentTrack.title}</p>
                <p className="text-sm text-muted-foreground truncate"><Music className="inline-block h-3 w-3 mr-1" /> YouTube Music</p>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" onClick={() => handlePrevTrack()}><SkipBack className="h-5 w-5" /></Button>
                <Button variant="ghost" size="icon" onClick={() => handleNextTrack()}><SkipForward className="h-5 w-5" /></Button>
              </div>
            </CardContent>
          </Card>

          {/* Controls remain the same, but handlePlayPause is now more powerful */}
          <div className="flex items-center justify-center gap-4">
            <Button variant="outline" size="lg" onClick={handlePreviousExercise} disabled={sessionState.currentExerciseIndex === 0}><SkipBack className="h-5 w-5 mr-2" />Previous</Button>
            <Button size="lg" onClick={handlePlayPause} className="px-8">{sessionState.isPlaying ? <Pause className="h-5 w-5 mr-2" /> : <Play className="h-5 w-5 mr-2" />}{sessionState.isPlaying ? 'Pause' : 'Start'}</Button>
            <Button variant="outline" size="lg" onClick={handleCompleteSet} disabled={sessionState.isResting}>Complete Set</Button>
            <Button variant="outline" size="lg" onClick={handleSkipExercise} disabled={sessionState.currentExerciseIndex === workout.exercises.length - 1}><SkipForward className="h-5 w-5 mr-2" />Skip</Button>
          </div>

          {/* Footer remains the same */}
          {nextExercise && <Card className="bg-muted/50"><CardContent className="p-4"><div className="flex items-center justify-between"><div><h4 className="font-semibold">Next: {nextExercise.name}</h4><p className="text-sm text-muted-foreground">{nextExercise.sets} sets × {nextExercise.reps} reps</p></div><Badge variant="secondary">Exercise {sessionState.currentExerciseIndex + 2}</Badge></div></CardContent></Card>}
          <div className="flex justify-center pt-2"><Button variant="destructive" size="lg" onClick={handleEndWorkout} className="px-8">End Workout</Button></div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutSession;