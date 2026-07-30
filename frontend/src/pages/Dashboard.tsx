// Dashboard.tsx

import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { HealthMetricChart } from "@/components/dashboard/HealthMetricChart";
import { WaterIntakeTracker } from "@/components/dashboard/WaterIntakeTracker";
import { MealTracker } from "@/components/meals/MealTracker";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { RecommendationEngine } from "@/components/ai/RecommendationEngine";
import { PersonalizedGreeting } from "@/components/dashboard/PersonalizedGreeting";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { EnhancedProgressBar } from "@/components/dashboard/EnhancedProgressBar";
import { Activity, Dumbbell, Heart, Calendar, Loader2 } from 'lucide-react';

// --- Imports for fetching data ---
import { useAuth } from '@/contexts/AuthContext';
import api from '@/services/api';
import { Meal, NutritionData } from '@/types/nutrition';

// --- UPDATED: Type definition for a Goal to match API response ---
interface Goal {
  id: string; // Changed from _id
  title: string;
  progress: number; // Changed from currentValue
  target: number;   // Changed from targetValue
  type: 'weight' | 'steps' | 'workout' | string;
}

// Sample data for other components
const weeklySteps = [
  { date: 'Mon', value: 6500 }, { date: 'Tue', value: 7200 }, { date: 'Wed', value: 8100 },
  { date: 'Thu', value: 6800 }, { date: 'Fri', value: 9200 }, { date: 'Sat', value: 7800 }, { date: 'Sun', value: 8500 },
];

const weightData = [
  { date: 'Apr 1', value: 75.5 }, { date: 'Apr 2', value: 75.3 }, { date: 'Apr 3', value: 75.1 },
  { date: 'Apr 4', value: 74.9 }, { date: 'Apr 5', value: 74.8 },
];

const getDateKey = (date: Date): string => format(date, 'yyyy-MM-dd');

const Dashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // --- State for fetched data ---
  const [meals, setMeals] = useState<Meal[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- State for daily target from local storage (for consistency) ---
  const NUTRITION_TARGET_KEY = 'dailyNutritionTarget';
  const [dailyTarget, setDailyTarget] = useState<NutritionData>(() => {
    try {
      const savedTarget = localStorage.getItem(NUTRITION_TARGET_KEY);
      return savedTarget ? JSON.parse(savedTarget) : { calories: 2200, protein: 130, carbs: 200, fat: 70 };
    } catch (error) {
      console.error("Failed to parse nutrition target from localStorage", error);
      return { calories: 2200, protein: 130, carbs: 200, fat: 70 };
    }
  });

  // --- Data fetching effect for both meals and goals ---
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!currentUser) return;
      setIsLoading(true);
      try {
        const dateKey = getDateKey(new Date());

        const [mealsResponse, goalsResponse] = await Promise.all([
          api.get<Meal[]>(`/meals?date=${dateKey}`),
          api.get<Goal[]>('/goals')
        ]);

        setMeals(mealsResponse.data);
        setGoals(goalsResponse.data);

      } catch (error) {
        toast({
          title: "Error fetching dashboard data",
          description: "Could not load your meals or goals.",
          variant: "destructive",
        });
        setMeals([]);
        setGoals([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [currentUser, toast]);

  const handleAddMeal = () => {
    navigate('/meals');
  };

  const handleStartWorkout = () => {
    navigate('/workouts');
  };

  const getGoalColorScheme = (type: string): 'warning' | 'success' | 'info' | 'default' => {
    const lowerCaseType = type.toLowerCase();
    if (lowerCaseType.includes('weight')) return 'warning';
    if (lowerCaseType.includes('steps')) return 'success';
    if (lowerCaseType.includes('workout')) return 'info';
    return 'default';
  };


  return (
    <div className="p-6 space-y-8 min-h-screen">
      <PersonalizedGreeting />

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-5">
        <StatsCard title="Daily Steps" value="8,234" icon={<Activity className="h-5 w-5" />} trend={{ value: 12, isPositive: true }} className="animate-fade-in" />
        <StatsCard title="Calories Burned" value="546" icon={<Activity className="h-5 w-5" />} trend={{ value: 5, isPositive: true }} className="animate-fade-in [animation-delay:100ms]" />
        <StatsCard title="Active Minutes" value="68" icon={<Dumbbell className="h-5 w-5" />} trend={{ value: 8, isPositive: true }} className="animate-fade-in [animation-delay:200ms]" />
        <StatsCard title="Heart Rate" value="72 bpm" icon={<Heart className="h-5 w-5" />} trend={{ value: 3, isPositive: false }} className="animate-fade-in [animation-delay:300ms]" />
        <QuickActions />
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        <HealthMetricChart title="Weekly Steps" data={weeklySteps} dataKey="value" className="lg:col-span-2" yAxisLabel="Steps" />
        <WaterIntakeTracker />
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        <MealTracker
          dailyTarget={dailyTarget}
          meals={meals}
          onAddMeal={handleAddMeal}
          className="lg:col-span-2"
          isLoading={isLoading}
        />

        <DashboardCard title="Today's Workout" description="You have a scheduled workout" className="animate-slide-up">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 p-3 border rounded-md bg-gradient-to-r from-orange-500/5 to-red-500/5 hover:from-orange-500/10 hover:to-red-500/10 transition-all duration-300">
              <div className="p-2 rounded-full bg-gradient-to-br from-orange-500/20 to-red-500/20"><Dumbbell className="h-5 w-5 text-orange-500" /></div>
              <div className="flex flex-col"><span className="font-medium">Upper Body Strength</span><span className="text-sm text-muted-foreground">45 min • 6 exercises</span></div>
            </div>
            <div className="flex items-center gap-3 p-3 border rounded-md bg-gradient-to-r from-blue-500/5 to-cyan-500/5 hover:from-blue-500/10 hover:to-cyan-500/10 transition-all duration-300">
              <div className="p-2 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20"><Calendar className="h-5 w-5 text-blue-500" /></div>
              <div className="flex flex-col"><span className="font-medium">Next: Cardio</span><span className="text-sm text-muted-foreground">Tomorrow • 30 min</span></div>
            </div>
            <Button onClick={handleStartWorkout} className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-lg hover:shadow-xl hover:shadow-orange-500/25 transition-all duration-300 hover:scale-105">Start Today's Workout</Button>
          </div>
        </DashboardCard>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        <HealthMetricChart title="Weight Tracking" description="Your progress over time" data={weightData} strokeColor="hsl(var(--accent))" yAxisLabel="kg" />

        <DashboardCard title="Goals Progress" description="You're making good progress!">
          {isLoading ? (
            <div className="flex justify-center items-center h-24">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : goals.length > 0 ? (
            <div className="space-y-4">
              {goals.map((goal) => {
                // --- UPDATED: Use correct property names for calculation ---
                // const percentage = goal.target > 0
                //   ? (goal.progress / goal.target) * 100
                //   : 0;

                return (
                  <EnhancedProgressBar
                    // --- UPDATED: Use correct property name for key ---
                    key={goal.id}
                    value={goal.progress} // No need to round here, component does it
                    label={goal.title}
                    colorScheme={getGoalColorScheme(goal.type)}
                    animated={true}
                  />
                );
              })}
            </div>
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              No goals have been set yet.
            </div>
          )}
        </DashboardCard>

        <RecommendationEngine />
      </div>
    </div>
  );
};

export default Dashboard;