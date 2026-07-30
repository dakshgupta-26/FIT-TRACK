// src/components/meals/DailyNutritionSummary.tsx

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar } from 'lucide-react';
import { Meal, NutritionData } from '@/types/nutrition';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const groupMealsByHour = (meals: Meal[]): Record<string, Meal[]> => {
  const sortedMeals = [...meals].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  return sortedMeals.reduce((acc, meal) => {
    const hourKey = format(new Date(meal.timestamp), 'HH');
    if (!acc[hourKey]) {
      acc[hourKey] = [];
    }
    acc[hourKey].push(meal);
    return acc;
  }, {} as Record<string, Meal[]>);
};

const MacroProgress = ({ name, icon, current, target, colorClassName }: { name: string; icon: string; current: number; target: number; colorClassName: string; }) => {
  const percentage = target > 0 ? (current / target) * 100 : 0;
  const isOverTarget = percentage > 100;

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-sm">
        <div className="flex items-center gap-1 font-medium"><span>{icon}</span><span>{name}</span></div>
        <Badge variant={isOverTarget ? "destructive" : "outline"} className="text-xs">{Math.round(percentage)}%</Badge>
      </div>
      <div>
        <Progress value={percentage} className="h-2" indicatorClassName={cn(isOverTarget ? 'bg-destructive' : colorClassName)} />
        <div className={cn("text-xs text-center mt-1 text-muted-foreground", isOverTarget && "font-bold text-destructive")}>{Math.round(current)}g / {target}g</div>
      </div>
    </div>
  );
};

// THIS IS THE LINE THAT IS MODIFIED
export const DailyNutritionSummary: React.FC<{
  dailyTarget: NutritionData;
  meals: Meal[];
  onTargetChange: (newCalories: number) => void;
}> = ({ dailyTarget, meals, onTargetChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(dailyTarget.calories.toString());

  // Keep internal input value in sync with prop unless we are actively editing
  useEffect(() => {
    if (!isEditing) {
      setInputValue(dailyTarget.calories.toString());
    }
  }, [dailyTarget.calories, isEditing]);

  const handleSave = () => {
    const newCalories = parseInt(inputValue, 10);
    // Only save if the value is a valid, positive number
    if (!isNaN(newCalories) && newCalories > 0) {
      onTargetChange(newCalories);
    } else {
      // On invalid input, revert to the original value
      setInputValue(dailyTarget.calories.toString());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      // On escape, revert and exit editing mode
      setInputValue(dailyTarget.calories.toString());
      setIsEditing(false);
    }
  };

  const totals = meals.reduce((acc, meal) => ({
    calories: acc.calories + meal.nutrition.calories,
    protein: acc.protein + meal.nutrition.protein,
    carbs: acc.carbs + meal.nutrition.carbs,
    fat: acc.fat + meal.nutrition.fat,
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

  const percentages = { calories: dailyTarget.calories > 0 ? (totals.calories / dailyTarget.calories) * 100 : 0 };
  const isCaloriesOverTarget = percentages.calories > 100;
  const groupedMeals = groupMealsByHour(meals);

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center gap-2"><Calendar className="h-5 w-5 text-primary" /><CardTitle className="text-xl">Daily Nutrition</CardTitle></div>
        <CardDescription className={cn("flex items-center gap-1", isCaloriesOverTarget && "text-destructive font-semibold")}>
          <span>{totals.calories} /</span>
          {isEditing ? (
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyDown}
              autoFocus
              className="w-20 px-1 py-0 rounded bg-muted border border-border text-card-foreground outline-none focus:ring-1 focus:ring-primary"
            />
          ) : (
            <span
              onClick={() => setIsEditing(true)}
              className="font-semibold cursor-pointer hover:border-b hover:border-dashed"
              title="Click to edit calorie goal"
            >
              {dailyTarget.calories}
            </span>
          )}
          <span>kcal consumed</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2 font-medium"><span>Calories</span><Badge variant={isCaloriesOverTarget ? "destructive" : "outline"} className="text-xs">{Math.round(percentages.calories)}%</Badge></div>
                <span className="text-muted-foreground">{Math.max(0, dailyTarget.calories - totals.calories)} kcal remaining</span>
              </div>
              <Progress value={percentages.calories} className="h-3" indicatorClassName={cn(isCaloriesOverTarget && 'bg-destructive')} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <MacroProgress name="Protein" icon="🥩" current={totals.protein} target={dailyTarget.protein} colorClassName="bg-green-500" />
              <MacroProgress name="Carbs" icon="🍞" current={totals.carbs} target={dailyTarget.carbs} colorClassName="bg-amber-500" />
              <MacroProgress name="Fat" icon="🥑" current={totals.fat} target={dailyTarget.fat} colorClassName="bg-sky-500" />
            </div>
          </div>
          <div className="space-y-4 pt-4 border-t border-border">
            <h4 className="font-semibold text-foreground">Today's Log</h4>
            {Object.keys(groupedMeals).length > 0 ? (
              Object.entries(groupedMeals).map(([hourKey, mealsAtHour]) => (
                <div key={hourKey} className="flex items-start gap-4">
                  <div className="w-16 text-right text-sm font-semibold text-muted-foreground pt-3">{format(new Date().setHours(parseInt(hourKey), 0), 'ha')}</div>
                  <div className="flex-1 space-y-2">
                    {mealsAtHour.map((meal) => (
                      <div key={meal.id} className="bg-muted/50 rounded-lg p-3">
                        <div className="flex justify-between items-start">
                          <div><p className="font-medium text-sm text-foreground">{meal.name}</p><p className="text-xs text-muted-foreground">{format(new Date(meal.timestamp), 'p')}</p></div>
                          <p className="font-bold text-base text-primary">{meal.nutrition.calories} kcal</p>
                        </div>
                        <div className="mt-2 pt-2 border-t border-border/50 flex justify-around text-xs text-muted-foreground">
                          <span><span className="font-bold text-green-500">{meal.nutrition.protein}</span>g Protein</span>
                          <span><span className="font-bold text-amber-500">{meal.nutrition.carbs}</span>g Carbs</span>
                          <span><span className="font-bold text-sky-500">{meal.nutrition.fat}</span>g Fat</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (<div className="text-center py-6 text-muted-foreground">No meals logged for this day.</div>)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};