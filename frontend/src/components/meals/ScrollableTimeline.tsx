import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from 'lucide-react';
import { format, getHours } from 'date-fns';
import { Meal } from '@/types/nutrition';
import { cn } from '@/lib/utils';

interface ScrollableTimelineProps {
  meals: Meal[];
  onAddMeal: (hour: number) => void;
  onEditMeal: (meal: Meal) => void;
  onDeleteMeal: (id: string) => void;
}

export const ScrollableTimeline: React.FC<ScrollableTimelineProps> = ({
  meals,
  onAddMeal,
  onEditMeal,
  onDeleteMeal,
}) => {
  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle>Daily Meal Timeline</CardTitle>
      </CardHeader>
      {/* THIS IS THE KEY FIX: A container with a max height and vertical scrolling */}
      <CardContent className="max-h-[70vh] overflow-y-auto pr-4">
        <div className="relative">
          {/* Vertical line that runs down the side */}
          <div className="absolute left-16 top-0 bottom-0 w-px bg-border -ml-px"></div>

          <div className="space-y-4">
            {hours.map((hour) => {
              const mealsInHour = meals
                .filter((meal) => getHours(new Date(meal.timestamp)) === hour)
                .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

              return (
                <div key={hour} className="flex items-start gap-4">
                  <div className="w-16 text-right text-sm font-semibold text-muted-foreground pt-3">
                    {format(new Date().setHours(hour, 0), 'ha')}
                  </div>
                  <div className="flex-1 space-y-2 pt-2">
                    {mealsInHour.length > 0 ? (
                      mealsInHour.map((meal) => (
                        <div key={meal.id} className="bg-muted/50 rounded-lg p-3 group relative">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-semibold text-foreground">{meal.name}</p>
                              <p className="text-xs text-muted-foreground">{format(new Date(meal.timestamp), 'p')}</p>
                            </div>
                            <p className="font-bold text-lg text-primary">{meal.nutrition.calories} <span className="text-xs font-normal text-muted-foreground">kcal</span></p>
                          </div>
                          {/* NEW: Display Protein, Carbs, and Fat */}
                          <div className="mt-2 pt-2 border-t border-border/50 flex justify-around text-xs text-muted-foreground">
                            <span><span className="font-bold text-green-500">{meal.nutrition.protein}</span>g P</span>
                            <span><span className="font-bold text-amber-500">{meal.nutrition.carbs}</span>g C</span>
                            <span><span className="font-bold text-sky-500">{meal.nutrition.fat}</span>g F</span>
                          </div>
                          <div className="absolute top-2 right-2 flex opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onEditMeal(meal)}><Edit className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onDeleteMeal(meal.id)}><Trash2 className="h-4 w-4" /></Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="h-8"></div> // Placeholder for empty hours
                    )}
                    <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground" onClick={() => onAddMeal(hour)}>
                      <Plus className="h-4 w-4" /> Add Food
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};