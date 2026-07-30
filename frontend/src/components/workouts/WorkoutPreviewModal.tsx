import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, Flame, Music, Play, Heart } from 'lucide-react';
import { Exercise } from '@/components/workouts/WorkoutCard';

interface WorkoutPreviewModalProps {
  workout: {
    id: string;
    title: string;
    duration: number;
    type: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    exercises: Exercise[];
    estimatedCalories?: number;
    targetMuscles?: string[];
  } | null;
  isOpen: boolean;
  onClose: () => void;
  onStart: (id: string) => void;
  onGeneratePlaylist: (workoutType: string, workoutTitle: string) => void;
}

const difficultyColors = {
  Easy: 'difficulty-badge-easy',
  Medium: 'difficulty-badge-medium',
  Hard: 'difficulty-badge-hard'
};

const difficultyIcons = {
  Easy: '🌱',
  Medium: '💪',
  Hard: '🔥'
};

export function WorkoutPreviewModal({ 
  workout, 
  isOpen, 
  onClose, 
  onStart, 
  onGeneratePlaylist 
}: WorkoutPreviewModalProps) {
  if (!workout) return null;

  const estimatedCalories = workout.estimatedCalories || Math.round(workout.duration * 8);
  const targetMuscles = workout.targetMuscles || ['Full Body'];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <span className="text-2xl">
              {workout.type === 'Strength' ? '🏋️' : 
               workout.type === 'Cardio' ? '❤️' : '🧘'}
            </span>
            {workout.title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-muted/30 rounded-lg p-4 text-center">
              <Clock className="h-6 w-6 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">{workout.duration}</div>
              <div className="text-sm text-muted-foreground">minutes</div>
            </div>
            
            <div className="bg-muted/30 rounded-lg p-4 text-center">
              <Flame className="h-6 w-6 mx-auto mb-2 text-orange-500" />
              <div className="text-2xl font-bold">{estimatedCalories}</div>
              <div className="text-sm text-muted-foreground">calories</div>
            </div>
            
            <div className="bg-muted/30 rounded-lg p-4 text-center">
              <Heart className="h-6 w-6 mx-auto mb-2 text-red-500" />
              <div className="text-2xl font-bold">{workout.exercises.length}</div>
              <div className="text-sm text-muted-foreground">exercises</div>
            </div>
          </div>

          {/* Metadata */}
          <div className="flex flex-wrap gap-3">
            <Badge className={difficultyColors[workout.difficulty]}>
              <span className="mr-1">{difficultyIcons[workout.difficulty]}</span>
              {workout.difficulty}
            </Badge>
            <Badge variant="outline">{workout.type}</Badge>
            {targetMuscles.map(muscle => (
              <Badge key={muscle} variant="secondary">{muscle}</Badge>
            ))}
          </div>

          {/* Exercise List */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Exercises</h3>
            <div className="space-y-3">
              {workout.exercises.map((exercise, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center text-sm font-medium">
                      {idx + 1}
                    </div>
                    <span className="font-medium">{exercise.name}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {exercise.sets} × {exercise.reps}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Workout Intensity */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Workout Intensity</span>
              <span>{workout.difficulty}</span>
            </div>
            <Progress 
              value={workout.difficulty === 'Easy' ? 33 : workout.difficulty === 'Medium' ? 66 : 100} 
              className="h-2"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button 
              onClick={() => onStart(workout.id)}
              className="flex-1 h-12 text-base font-medium"
            >
              <Play className="h-5 w-5 mr-2" />
              Start Workout
            </Button>
            
            <Button 
              onClick={() => onGeneratePlaylist(workout.type, workout.title)}
              className="playlist-button h-12 px-6"
              variant="secondary"
            >
              <Music className="h-5 w-5 mr-2" />
              🎵 Generate Playlist
            </Button>
          </div>

          {/* Recommended Playlist Preview */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-4">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Music className="h-4 w-4" />
              Recommended Playlist Vibe
            </h4>
            <div className="text-sm text-muted-foreground">
              {workout.type === 'Strength' && 'High-energy rock and hip-hop tracks to power through your lifts'}
              {workout.type === 'Cardio' && 'Upbeat electronic and pop music to keep your heart rate up'}
              {workout.type === 'Flexibility' && 'Calm instrumental and ambient sounds for mindful movement'}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}