import React, { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import {
  SlidersHorizontal,
  Camera,
  Calendar,
  Scale,
  Sparkles,
  ArrowRight,
  Plus,
  Layers,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProgressComparison, ProgressCategory } from "@/types/progress";
import { resolveImageUrl } from "@/services/api";

interface TransformationHeroProps {
  comparison: ProgressComparison;
  onOpenAddModal: () => void;
  unitSystem?: "metric" | "imperial";
}

export const TransformationHero: React.FC<TransformationHeroProps> = ({
  comparison,
  onOpenAddModal,
  unitSystem = "metric",
}) => {
  const [selectedAngle, setSelectedAngle] = useState<ProgressCategory>("Front");
  const [sliderPosition, setSliderPosition] = useState(50); // percentage 0 - 100
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const weightUnit = unitSystem === "imperial" ? "lbs" : "kg";
  const lengthUnit = unitSystem === "imperial" ? "in" : "cm";

  // Get photo for the selected angle
  const getPhoto = (subject: typeof comparison.before, angle: ProgressCategory) => {
    if (!subject) return null;
    if (angle === "Front") return subject.frontPhoto || subject.sidePhoto || subject.backPhoto;
    if (angle === "Side") return subject.sidePhoto || subject.frontPhoto || subject.backPhoto;
    if (angle === "Back") return subject.backPhoto || subject.frontPhoto || subject.sidePhoto;
    return subject.frontPhoto;
  };

  const rawBefore = getPhoto(comparison.before, selectedAngle);
  const rawCurrent = getPhoto(comparison.current, selectedAngle);
  const beforePhoto = rawBefore ? resolveImageUrl(rawBefore) : null;
  const currentPhoto = rawCurrent ? resolveImageUrl(rawCurrent) : null;


  // Handle drag calculation
  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging) return;
      handleMove(e.touches[0].clientX);
    },
    [isDragging, handleMove]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      handleMove(e.clientX);
    },
    [isDragging, handleMove]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchmove", handleTouchMove, { passive: false });
      window.addEventListener("touchend", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove]);

  const hasTwoPhotos = Boolean(beforePhoto && currentPhoto && beforePhoto !== currentPhoto);

  return (
    <Card id="transformation-hero" className="border-border/60 bg-card/60 backdrop-blur-md overflow-hidden relative shadow-lg">
      <CardHeader className="p-5 sm:p-6 pb-3 sm:pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/40">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> See The Change
            </span>
          </div>
          <CardTitle className="text-xl sm:text-2xl font-extrabold text-foreground">
            Your Transformation
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Interactive side-by-side progression analysis across all angles.
          </CardDescription>
        </div>

        {/* Angle Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-muted/60 border border-border/50 self-start sm:self-auto">
          {(["Front", "Side", "Back"] as ProgressCategory[]).map((angle) => {
            const isSelected = selectedAngle === angle;
            return (
              <button
                key={angle}
                onClick={() => setSelectedAngle(angle)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isSelected
                    ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {angle}
              </button>
            );
          })}
        </div>
      </CardHeader>

      <CardContent className="p-5 sm:p-6 space-y-6">
        {hasTwoPhotos ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Draggable Comparison Slider Canvas */}
            <div className="lg:col-span-8 flex flex-col items-center">
              <div
                ref={containerRef}
                onMouseDown={() => setIsDragging(true)}
                onTouchStart={() => setIsDragging(true)}
                className="relative w-full max-w-2xl h-[360px] sm:h-[480px] md:h-[540px] rounded-2xl overflow-hidden cursor-ew-resize select-none border border-border/60 bg-muted/30 shadow-2xl"
              >
                {/* Background Image: CURRENT */}
                <img
                  src={currentPhoto!}
                  alt="Current progress"
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                />

                {/* Foreground Image: BEFORE (clipped by width percentage) */}
                <div
                  className="absolute inset-0 overflow-hidden pointer-events-none"
                  style={{ width: `${sliderPosition}%` }}
                >
                  <img
                    src={beforePhoto!}
                    alt="Starting progress"
                    className="absolute inset-0 w-full h-full object-cover max-w-none"
                    style={{
                      width: containerRef.current ? `${containerRef.current.clientWidth}px` : "100%",
                      height: "100%",
                    }}
                  />
                  {/* Subtle shadow at border */}
                  <div className="absolute inset-y-0 right-0 w-px bg-white/40 shadow-[0_0_10px_rgba(255,255,255,0.7)]" />
                </div>

                {/* Draggable Vertical Slider Handle */}
                <div
                  className="absolute inset-y-0 w-1 bg-cyan-400/90 shadow-[0_0_12px_rgba(34,211,238,0.8)] pointer-events-none"
                  style={{ left: `${sliderPosition}%` }}
                >
                  <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-cyan-500 text-white flex items-center justify-center shadow-lg shadow-cyan-500/50 border-2 border-white pointer-events-auto">
                    <SlidersHorizontal className="w-4 h-4 rotate-90" />
                  </div>
                </div>

                {/* Overlaid Badges */}
                <div className="absolute top-4 left-4 z-10 pointer-events-none">
                  <Badge className="bg-black/70 backdrop-blur-md text-white border border-white/20 text-xs font-semibold px-2.5 py-1">
                    START • {comparison.before?.date ? new Date(comparison.before.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Day 1"}
                  </Badge>
                </div>

                <div className="absolute top-4 right-4 z-10 pointer-events-none">
                  <Badge className="bg-cyan-500/80 backdrop-blur-md text-white border border-cyan-400/40 text-xs font-semibold px-2.5 py-1">
                    CURRENT • {comparison.current?.date ? new Date(comparison.current.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Today"}
                  </Badge>
                </div>

                {/* Bottom guidance hint */}
                <div className="absolute bottom-3 inset-x-0 flex justify-center pointer-events-none">
                  <span className="text-[11px] font-medium text-white/90 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                    ↔ Drag horizontally or swipe to compare
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Comparative Metrics Delta Box */}
            <div className="lg:col-span-4 flex flex-col justify-between space-y-5 p-5 rounded-2xl bg-muted/40 border border-border/50 backdrop-blur-sm">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                  Transformation Delta
                </span>
                <h4 className="text-lg font-bold text-foreground">
                  Baseline to Present Day
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Direct physical variance recorded between your first and most recent check-in.
                </p>
              </div>

              {/* Stat Comparison Rows */}
              <div className="space-y-3">
                {/* Weight Row */}
                <div className="p-3 rounded-xl bg-card border border-border/60 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                      <Scale className="w-3.5 h-3.5 text-cyan-400" /> Total Weight
                    </span>
                    <div className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <span>{comparison.before?.weight ? `${comparison.before.weight} ${weightUnit}` : "--"}</span>
                      <ArrowRight className="w-3 h-3 text-muted-foreground" />
                      <span>{comparison.current?.weight ? `${comparison.current.weight} ${weightUnit}` : "--"}</span>
                    </div>
                  </div>
                  {comparison.deltas.weight !== null && comparison.deltas.weight !== undefined && (
                    <span
                      className={`text-xs font-bold px-2 py-1 rounded-md ${
                        comparison.deltas.weight <= 0
                          ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20"
                          : "text-amber-400 bg-amber-500/10 border border-amber-500/20"
                      }`}
                    >
                      {comparison.deltas.weight > 0 ? "+" : ""}
                      {comparison.deltas.weight.toFixed(1)} {weightUnit}
                    </span>
                  )}
                </div>

                {/* Body Fat Row */}
                <div className="p-3 rounded-xl bg-card border border-border/60 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-blue-400" /> Body Fat %
                    </span>
                    <div className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <span>{comparison.before?.bodyFat ? `${comparison.before.bodyFat}%` : "--"}</span>
                      <ArrowRight className="w-3 h-3 text-muted-foreground" />
                      <span>{comparison.current?.bodyFat ? `${comparison.current.bodyFat}%` : "--"}</span>
                    </div>
                  </div>
                  {comparison.deltas.bodyFat !== null && comparison.deltas.bodyFat !== undefined && (
                    <span
                      className={`text-xs font-bold px-2 py-1 rounded-md ${
                        comparison.deltas.bodyFat <= 0
                          ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20"
                          : "text-amber-400 bg-amber-500/10 border border-amber-500/20"
                      }`}
                    >
                      {comparison.deltas.bodyFat > 0 ? "+" : ""}
                      {comparison.deltas.bodyFat.toFixed(1)}%
                    </span>
                  )}
                </div>

                {/* Waist Row */}
                <div className="p-3 rounded-xl bg-card border border-border/60 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-indigo-400" /> Waistline
                    </span>
                    <div className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <span>{comparison.before?.waist ? `${comparison.before.waist} ${lengthUnit}` : "--"}</span>
                      <ArrowRight className="w-3 h-3 text-muted-foreground" />
                      <span>{comparison.current?.waist ? `${comparison.current.waist} ${lengthUnit}` : "--"}</span>
                    </div>
                  </div>
                  {comparison.deltas.waist !== null && comparison.deltas.waist !== undefined && (
                    <span
                      className={`text-xs font-bold px-2 py-1 rounded-md ${
                        comparison.deltas.waist <= 0
                          ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20"
                          : "text-amber-400 bg-amber-500/10 border border-amber-500/20"
                      }`}
                    >
                      {comparison.deltas.waist > 0 ? "+" : ""}
                      {comparison.deltas.waist.toFixed(1)} {lengthUnit}
                    </span>
                  )}
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={onOpenAddModal}
                className="w-full gap-2 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
              >
                <Plus className="w-4 h-4" /> Log New Photo Check-In
              </Button>
            </div>
          </div>
        ) : (
          /* Empty State when fewer than 2 photos exist */
          <div className="p-8 sm:p-12 text-center rounded-2xl border border-dashed border-border/80 bg-muted/20 flex flex-col items-center justify-center max-w-2xl mx-auto space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shadow-lg shadow-cyan-500/10">
              <Camera className="w-8 h-8" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg font-bold text-foreground">
                Unlock Draggable Before & After Comparison
              </h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                {beforePhoto
                  ? "You have 1 photo logged. Add another progress photo to activate the interactive transformation slider."
                  : "Upload your baseline progress photos (Front, Side, or Back) to visualize your visual changes over time."}
              </p>
            </div>

            {beforePhoto && (
              <div className="w-36 h-48 rounded-xl overflow-hidden border border-border/80 shadow-md my-2">
                <img src={beforePhoto} alt="Baseline preview" className="w-full h-full object-cover" />
              </div>
            )}

            <Button
              onClick={onOpenAddModal}
              className="gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold shadow-lg shadow-cyan-500/25"
            >
              <Camera className="w-4 h-4" />
              {beforePhoto ? "Upload Next Progress Photo" : "Upload First Progress Photo"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
