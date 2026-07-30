// mealtracker.tsx

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Plus, Loader2 } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { format } from 'date-fns'; // Import date-fns for formatting

export interface NutritionData {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

// Updated Meal interface to match backend data (timestamp)
export interface Meal {
  id: string;
  name: string;
  timestamp: string; // Changed from 'time' to 'timestamp'
  nutrition: NutritionData;
}

interface MealTrackerProps {
  dailyTarget: NutritionData;
  meals: Meal[];
  className?: string;
  onAddMeal?: () => void;
  isLoading?: boolean; // Added for loading state
}

export function MealTracker({
  dailyTarget,
  meals,
  className,
  onAddMeal,
  isLoading = false
}: MealTrackerProps) {

  const totals = meals.reduce((acc, meal) => {
    return {
      calories: acc.calories + (meal.nutrition.calories || 0),
      protein: acc.protein + (meal.nutrition.protein || 0),
      carbs: acc.carbs + (meal.nutrition.carbs || 0),
      fat: acc.fat + (meal.nutrition.fat || 0),
    };
  }, { calories: 0, protein: 0, carbs: 0, fat: 0 });

  const getPercentage = (current: number, target: number) => {
    if (target === 0) return 0;
    return Math.min((current / target) * 100, 100);
  };

  const percentages = {
    calories: getPercentage(totals.calories, dailyTarget.calories),
    protein: getPercentage(totals.protein, dailyTarget.protein),
    carbs: getPercentage(totals.carbs, dailyTarget.carbs),
    fat: getPercentage(totals.fat, dailyTarget.fat),
  };

  return (
    <Card className={cn("h-full", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            <CardTitle className="text-xl">Daily Nutrition</CardTitle>
          </div>
          <Button variant="outline" size="sm" onClick={onAddMeal}>
            <Plus className="h-4 w-4 mr-1" /> Add Meal
          </Button>
        </div>
        <CardDescription>
          {totals.calories} / {dailyTarget.calories} kcal consumed
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Progress Bars */}
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm"><span>Calories</span><span>{Math.round(percentages.calories)}%</span></div>
              <Progress value={percentages.calories} className="h-2" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm"><span>Protein</span><span>{totals.protein}g</span></div>
                <Progress value={percentages.protein} className="h-2 bg-muted" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm"><span>Carbs</span><span>{totals.carbs}g</span></div>
                <Progress value={percentages.carbs} className="h-2 bg-muted" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm"><span>Fat</span><span>{totals.fat}g</span></div>
                <Progress value={percentages.fat} className="h-2 bg-muted" />
              </div>
            </div>
          </div>

          {/* Meals List */}
          <div className="space-y-2 mt-4">
            <h4 className="font-medium">Today's Meals</h4>
            {isLoading ? (
              <div className="flex justify-center items-center h-24">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : meals.length > 0 ? (
              <div className="space-y-2">
                {meals.map((meal) => (
                  <div key={meal.id} className="flex items-center justify-between p-3 border rounded-md text-sm">
                    <div className="flex flex-col">
                      <span className="font-medium">{meal.name}</span>
                      {/* Use date-fns to format the ISO timestamp */}
                      <span className="text-xs text-muted-foreground">{format(new Date(meal.timestamp), 'p')}</span>
                    </div>
                    <span>{meal.nutrition.calories} kcal</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                No meals logged for today.
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}