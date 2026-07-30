import React from 'react';
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface EnhancedProgressBarProps {
  value: number;
  label: string;
  className?: string;
  colorScheme?: 'success' | 'warning' | 'danger' | 'info' | 'default';
  showPercentage?: boolean;
  animated?: boolean;
}

export function EnhancedProgressBar({ 
  value, 
  label, 
  className,
  colorScheme = 'success',
  showPercentage = true,
  animated = true
}: EnhancedProgressBarProps) {
  const getColorClasses = () => {
    switch (colorScheme) {
      case 'success':
        return 'from-green-500 to-emerald-500';
      case 'warning':
        return 'from-yellow-500 to-orange-500';
      case 'danger':
        return 'from-red-500 to-rose-500';
      case 'info':
        return 'from-blue-500 to-cyan-500';
      default:
        return 'from-primary to-primary';
    }
  };

  const getGlowColor = () => {
    switch (colorScheme) {
      case 'success':
        return 'shadow-green-500/30';
      case 'warning':
        return 'shadow-orange-500/30';
      case 'danger':
        return 'shadow-red-500/30';
      case 'info':
        return 'shadow-blue-500/30';
      default:
        return 'shadow-primary/30';
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">{label}</span>
        {showPercentage && (
          <span className="text-sm text-muted-foreground">{Math.round(value)}%</span>
        )}
      </div>
      <div className="relative">
        <Progress 
          value={value} 
          className={cn(
            "h-3 bg-muted/50 overflow-hidden",
            animated && "transition-all duration-1000 ease-out"
          )}
          indicatorClassName={cn(
            `bg-gradient-to-r ${getColorClasses()} shadow-lg ${getGlowColor()}`,
            "transition-all duration-1000 ease-out relative",
            "before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/20 before:to-transparent",
            animated && "animate-pulse-gentle"
          )}
        />
      </div>
    </div>
  );
}