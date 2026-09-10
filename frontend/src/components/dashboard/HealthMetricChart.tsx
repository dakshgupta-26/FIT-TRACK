
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Activity } from 'lucide-react';

interface DataPoint {
  date: string;
  value: number;
}

interface HealthMetricChartProps {
  title: string;
  description?: string;
  data: DataPoint[];
  dataKey?: string;
  strokeColor?: string;
  className?: string;
  yAxisLabel?: string;
}

export function HealthMetricChart({ 
  title, 
  description, 
  data, 
  dataKey = "value", 
  strokeColor = "hsl(var(--primary))",
  className,
  yAxisLabel
}: HealthMetricChartProps) {
  const hasData = data && data.length > 0 && data.some(d => d.value > 0);

  return (
    <Card className={cn("h-full", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="p-1 pt-4">
        {!hasData ? (
          <div className="h-[250px] flex flex-col items-center justify-center text-center p-6 space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <Activity className="w-6 h-6 opacity-60" />
            </div>
            <p className="text-sm font-medium text-foreground">No {title.toLowerCase()} recorded yet</p>
            <p className="text-xs text-muted-foreground max-w-xs">
              Log your health metrics to view your progress trends over time.
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" opacity={0.3} />
            <XAxis 
              dataKey="date" 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
              label={{ 
                value: yAxisLabel, 
                angle: -90, 
                position: 'insideLeft', 
                style: { textAnchor: 'middle', fill: 'hsl(var(--muted-foreground))' } 
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                borderColor: 'hsl(var(--border))',
                borderRadius: 'var(--radius)',
                color: 'hsl(var(--card-foreground))'
              }}
            />
            <defs>
              <linearGradient id={`gradient-${title.replace(/\s+/g, '-')}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={strokeColor} stopOpacity={0.3} />
                <stop offset="100%" stopColor={strokeColor} stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <Line 
              type="monotone" 
              dataKey={dataKey} 
              stroke={strokeColor} 
              strokeWidth={3}
              activeDot={{ 
                r: 8, 
                fill: strokeColor,
                stroke: 'hsl(var(--background))',
                strokeWidth: 3,
                className: "animate-glow"
              }}
              dot={{ 
                r: 4, 
                fill: strokeColor, 
                stroke: 'hsl(var(--background))', 
                strokeWidth: 2,
                className: "hover:animate-pulse"
              }}
              fill={`url(#gradient-${title.replace(/\s+/g, '-')})`}
            />
          </LineChart>
        </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}

export default HealthMetricChart;
