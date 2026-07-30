// src/components/modals/CreateGoalModal.tsx

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Goal } from "@/hooks/useGoals"; // Import Goal type for props

// --- CHANGE: The props interface is updated to accept the addGoal function ---
interface CreateGoalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  addGoal: (goalData: Omit<Goal, "_id" | "id" | "user" | "status" | "progress" | "createdAt" | "updatedAt">) => Promise<void>;
}

const initialState = {
  title: '',
  description: '',
  type: '',
  targetValue: '',
  unit: '',
  startDate: undefined as Date | undefined,
  targetDate: undefined as Date | undefined,
};

const getCategoryFromType = (type: string) => {
  switch (type) {
    case 'weight': case 'workout': case 'strength': return 'Fitness';
    case 'nutrition': return 'Nutrition';
    case 'hydration': case 'habit': case 'steps': return 'Lifestyle';
    default: return 'Fitness';
  }
};

export function CreateGoalModal({ open, onOpenChange, addGoal }: CreateGoalModalProps) {
  const { toast } = useToast();
  // --- CHANGE: The local useGoals() call is removed ---
  const [formData, setFormData] = useState(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setFormData(initialState);
    }
  }, [open]);

  const handleChange = (field: keyof typeof initialState, value: string | Date | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNativeDateChange = (field: 'startDate' | 'targetDate', value: string) => {
    if (value) {
      const date = new Date(`${value}T00:00:00`);
      setFormData(prev => ({ ...prev, [field]: date }));
    } else {
      setFormData(prev => ({ ...prev, [field]: undefined }));
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.startDate || !formData.targetDate) {
      toast({ title: "Missing Dates", description: "Please select both a start and target date.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    try {
      // --- CHANGE: This `addGoal` function now comes from props ---
      await addGoal({
        title: formData.title,
        description: formData.description,
        type: formData.type as any,
        category: getCategoryFromType(formData.type) as any,
        startDate: formData.startDate.toISOString(),
        targetDate: formData.targetDate.toISOString(),
        target: parseFloat(formData.targetValue) || 0,
        unit: formData.unit,
      });
      onOpenChange(false);
    } catch (error) {
      // Error is already handled by the useGoals hook
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create New Goal</DialogTitle>
          <DialogDescription>Set a new fitness goal to track your progress and stay motivated.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="goal-title">Goal Title</Label>
            <Input id="goal-title" placeholder="e.g., Lose 5kg, Run 5k" value={formData.title} onChange={(e) => handleChange('title', e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="goal-type">Goal Type</Label>
            <Select value={formData.type} onValueChange={(value) => handleChange('type', value)}>
              <SelectTrigger><SelectValue placeholder="Select goal type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="weight">Weight</SelectItem>
                <SelectItem value="strength">Strength</SelectItem>
                <SelectItem value="workout">Cardio/Workout</SelectItem>
                <SelectItem value="nutrition">Nutrition</SelectItem>
                <SelectItem value="habit">Habit</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="target-value">Target Value</Label>
              <Input id="target-value" type="number" placeholder="0" value={formData.targetValue} onChange={(e) => handleChange('targetValue', e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">Unit</Label>
              <Select value={formData.unit} onValueChange={(value) => handleChange('unit', value)}>
                <SelectTrigger><SelectValue placeholder="Unit" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="kg">kg</SelectItem><SelectItem value="lbs">lbs</SelectItem><SelectItem value="km">km</SelectItem><SelectItem value="miles">miles</SelectItem><SelectItem value="reps">reps</SelectItem><SelectItem value="minutes">minutes</SelectItem><SelectItem value="days">days</SelectItem><SelectItem value="calories">calories</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-date">Start Date</Label>
              <Input
                id="start-date"
                type="date"
                value={formData.startDate ? format(formData.startDate, 'yyyy-MM-dd') : ''}
                onChange={(e) => handleNativeDateChange('startDate', e.target.value)}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="target-date">Target Date</Label>
              <Input
                id="target-date"
                type="date"
                value={formData.targetDate ? format(formData.targetDate, 'yyyy-MM-dd') : ''}
                onChange={(e) => handleNativeDateChange('targetDate', e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" placeholder="Describe your goal..." value={formData.description} onChange={(e) => handleChange('description', e.target.value)} rows={3} />
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSubmitting ? "Creating..." : "Create Goal"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}