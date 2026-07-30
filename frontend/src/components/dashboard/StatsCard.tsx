
import React from 'react';
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function StatsCard({ title, value, icon, trend, className }: StatsCardProps) {
  return (
    <div className={cn("dashboard-stat gap-2 group animate-slide-up", className)}>
      <div className="flex justify-between items-start">
        <p className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
          {title}
        </p>
        <div className="p-2 rounded-full bg-gradient-to-br from-primary/10 to-primary/20 text-primary group-hover:scale-110 transition-transform duration-200">
          {icon}
        </div>
      </div>
      <div className="flex items-baseline justify-between">
        <h3 className="text-2xl font-bold group-hover:animate-counter-up">{value}</h3>
        {trend && (
          <div className={cn(
            "flex items-center text-xs font-medium px-2 py-1 rounded-full transition-all duration-200",
            trend.isPositive 
              ? "text-green-600 bg-green-500/10 group-hover:bg-green-500/20" 
              : "text-red-600 bg-red-500/10 group-hover:bg-red-500/20"
          )}>
            <span className="mr-1">{trend.isPositive ? '↗' : '↘'}</span>
            <span>{trend.value}%</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default StatsCard;
