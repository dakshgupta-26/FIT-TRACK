
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { DashboardCard } from "./DashboardCard";
import { Plus, Minus } from 'lucide-react';
import { cn } from "@/lib/utils";

interface WaterIntakeTrackerProps {
  className?: string;
}

export function WaterIntakeTracker({ className }: WaterIntakeTrackerProps) {
  const [glasses, setGlasses] = useState(() => {
    // Load from localStorage or default to 0
    const saved = localStorage.getItem('waterGlasses');
    return saved ? parseInt(saved) : 0;
  });
  const target = 8;

  // Save to localStorage whenever glasses change
  useEffect(() => {
    localStorage.setItem('waterGlasses', glasses.toString());
  }, [glasses]);

  const addGlass = () => {
    if (glasses < target) {
      setGlasses(glasses + 1);
    }
  };

  const removeGlass = () => {
    if (glasses > 0) {
      setGlasses(glasses - 1);
    }
  };

  const progress = (glasses / target) * 100;

  return (
    <DashboardCard 
      title="Water Intake" 
      description={`${glasses} of ${target} glasses`}
      className={cn("animate-slide-up", className)}
    >
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-32 h-32 group">
          <svg className="w-full h-full transform group-hover:scale-105 transition-transform duration-300" viewBox="0 0 100 100">
            <circle
              className="text-muted/30 stroke-2 fill-none"
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
              style={{
                filter: 'drop-shadow(0 0 8px hsl(221, 83%, 53%))',
                transition: 'all 1s ease-out'
              }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-500 group-hover:animate-counter-up">
                {Math.round(progress)}%
              </div>
              <div className="text-xs text-muted-foreground">complete</div>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2 items-center">
          <Button 
            variant="outline" 
            size="icon"
            onClick={removeGlass}
            disabled={glasses <= 0}
          >
            <Minus className="h-4 w-4" />
          </Button>
          
          <div className="flex gap-1">
            {Array.from({ length: target }).map((_, i) => (
              <div 
                key={i}
                className={cn(
                  "w-4 h-8 rounded-b-full border transition-all duration-500 hover:scale-110",
                  i < glasses 
                    ? "bg-gradient-to-b from-blue-400 to-blue-600 border-blue-500 animate-glow shadow-lg shadow-blue-500/30" 
                    : "bg-muted/50 border-muted hover:bg-muted"
                )}
                style={{
                  animationDelay: `${i * 100}ms`
                }}
              />
            ))}
          </div>
          
          <Button 
            variant="outline" 
            size="icon"
            onClick={addGlass}
            disabled={glasses >= target}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </DashboardCard>
  );
}

export default WaterIntakeTracker;
