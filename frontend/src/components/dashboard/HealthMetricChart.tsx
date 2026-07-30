
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

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
  return (
    <Card className={cn("h-full", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="p-1 pt-4">
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
      </CardContent>
    </Card>
  );
}

export default HealthMetricChart;
