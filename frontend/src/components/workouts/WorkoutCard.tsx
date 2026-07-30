
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dumbbell, Clock, Music, Eye, Play } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface Exercise {
  name: string;
  sets: number;
  reps: number;
}

export interface WorkoutProps {
  id: string;
  title: string;
  duration: number;
  type: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  exercises: Exercise[];
  className?: string;
  onStart?: (id: string) => void;
  onPreview?: (id: string) => void;
  onGeneratePlaylist?: (type: string, title: string) => void;
}

export function WorkoutCard({
  id,
  title,
  duration,
  type,
  difficulty,
  exercises,
  className,
  onStart,
  onPreview,
  onGeneratePlaylist
}: WorkoutProps) {
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

  const typeIcons = {
    Strength: '🏋️',
    Cardio: '❤️',
    Flexibility: '🧘'
  };

  const getCardClassName = () => {
    const baseClass = "workout-card h-full flex flex-col";
    const typeClass = `workout-card-${type.toLowerCase()}`;
    return cn(baseClass, typeClass, className);
  };

  return (
    <Card className={getCardClassName()}>
      <CardHeader className="relative pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xl">{typeIcons[type as keyof typeof typeIcons] || '💪'}</span>
            <CardTitle className="text-lg font-bold leading-tight">{title}</CardTitle>
          </div>
          <Badge className={difficultyColors[difficulty]}>
            <span className="mr-1">{difficultyIcons[difficulty]}</span>
            {difficulty}
          </Badge>
        </div>
        <CardDescription className="flex items-center mt-1 text-sm font-medium">
          <Clock className="h-4 w-4 mr-1" />
          {duration} min • {type}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-3">
        <h4 className="font-medium mb-2 text-sm">Exercises</h4>
        <div className="overflow-y-auto max-h-32">
          <ul className="space-y-1.5">
            {exercises.map((exercise, idx) => (
              <li key={idx} className="text-sm">
                <div className="flex items-center justify-between">
                  <span className="truncate pr-2">{exercise.name}</span>
                  <span className="text-muted-foreground text-xs whitespace-nowrap">
                    {exercise.sets} × {exercise.reps}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
      <CardFooter className="pt-3 border-t">
        <div className="flex gap-1.5 w-full">
          <Button 
            onClick={() => onStart && onStart(id)} 
            className="flex-1 h-9 font-medium bg-primary hover:bg-primary/90 text-xs"
          >
            <Play className="h-3.5 w-3.5 mr-1.5" />
            Start
          </Button>
          
          <Button 
            onClick={() => onGeneratePlaylist && onGeneratePlaylist(type, title)}
            className="playlist-button h-9 w-9 p-0 flex items-center justify-center"
            variant="secondary"
          >
            <Music className="h-3.5 w-3.5" />
          </Button>

          <Button 
            variant="outline" 
            className="flex-1 h-9 text-xs" 
            onClick={() => onPreview && onPreview(id)}
          >
            <Eye className="h-3.5 w-3.5 mr-1.5" />
            Preview
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

export default WorkoutCard;
