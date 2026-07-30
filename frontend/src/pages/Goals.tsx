// src/pages/Goals.tsx

import React, { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Target, Loader2 } from 'lucide-react';
import { CreateGoalModal } from "@/components/modals/CreateGoalModal";
import GoalCard from "@/components/goals/GoalCard";
import GoalFilters from "@/components/goals/GoalFilters";
import { useGoals, Goal } from "@/hooks/useGoals";

interface GoalFiltersState {
  categories: string[];
  types: string[];
  status: string[];
  sortBy: 'dueDate' | 'progress' | 'category' | 'created';
  sortOrder: 'asc' | 'desc';
}

const Goals = () => {
  const { toast } = useToast();
  const [createGoalModalOpen, setCreateGoalModalOpen] = useState(false);
  // --- CHANGE: Destructure `addGoal` here to pass it down ---
  const { goals, loading, addGoal, updateGoal, deleteGoal } = useGoals();
  const [filters, setFilters] = useState<GoalFiltersState>({
    categories: [],
    types: [],
    status: [],
    sortBy: 'dueDate',
    sortOrder: 'asc'
  });
  
  const handleCreateGoal = () => {
    setCreateGoalModalOpen(true);
  };
  
  const handleGoalAction = async (goalId: string, action: string) => {
    try {
      if (action === 'Completed') {
        await updateGoal(goalId, { 
          status: 'completed' as const, 
          progress: 100 
        });
        toast({ title: "Goal Completed!", description: "Great job reaching your goal." });
      } else if (action === 'Deleted') {
        await deleteGoal(goalId);
        toast({ title: "Goal Deleted", description: "The goal has been removed." });
      }
    } catch (error) {
      console.error('Error handling goal action:', error);
      toast({ title: "Error", description: "Could not perform action. Please try again.", variant: "destructive" });
    }
  };

  const handleGoalUpdate = async (goalId: string, updates: Partial<Goal>) => {
    try {
      await updateGoal(goalId, updates);
      toast({ title: "Goal Updated", description: "Your goal progress has been saved." });
    } catch (error) {
      console.error('Error updating goal:', error);
    }
  };

  const filteredAndSortedGoals = useMemo(() => {
    let filtered = [...goals];

    if (filters.categories.length > 0) {
      filtered = filtered.filter(goal => filters.categories.includes(goal.category));
    }
    if (filters.types.length > 0) {
      filtered = filtered.filter(goal => filters.types.includes(goal.type));
    }
    if (filters.status.length > 0) {
      filtered = filtered.filter(goal => filters.status.includes(goal.status));
    }

    filtered.sort((a, b) => {
      let compareValue = 0;
      switch (filters.sortBy) {
        case 'dueDate':
          compareValue = new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime();
          break;
        case 'progress':
          compareValue = a.progress - b.progress;
          break;
        case 'category':
          compareValue = a.category.localeCompare(b.category);
          break;
        case 'created':
          compareValue = new Date(a.createdAt || a.startDate).getTime() - new Date(b.createdAt || b.startDate).getTime();
          break;
        default:
          compareValue = 0;
      }
      return filters.sortOrder === 'asc' ? compareValue : -compareValue;
    });

    return filtered;
  }, [goals, filters]);

  const groupedGoals = useMemo(() => {
    const groups: Record<string, Goal[]> = {};
    filteredAndSortedGoals.forEach(goal => {
      if (!groups[goal.category]) {
        groups[goal.category] = [];
      }
      groups[goal.category].push(goal);
    });
    return groups;
  }, [filteredAndSortedGoals]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Goal Tracker
          </h1>
          <p className="text-muted-foreground mt-1">
            Track your fitness journey with personalized goals • {filteredAndSortedGoals.length} goals
            {goals.length !== filteredAndSortedGoals.length && ` (${goals.length} total)`}
          </p>
        </div>
        <div className="flex gap-3">
          <GoalFilters filters={filters} onFiltersChange={setFilters} />
          <Button onClick={handleCreateGoal} className="h-10">
            <Plus className="h-4 w-4 mr-2" />
            New Goal
          </Button>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading goals...</span>
        </div>
      )}

      {!loading && (
        <div className="space-y-6">
          {Object.entries(groupedGoals).map(([category, categoryGoals]) => (
            <div key={category} className="space-y-4">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">{category} Goals</h2>
                <span className="text-sm text-muted-foreground">({categoryGoals.length})</span>
              </div>
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {categoryGoals.map(goal => (
                  <GoalCard
                    key={goal.id}
                    goal={goal}
                    onGoalUpdate={handleGoalUpdate}
                    onGoalAction={handleGoalAction}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && filteredAndSortedGoals.length === 0 && (
        <div className="text-center py-12">
          <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No goals found</h3>
          <p className="text-muted-foreground mb-4">
            {filters.categories.length > 0 || filters.types.length > 0 || filters.status.length > 0
              ? "Try adjusting your filters to see more goals."
              : "Create your first goal to start tracking your fitness journey."}
          </p>
          <Button onClick={handleCreateGoal}>
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Goal
          </Button>
        </div>
      )}
      
      <CreateGoalModal 
        open={createGoalModalOpen} 
        onOpenChange={setCreateGoalModalOpen}
        // --- CHANGE: Pass the addGoal function from the hook as a prop ---
        addGoal={addGoal}
      />
    </div>
  );
};

export default Goals;