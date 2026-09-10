import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Droplets, Plus, Minus, Clock, RotateCcw } from 'lucide-react';
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

interface EnhancedWaterTrackerProps {
  className?: string;
}

export function EnhancedWaterTracker({ className }: EnhancedWaterTrackerProps) {
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const userId = currentUser?._id || currentUser?.uid || 'guest';
  const todayKey = new Date().toISOString().split('T')[0];
  const storageKey = `waterIntake_${userId}_${todayKey}`;
  const remindersKey = `waterReminders_${userId}`;

  const [waterIntake, setWaterIntake] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  const [remindersEnabled, setRemindersEnabled] = useState(() => {
    try {
      const saved = localStorage.getItem(remindersKey);
      return saved === 'true';
    } catch {
      return false;
    }
  });

  const [customAmount, setCustomAmount] = useState('');
  const target = 2000; // 2L daily target

  // Re-sync if user changes
  useEffect(() => {
    try {
      const savedIntake = localStorage.getItem(storageKey);
      setWaterIntake(savedIntake ? parseInt(savedIntake, 10) : 0);
      const savedReminders = localStorage.getItem(remindersKey);
      setRemindersEnabled(savedReminders === 'true');
    } catch {
      setWaterIntake(0);
      setRemindersEnabled(false);
    }
  }, [storageKey, remindersKey]);

  // Save to localStorage whenever water intake changes
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, waterIntake.toString());
    } catch (e) {
      console.warn("Could not save water intake", e);
    }
  }, [waterIntake, storageKey]);

  // Save reminders setting
  useEffect(() => {
    try {
      localStorage.setItem(remindersKey, remindersEnabled.toString());
    } catch (e) {
      console.warn("Could not save reminders setting", e);
    }
  }, [remindersEnabled, remindersKey]);

  // Daily reset at midnight
  useEffect(() => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const timeUntilMidnight = tomorrow.getTime() - now.getTime();
    
    const timeout = setTimeout(() => {
      setWaterIntake(0);
      toast({
        title: "New Day! 🌅",
        description: "Your water intake has been reset for today",
        duration: 3000,
      });
    }, timeUntilMidnight);

    return () => clearTimeout(timeout);
  }, [toast]);

  const glasses = Math.floor(waterIntake / 250);
  const totalGlasses = Math.ceil(target / 250);
  const progress = (waterIntake / target) * 100;

  const addWater = (amount: number) => {
    const newIntake = Math.min(waterIntake + amount, target);
    setWaterIntake(newIntake);
    
    if (newIntake >= target && waterIntake < target) {
      toast({
        title: "🎉 Daily Goal Reached!",
        description: "Congratulations! You've reached your daily hydration goal.",
        duration: 4000,
      });
    }
  };

  const removeWater = (amount: number) => {
    setWaterIntake(Math.max(waterIntake - amount, 0));
  };

  const resetDaily = () => {
    setWaterIntake(0);
    toast({
      title: "Daily Reset",
      description: "Water intake has been reset for today",
      duration: 2000,
    });
  };

  const addCustomAmount = () => {
    const amount = parseInt(customAmount);
    if (amount && amount > 0) {
      addWater(amount);
      setCustomAmount('');
      toast({
        title: "Water Added",
        description: `${amount}ml added to your daily intake`,
        duration: 2000,
      });
    }
  };

  // Simple reminder system
  useEffect(() => {
    if (!remindersEnabled) return;

    const interval = setInterval(() => {
      if (waterIntake < target * 0.75) { // If less than 75% of daily goal
        toast({
          title: "💧 Hydration Reminder",
          description: "Time to drink some water! Stay hydrated.",
          duration: 3000,
        });
      }
    }, 60 * 60 * 1000); // Every hour

    return () => clearInterval(interval);
  }, [remindersEnabled, waterIntake, target, toast]);

  return (
    <Card className={cn("h-full", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Droplets className="h-5 w-5 text-blue-500" />
            <CardTitle className="text-xl">Water Intake</CardTitle>
          </div>
          <div className="flex gap-2">
            <Button
              variant={remindersEnabled ? "default" : "outline"}
              size="sm"
              onClick={() => setRemindersEnabled(!remindersEnabled)}
            >
              <Clock className="h-4 w-4 mr-1" />
              {remindersEnabled ? "On" : "Off"}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={resetDaily}
              title="Reset daily intake"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-32 h-32">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle
                className="text-muted stroke-2 fill-none"
                cx="50"
                cy="50"
                r="40"
              />
              <circle
                className="text-blue-500 stroke-2 fill-none progress-ring-circle"
                cx="50"
                cy="50"
                r="40"
                strokeDasharray={2 * Math.PI * 40}
                strokeDashoffset={2 * Math.PI * 40 * (1 - progress / 100)}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-2xl font-bold text-blue-500">
                {Math.round(progress)}%
              </div>
              <div className="text-xs text-muted-foreground">
                {waterIntake}ml
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">
              {glasses} of {totalGlasses} glasses
            </p>
            <div className="flex justify-center mb-4">
              <div className="flex gap-1">
                {Array.from({ length: totalGlasses }).map((_, i) => (
                  <div 
                    key={i}
                    className={cn(
                      "w-4 h-8 rounded-b-full border-2 transition-all duration-300 hover:scale-110",
                      i < glasses 
                        ? "bg-gradient-to-b from-blue-400 to-blue-600 border-blue-500 shadow-lg shadow-blue-500/30 animate-pulse" 
                        : "bg-muted border-muted-foreground/20 hover:bg-muted-foreground/10"
                    )}
                    style={{
                      animationDelay: `${i * 100}ms`
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-2 w-full">
            <div className="flex gap-2 justify-center">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => addWater(250)}
                className="flex-1"
              >
                <Plus className="h-4 w-4 mr-1" />
                +250ml
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => addWater(500)}
                className="flex-1"
              >
                <Plus className="h-4 w-4 mr-1" />
                +500ml
              </Button>
            </div>
            
            <div className="flex gap-2 justify-center">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => removeWater(250)}
                disabled={waterIntake <= 0}
                className="flex-1"
              >
                <Minus className="h-4 w-4 mr-1" />
                -250ml
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => removeWater(500)}
                disabled={waterIntake <= 0}
                className="flex-1"
              >
                <Minus className="h-4 w-4 mr-1" />
                -500ml
              </Button>
            </div>
            
            <div className="flex gap-2 w-full">
              <Input
                type="number"
                placeholder="Custom ml"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                className="flex-1"
                min="1"
                max="1000"
              />
              <Button 
                variant="outline" 
                size="sm"
                onClick={addCustomAmount}
                disabled={!customAmount || parseInt(customAmount) <= 0}
              >
                Add
              </Button>
            </div>
          </div>

          {progress >= 100 && (
            <Badge variant="default" className="bg-blue-500">
              🎉 Goal Complete!
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default EnhancedWaterTracker;