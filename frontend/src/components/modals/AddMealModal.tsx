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
import { useToast } from "@/components/ui/use-toast";

interface AddMealModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddMeal?: (mealData: any) => void;
  editingMeal?: any;
  isEditMode?: boolean;
}

export function AddMealModal({ open, onOpenChange, onAddMeal, editingMeal, isEditMode = false }: AddMealModalProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    mealType: '',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Call the onAddMeal function if provided
    if (onAddMeal) {
      onAddMeal(formData);
    } else {
      toast({
        title: "Meal Added Successfully!",
        description: `${formData.name} has been added to your daily log`,
        duration: 3000,
      });
    }
    
    // Reset form
    setFormData({
      name: '',
      calories: '',
      protein: '',
      carbs: '',
      fat: '',
      mealType: '',
      notes: ''
    });
    
    onOpenChange(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Populate form when editing
  useEffect(() => {
    if (isEditMode && editingMeal) {
      setFormData({
        name: editingMeal.name,
        calories: editingMeal.nutrition.calories.toString(),
        protein: editingMeal.nutrition.protein.toString(),
        carbs: editingMeal.nutrition.carbs.toString(),
        fat: editingMeal.nutrition.fat.toString(),
        mealType: '',
        notes: ''
      });
    } else {
      // Reset form for add mode
      setFormData({
        name: '',
        calories: '',
        protein: '',
        carbs: '',
        fat: '',
        mealType: '',
        notes: ''
      });
    }
  }, [isEditMode, editingMeal]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Meal' : 'Add New Meal'}</DialogTitle>
          <DialogDescription>
            {isEditMode ? 'Update your meal information.' : 'Log a new meal to track your daily nutrition intake.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="meal-name">Meal Name</Label>
              <Input
                id="meal-name"
                placeholder="e.g., Grilled Chicken Salad"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="meal-type">Meal Type</Label>
              <Select value={formData.mealType} onValueChange={(value) => handleInputChange('mealType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select meal type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="breakfast">Breakfast</SelectItem>
                  <SelectItem value="lunch">Lunch</SelectItem>
                  <SelectItem value="dinner">Dinner</SelectItem>
                  <SelectItem value="snack">Snack</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="calories">Calories</Label>
                <Input
                  id="calories"
                  type="number"
                  placeholder="0"
                  value={formData.calories}
                  onChange={(e) => handleInputChange('calories', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="protein">Protein (g)</Label>
                <Input
                  id="protein"
                  type="number"
                  placeholder="0"
                  value={formData.protein}
                  onChange={(e) => handleInputChange('protein', e.target.value)}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="carbs">Carbs (g)</Label>
                <Input
                  id="carbs"
                  type="number"
                  placeholder="0"
                  value={formData.carbs}
                  onChange={(e) => handleInputChange('carbs', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fat">Fat (g)</Label>
                <Input
                  id="fat"
                  type="number"
                  placeholder="0"
                  value={formData.fat}
                  onChange={(e) => handleInputChange('fat', e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea
                id="notes"
                placeholder="Any additional notes about this meal..."
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{isEditMode ? 'Update Meal' : 'Add Meal'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}