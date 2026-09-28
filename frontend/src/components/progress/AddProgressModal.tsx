import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  UploadCloud,
  Image as ImageIcon,
  X,
  Loader2,
  CheckCircle,
  Dumbbell,
  Scale,
  Sparkles,
  Camera,
} from "lucide-react";
import { ProgressEntry, NewProgressData, ProgressCategory } from "@/types/progress";

interface AddProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: NewProgressData) => Promise<any>;
  initialEntry?: ProgressEntry | null; // For editing mode
}

export const AddProgressModal: React.FC<AddProgressModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialEntry,
}) => {
  const isEditing = Boolean(initialEntry);

  // Form State
  const [photos, setPhotos] = useState<{ file: File; preview: string; type: ProgressCategory }[]>([]);
  const [existingImageUrl, setExistingImageUrl] = useState<string>("");
  const [category, setCategory] = useState<ProgressCategory>("Front");
  const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0]);

  // Measurements
  const [unitSystem, setUnitSystem] = useState<"metric" | "imperial">("metric");
  const [weight, setWeight] = useState<string>("");
  const [waist, setWaist] = useState<string>("");
  const [bodyFat, setBodyFat] = useState<string>("");
  const [chest, setChest] = useState<string>("");
  const [arms, setArms] = useState<string>("");
  const [thighs, setThighs] = useState<string>("");
  const [hips, setHips] = useState<string>("");
  const [neck, setNeck] = useState<string>("");

  // Notes
  const [notes, setNotes] = useState<string>("");

  // Workout snapshot
  const [attachWorkout, setAttachWorkout] = useState<boolean>(false);
  const [workoutTitle, setWorkoutTitle] = useState<string>("");
  const [workoutType, setWorkoutType] = useState<string>("Strength");
  const [workoutDuration, setWorkoutDuration] = useState<string>("");
  const [workoutCalories, setWorkoutCalories] = useState<string>("");
  const [prAchieved, setPrAchieved] = useState<string>("");

  // UI state
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("photos");
  const [dragActive, setDragActive] = useState<boolean>(false);

  // Reset or pre-fill on open/edit
  useEffect(() => {
    if (initialEntry) {
      setExistingImageUrl(initialEntry.imageUrl || initialEntry.photos?.[0]?.url || "");
      setCategory(initialEntry.category || "Front");
      setDate(
        initialEntry.date
          ? new Date(initialEntry.date).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0]
      );
      setWeight(initialEntry.weight !== undefined ? String(initialEntry.weight) : "");
      setWaist(initialEntry.waist !== undefined ? String(initialEntry.waist) : "");
      setBodyFat(
        initialEntry.bodyFat !== undefined
          ? String(initialEntry.bodyFat)
          : initialEntry.bodyFatPercentage !== undefined
          ? String(initialEntry.bodyFatPercentage)
          : ""
      );
      setChest(initialEntry.chest !== undefined ? String(initialEntry.chest) : "");
      setArms(initialEntry.arms !== undefined ? String(initialEntry.arms) : "");
      setThighs(initialEntry.thighs !== undefined ? String(initialEntry.thighs) : "");
      setHips(initialEntry.hips !== undefined ? String(initialEntry.hips) : "");
      setNeck(initialEntry.neck !== undefined ? String(initialEntry.neck) : "");
      setNotes(initialEntry.notes || "");
      setUnitSystem(initialEntry.unitPreference || "metric");

      if (initialEntry.workoutSnapshot) {
        setAttachWorkout(true);
        setWorkoutTitle(initialEntry.workoutSnapshot.workoutTitle || "");
        setWorkoutType(initialEntry.workoutSnapshot.workoutType || "Strength");
        setWorkoutDuration(
          initialEntry.workoutSnapshot.duration !== undefined
            ? String(initialEntry.workoutSnapshot.duration)
            : ""
        );
        setWorkoutCalories(
          initialEntry.workoutSnapshot.calories !== undefined
            ? String(initialEntry.workoutSnapshot.calories)
            : ""
        );
        setPrAchieved(initialEntry.workoutSnapshot.prAchieved || "");
      } else {
        setAttachWorkout(false);
      }
    } else {
      // Clear form
      setPhotos([]);
      setExistingImageUrl("");
      setCategory("Front");
      setDate(new Date().toISOString().split("T")[0]);
      setWeight("");
      setWaist("");
      setBodyFat("");
      setChest("");
      setArms("");
      setThighs("");
      setHips("");
      setNeck("");
      setNotes("");
      setAttachWorkout(false);
      setWorkoutTitle("");
      setWorkoutType("Strength");
      setWorkoutDuration("");
      setWorkoutCalories("");
      setPrAchieved("");
    }
  }, [initialEntry, isOpen]);

  // Handle file additions
  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const newPhotos = [...photos];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith("image/")) {
        const preview = URL.createObjectURL(file);
        // Default angle assignment: 1st Front, 2nd Side, 3rd Back
        const defaultTypes: ProgressCategory[] = ["Front", "Side", "Back", "Other"];
        const assignedType = defaultTypes[newPhotos.length % defaultTypes.length];
        newPhotos.push({ file, preview, type: assignedType });
      }
    }
    setPhotos(newPhotos);
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => {
      const copy = [...prev];
      URL.revokeObjectURL(copy[index].preview);
      copy.splice(index, 1);
      return copy;
    });
  };

  const updatePhotoType = (index: number, newType: ProgressCategory) => {
    setPhotos((prev) => {
      const copy = [...prev];
      copy[index].type = newType;
      return copy;
    });
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic numerical parsing
    const parseNum = (v: string) => (v.trim() === "" ? undefined : parseFloat(v));

    const numWeight = parseNum(weight);
    const numWaist = parseNum(waist);
    const numBodyFat = parseNum(bodyFat);
    const numChest = parseNum(chest);
    const numArms = parseNum(arms);
    const numThighs = parseNum(thighs);
    const numHips = parseNum(hips);
    const numNeck = parseNum(neck);

    // Validate that user provided at least one photo or one measurement
    const hasPhoto = photos.length > 0 || Boolean(existingImageUrl);
    const hasMeasurement =
      numWeight !== undefined ||
      numWaist !== undefined ||
      numBodyFat !== undefined ||
      numChest !== undefined ||
      notes.trim() !== "";

    if (!hasPhoto && !hasMeasurement) {
      alert("Please provide at least one photo or body measurement to log your progress.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload: NewProgressData = {
        category,
        date,
        unitPreference: unitSystem,
        weight: numWeight,
        waist: numWaist,
        bodyFat: numBodyFat,
        chest: numChest,
        arms: numArms,
        thighs: numThighs,
        hips: numHips,
        neck: numNeck,
        notes: notes.trim(),
      };

      if (photos.length > 0) {
        payload.image = photos[0].file;
        payload.photos = photos.map((p) => ({ file: p.file, type: p.type }));
      } else if (existingImageUrl) {
        payload.imageUrl = existingImageUrl;
      }

      if (attachWorkout && workoutTitle.trim()) {
        payload.workoutSnapshot = {
          workoutTitle: workoutTitle.trim(),
          workoutType,
          duration: parseNum(workoutDuration),
          calories: parseNum(workoutCalories),
          prAchieved: prAchieved.trim() || undefined,
        };
      }

      await onSubmit(payload);
      onClose();
    } catch (err) {
      console.error("Submission failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !isSubmitting && !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[92vh] overflow-y-auto p-0 bg-card border-border/80 shadow-2xl">
        <form onSubmit={handleSubmit} className="flex flex-col">
          <DialogHeader className="p-5 sm:p-6 pb-4 border-b border-border/40">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-widest">
                {isEditing ? "EDIT CHECK-IN" : "LOG NEW CHECK-IN"}
              </span>
            </div>
            <DialogTitle className="text-xl sm:text-2xl font-extrabold text-foreground">
              {isEditing ? "Update Progress Record" : "Add Progress Entry"}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Capture your physical transformation photos, body measurements, and fitness reflections.
            </DialogDescription>
          </DialogHeader>

          {/* Navigation Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="px-5 sm:px-6 pt-3 border-b border-border/40">
              <TabsList className="grid grid-cols-3 w-full bg-muted/60 p-1">
                <TabsTrigger value="photos" className="text-xs font-semibold gap-1.5">
                  <Camera className="w-3.5 h-3.5" /> Photos
                </TabsTrigger>
                <TabsTrigger value="measurements" className="text-xs font-semibold gap-1.5">
                  <Scale className="w-3.5 h-3.5" /> Measurements
                </TabsTrigger>
                <TabsTrigger value="reflection" className="text-xs font-semibold gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Reflection & Workout
                </TabsTrigger>
              </TabsList>
            </div>

            {/* TAB 1: PHOTOS */}
            <TabsContent value="photos" className="p-5 sm:p-6 space-y-4 m-0">
              {/* Drag & Drop Zone */}
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`relative p-6 sm:p-8 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center text-center cursor-pointer ${
                  dragActive
                    ? "border-cyan-400 bg-cyan-500/10 shadow-lg shadow-cyan-500/10"
                    : "border-border/80 bg-muted/30 hover:border-cyan-500/50 hover:bg-muted/50"
                }`}
                onClick={() => document.getElementById("file-upload-input")?.click()}
              >
                <input
                  id="file-upload-input"
                  type="file"
                  multiple
                  accept="image/png, image/jpeg, image/webp"
                  className="hidden"
                  onChange={(e) => handleFiles(e.target.files)}
                />

                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-3">
                  <UploadCloud className="w-6 h-6" />
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-semibold text-foreground">
                    Drop your progress photo here, or{" "}
                    <span className="text-cyan-400 underline underline-offset-2">browse</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Supports PNG, JPEG, WEBP up to 15MB • Upload Front, Side, or Back views
                  </p>
                </div>
              </div>

              {/* Photos Preview Grid */}
              {(photos.length > 0 || existingImageUrl) && (
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase">
                    Photo Previews & Angles
                  </Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {/* Existing Photo (if in edit mode and no new photos selected yet) */}
                    {photos.length === 0 && existingImageUrl && (
                      <div className="relative rounded-xl overflow-hidden border border-border/80 aspect-[3/4] bg-muted group">
                        <img
                          src={existingImageUrl}
                          alt="Current progress"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-black/70 text-white">
                            Existing
                          </span>
                        </div>
                      </div>
                    )}

                    {/* New Uploaded Photos */}
                    {photos.map((item, idx) => (
                      <div
                        key={idx}
                        className="relative rounded-xl overflow-hidden border border-border/80 aspect-[3/4] bg-muted group"
                      >
                        <img
                          src={item.preview}
                          alt={`Uploaded preview ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />

                        {/* Angle Selector Dropdown on Image */}
                        <div className="absolute top-2 left-2 z-10">
                          <Select
                            value={item.type}
                            onValueChange={(val: ProgressCategory) => updatePhotoType(idx, val)}
                          >
                            <SelectTrigger className="h-6 text-[10px] font-bold bg-black/80 text-white border-0 px-2 py-0">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Front">Front</SelectItem>
                              <SelectItem value="Side">Side</SelectItem>
                              <SelectItem value="Back">Back</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Remove Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removePhoto(idx);
                          }}
                          className="absolute top-2 right-2 p-1 rounded-full bg-black/70 text-white hover:bg-rose-500 transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Primary Category & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <Label htmlFor="entry-category" className="text-xs font-semibold">
                    Primary Angle
                  </Label>
                  <Select value={category} onValueChange={(val: ProgressCategory) => setCategory(val)}>
                    <SelectTrigger id="entry-category">
                      <SelectValue placeholder="Select angle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Front">Front Angle</SelectItem>
                      <SelectItem value="Side">Side Profile</SelectItem>
                      <SelectItem value="Back">Back View</SelectItem>
                      <SelectItem value="Other">Other Detail</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="entry-date" className="text-xs font-semibold">
                    Date Taken
                  </Label>
                  <Input
                    id="entry-date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
              </div>
            </TabsContent>

            {/* TAB 2: MEASUREMENTS */}
            <TabsContent value="measurements" className="p-5 sm:p-6 space-y-4 m-0">
              {/* Unit System Switcher */}
              <div className="flex items-center justify-between pb-2 border-b border-border/40">
                <span className="text-xs font-semibold text-muted-foreground">Measurement System</span>
                <div className="flex items-center gap-1 p-0.5 rounded-lg bg-muted border border-border/50 text-xs">
                  <button
                    type="button"
                    onClick={() => setUnitSystem("metric")}
                    className={`px-3 py-1 rounded-md font-semibold transition-all ${
                      unitSystem === "metric"
                        ? "bg-cyan-500 text-white shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Metric (kg / cm)
                  </button>
                  <button
                    type="button"
                    onClick={() => setUnitSystem("imperial")}
                    className={`px-3 py-1 rounded-md font-semibold transition-all ${
                      unitSystem === "imperial"
                        ? "bg-cyan-500 text-white shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Imperial (lbs / in)
                  </button>
                </div>
              </div>

              {/* Primary Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div className="space-y-1">
                  <Label htmlFor="weight-input" className="text-xs font-semibold text-foreground">
                    Weight ({unitSystem === "imperial" ? "lbs" : "kg"})
                  </Label>
                  <Input
                    id="weight-input"
                    type="number"
                    step="0.1"
                    placeholder="e.g. 74.5"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="bodyfat-input" className="text-xs font-semibold text-foreground">
                    Body Fat (%)
                  </Label>
                  <Input
                    id="bodyfat-input"
                    type="number"
                    step="0.1"
                    placeholder="e.g. 15.2"
                    value={bodyFat}
                    onChange={(e) => setBodyFat(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="waist-input" className="text-xs font-semibold text-foreground">
                    Waist ({unitSystem === "imperial" ? "in" : "cm"})
                  </Label>
                  <Input
                    id="waist-input"
                    type="number"
                    step="0.1"
                    placeholder="e.g. 81"
                    value={waist}
                    onChange={(e) => setWaist(e.target.value)}
                  />
                </div>
              </div>

              {/* Detailed Circumferences */}
              <div className="pt-2">
                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-2">
                  Optional Body Circumferences ({unitSystem === "imperial" ? "in" : "cm"})
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="chest-input" className="text-xs text-muted-foreground">
                      Chest
                    </Label>
                    <Input
                      id="chest-input"
                      type="number"
                      step="0.1"
                      placeholder="e.g. 98"
                      value={chest}
                      onChange={(e) => setChest(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="arms-input" className="text-xs text-muted-foreground">
                      Arms / Bicep
                    </Label>
                    <Input
                      id="arms-input"
                      type="number"
                      step="0.1"
                      placeholder="e.g. 36"
                      value={arms}
                      onChange={(e) => setArms(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="thighs-input" className="text-xs text-muted-foreground">
                      Thighs
                    </Label>
                    <Input
                      id="thighs-input"
                      type="number"
                      step="0.1"
                      placeholder="e.g. 58"
                      value={thighs}
                      onChange={(e) => setThighs(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="hips-input" className="text-xs text-muted-foreground">
                      Hips
                    </Label>
                    <Input
                      id="hips-input"
                      type="number"
                      step="0.1"
                      placeholder="e.g. 95"
                      value={hips}
                      onChange={(e) => setHips(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* TAB 3: REFLECTION & WORKOUT SNAPSHOT */}
            <TabsContent value="reflection" className="p-5 sm:p-6 space-y-4 m-0">
              {/* How are you feeling note */}
              <div className="space-y-1.5">
                <Label htmlFor="notes-textarea" className="text-xs font-semibold text-foreground">
                  How are you feeling this week?
                </Label>
                <Textarea
                  id="notes-textarea"
                  rows={3}
                  placeholder="e.g. Energy levels peak, hit a new bench PR at 100kg, waist feeling noticeably leaner..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
                <span className="text-[11px] text-muted-foreground">
                  This reflection note will accompany your check-in along the visual timeline.
                </span>
              </div>

              {/* Workout Snapshot Linkage */}
              <div className="pt-2 border-t border-border/40 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <Dumbbell className="w-3.5 h-3.5 text-purple-400" /> Attach Workout Snapshot
                    </Label>
                    <span className="text-[11px] text-muted-foreground block">
                      Optionally associate today's training session with this progress entry.
                    </span>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setAttachWorkout(!attachWorkout)}
                    className="text-xs h-7"
                  >
                    {attachWorkout ? "Remove" : "+ Add Workout"}
                  </Button>
                </div>

                {attachWorkout && (
                  <div className="p-3.5 rounded-xl bg-purple-500/5 border border-purple-500/20 space-y-3 animate-in fade-in duration-200">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs">Workout Title</Label>
                        <Input
                          placeholder="e.g. Upper Body Hypertrophy"
                          value={workoutTitle}
                          onChange={(e) => setWorkoutTitle(e.target.value)}
                        />
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs">Type</Label>
                        <Select value={workoutType} onValueChange={setWorkoutType}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Strength">Strength</SelectItem>
                            <SelectItem value="Cardio">Cardio</SelectItem>
                            <SelectItem value="Flexibility">Flexibility</SelectItem>
                            <SelectItem value="HIIT">HIIT</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs">Duration (mins)</Label>
                        <Input
                          type="number"
                          placeholder="e.g. 55"
                          value={workoutDuration}
                          onChange={(e) => setWorkoutDuration(e.target.value)}
                        />
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs">Calories</Label>
                        <Input
                          type="number"
                          placeholder="e.g. 420"
                          value={workoutCalories}
                          onChange={(e) => setWorkoutCalories(e.target.value)}
                        />
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs">PR Achieved</Label>
                        <Input
                          placeholder="e.g. 100kg Squat"
                          value={prAchieved}
                          onChange={(e) => setPrAchieved(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="p-5 sm:p-6 border-t border-border/40 flex items-center justify-between sm:justify-between gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold shadow-lg shadow-cyan-500/25 min-w-[140px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : isEditing ? (
                "Update Entry"
              ) : (
                "Save Progress"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
