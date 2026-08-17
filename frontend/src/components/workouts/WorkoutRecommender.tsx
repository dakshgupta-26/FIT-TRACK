// src/components/workouts/WorkoutRecommender.tsx

import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Search } from 'lucide-react';

// Define the type for a single recommendation coming from our Python API
interface RecommendedExercise {
    Title: string;
    BodyPart: string;
    Equipment: string;
    Level: string;
}

export const WorkoutRecommender = () => {
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
            const recommenderUrl =
              import.meta.env.NEXT_PUBLIC_RECOMMENDER_URL ||
              import.meta.env.VITE_RECOMMENDER_URL ||
              'http://localhost:8000';
            const response = await fetch(`${recommenderUrl}/recommend`, {
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
                Describe the exercises you want to find. e.g., "advanced legs workout with barbell"
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
                    <span className="ml-2">Find</span>
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