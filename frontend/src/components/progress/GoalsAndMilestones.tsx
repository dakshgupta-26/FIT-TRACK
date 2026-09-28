import React from "react";
import { motion } from "framer-motion";
import {
  Target,
  Award,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowRight,
  Flame,
  Camera,
  Dumbbell,
  Zap,
  TrendingDown,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ProgressGoal, ProgressMilestone } from "@/types/progress";

interface GoalsAndMilestonesProps {
  goals: ProgressGoal[];
  milestones: ProgressMilestone[];
  onOpenAddModal: () => void;
  unitSystem?: "metric" | "imperial";
}

export const GoalsAndMilestones: React.FC<GoalsAndMilestonesProps> = ({
  goals,
  milestones,
  onOpenAddModal,
  unitSystem = "metric",
}) => {
  const getMilestoneIcon = (iconName: string) => {
    switch (iconName) {
      case "Flame":
        return Flame;
      case "Camera":
        return Camera;
      case "Calendar":
        return Calendar;
      case "Dumbbell":
        return Dumbbell;
      case "TrendingDown":
        return TrendingDown;
      case "Zap":
        return Zap;
      case "Award":
      default:
        return Award;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Active Goals Section */}
      <Card className="lg:col-span-6 border-border/60 bg-card/60 backdrop-blur-md overflow-hidden relative shadow-lg flex flex-col justify-between">
        <CardHeader className="p-5 sm:p-6 pb-3 border-b border-border/40">
          <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-400 uppercase tracking-wider mb-0.5">
            <Target className="w-3.5 h-3.5" /> Benchmarks
          </div>
          <CardTitle className="text-xl font-extrabold text-foreground">
            Target Goals
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Live progression calculated against your defined transformation goals.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-5 sm:p-6 space-y-4">
          {goals && goals.length > 0 ? (
            <div className="space-y-4">
              {goals.map((goal) => {
                const remaining = Math.max(0, Math.round(Math.abs(goal.target - goal.current) * 10) / 10);

                return (
                  <div
                    key={goal.id}
                    className="p-4 rounded-xl bg-muted/30 border border-border/50 hover:border-cyan-500/30 transition-all space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="text-sm font-bold text-foreground block">
                          {goal.title}
                        </span>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>Target: {goal.target} {goal.unit}</span>
                          <span>•</span>
                          <span>Current: {Math.round(goal.current * 10) / 10} {goal.unit}</span>
                        </div>
                      </div>

                      <Badge
                        className={`text-xs font-bold px-2 py-0.5 ${
                          goal.progress >= 100
                            ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                            : "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30"
                        }`}
                      >
                        {goal.progress}% Complete
                      </Badge>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <Progress
                        value={goal.progress}
                        className="h-2 bg-muted/80"
                      />
                      <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-0.5">
                        <span>
                          {remaining === 0 ? "Goal achieved!" : `${remaining} ${goal.unit} remaining`}
                        </span>
                        {goal.targetDate && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Target: {new Date(goal.targetDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center rounded-xl border border-dashed border-border/60 bg-muted/20 flex flex-col items-center justify-center space-y-2">
              <Target className="w-8 h-8 text-muted-foreground/50" />
              <p className="text-sm font-semibold text-foreground">No active goals linked</p>
              <p className="text-xs text-muted-foreground max-w-xs">
                Set a target weight, body fat %, or workout target in Fitness Goals to track live progress here.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transformation Milestones Section */}
      <Card className="lg:col-span-6 border-border/60 bg-card/60 backdrop-blur-md overflow-hidden relative shadow-lg flex flex-col justify-between">
        <CardHeader className="p-5 sm:p-6 pb-3 border-b border-border/40">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wider mb-0.5">
            <Award className="w-3.5 h-3.5" /> Achievements
          </div>
          <CardTitle className="text-xl font-extrabold text-foreground">
            Milestones & Badges
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Dynamically unlocked through real consistency, measurements, and workouts.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-5 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {milestones.map((m) => {
              const Icon = getMilestoneIcon(m.icon);
              const isAchieved = m.achieved;

              return (
                <div
                  key={m.id}
                  className={`p-3.5 rounded-xl border transition-all flex items-start gap-3 relative overflow-hidden ${
                    isAchieved
                      ? "bg-gradient-to-br from-amber-500/10 via-card to-card border-amber-500/30 shadow-md shadow-amber-500/5"
                      : "bg-muted/30 border-border/50 opacity-70"
                  }`}
                >
                  {/* Icon Avatar */}
                  <div
                    className={`p-2.5 rounded-xl flex items-center justify-center shrink-0 ${
                      isAchieved
                        ? "bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-inner"
                        : "bg-muted text-muted-foreground border border-border/40"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  {/* Details */}
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className={`text-xs font-bold truncate ${isAchieved ? "text-foreground" : "text-muted-foreground"}`}>
                        {m.title}
                      </span>
                      {isAchieved && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      )}
                    </div>

                    <p className="text-[11px] text-muted-foreground leading-snug line-clamp-2">
                      {m.description}
                    </p>

                    {/* Progress or Completion Date */}
                    <div className="pt-1">
                      {isAchieved ? (
                        <span className="text-[10px] text-amber-400/90 font-medium">
                          Unlocked {m.achievedAt ? new Date(m.achievedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "Recently"}
                        </span>
                      ) : (
                        <div className="space-y-0.5">
                          <div className="flex justify-between text-[10px] text-muted-foreground">
                            <span>Progress</span>
                            <span>{m.progress}%</span>
                          </div>
                          <Progress value={m.progress} className="h-1 bg-muted" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
