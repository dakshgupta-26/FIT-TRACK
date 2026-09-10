// Dashboard.tsx

import React, { useState, useEffect, useMemo } from 'react';
import { format, subDays } from 'date-fns';
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
import { Activity, Dumbbell, Heart, Calendar, Loader2, Plus, ArrowRight } from 'lucide-react';

// --- Imports for fetching data ---
import { useAuth } from '@/contexts/AuthContext';
import api from '@/services/api';
import { Meal, NutritionData } from '@/types/nutrition';

// --- Type definition for a Goal to match API response ---
interface Goal {
  id: string;
  title: string;
  progress: number;
  target: number;
  type: 'weight' | 'steps' | 'workout' | string;
}

interface WorkoutItem {
  id: string;
  _id?: string;
  title: string;
  duration: number;
  type: string;
  difficulty?: string;
  exercises?: any[];
}

interface HealthMetricItem {
  _id: string;
  type: string;
  value: number;
  unit: string;
  date: string;
}

const getDateKey = (date: Date): string => format(date, 'yyyy-MM-dd');

const Dashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const userUid = currentUser?.uid || currentUser?._id;

  // --- State for fetched data ---
  const [meals, setMeals] = useState<Meal[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [workouts, setWorkouts] = useState<WorkoutItem[]>([]);
  const [healthMetrics, setHealthMetrics] = useState<HealthMetricItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- User-scoped daily target from local storage ---
  const NUTRITION_TARGET_KEY = `dailyNutritionTarget_${userUid || 'guest'}`;
  const [dailyTarget, setDailyTarget] = useState<NutritionData>(() => {
    try {
      const savedTarget = localStorage.getItem(NUTRITION_TARGET_KEY);
      return savedTarget ? JSON.parse(savedTarget) : { calories: 2000, protein: 120, carbs: 200, fat: 65 };
    } catch (error) {
      return { calories: 2000, protein: 120, carbs: 200, fat: 65 };
    }
  });

  // Re-sync nutrition target if user changes
  useEffect(() => {
    try {
      const savedTarget = localStorage.getItem(NUTRITION_TARGET_KEY);
      if (savedTarget) {
        setDailyTarget(JSON.parse(savedTarget));
      } else {
        setDailyTarget({ calories: 2000, protein: 120, carbs: 200, fat: 65 });
      }
    } catch {
      setDailyTarget({ calories: 2000, protein: 120, carbs: 200, fat: 65 });
    }
  }, [NUTRITION_TARGET_KEY]);

  // --- Data fetching effect for meals, goals, workouts, and health metrics ---
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!currentUser) return;
      setIsLoading(true);
      try {
        const dateKey = getDateKey(new Date());

        const [mealsResponse, goalsResponse, workoutsResponse, metricsResponse] = await Promise.all([
          api.get<Meal[]>(`/meals?date=${dateKey}`).catch(() => ({ data: [] as Meal[] })),
          api.get<Goal[]>('/goals').catch(() => ({ data: [] as Goal[] })),
          api.get<WorkoutItem[]>('/workouts').catch(() => ({ data: [] as WorkoutItem[] })),
          userUid
            ? api.get<{ success: boolean; metrics: HealthMetricItem[] }>(`/health-metrics/${userUid}?limit=100`).catch(() => ({ data: { success: false, metrics: [] as HealthMetricItem[] } }))
            : Promise.resolve({ data: { success: false, metrics: [] as HealthMetricItem[] } }),
        ]);

        setMeals(mealsResponse.data || []);
        setGoals(goalsResponse.data || []);
        setWorkouts(workoutsResponse.data || []);
        setHealthMetrics(metricsResponse.data?.metrics || []);

      } catch (error) {
        toast({
          title: "Notice",
          description: "Could not load complete dashboard data.",
          variant: "destructive",
        });
        setMeals([]);
        setGoals([]);
        setWorkouts([]);
        setHealthMetrics([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [currentUser, userUid, toast]);

  // --- Compute User-Specific Real Stats ---
  const todayDateStr = new Date().toDateString();

  // 1. Steps Today
  const stepMetricToday = useMemo(() => {
    return healthMetrics.find(
      (m) => m.type === 'steps' && new Date(m.date).toDateString() === todayDateStr
    );
  }, [healthMetrics, todayDateStr]);

  const dailyStepsValue = stepMetricToday ? stepMetricToday.value.toLocaleString() : '0';

  // 2. Calories Burned Today
  const caloriesBurnedValue = useMemo(() => {
    const workoutCalories = workouts.reduce((sum, w) => sum + (w.duration ? Math.round(w.duration * 6.5) : 0), 0);
    const mealCalories = meals.reduce((sum, m) => sum + (m.nutrition?.calories || 0), 0);
    const total = workoutCalories > 0 ? workoutCalories : mealCalories;
    return total > 0 ? total.toLocaleString() : '0';
  }, [workouts, meals]);

  // 3. Active Minutes
  const activeMinutesValue = useMemo(() => {
    const total = workouts.reduce((sum, w) => sum + (w.duration || 0), 0);
    return total > 0 ? `${total}` : '0';
  }, [workouts]);

  // 4. Heart Rate
  const heartRateValue = useMemo(() => {
    const hrMetric = healthMetrics.find(
      (m) => m.type === 'heart_rate_resting' || m.type === 'heart_rate_active'
    );
    return hrMetric ? `${hrMetric.value} bpm` : '-- bpm';
  }, [healthMetrics]);

  // 5. Weekly Steps Chart Data (Real user steps, or empty state)
  const weeklyStepsChartData = useMemo(() => {
    const stepMetrics = healthMetrics.filter((m) => m.type === 'steps');
    if (stepMetrics.length === 0) return [];

    return Array.from({ length: 7 }).map((_, i) => {
      const d = subDays(new Date(), 6 - i);
      const dayLabel = format(d, 'EEE');
      const dStr = d.toDateString();
      const match = stepMetrics.find((m) => new Date(m.date).toDateString() === dStr);
      return {
        date: dayLabel,
        value: match ? match.value : 0,
      };
    });
  }, [healthMetrics]);

  // 6. Weight Tracking Chart Data (Real user weight entries)
  const weightTrackingChartData = useMemo(() => {
    const weightMetrics = healthMetrics
      .filter((m) => m.type === 'weight')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    if (weightMetrics.length > 0) {
      return weightMetrics.map((m) => ({
        date: format(new Date(m.date), 'MMM d'),
        value: m.value,
      }));
    }

    if (currentUser?.weight && parseFloat(currentUser.weight) > 0) {
      return [{ date: 'Today', value: parseFloat(currentUser.weight) }];
    }

    return [];
  }, [healthMetrics, currentUser?.weight]);

  // 7. Today's Workout Item
  const todayWorkout = workouts.length > 0 ? workouts[0] : null;

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
    <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6 md:space-y-8 min-h-screen max-w-7xl mx-auto w-full">
      <PersonalizedGreeting />

      {/* Real User Telemetry Stats Cards */}
      <div className="grid gap-3 sm:gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
        <StatsCard 
          title="Daily Steps" 
          value={dailyStepsValue} 
          icon={<Activity className="h-5 w-5 text-teal-400" />} 
          trend={stepMetricToday ? { value: stepMetricToday.value, isPositive: true } : undefined} 
          className="animate-fade-in" 
        />
        <StatsCard 
          title="Calories Burned" 
          value={caloriesBurnedValue} 
          icon={<Activity className="h-5 w-5 text-orange-400" />} 
          className="animate-fade-in [animation-delay:100ms]" 
        />
        <StatsCard 
          title="Active Minutes" 
          value={activeMinutesValue} 
          icon={<Dumbbell className="h-5 w-5 text-cyan-400" />} 
          className="animate-fade-in [animation-delay:200ms]" 
        />
        <StatsCard 
          title="Heart Rate" 
          value={heartRateValue} 
          icon={<Heart className="h-5 w-5 text-rose-400" />} 
          className="animate-fade-in [animation-delay:300ms]" 
        />
        <QuickActions />
      </div>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-3">
        <HealthMetricChart 
          title="Weekly Steps" 
          data={weeklyStepsChartData} 
          dataKey="value" 
          className="lg:col-span-2" 
          yAxisLabel="Steps" 
        />
        <WaterIntakeTracker />
      </div>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-3">
        <MealTracker
          dailyTarget={dailyTarget}
          meals={meals}
          onAddMeal={handleAddMeal}
          className="lg:col-span-2"
          isLoading={isLoading}
        />

        {/* Dynamic Today's Workout Card */}
        <DashboardCard title="Today's Workout" description={todayWorkout ? "Your active routine" : "No workout logged today"} className="animate-slide-up">
          {todayWorkout ? (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 p-3 border rounded-md bg-gradient-to-r from-orange-500/5 to-red-500/5 hover:from-orange-500/10 hover:to-red-500/10 transition-all duration-300">
                <div className="p-2 rounded-full bg-gradient-to-br from-orange-500/20 to-red-500/20">
                  <Dumbbell className="h-5 w-5 text-orange-500" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-medium truncate">{todayWorkout.title}</span>
                  <span className="text-sm text-muted-foreground truncate">
                    {todayWorkout.duration} min • {todayWorkout.difficulty || 'Custom'}
                  </span>
                </div>
              </div>
              <Button onClick={handleStartWorkout} className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-lg hover:shadow-xl hover:shadow-orange-500/25 transition-all duration-300 hover:scale-105">
                Start Workout
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-400">
                <Dumbbell className="w-6 h-6 opacity-80" />
              </div>
              <div>
                <p className="font-medium text-sm text-foreground">No workouts scheduled</p>
                <p className="text-xs text-muted-foreground max-w-xs mt-0.5">
                  Pick or create a tailored exercise routine to keep moving today.
                </p>
              </div>
              <Button 
                onClick={handleStartWorkout} 
                variant="outline" 
                className="w-full mt-2 border-orange-500/30 text-orange-400 hover:bg-orange-500/10 flex items-center justify-center gap-2"
              >
                <span>Find or Create Workout</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </DashboardCard>
      </div>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-3">
        <HealthMetricChart 
          title="Weight Tracking" 
          description="Your weight progression over time" 
          data={weightTrackingChartData} 
          strokeColor="hsl(var(--accent))" 
          yAxisLabel="kg" 
        />

        <DashboardCard title="Goals Progress" description="Your active milestones">
          {isLoading ? (
            <div className="flex justify-center items-center h-24">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : goals.length > 0 ? (
            <div className="space-y-4">
              {goals.map((goal) => (
                <EnhancedProgressBar
                  key={goal.id}
                  value={goal.progress}
                  label={goal.title}
                  colorScheme={getGoalColorScheme(goal.type)}
                  animated={true}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-muted-foreground space-y-2">
              <p className="text-sm">No goals have been set yet.</p>
              <Button 
                variant="link" 
                onClick={() => navigate('/goals')} 
                className="text-xs text-teal-400 p-0 h-auto"
              >
                + Create your first fitness goal
              </Button>
            </div>
          )}
        </DashboardCard>

        <RecommendationEngine />
      </div>
    </div>
  );
};

export default Dashboard;