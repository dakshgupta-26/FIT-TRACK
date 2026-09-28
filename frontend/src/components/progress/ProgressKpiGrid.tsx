import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Scale,
  Percent,
  Ruler,
  Flame,
  Target,
  Dumbbell,
  ArrowDownRight,
  ArrowUpRight,
  Minus,
  Sparkles,
  Plus,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ProgressKPIs } from "@/types/progress";

interface ProgressKpiGridProps {
  kpis: ProgressKPIs;
  hasData: boolean;
  onOpenAddModal: () => void;
  unitSystem?: "metric" | "imperial";
}

/**
 * Animated counter that smoothly increments to the target number
 */
const AnimatedCounter: React.FC<{ value: number; decimals?: number; suffix?: string }> = ({
  value,
  decimals = 1,
  suffix = "",
}) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    // Respect prefers-reduced-motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplayValue(value);
      return;
    }

    const start = 0;
    const duration = 800; // ms
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutCubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = start + (value - start) * ease;

      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(value);
      }
    };

    requestAnimationFrame(animate);
  }, [value]);

  return (
    <span>
      {displayValue.toFixed(decimals)}
      {suffix}
    </span>
  );
};

export const ProgressKpiGrid: React.FC<ProgressKpiGridProps> = ({
  kpis,
  hasData,
  onOpenAddModal,
  unitSystem = "metric",
}) => {
  const weightUnit = unitSystem === "imperial" ? "lbs" : "kg";
  const lengthUnit = unitSystem === "imperial" ? "in" : "cm";

  // Helper for trend badge
  const renderTrendBadge = (delta: number | null | undefined, unit: string, isInverseGood: boolean = true) => {
    if (delta === null || delta === undefined || isNaN(delta)) {
      return (
        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
          <Minus className="w-3 h-3" /> Baseline
        </span>
      );
    }

    if (delta === 0) {
      return (
        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
          <Minus className="w-3 h-3" /> Steady
        </span>
      );
    }

    const isDecreased = delta < 0;
    // For weight/fat/waist, reduction is typically celebrated as positive progress (green/cyan)
    const isGood = isInverseGood ? isDecreased : !isDecreased;

    return (
      <span
        className={`inline-flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full ${
          isGood
            ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20"
            : "text-amber-400 bg-amber-500/10 border border-amber-500/20"
        }`}
      >
        {isDecreased ? (
          <ArrowDownRight className="w-3 h-3" />
        ) : (
          <ArrowUpRight className="w-3 h-3" />
        )}
        {Math.abs(delta).toFixed(1)} {unit}
        <span className="text-[10px] text-muted-foreground ml-1 font-normal">since start</span>
      </span>
    );
  };

  const cards = [
    {
      title: "Current Weight",
      icon: Scale,
      value: kpis.currentWeight,
      unit: weightUnit,
      decimals: 1,
      badge: renderTrendBadge(kpis.weightDelta, weightUnit, true),
      subtext: kpis.weightDeltaPrev !== null && kpis.weightDeltaPrev !== undefined && kpis.weightDeltaPrev !== 0
        ? `${kpis.weightDeltaPrev > 0 ? "+" : ""}${kpis.weightDeltaPrev.toFixed(1)} ${weightUnit} vs previous entry`
        : "Initial baseline active",
      glowColor: "from-cyan-500/15 to-transparent",
      iconColor: "text-cyan-400",
    },
    {
      title: "Body Fat",
      icon: Percent,
      value: kpis.currentBodyFat,
      unit: "%",
      decimals: 1,
      badge: renderTrendBadge(kpis.bodyFatDelta, "%", true),
      subtext: kpis.bodyFatDeltaPrev !== null && kpis.bodyFatDeltaPrev !== undefined && kpis.bodyFatDeltaPrev !== 0
        ? `${kpis.bodyFatDeltaPrev > 0 ? "+" : ""}${kpis.bodyFatDeltaPrev.toFixed(1)}% vs previous entry`
        : "Calculated body composition",
      glowColor: "from-blue-500/15 to-transparent",
      iconColor: "text-blue-400",
    },
    {
      title: "Waist Circumference",
      icon: Ruler,
      value: kpis.currentWaist,
      unit: lengthUnit,
      decimals: 1,
      badge: renderTrendBadge(kpis.waistDelta, lengthUnit, true),
      subtext: kpis.waistDeltaPrev !== null && kpis.waistDeltaPrev !== undefined && kpis.waistDeltaPrev !== 0
        ? `${kpis.waistDeltaPrev > 0 ? "+" : ""}${kpis.waistDeltaPrev.toFixed(1)} ${lengthUnit} vs previous entry`
        : "Abdominal visceral metric",
      glowColor: "from-indigo-500/15 to-transparent",
      iconColor: "text-indigo-400",
    },
    {
      title: "Progress Streak",
      icon: Flame,
      value: kpis.streak,
      unit: "days",
      decimals: 0,
      badge: (
        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full text-orange-400 bg-orange-500/10 border border-orange-500/20">
          🔥 {kpis.streak >= 7 ? "On Fire" : "Active"}
        </span>
      ),
      subtext: "Continuous logging & activity",
      glowColor: "from-orange-500/15 to-transparent",
      iconColor: "text-orange-400",
    },
    {
      title: "Goal Progress",
      icon: Target,
      value: kpis.goalProgress,
      unit: "%",
      decimals: 0,
      badge: (
        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
          {kpis.goalProgress}% toward target
        </span>
      ),
      subtext: (
        <div className="w-full mt-1.5">
          <Progress value={kpis.goalProgress} className="h-1.5 bg-muted" />
        </div>
      ),
      glowColor: "from-emerald-500/15 to-transparent",
      iconColor: "text-emerald-400",
    },
    {
      title: "Workouts Completed",
      icon: Dumbbell,
      value: kpis.workoutsCount,
      unit: "sessions",
      decimals: 0,
      badge: (
        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full text-purple-400 bg-purple-500/10 border border-purple-500/20">
          {kpis.totalWorkoutsAllTime} all-time
        </span>
      ),
      subtext: "Logged during this period",
      glowColor: "from-purple-500/15 to-transparent",
      iconColor: "text-purple-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5 sm:gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;

        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: idx * 0.05 }}
          >
            <Card className="relative overflow-hidden border-border/60 bg-card/60 backdrop-blur-md hover:border-cyan-500/40 hover:shadow-lg hover:shadow-cyan-500/5 transition-all duration-300 h-full flex flex-col justify-between group">
              {/* Subtle top edge glow on hover */}
              <div
                className={`absolute top-0 inset-x-0 h-1 bg-gradient-to-r ${card.glowColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              />

              <CardContent className="p-4 sm:p-5 flex flex-col justify-between h-full gap-3">
                {/* Header: Label + Icon */}
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/90">
                    {card.title}
                  </span>
                  <div className={`p-2 rounded-lg bg-muted/60 border border-border/40 ${card.iconColor}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                {/* Main Metric Value */}
                <div>
                  {hasData && card.value !== null && card.value !== undefined ? (
                    <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-baseline gap-1.5">
                      <AnimatedCounter value={card.value} decimals={card.decimals} />
                      <span className="text-xs font-semibold text-muted-foreground uppercase">
                        {card.unit}
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-1.5">
                      <span className="text-lg font-bold text-muted-foreground">No data yet</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={onOpenAddModal}
                        className="h-7 text-xs text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 p-0 justify-start"
                      >
                        <Plus className="w-3 h-3 mr-1" /> Log first entry
                      </Button>
                    </div>
                  )}
                </div>

                {/* Footer: Trend Badge & Subtext */}
                <div className="flex flex-col gap-1 pt-1 border-t border-border/40">
                  {hasData && card.value !== null && card.value !== undefined ? (
                    <>
                      <div className="flex items-center justify-between flex-wrap gap-1">
                        {card.badge}
                      </div>
                      <div className="text-[11px] text-muted-foreground leading-tight">
                        {card.subtext}
                      </div>
                    </>
                  ) : (
                    <span className="text-[11px] text-muted-foreground">
                      Awaiting entry to compute metrics
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};
