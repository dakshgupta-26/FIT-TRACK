import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Plus, Calendar, Activity, Heart, Weight, Clock } from 'lucide-react';
import apiClient from '@/lib/api-client';

interface AddMeasurementModalProps {
  onMeasurementAdded?: () => void;
}

const measurementTypes = [
  { value: 'weight', label: 'Weight', unit: 'kg', icon: Weight },
  { value: 'heart_rate_resting', label: 'Resting Heart Rate', unit: 'bpm', icon: Heart },
  { value: 'heart_rate_active', label: 'Active Heart Rate', unit: 'bpm', icon: Heart },
  { value: 'blood_pressure_systolic', label: 'Blood Pressure (Systolic)', unit: 'mmHg', icon: Activity },
  { value: 'blood_pressure_diastolic', label: 'Blood Pressure (Diastolic)', unit: 'mmHg', icon: Activity },
  { value: 'sleep_hours', label: 'Sleep Hours', unit: 'hours', icon: Clock },
  { value: 'sleep_deep', label: 'Deep Sleep', unit: 'hours', icon: Clock },
  { value: 'sleep_light', label: 'Light Sleep', unit: 'hours', icon: Clock },
  { value: 'sleep_rem', label: 'REM Sleep', unit: 'hours', icon: Clock },
  { value: 'bmi', label: 'BMI', unit: '', icon: Activity },
  { value: 'body_fat', label: 'Body Fat', unit: '%', icon: Weight },
];

const AddMeasurementModal: React.FC<AddMeasurementModalProps> = ({ onMeasurementAdded }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: '',
    value: '',
    unit: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });
  const { toast } = useToast();
  const { currentUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser?.uid) {
      toast({
        title: "Error",
        description: "You must be logged in to add measurements",
        variant: "destructive"
      });
      return;
    }

    if (!formData.type || !formData.value || !formData.date) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const { data: result } = await apiClient.post('/health-metrics', {
        uid: currentUser.uid,
        type: formData.type,
        value: parseFloat(formData.value),
        unit: formData.unit,
        date: formData.date,
        notes: formData.notes
      });

      if (result.success) {
        toast({
          title: "Success",
          description: "Health measurement added successfully!",
        });
        
        // Reset form
        setFormData({
          type: '',
          value: '',
          unit: '',
          date: new Date().toISOString().split('T')[0],
          notes: ''
        });
        
        setOpen(false);
        onMeasurementAdded?.();
      } else {
        throw new Error(result.error || 'Failed to add measurement');
      }
    } catch (error) {
      console.error('Error adding measurement:', error);
      toast({
        title: "Error",
        description: "Failed to add measurement. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTypeChange = (type: string) => {
    const selectedType = measurementTypes.find(t => t.value === type);
    setFormData(prev => ({
      ...prev,
      type,
      unit: selectedType?.unit || ''
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Measurement
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Health Measurement</DialogTitle>
          <DialogDescription>
            Record a new health metric to track your progress.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="type">Measurement Type</Label>
            <Select value={formData.type} onValueChange={handleTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select measurement type" />
              </SelectTrigger>
              <SelectContent>
                {measurementTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center gap-2">
                      <type.icon className="h-4 w-4" />
                      {type.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="value">Value</Label>
            <div className="flex gap-2">
              <Input
                id="value"
                type="number"
                step="0.1"
                value={formData.value}
                onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
                placeholder="Enter value"
                required
              />
              {formData.unit && (
                <div className="flex items-center px-3 py-2 bg-muted rounded-md text-sm">
                  {formData.unit}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Add any additional notes..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Measurement'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMeasurementModal;
