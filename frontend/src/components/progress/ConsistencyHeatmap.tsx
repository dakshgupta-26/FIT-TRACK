import React from "react";
import { Flame, Calendar, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HeatmapDay } from "@/types/progress";

interface ConsistencyHeatmapProps {
  heatmap: HeatmapDay[];
  streak: number;
}

export const ConsistencyHeatmap: React.FC<ConsistencyHeatmapProps> = ({
  heatmap,
  streak,
}) => {
  const getCellColor = (level: number) => {
    switch (level) {
      case 3:
        return "bg-cyan-400 border-cyan-300 shadow-[0_0_8px_rgba(34,211,238,0.5)]";
      case 2:
        return "bg-cyan-500/80 border-cyan-400/50";
      case 1:
        return "bg-cyan-500/40 border-cyan-500/30";
      case 0:
      default:
        return "bg-muted/40 border-border/40 hover:bg-muted/70";
    }
  };

  const totalActiveDays = heatmap.filter((d) => d.count > 0).length;

  return (
    <Card className="border-border/60 bg-card/60 backdrop-blur-md overflow-hidden relative shadow-lg">
      <CardHeader className="p-5 sm:p-6 pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/40">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-orange-400 uppercase tracking-wider mb-0.5">
            <Flame className="w-3.5 h-3.5" /> Habit Matrix
          </div>
          <CardTitle className="text-xl font-extrabold text-foreground">
            Activity & Progress Heatmap
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            90-day consistency record combining progress logs and completed training workouts.
          </CardDescription>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-muted-foreground">Active Days:</span>
            <span className="font-bold text-foreground">{totalActiveDays} / 90</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-muted-foreground">Current Streak:</span>
            <span className="font-bold text-orange-400 flex items-center gap-0.5">
              🔥 {streak} days
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5 sm:p-6">
        <TooltipProvider delayDuration={100}>
          <div className="flex flex-col gap-3">
            {/* Heatmap Grid */}
            <div className="overflow-x-auto pb-2">
              <div className="grid grid-flow-col grid-rows-7 gap-1.5 min-w-[620px] max-w-full">
                {heatmap.map((day) => {
                  const dateObj = new Date(day.date);
                  const formattedDate = dateObj.toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  });

                  return (
                    <Tooltip key={day.date}>
                      <TooltipTrigger asChild>
                        <div
                          className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-sm border transition-all cursor-pointer ${getCellColor(
                            day.level
                          )}`}
                        />
                      </TooltipTrigger>
                      <TooltipContent side="top" className="text-xs p-2.5 bg-popover/95 border-border shadow-xl backdrop-blur-md">
                        <p className="font-bold text-foreground">{formattedDate}</p>
                        {day.count > 0 ? (
                          <div className="space-y-0.5 mt-1 text-muted-foreground">
                            {day.details.map((detail, idx) => (
                              <p key={idx} className="flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 inline-block" />
                                {detail}
                              </p>
                            ))}
                            <p className="text-[10px] text-cyan-400 font-semibold pt-0.5">
                              {day.count} {day.count === 1 ? "activity" : "activities"} logged
                            </p>
                          </div>
                        ) : (
                          <p className="text-muted-foreground text-[11px] mt-0.5">
                            No activities logged
                          </p>
                        )}
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-end gap-2 text-xs text-muted-foreground pt-1">
              <span>Less</span>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-sm bg-muted/40 border border-border/40" />
                <div className="w-3 h-3 rounded-sm bg-cyan-500/40 border border-cyan-500/30" />
                <div className="w-3 h-3 rounded-sm bg-cyan-500/80 border border-cyan-400/50" />
                <div className="w-3 h-3 rounded-sm bg-cyan-400 border-cyan-300" />
              </div>
              <span>More activity</span>
            </div>
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
};
