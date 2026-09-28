import React from "react";
import { motion } from "framer-motion";
import { Plus, SlidersHorizontal, Download, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProgressHeaderProps {
  selectedRange: "7d" | "30d" | "90d" | "6m" | "1y" | "all";
  onRangeChange: (range: "7d" | "30d" | "90d" | "6m" | "1y" | "all") => void;
  onOpenAddModal: () => void;
  onScrollToComparison: () => void;
  onExportData: () => void;
  hasEntries: boolean;
}

const RANGES: { label: string; value: "7d" | "30d" | "90d" | "6m" | "1y" | "all" }[] = [
  { label: "7D", value: "7d" },
  { label: "30D", value: "30d" },
  { label: "90D", value: "90d" },
  { label: "6M", value: "6m" },
  { label: "1Y", value: "1y" },
  { label: "ALL", value: "all" },
];

export const ProgressHeader: React.FC<ProgressHeaderProps> = ({
  selectedRange,
  onRangeChange,
  onOpenAddModal,
  onScrollToComparison,
  onExportData,
  hasEntries,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex flex-col gap-5 pb-6 border-b border-border/50"
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Title & Eyebrow */}
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold tracking-wider uppercase mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            FITTRACKER AI • TRANSFORMATION ENGINE
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
            Your Progress
            <Sparkles className="w-6 h-6 text-cyan-400 hidden sm:inline-block" />
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base mt-1 max-w-2xl">
            Track your transformation, understand your trends, and stay ahead of your goals with clinical-grade body analytics.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {hasEntries && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={onScrollToComparison}
                className="gap-2 border-border/70 hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-all text-xs sm:text-sm font-medium"
              >
                <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
                Compare
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={onExportData}
                className="gap-2 border-border/70 hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-all text-xs sm:text-sm font-medium"
              >
                <Download className="w-4 h-4 text-muted-foreground" />
                Export CSV
              </Button>
            </>
          )}

          <Button
            onClick={onOpenAddModal}
            className="gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/35 transition-all text-xs sm:text-sm px-4"
          >
            <Plus className="w-4 h-4" />
            Add Progress
          </Button>
        </div>
      </div>

      {/* Date Range Selector Pill Bar */}
      <div className="flex items-center justify-between flex-wrap gap-3 pt-1">
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-muted/60 border border-border/50 backdrop-blur-sm">
          {RANGES.map((range) => {
            const isSelected = selectedRange === range.value;
            return (
              <button
                key={range.value}
                onClick={() => onRangeChange(range.value)}
                className={`relative px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  isSelected
                    ? "text-white bg-gradient-to-r from-cyan-500 to-blue-600 shadow-md shadow-cyan-500/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/80"
                }`}
              >
                {range.label}
              </button>
            );
          })}
        </div>

        <div className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500/80 inline-block animate-pulse" />
          Real-time metrics synchronized
        </div>
      </div>
    </motion.div>
  );
};
