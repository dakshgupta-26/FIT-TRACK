import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import api from "@/services/api"; // <-- CHANGE: Import the configured axios instance
import { useAuth } from "@/contexts/AuthContext";

// This interface now matches the backend response exactly
export interface Goal {
  id: string; // The ID provided by the backend
  user: string;
  title: string;
  description?: string;
  type:
    | "weight"
    | "workout"
    | "nutrition"
    | "habit"
    | "strength"
    | "hydration"
    | "steps";
  category: "Fitness" | "Nutrition" | "Lifestyle";
  startDate: string;
  targetDate: string;
  progress: number;
  target: number;
  unit: string;
  status: "active" | "completed" | "failed";
  createdAt?: string;
  updatedAt?: string;
}

export const useGoals = () => {
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  // --- CHANGE: All functions now use the 'api' service ---

  const fetchGoals = useCallback(async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      // The backend knows the user from the token, no need to send UID in URL
      const { data } = await api.get<Goal[]>("/goals");
      setGoals(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not fetch goals.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [currentUser, toast]);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const addGoal = async (
    goalData: Omit<
      Goal,
      "_id" | "id" | "user" | "status" | "progress" | "createdAt" | "updatedAt"
    >
  ) => {
    try {
      // The backend adds the user ID automatically
      const { data: newGoal } = await api.post<Goal>("/goals", goalData);
      setGoals((prev) =>
        [newGoal, ...prev].sort(
          (a, b) =>
            new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime()
        )
      );
      toast({ title: "Success", description: "New goal created!" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create goal.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateGoal = async (goalId: string, updates: Partial<Goal>) => {
    try {
      const { data: updatedGoal } = await api.put<Goal>(
        `/goals/${goalId}`,
        updates
      );
      setGoals((prev) => prev.map((g) => (g.id === goalId ? updatedGoal : g)));
      // No toast here as components handle it, which is good practice
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update goal.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteGoal = async (goalId: string) => {
    try {
      await api.delete(`/goals/${goalId}`);
      setGoals((prev) => prev.filter((g) => g.id !== goalId));
      // No toast here as the component handles it
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete goal.",
        variant: "destructive",
      });
      throw error;
    }
  };

  // The 'updateProgress' function is removed because it's redundant.
  // The generic 'updateGoal' can handle progress updates perfectly.

  return {
    goals,
    loading,
    addGoal,
    updateGoal,
    deleteGoal,
    refetch: fetchGoals,
  };
};