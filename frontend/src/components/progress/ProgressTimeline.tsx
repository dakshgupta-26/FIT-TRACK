import React from "react";
import {
  Calendar,
  Eye,
  Edit2,
  Trash2,
  Scale,
  Percent,
  Ruler,
  MessageSquare,
  Dumbbell,
  Tag,
  Camera,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProgressEntry } from "@/types/progress";
import { resolveImageUrl } from "@/services/api";

interface ProgressTimelineProps {
  entries: ProgressEntry[];
  onViewEntry: (entry: ProgressEntry) => void;
  onEditEntry: (entry: ProgressEntry) => void;
  onDeleteEntry: (entryId: string) => void;
  unitSystem?: "metric" | "imperial";
}

export const ProgressTimeline: React.FC<ProgressTimelineProps> = ({
  entries,
  onViewEntry,
  onEditEntry,
  onDeleteEntry,
  unitSystem = "metric",
}) => {
  const weightUnit = unitSystem === "imperial" ? "lbs" : "kg";
  const lengthUnit = unitSystem === "imperial" ? "in" : "cm";

  if (!entries || entries.length === 0) {
    return null;
  }

  return (
    <Card className="border-border/60 bg-card/60 backdrop-blur-md overflow-hidden relative shadow-lg">
      <CardHeader className="p-5 sm:p-6 pb-3 border-b border-border/40 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-400 uppercase tracking-wider mb-0.5">
            <Calendar className="w-3.5 h-3.5" /> History Log
          </div>
          <CardTitle className="text-xl font-extrabold text-foreground">
            Transformation Timeline
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Chronological log of verified measurements, reflection notes, and check-in photos.
          </CardDescription>
        </div>

        <Badge variant="outline" className="text-xs font-medium self-start sm:self-auto border-border/80">
          {entries.length} {entries.length === 1 ? "entry" : "entries"} recorded
        </Badge>
      </CardHeader>

      <CardContent className="p-4 sm:p-6">
        <div className="relative border-l border-border/80 ml-3 sm:ml-4 space-y-6">
          {entries.map((entry, index) => {
            const entryId = entry.id || entry._id || String(index);
            const dateStr = new Date(entry.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            });

            const hasPhoto = Boolean(entry.imageUrl || (entry.photos && entry.photos.length > 0));
            const rawPhoto = entry.imageUrl || entry.photos?.[0]?.url;
            const primaryPhoto = rawPhoto ? resolveImageUrl(rawPhoto) : null;


            return (
              <div key={entryId} className="relative pl-6 sm:pl-8 group">
                {/* Timeline dot */}
                <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-cyan-400 border-2 border-background shadow-[0_0_8px_rgba(34,211,238,0.6)] group-hover:scale-125 transition-transform" />

                <div className="p-4 sm:p-5 rounded-2xl bg-muted/30 border border-border/60 hover:border-cyan-500/40 hover:bg-muted/50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Left: Thumbnail & Core Stats */}
                  <div className="flex items-start sm:items-center gap-4">
                    {/* Thumbnail */}
                    {hasPhoto && primaryPhoto ? (
                      <div
                        onClick={() => onViewEntry(entry)}
                        className="w-16 h-20 sm:w-20 sm:h-24 rounded-xl overflow-hidden border border-border/80 shrink-0 cursor-pointer bg-muted shadow-md hover:opacity-90 transition-opacity relative group/thumb"
                      >
                        <img
                          src={primaryPhoto}
                          alt={`Progress on ${dateStr}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center">
                          <Eye className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    ) : (
                      <div className="w-16 h-20 sm:w-20 sm:h-24 rounded-xl border border-dashed border-border/80 bg-muted/40 shrink-0 flex flex-col items-center justify-center text-muted-foreground/60">
                        <Camera className="w-6 h-6" />
                        <span className="text-[10px] mt-1">No photo</span>
                      </div>
                    )}

                    {/* Information */}
                    <div className="space-y-1.5 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm sm:text-base text-foreground">
                          {dateStr}
                        </span>
                        <Badge
                          variant="secondary"
                          className="text-[11px] font-semibold px-2 py-0.5 bg-muted border border-border/60"
                        >
                          {entry.category || "Front"}
                        </Badge>
                      </div>

                      {/* Key Measurement Chips */}
                      <div className="flex items-center gap-3 flex-wrap text-xs text-muted-foreground font-medium">
                        {entry.weight !== undefined && entry.weight !== null && (
                          <span className="flex items-center gap-1 text-foreground font-semibold">
                            <Scale className="w-3.5 h-3.5 text-cyan-400" />
                            {entry.weight} {weightUnit}
                          </span>
                        )}

                        {entry.bodyFat !== undefined && entry.bodyFat !== null && (
                          <span className="flex items-center gap-1 text-foreground font-semibold">
                            <Percent className="w-3.5 h-3.5 text-blue-400" />
                            {entry.bodyFat}%
                          </span>
                        )}

                        {entry.waist !== undefined && entry.waist !== null && (
                          <span className="flex items-center gap-1 text-foreground font-semibold">
                            <Ruler className="w-3.5 h-3.5 text-indigo-400" />
                            {entry.waist} {lengthUnit}
                          </span>
                        )}
                      </div>

                      {/* Progress reflection note */}
                      {entry.notes && (
                        <p className="text-xs text-muted-foreground/90 italic flex items-start gap-1.5 pt-0.5 line-clamp-2">
                          <MessageSquare className="w-3 h-3 text-cyan-400 shrink-0 mt-0.5" />
                          "{entry.notes}"
                        </p>
                      )}

                      {/* Attached workout snapshot */}
                      {entry.workoutSnapshot?.workoutTitle && (
                        <div className="inline-flex items-center gap-1.5 text-[11px] font-medium text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-md mt-1">
                          <Dumbbell className="w-3 h-3" />
                          Workout: {entry.workoutSnapshot.workoutTitle}
                          {entry.workoutSnapshot.duration && ` (${entry.workoutSnapshot.duration}m)`}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewEntry(entry)}
                      className="h-8 px-3 text-xs gap-1.5 border-border/80 hover:bg-muted"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEditEntry(entry)}
                      className="h-8 px-2.5 text-xs text-muted-foreground hover:text-foreground border-border/80"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDeleteEntry(entryId)}
                      className="h-8 px-2.5 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border-rose-500/20"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
