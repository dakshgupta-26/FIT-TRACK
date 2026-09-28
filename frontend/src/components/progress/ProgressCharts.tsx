import React, { useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Area,
  AreaChart,
} from "recharts";
import {
  TrendingUp,
  Dumbbell,
  Activity,
  Calendar,
  Layers,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendDataPoint, WorkoutFrequencyPoint } from "@/types/progress";

interface ProgressChartsProps {
  charts: {
    weightTrend: TrendDataPoint[];
    bodyFatTrend: TrendDataPoint[];
    waistTrend: TrendDataPoint[];
    chestTrend: TrendDataPoint[];
    armsTrend: TrendDataPoint[];
    thighsTrend: TrendDataPoint[];
    workoutFrequency: WorkoutFrequencyPoint[];
  };
  unitSystem?: "metric" | "imperial";
}

type MetricType = "weight" | "bodyFat" | "waist" | "chest" | "arms" | "thighs";

export const ProgressCharts: React.FC<ProgressChartsProps> = ({
  charts,
  unitSystem = "metric",
}) => {
  const [activeMetric, setActiveMetric] = useState<MetricType>("weight");

  const weightUnit = unitSystem === "imperial" ? "lbs" : "kg";
  const lengthUnit = unitSystem === "imperial" ? "in" : "cm";

  // Map metric to corresponding data and config
  const getMetricConfig = () => {
    switch (activeMetric) {
      case "weight":
        return {
          title: "Body Weight Trend",
          data: charts.weightTrend,
          unit: weightUnit,
          strokeColor: "#06b6d4", // cyan-500
          fillGradient: "cyanGrad",
          gradientStop: "rgba(6, 182, 212, 0.35)",
        };
      case "bodyFat":
        return {
          title: "Body Fat Percentage",
          data: charts.bodyFatTrend,
          unit: "%",
          strokeColor: "#3b82f6", // blue-500
          fillGradient: "blueGrad",
          gradientStop: "rgba(59, 130, 246, 0.35)",
        };
      case "waist":
        return {
          title: "Waistline Progression",
          data: charts.waistTrend,
          unit: lengthUnit,
          strokeColor: "#6366f1", // indigo-500
          fillGradient: "indigoGrad",
          gradientStop: "rgba(99, 102, 241, 0.35)",
        };
      case "chest":
        return {
          title: "Chest Circumference",
          data: charts.chestTrend,
          unit: lengthUnit,
          strokeColor: "#10b981", // emerald-500
          fillGradient: "emeraldGrad",
          gradientStop: "rgba(16, 185, 129, 0.35)",
        };
      case "arms":
        return {
          title: "Bicep / Arm Size",
          data: charts.armsTrend,
          unit: lengthUnit,
          strokeColor: "#f59e0b", // amber-500
          fillGradient: "amberGrad",
          gradientStop: "rgba(245, 158, 11, 0.35)",
        };
      case "thighs":
        return {
          title: "Thigh Circumference",
          data: charts.thighsTrend,
          unit: lengthUnit,
          strokeColor: "#ec4899", // pink-500
          fillGradient: "pinkGrad",
          gradientStop: "rgba(236, 72, 153, 0.35)",
        };
    }
  };

  const metricConfig = getMetricConfig();
  const currentData = metricConfig.data;

  // Custom Glassmorphism Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload as TrendDataPoint;
      const value = item.value;
      const change = item.change;

      return (
        <div className="rounded-xl border border-border/80 bg-popover/95 p-3.5 shadow-2xl backdrop-blur-md text-xs space-y-1.5 min-w-[160px]">
          <div className="flex items-center justify-between text-muted-foreground font-semibold border-b border-border/40 pb-1">
            <span>{item.date}</span>
            <span className="text-[10px] text-muted-foreground/80">{item.fullDate}</span>
          </div>

          <div className="flex items-baseline justify-between pt-0.5">
            <span className="font-medium text-foreground">{metricConfig.title.split(" ")[0]}:</span>
            <span className="text-base font-extrabold text-cyan-400">
              {value} {metricConfig.unit}
            </span>
          </div>

          {change !== undefined && change !== 0 && (
            <div className="text-[11px] font-semibold flex items-center justify-between text-muted-foreground pt-0.5">
              <span>Vs previous:</span>
              <span className={change < 0 ? "text-emerald-400" : "text-amber-400"}>
                {change > 0 ? "+" : ""}
                {change.toFixed(1)} {metricConfig.unit}
              </span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  const METRICS: { label: string; key: MetricType }[] = [
    { label: "Weight", key: "weight" },
    { label: "Body Fat %", key: "bodyFat" },
    { label: "Waist", key: "waist" },
    { label: "Chest", key: "chest" },
    { label: "Arms", key: "arms" },
    { label: "Thighs", key: "thighs" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Main Metric Trend Chart */}
      <Card className="lg:col-span-8 border-border/60 bg-card/60 backdrop-blur-md overflow-hidden relative shadow-lg flex flex-col justify-between">
        <CardHeader className="p-5 sm:p-6 pb-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/40">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-400 uppercase tracking-wider mb-0.5">
              <TrendingUp className="w-3.5 h-3.5" /> Body Analytics
            </div>
            <CardTitle className="text-xl font-extrabold text-foreground">
              {metricConfig.title}
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Chronological progress tracking curve with historical deltas.
            </CardDescription>
          </div>

          {/* Metric Selector Buttons */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-muted/60 border border-border/50 flex-wrap">
            {METRICS.map((m) => {
              const isActive = activeMetric === m.key;
              return (
                <button
                  key={m.key}
                  onClick={() => setActiveMetric(m.key)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {m.label}
                </button>
              );
            })}
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-6 pt-6">
          {currentData && currentData.length > 0 ? (
            <div className="h-[280px] sm:h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={currentData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id={metricConfig.fillGradient} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={metricConfig.strokeColor} stopOpacity={0.4} />
                      <stop offset="95%" stopColor={metricConfig.strokeColor} stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis
                    dataKey="date"
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    domain={["auto", "auto"]}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke={metricConfig.strokeColor}
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill={`url(#${metricConfig.fillGradient})`}
                    activeDot={{ r: 6, stroke: "#fff", strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[280px] sm:h-[320px] flex flex-col items-center justify-center text-center p-6 border border-dashed border-border/60 rounded-xl bg-muted/20">
              <Activity className="w-10 h-10 text-muted-foreground/60 mb-2" />
              <h4 className="text-sm font-semibold text-foreground">
                No {activeMetric} records logged yet
              </h4>
              <p className="text-xs text-muted-foreground max-w-xs mt-1">
                Enter your {activeMetric} in your next progress entry to visualize your trajectory curve.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Workout Frequency Bar Chart */}
      <Card className="lg:col-span-4 border-border/60 bg-card/60 backdrop-blur-md overflow-hidden relative shadow-lg flex flex-col justify-between">
        <CardHeader className="p-5 sm:p-6 pb-2 border-b border-border/40">
          <div className="flex items-center gap-1.5 text-xs font-bold text-purple-400 uppercase tracking-wider mb-0.5">
            <Dumbbell className="w-3.5 h-3.5" /> Training Cadence
          </div>
          <CardTitle className="text-xl font-extrabold text-foreground">
            Workout Frequency
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Completed training sessions grouped by week.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-4 sm:p-6 pt-6">
          {charts.workoutFrequency && charts.workoutFrequency.length > 0 ? (
            <div className="h-[280px] sm:h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={charts.workoutFrequency}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="workoutGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#a855f7" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity={0.6} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis
                    dataKey="week"
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload as WorkoutFrequencyPoint;
                        return (
                          <div className="rounded-xl border border-border/80 bg-popover/95 p-3 shadow-xl backdrop-blur-md text-xs space-y-1">
                            <span className="text-muted-foreground font-semibold block">{d.week}</span>
                            <span className="text-sm font-extrabold text-purple-400">
                              {d.workouts} workout{d.workouts !== 1 ? "s" : ""} completed
                            </span>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar
                    dataKey="workouts"
                    fill="url(#workoutGrad)"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[280px] sm:h-[320px] flex flex-col items-center justify-center text-center p-6 border border-dashed border-border/60 rounded-xl bg-muted/20">
              <Dumbbell className="w-10 h-10 text-muted-foreground/60 mb-2" />
              <h4 className="text-sm font-semibold text-foreground">
                No workouts recorded in period
              </h4>
              <p className="text-xs text-muted-foreground max-w-xs mt-1">
                Complete workout sessions to track weekly training frequency and volume.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
