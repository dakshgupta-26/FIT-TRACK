// Workout.tsx

import React, { useState, useMemo, useEffect } from 'react';
import { WorkoutCard, Exercise } from "@/components/workouts/WorkoutCard";
import { WorkoutFilters, FilterState } from "@/components/workouts/WorkoutFilters";
import { WorkoutPreviewModal } from "@/components/workouts/WorkoutPreviewModal";
import { CreateWorkoutModal } from "@/components/workouts/CreateWorkoutModal";
import WorkoutSession from "@/components/workouts/WorkoutSession";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // <-- Added Input for the recommender
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Loader2, Search } from 'lucide-react'; // <-- Added Search icon

// --- Imports for fetching data ---
import api from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';

// ===================================================================
// 1. NEW AI WORKOUT RECOMMENDER COMPONENT
// ===================================================================

// Define the type for a single recommendation coming from our Python API
interface RecommendedExercise {
  Title: string;
  BodyPart: string;
  Equipment: string;
  Level: string;
}

const WorkoutRecommender = () => {
  const [query, setQuery] = useState('');
  const [recommendations, setRecommendations] = useState<RecommendedExercise[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent form submission from reloading the page
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);
    setRecommendations([]);

    try {
      // The Flask server runs on port 5000 by default
      const response = await fetch('http://localhost:8000/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      if (data.recommendations && data.recommendations.length > 0) {
        setRecommendations(data.recommendations);
      } else {
        setError('No specific exercises found. Try a different query!');
      }
    } catch (err) {
      setError('Failed to connect to the recommendation server. Is it running?');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-8 p-6 border rounded-lg bg-card shadow-sm">
      <h2 className="text-2xl font-semibold mb-2 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
        AI Exercise Finder
      </h2>
      <p className="text-muted-foreground mb-4">
        Describe the exercises you want to find, e.g., "advanced legs workout with barbell"
      </p>

      <form onSubmit={handleSearch} className="flex items-center gap-2 mb-4">
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="I'm looking for..."
          className="flex-grow"
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
          <span className="ml-2 hidden sm:inline">Find</span>
        </Button>
      </form>

      {error && <p className="text-destructive text-center">{error}</p>}

      {recommendations.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-4 text-center">Suggested Exercises</h3>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {recommendations.map((rec, index) => (
              <div key={index} className="p-4 border rounded-md bg-background">
                <p className="font-bold text-card-foreground">{rec.Title}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  <span className="font-medium">{rec.Level}</span> • {rec.BodyPart}
                </p>
                <p className="text-xs text-muted-foreground mt-2">Equipment: {rec.Equipment}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};


// ===================================================================
// 2. MAIN WORKOUTS PAGE COMPONENT (with recommender integrated)
// ===================================================================

// This interface now represents the data coming from the backend
interface Workout {
  id: string; // The backend provides this
  _id?: string; // Mongoose might use _id
  title: string;
  duration: number;
  type: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  exercises: Exercise[];
  estimatedCalories?: number;
  targetMuscles?: string[];
  popularity?: number;
}

const Workouts = () => {
  const { toast } = useToast();
  const { currentUser } = useAuth();

  // --- Component State ---
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [previewWorkout, setPreviewWorkout] = useState<Workout | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [activeWorkout, setActiveWorkout] = useState<Workout | null>(null);
  const [isWorkoutSessionOpen, setIsWorkoutSessionOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false); // State for the create modal

  const [filters, setFilters] = useState<FilterState>({
    difficulties: [],
    durations: [],
    types: [],
    sortBy: 'popular'
  });

  // --- Data Fetching Effect ---
  useEffect(() => {
    const fetchWorkouts = async () => {
      if (!currentUser) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const { data } = await api.get<Workout[]>('/workouts');
        // Handle both id and _id from backend for consistency
        const formattedData = data.map(w => ({ ...w, id: w.id || w._id! }));
        setWorkouts(formattedData);
      } catch (error) {
        toast({
          title: "Error fetching workouts",
          description: "Could not load your workout data. Please try again later.",
          variant: "destructive",
        });
        setWorkouts([]); // Clear data on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkouts();
  }, [currentUser, toast]);

  // Filter and sort workouts from state
  const filteredWorkouts = useMemo(() => {
    const filtered = workouts.filter(workout => {
      if (filters.difficulties.length > 0 && !filters.difficulties.includes(workout.difficulty)) return false;
      if (filters.durations.length > 0) {
        const durationCategory = workout.duration < 30 ? 'short' : workout.duration <= 45 ? 'medium' : 'long';
        if (!filters.durations.includes(durationCategory)) return false;
      }
      if (filters.types.length > 0 && !filters.types.includes(workout.type)) return false;
      return true;
    });

    return [...filtered].sort((a, b) => {
      switch (filters.sortBy) {
        case 'duration': return a.duration - b.duration;
        case 'difficulty': {
          const difficultyOrder = { Easy: 1, Medium: 2, Hard: 3 };
          return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
        }
        case 'popular':
        default: return (b.popularity || 0) - (a.popularity || 0);
      }
    });
  }, [filters, workouts]);

  const strengthWorkouts = filteredWorkouts.filter(w => w.type === 'Strength');
  const cardioWorkouts = filteredWorkouts.filter(w => w.type === 'Cardio');
  const flexibilityWorkouts = filteredWorkouts.filter(w => w.type === 'Flexibility');

  const getWorkoutId = (workout: Workout) => workout.id || workout._id!;

  const handleStartWorkout = (id: string) => {
    const workout = workouts.find(w => getWorkoutId(w) === id);
    if (workout) {
      setActiveWorkout(workout);
      setIsWorkoutSessionOpen(true);
      toast({ title: `Starting: ${workout.title}`, description: "Get ready to crush your workout! 💪" });
    }
  };

  const handlePreviewWorkout = (id: string) => {
    const workout = workouts.find(w => getWorkoutId(w) === id);
    if (workout) {
      setPreviewWorkout(workout);
      setIsPreviewOpen(true);
    }
  };

  const handleGeneratePlaylist = (type: string, title: string) => {
    window.location.href = `/playlist-creator?type=${type}&workout=${encodeURIComponent(title)}`;
  };

  const handleCreateWorkout = () => {
    setIsCreateModalOpen(true);
  };

  const handleWorkoutCreated = (newWorkout: Workout) => {
    setWorkouts(prevWorkouts => [{ ...newWorkout, id: newWorkout.id || newWorkout._id! }, ...prevWorkouts]);
  };

  const handleEndWorkout = () => {
    setIsWorkoutSessionOpen(false);
    setActiveWorkout(null);
    toast({ title: "Workout Completed! 🎉", description: "Great job! You've finished your workout session." });
  };

  const handleCloseWorkoutSession = () => {
    setIsWorkoutSessionOpen(false);
    setActiveWorkout(null);
  };

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Workout Library
          </h1>
          <p className="text-muted-foreground mt-1">
            Discover personalized workouts • {isLoading ? 'Loading workouts...' : `${filteredWorkouts.length} workouts available`}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <WorkoutFilters filters={filters} onFiltersChange={setFilters} />
          <Button onClick={handleCreateWorkout} className="h-10 px-6">
            <Plus className="h-4 w-4 mr-2" />
            Create Workout
          </Button>
        </div>
      </div>

      {/* ======================= */}
      {/* INTEGRATION POINT       */}
      {/* ======================= */}
      <WorkoutRecommender />

      {isLoading ? (
        <div className="flex justify-center items-center py-24">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      ) : (
        <Tabs defaultValue="all">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Workouts</TabsTrigger>
            <TabsTrigger value="strength">Strength</TabsTrigger>
            <TabsTrigger value="cardio">Cardio</TabsTrigger>
            <TabsTrigger value="flexibility">Flexibility</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-0">
            {filteredWorkouts.length > 0 ? (
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredWorkouts.map(workout => (
                  <WorkoutCard key={getWorkoutId(workout)} {...workout} id={getWorkoutId(workout)} onStart={handleStartWorkout} onPreview={handlePreviewWorkout} onGeneratePlaylist={handleGeneratePlaylist} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">No workouts match your current filters.</p>
                <p className="text-muted-foreground">Try adjusting your filters or creating a custom workout.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="strength" className="mt-0"><div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{strengthWorkouts.map(w => <WorkoutCard key={getWorkoutId(w)} {...w} id={getWorkoutId(w)} onStart={handleStartWorkout} onPreview={handlePreviewWorkout} onGeneratePlaylist={handleGeneratePlaylist} />)}</div></TabsContent>
          <TabsContent value="cardio" className="mt-0"><div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{cardioWorkouts.map(w => <WorkoutCard key={getWorkoutId(w)} {...w} id={getWorkoutId(w)} onStart={handleStartWorkout} onPreview={handlePreviewWorkout} onGeneratePlaylist={handleGeneratePlaylist} />)}</div></TabsContent>
          <TabsContent value="flexibility" className="mt-0"><div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{flexibilityWorkouts.map(w => <WorkoutCard key={getWorkoutId(w)} {...w} id={getWorkoutId(w)} onStart={handleStartWorkout} onPreview={handlePreviewWorkout} onGeneratePlaylist={handleGeneratePlaylist} />)}</div></TabsContent>

          <TabsContent value="favorites" className="mt-0">
            <div className="flex flex-col items-center justify-center py-12">
              <div className="text-6xl mb-4">⭐</div>
              <p className="text-muted-foreground text-lg">No favorite workouts yet.</p>
            </div>
          </TabsContent>
        </Tabs>
      )}

      {/* Render the Modals */}
      <WorkoutPreviewModal workout={previewWorkout} isOpen={isPreviewOpen} onClose={() => setIsPreviewOpen(false)} onStart={handleStartWorkout} onGeneratePlaylist={handleGeneratePlaylist} />
      {activeWorkout && (<WorkoutSession workout={activeWorkout} onEndWorkout={handleEndWorkout} onClose={handleCloseWorkoutSession} />)}

      <CreateWorkoutModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onWorkoutCreated={handleWorkoutCreated}
      />
    </div>
  );
};

export default Workouts;