import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Info, ShieldCheck, Flame, Dumbbell, Target } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ProgressKPIs, AiProgressInsights } from "@/types/progress";

interface ProgressScoreCardProps {
  kpis: ProgressKPIs;
  aiInsights: AiProgressInsights;
  hasData: boolean;
}

export const ProgressScoreCard: React.FC<ProgressScoreCardProps> = ({
  kpis,
  aiInsights,
  hasData,
}) => {
  const score = hasData ? Math.round(kpis.progressScore || 0) : 0;

  // SVG Circular Gauge calculations
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  // Dynamic glow & color based on score
  const getScoreColor = (val: number) => {
    if (val >= 80) return "text-cyan-400 stroke-cyan-400";
    if (val >= 60) return "text-emerald-400 stroke-emerald-400";
    if (val >= 40) return "text-blue-400 stroke-blue-400";
    return "text-indigo-400 stroke-indigo-400";
  };

  const getScoreGlow = (val: number) => {
    if (val >= 80) return "drop-shadow-[0_0_12px_rgba(34,211,238,0.4)]";
    if (val >= 60) return "drop-shadow-[0_0_12px_rgba(52,211,153,0.4)]";
    if (val >= 40) return "drop-shadow-[0_0_12px_rgba(96,165,250,0.4)]";
    return "drop-shadow-[0_0_12px_rgba(129,140,248,0.3)]";
  };

  return (
    <Card className="border-border/60 bg-gradient-to-br from-card/80 via-card/50 to-background/80 backdrop-blur-md overflow-hidden relative shadow-xl">
      {/* Ambient background light pattern */}
      <div className="absolute top-0 right-1/4 w-96 h-36 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-72 h-28 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <CardContent className="p-5 sm:p-7 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left: Circular Progress Score Gauge */}
        <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col items-center justify-center gap-5 border-b lg:border-b-0 lg:border-r border-border/50 pb-5 lg:pb-0 lg:pr-6">
          <div className="relative flex items-center justify-center">
            {/* SVG Circle */}
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
              {/* Background Track */}
              <circle
                cx="60"
                cy="60"
                r={radius}
                className="stroke-muted/40"
                strokeWidth="8"
                fill="transparent"
              />
              {/* Animated Progress Arc */}
              <motion.circle
                cx="60"
                cy="60"
                r={radius}
                className={`${getScoreColor(score)} ${getScoreGlow(score)}`}
                strokeWidth="8"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>

            {/* Inner Score Number */}
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-black tracking-tight text-foreground">
                {score}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                / 100
              </span>
            </div>
          </div>

          <div className="text-center sm:text-left lg:text-center space-y-1">
            <div className="flex items-center justify-center gap-1.5">
              <h3 className="font-bold text-sm tracking-wide text-foreground uppercase">
                FitTracker Progress Score
              </h3>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="text-muted-foreground hover:text-foreground transition-colors p-0.5">
                      <Info className="w-3.5 h-3.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs text-xs space-y-1 p-3 bg-popover/95 border-border backdrop-blur-md">
                    <p className="font-semibold text-foreground">Transparent Score Breakdown:</p>
                    <ul className="text-muted-foreground list-disc pl-4 space-y-0.5">
                      <li><strong>Goal Completion (35 pts):</strong> Progress toward your active targets.</li>
                      <li><strong>Consistency & Streak (25 pts):</strong> Consecutive days logging workouts & photos.</li>
                      <li><strong>Workout Volume (20 pts):</strong> Frequency & intensity of completed training sessions.</li>
                      <li><strong>Tracking Cadence (20 pts):</strong> Regular measurement tracking over time.</li>
                    </ul>
                    <p className="text-[10px] text-muted-foreground/80 pt-1 border-t border-border/50">
                      * Algorithmic fitness metric, not a clinical diagnosis.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <p className="text-xs text-muted-foreground max-w-[220px]">
              Composite index calculated from real goals, habits, and body metric consistency.
            </p>

            {/* Mini breakdown chips */}
            {hasData && kpis.scoreBreakdown && (
              <div className="flex items-center justify-center gap-2 pt-2 flex-wrap text-[10px] font-medium text-muted-foreground">
                <span className="flex items-center gap-0.5">
                  <Target className="w-3 h-3 text-cyan-400" /> {kpis.scoreBreakdown.goalPts}/35
                </span>
                <span>•</span>
                <span className="flex items-center gap-0.5">
                  <Flame className="w-3 h-3 text-orange-400" /> {kpis.scoreBreakdown.streakPts}/25
                </span>
                <span>•</span>
                <span className="flex items-center gap-0.5">
                  <Dumbbell className="w-3 h-3 text-purple-400" /> {kpis.scoreBreakdown.workoutPts}/20
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right: AI Transformation Intelligence Card */}
        <div className="lg:col-span-8 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: "6s" }} />
              FITTRACKER AI INSIGHT
            </div>

            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-muted/80 text-foreground border border-border/60">
              {aiInsights.statusBadge || "Active Analysis"}
            </span>
          </div>

          {/* Primary AI Narrative */}
          <div className="space-y-2">
            <p className="text-base sm:text-lg font-medium text-foreground leading-relaxed">
              "{aiInsights.primaryInsight}"
            </p>
          </div>

          {/* Actionable Focus Box */}
          <div className="p-3.5 rounded-xl bg-cyan-500/5 border border-cyan-500/20 backdrop-blur-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 block">
                Targeted Focus For Next Week
              </span>
              <p className="text-xs sm:text-sm text-foreground/90 font-medium">
                {aiInsights.focusForNextWeek}
              </p>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-muted-foreground whitespace-nowrap self-start sm:self-center">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Evidence-based</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
