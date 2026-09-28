import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Scale,
  Percent,
  Ruler,
  MessageSquare,
  Dumbbell,
  Edit2,
  Trash2,
  Camera,
  X,
} from "lucide-react";
import { ProgressEntry } from "@/types/progress";
import { resolveImageUrl } from "@/services/api";

interface ProgressDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  entry: ProgressEntry | null;
  onEdit: (entry: ProgressEntry) => void;
  onDelete: (entryId: string) => void;
  unitSystem?: "metric" | "imperial";
}

export const ProgressDetailModal: React.FC<ProgressDetailModalProps> = ({
  isOpen,
  onClose,
  entry,
  onEdit,
  onDelete,
  unitSystem = "metric",
}) => {
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  if (!entry) return null;

  const entryId = entry.id || entry._id || "";
  const weightUnit = unitSystem === "imperial" ? "lbs" : "kg";
  const lengthUnit = unitSystem === "imperial" ? "in" : "cm";

  const dateStr = new Date(entry.date).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const rawPhotos = entry.photos && entry.photos.length > 0
    ? entry.photos
    : entry.imageUrl
    ? [{ url: entry.imageUrl, type: entry.category || "Front" }]
    : [];

  const allPhotos = rawPhotos.map((p) => ({
    ...p,
    url: resolveImageUrl(p.url),
  }));

  const currentPhoto = allPhotos[activePhotoIndex] || allPhotos[0];



  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[92vh] overflow-y-auto p-0 bg-card border-border/80 shadow-2xl">
        <DialogHeader className="p-5 sm:p-6 pb-4 border-b border-border/40">
          <div className="flex items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs font-semibold uppercase tracking-wider border-cyan-500/30 text-cyan-400">
                  {entry.category || "Progress Check-In"}
                </Badge>
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {dateStr}
                </span>
              </div>
              <DialogTitle className="text-xl sm:text-2xl font-extrabold text-foreground">
                Progress Entry Details
              </DialogTitle>
            </div>
          </div>
        </DialogHeader>

        <div className="p-5 sm:p-6 space-y-6">
          {/* Photo Gallery & Angle Carousel */}
          {allPhotos.length > 0 ? (
            <div className="space-y-3">
              <div className="w-full h-80 sm:h-96 rounded-2xl overflow-hidden bg-muted/40 border border-border/80 flex items-center justify-center relative shadow-inner">
                <img
                  src={currentPhoto.url}
                  alt={`Progress entry ${currentPhoto.type}`}
                  className="w-full h-full object-contain"
                />
                <div className="absolute top-3 left-3">
                  <Badge className="bg-black/70 backdrop-blur-md text-white text-xs px-2.5 py-1">
                    {currentPhoto.type} Angle
                  </Badge>
                </div>
              </div>

              {/* Thumbnails if multiple photos */}
              {allPhotos.length > 1 && (
                <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
                  {allPhotos.map((photo, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActivePhotoIndex(idx)}
                      className={`relative w-16 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                        activePhotoIndex === idx
                          ? "border-cyan-400 shadow-md shadow-cyan-500/20"
                          : "border-border/60 opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img src={photo.url} alt={photo.type} className="w-full h-full object-cover" />
                      <span className="absolute bottom-1 inset-x-1 text-[9px] font-bold text-center bg-black/70 text-white rounded">
                        {photo.type}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 text-center rounded-2xl border border-dashed border-border/80 bg-muted/20 flex flex-col items-center justify-center space-y-2">
              <Camera className="w-10 h-10 text-muted-foreground/60" />
              <p className="text-sm font-semibold text-foreground">No photos attached to this entry</p>
            </div>
          )}

          {/* Measurements Breakdown Grid */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
              Recorded Body Metrics
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {entry.weight !== undefined && (
                <div className="p-3.5 rounded-xl bg-muted/40 border border-border/50 space-y-0.5">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Scale className="w-3.5 h-3.5 text-cyan-400" /> Weight
                  </span>
                  <p className="text-lg font-extrabold text-foreground">
                    {entry.weight} {weightUnit}
                  </p>
                </div>
              )}

              {entry.bodyFat !== undefined && (
                <div className="p-3.5 rounded-xl bg-muted/40 border border-border/50 space-y-0.5">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Percent className="w-3.5 h-3.5 text-blue-400" /> Body Fat
                  </span>
                  <p className="text-lg font-extrabold text-foreground">{entry.bodyFat}%</p>
                </div>
              )}

              {entry.waist !== undefined && (
                <div className="p-3.5 rounded-xl bg-muted/40 border border-border/50 space-y-0.5">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Ruler className="w-3.5 h-3.5 text-indigo-400" /> Waist
                  </span>
                  <p className="text-lg font-extrabold text-foreground">
                    {entry.waist} {lengthUnit}
                  </p>
                </div>
              )}

              {entry.chest !== undefined && (
                <div className="p-3.5 rounded-xl bg-muted/40 border border-border/50 space-y-0.5">
                  <span className="text-xs text-muted-foreground">Chest</span>
                  <p className="text-lg font-extrabold text-foreground">
                    {entry.chest} {lengthUnit}
                  </p>
                </div>
              )}

              {entry.arms !== undefined && (
                <div className="p-3.5 rounded-xl bg-muted/40 border border-border/50 space-y-0.5">
                  <span className="text-xs text-muted-foreground">Arms</span>
                  <p className="text-lg font-extrabold text-foreground">
                    {entry.arms} {lengthUnit}
                  </p>
                </div>
              )}

              {entry.thighs !== undefined && (
                <div className="p-3.5 rounded-xl bg-muted/40 border border-border/50 space-y-0.5">
                  <span className="text-xs text-muted-foreground">Thighs</span>
                  <p className="text-lg font-extrabold text-foreground">
                    {entry.thighs} {lengthUnit}
                  </p>
                </div>
              )}

              {entry.hips !== undefined && (
                <div className="p-3.5 rounded-xl bg-muted/40 border border-border/50 space-y-0.5">
                  <span className="text-xs text-muted-foreground">Hips</span>
                  <p className="text-lg font-extrabold text-foreground">
                    {entry.hips} {lengthUnit}
                  </p>
                </div>
              )}

              {entry.neck !== undefined && (
                <div className="p-3.5 rounded-xl bg-muted/40 border border-border/50 space-y-0.5">
                  <span className="text-xs text-muted-foreground">Neck</span>
                  <p className="text-lg font-extrabold text-foreground">
                    {entry.neck} {lengthUnit}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Reflection Notes */}
          {entry.notes && (
            <div className="p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20 space-y-1">
              <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5 uppercase tracking-wide">
                <MessageSquare className="w-3.5 h-3.5" /> Reflection Note
              </span>
              <p className="text-sm text-foreground/90 italic">"{entry.notes}"</p>
            </div>
          )}

          {/* Attached Workout Snapshot */}
          {entry.workoutSnapshot?.workoutTitle && (
            <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/20 space-y-2">
              <span className="text-xs font-bold text-purple-400 flex items-center gap-1.5 uppercase tracking-wide">
                <Dumbbell className="w-3.5 h-3.5" /> Associated Workout
              </span>
              <div className="flex flex-wrap items-center gap-4 text-xs">
                <div>
                  <span className="text-muted-foreground">Title: </span>
                  <span className="font-bold text-foreground">{entry.workoutSnapshot.workoutTitle}</span>
                </div>
                {entry.workoutSnapshot.workoutType && (
                  <div>
                    <span className="text-muted-foreground">Type: </span>
                    <span className="font-bold text-foreground">{entry.workoutSnapshot.workoutType}</span>
                  </div>
                )}
                {entry.workoutSnapshot.duration && (
                  <div>
                    <span className="text-muted-foreground">Duration: </span>
                    <span className="font-bold text-foreground">{entry.workoutSnapshot.duration} mins</span>
                  </div>
                )}
                {entry.workoutSnapshot.calories && (
                  <div>
                    <span className="text-muted-foreground">Burned: </span>
                    <span className="font-bold text-foreground">{entry.workoutSnapshot.calories} kcal</span>
                  </div>
                )}
                {entry.workoutSnapshot.prAchieved && (
                  <div>
                    <span className="text-muted-foreground">PR: </span>
                    <span className="font-bold text-amber-400">🔥 {entry.workoutSnapshot.prAchieved}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="p-5 sm:p-6 border-t border-border/40 flex items-center justify-between sm:justify-between gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              onClose();
              onDelete(entryId);
            }}
            className="text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border-rose-500/30 gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" /> Delete Entry
          </Button>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                onClose();
                onEdit(entry);
              }}
              className="text-xs gap-1.5"
            >
              <Edit2 className="w-3.5 h-3.5" /> Edit
            </Button>

            <Button
              type="button"
              size="sm"
              onClick={onClose}
              className="text-xs"
            >
              Close
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
