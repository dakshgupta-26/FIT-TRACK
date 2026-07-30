// src/components/goals/GoalCard.tsx

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CheckIcon,
  MoreHorizontal,
  Edit2,
  X,
  Target,
  Trophy,
  Dumbbell,
  Droplets,
  Apple,
  Activity,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { Goal } from '@/hooks/useGoals';
import { useForm, SubmitHandler } from 'react-hook-form';

interface GoalCardProps {
  goal: Goal;
  onGoalUpdate: (goalId: string, updates: Partial<Goal>) => void;
  onGoalAction: (goalId: string, action: string) => void;
}

type EditFormValues = {
  title: string;
  target: number;
  progress: number;
};

const getGoalIcon = (type: string) => {
  switch (type) {
    case 'weight': return Target;
    case 'workout':
    case 'strength': return Dumbbell;
    case 'hydration': return Droplets;
    case 'nutrition': return Apple;
    case 'habit':
    case 'steps': return Activity;
    default: return Target;
  }
};

const getGoalTypeColor = (type: string) => {
  switch (type) {
    case 'weight': return 'hsl(var(--primary))';
    case 'workout':
    case 'strength': return 'hsl(var(--chart-1))';
    case 'hydration': return 'hsl(var(--chart-2))';
    case 'nutrition': return 'hsl(var(--chart-3))';
    case 'habit':
    case 'steps': return 'hsl(var(--chart-4))';
    default: return 'hsl(var(--primary))';
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
};

const calculateDaysLeft = (targetDate: string) => {
  const target = new Date(targetDate);
  const today = new Date();
  target.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  const diffTime = target.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const GoalCard: React.FC<GoalCardProps> = ({ goal, onGoalUpdate, onGoalAction }) => {
  const [isEditing, setIsEditing] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<EditFormValues>({
    mode: 'onChange',
    defaultValues: {
      title: goal.title,
      target: goal.target,
      progress: goal.progress,
    },
  });

  const IconComponent = getGoalIcon(goal.type);
  const daysLeft = calculateDaysLeft(goal.targetDate);
  const isCompleted = goal.progress >= 100 || goal.status === 'completed';
  const isOverdue = daysLeft < 0 && !isCompleted;

  const handleSaveEdit: SubmitHandler<EditFormValues> = (data) => {
    // A simple check to ensure the ID exists before updating.
    if (!goal.id) return;

    const validatedProgress = Math.max(0, Math.min(100, data.progress));

    onGoalUpdate(goal.id, {
      title: data.title.trim(),
      target: data.target,
      progress: validatedProgress,
    });
    setIsEditing(false);
  };

  // --- EDIT MODE ---
  if (isEditing) {
    return (
      <Card className="p-4 relative z-50">
        <form
          onSubmit={handleSubmit(handleSaveEdit)}
          noValidate
          className="flex flex-col space-y-4"
        >
          {/* Goal Title */}
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-1 block">
              Goal Title
            </label>
            <Input
              {...register("title", { required: "Goal title cannot be empty" })}
              placeholder="Enter goal title"
            />
            {errors.title && (
              <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>
            )}
          </div>

          {/* Progress and Target Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1 block">
                Progress (%)
              </label>
              <Input
                type="number"
                {...register("progress", {
                  required: "Progress is required",
                  min: 0,
                  max: 100,
                  valueAsNumber: true,
                })}
                placeholder="Progress %"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1 block">
                Target ({goal.unit})
              </label>
              <Input
                type="number"
                {...register("target", {
                  required: "Target is required",
                  min: 1,
                  valueAsNumber: true,
                })}
                placeholder={`Target (${goal.unit})`}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-primary text-white hover:bg-primary/90"
            >
              Save
            </Button>
          </div>
        </form>
      </Card>
    );
  }

  // --- NORMAL VIEW ---
  return (
    <Card
      className={cn(
        "relative transition-all duration-300 hover:shadow-lg group flex flex-col h-full",
        isCompleted && "ring-2 ring-green-500/50 bg-green-50/50",
        isOverdue && "ring-2 ring-red-500/50"
      )}
    >
      {isCompleted && (
        <div className="absolute -top-2 -right-2 z-10">
          <div className="bg-green-500 text-white rounded-full p-2">
            <Trophy className="h-4 w-4" />
          </div>
        </div>
      )}

      <CardHeader className="pb-3 space-y-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <div
              className="p-2 rounded-lg"
              style={{ backgroundColor: `${getGoalTypeColor(goal.type)}15` }}
            >
              <IconComponent
                className="h-4 w-4"
                style={{ color: getGoalTypeColor(goal.type) }}
              />
            </div>
            <Badge variant="secondary" className="text-xs">
              {goal.category}
            </Badge>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  setIsEditing(true);
                }}
                disabled={isCompleted}
              >
                <Edit2 className="h-4 w-4 mr-2" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => onGoalAction(goal.id, 'Completed')}
                disabled={isCompleted}
              >
                <CheckIcon className="h-4 w-4 mr-2" /> Mark Complete
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-500 focus:text-red-500"
                onSelect={() => onGoalAction(goal.id, 'Deleted')}
              >
                <X className="h-4 w-4 mr-2" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <CardTitle className="text-lg leading-tight">{goal.title}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 flex-grow flex flex-col justify-end">
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="font-medium">Progress</span>
            <span
              className="font-bold"
              style={{ color: getGoalTypeColor(goal.type) }}
            >
              {goal.progress}%
            </span>
          </div>
          <Progress
            value={goal.progress}
            className="h-3"
            style={{ background: `${getGoalTypeColor(goal.type)}20` }}
          />
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-muted-foreground text-xs">Target</p>
            <p className="font-medium">
              {goal.target} {goal.unit}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Due Date</p>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span
                className={cn("font-medium", isOverdue && "text-red-500")}
              >
                {formatDate(goal.targetDate)}
              </span>
            </div>
          </div>
        </div>

        <div
          className={cn(
            "flex items-center gap-2 text-sm p-2 rounded-lg",
            isCompleted
              ? "bg-green-50 text-green-700"
              : isOverdue
                ? "bg-red-50 text-red-700"
                : daysLeft <= 7
                  ? "bg-amber-50 text-amber-700"
                  : "bg-muted/50"
          )}
        >
          {isCompleted ? (
            <Trophy className="h-4 w-4" />
          ) : isOverdue ? (
            <AlertCircle className="h-4 w-4" />
          ) : (
            <Calendar className="h-4 w-4" />
          )}
          <span className="font-medium">
            {isCompleted
              ? "Completed!"
              : isOverdue
                ? `${Math.abs(daysLeft)} days overdue`
                : daysLeft === 0
                  ? "Due today"
                  : `${daysLeft} days left`}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default GoalCard;