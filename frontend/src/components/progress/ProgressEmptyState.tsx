import React from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  Camera,
  TrendingUp,
  Ruler,
  Flame,
  Plus,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ProgressEmptyStateProps {
  onOpenAddModal: () => void;
}

export const ProgressEmptyState: React.FC<ProgressEmptyStateProps> = ({
  onOpenAddModal,
}) => {
  const benefits = [
    {
      title: "Interactive Before & After",
      description: "Compare body transformation with our high-precision draggable slider.",
      icon: Camera,
      color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
    },
    {
      title: "Clinical Body Metrics",
      description: "Track weight, body fat %, waist, and circumferences over time.",
      icon: Ruler,
      color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    },
    {
      title: "Predictive Analytics Curves",
      description: "Observe trajectory trends and evaluate metabolic progress curves.",
      icon: TrendingUp,
      color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
    },
    {
      title: "Habit Heatmap & Milestones",
      description: "Stay accountable with 90-day activity matrices and badge unlocks.",
      icon: Flame,
      color: "text-orange-400 bg-orange-500/10 border-orange-500/20",
    },
  ];

  return (
    <Card className="border-border/60 bg-gradient-to-b from-card/80 via-card/50 to-background/90 backdrop-blur-md overflow-hidden relative shadow-2xl my-4">
      {/* Background ambient radial gradients */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

      <CardContent className="p-8 sm:p-14 flex flex-col items-center justify-center text-center max-w-4xl mx-auto space-y-8 relative z-10">
        {/* Animated Badge & Hero Graphic */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-4 flex flex-col items-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            TRANSFORMATION OPERATING SYSTEM
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground max-w-2xl leading-tight">
            Your transformation starts here.
          </h2>

          <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
            FitTracker turns your weekly photos and circumference measurements into an intelligent, data-driven transformation command center.
          </p>

          <Button
            size="lg"
            onClick={onOpenAddModal}
            className="gap-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-base px-7 py-6 rounded-xl shadow-xl shadow-cyan-500/30 hover:shadow-cyan-500/45 transition-all mt-3"
          >
            <Plus className="w-5 h-5" /> Add Your First Progress Entry
          </Button>
        </motion.div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full text-left pt-6 border-t border-border/50">
          {benefits.map((b, idx) => {
            const Icon = b.icon;
            return (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * idx }}
                className="p-4 rounded-2xl bg-muted/30 border border-border/60 hover:border-cyan-500/30 transition-all flex flex-col gap-2.5"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${b.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-foreground">{b.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {b.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Privacy Assurance Footnote */}
        <div className="inline-flex items-center gap-2 text-xs text-muted-foreground/80 pt-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Photos are 100% private and protected by authenticated user encryption.</span>
        </div>
      </CardContent>
    </Card>
  );
};
