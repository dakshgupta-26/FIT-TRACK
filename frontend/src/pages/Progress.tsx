import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useProgress } from "@/hooks/useProgress";
import { ProgressHeader } from "@/components/progress/ProgressHeader";
import { ProgressKpiGrid } from "@/components/progress/ProgressKpiGrid";
import { ProgressScoreCard } from "@/components/progress/ProgressScoreCard";
import { TransformationHero } from "@/components/progress/TransformationHero";
import { ProgressCharts } from "@/components/progress/ProgressCharts";
import { GoalsAndMilestones } from "@/components/progress/GoalsAndMilestones";
import { ConsistencyHeatmap } from "@/components/progress/ConsistencyHeatmap";
import { ProgressTimeline } from "@/components/progress/ProgressTimeline";
import { AddProgressModal } from "@/components/progress/AddProgressModal";
import { ProgressDetailModal } from "@/components/progress/ProgressDetailModal";
import { DeleteProgressDialog } from "@/components/progress/DeleteProgressDialog";
import { ProgressEmptyState } from "@/components/progress/ProgressEmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";
import { ProgressEntry, NewProgressData } from "@/types/progress";

const ProgressPage: React.FC = () => {
  const { currentUser } = useAuth();
  const {
    entries,
    analytics,
    loading,
    analyticsLoading,
    error,
    selectedRange,
    setSelectedRange,
    addProgressEntry,
    updateProgressEntry,
    deleteProgressEntry,
    refresh,
  } = useProgress(Boolean(currentUser));

  // Modal & Dialog state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<ProgressEntry | null>(null);
  const [viewingEntry, setViewingEntry] = useState<ProgressEntry | null>(null);
  const [deletingEntryId, setDeletingEntryId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [unitSystem, setUnitSystem] = useState<"metric" | "imperial">("metric");

  // Scroll to transformation hero
  const handleScrollToComparison = () => {
    const el = document.getElementById("transformation-hero");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Export progress data to CSV
  const handleExportData = () => {
    if (!entries || entries.length === 0) return;

    const headers = [
      "Date",
      "Category",
      "Weight (kg)",
      "Body Fat (%)",
      "Waist (cm)",
      "Chest (cm)",
      "Arms (cm)",
      "Thighs (cm)",
      "Hips (cm)",
      "Neck (cm)",
      "Notes",
      "Workout Title",
    ];

    const rows = entries.map((e) => [
      `"${new Date(e.date).toISOString().split("T")[0]}"`,
      `"${e.category || "Front"}"`,
      e.weight !== undefined ? e.weight : "",
      e.bodyFat !== undefined ? e.bodyFat : "",
      e.waist !== undefined ? e.waist : "",
      e.chest !== undefined ? e.chest : "",
      e.arms !== undefined ? e.arms : "",
      e.thighs !== undefined ? e.thighs : "",
      e.hips !== undefined ? e.hips : "",
      e.neck !== undefined ? e.neck : "",
      `"${(e.notes || "").replace(/"/g, '""')}"`,
      `"${(e.workoutSnapshot?.workoutTitle || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `fittracker_progress_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Submit Handler for Add / Edit
  const handleModalSubmit = async (data: NewProgressData) => {
    if (editingEntry) {
      const id = editingEntry.id || editingEntry._id || "";
      await updateProgressEntry(id, data);
      setEditingEntry(null);
    } else {
      await addProgressEntry(data);
    }
  };

  // Delete Handler
  const handleConfirmDelete = async () => {
    if (!deletingEntryId) return;
    setIsDeleting(true);
    try {
      await deleteProgressEntry(deletingEntryId);
      setDeletingEntryId(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const hasEntries = entries && entries.length > 0;
  const initialLoading = loading && !hasEntries;

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-8 max-w-7xl mx-auto min-h-screen text-foreground">
      {/* 1. Header Section */}
      <ProgressHeader
        selectedRange={selectedRange}
        onRangeChange={setSelectedRange}
        onOpenAddModal={() => {
          setEditingEntry(null);
          setIsAddModalOpen(true);
        }}
        onScrollToComparison={handleScrollToComparison}
        onExportData={handleExportData}
        hasEntries={hasEntries}
      />

      {/* 2. Error Banner (Non-technical & Actionable) */}
      {error && !initialLoading && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-4 text-xs sm:text-sm text-amber-300"
        >
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <p className="font-semibold">{error}</p>
              <p className="text-xs text-amber-300/80 mt-0.5">
                FitTracker services might be synchronizing. You can retry anytime.
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={refresh}
            className="border-amber-500/40 text-amber-300 hover:bg-amber-500/20 shrink-0 gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Retry
          </Button>
        </motion.div>
      )}

      {/* 3. Loading Skeletons */}
      {initialLoading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-2xl bg-muted/40" />
            ))}
          </div>
          <Skeleton className="h-44 rounded-2xl bg-muted/40" />
          <Skeleton className="h-[460px] rounded-2xl bg-muted/40" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <Skeleton className="lg:col-span-8 h-80 rounded-2xl bg-muted/40" />
            <Skeleton className="lg:col-span-4 h-80 rounded-2xl bg-muted/40" />
          </div>
        </div>
      ) : (
        <>
          {/* 4. Top KPI Cards */}
          <ProgressKpiGrid
            kpis={
              analytics?.kpis || {
                currentWeight: null,
                startWeight: null,
                weightDelta: null,
                weightDeltaPrev: null,
                weightChangePct: null,
                currentBodyFat: null,
                startBodyFat: null,
                bodyFatDelta: null,
                bodyFatDeltaPrev: null,
                currentWaist: null,
                startWaist: null,
                waistDelta: null,
                waistDeltaPrev: null,
                streak: 0,
                goalProgress: 0,
                workoutsCount: 0,
                totalWorkoutsAllTime: 0,
                progressScore: 0,
              }
            }
            hasData={hasEntries}
            onOpenAddModal={() => {
              setEditingEntry(null);
              setIsAddModalOpen(true);
            }}
            unitSystem={unitSystem}
          />

          {/* 5. Progress Score & AI Insights */}
          <ProgressScoreCard
            kpis={
              analytics?.kpis || {
                currentWeight: null,
                startWeight: null,
                weightDelta: null,
                weightDeltaPrev: null,
                weightChangePct: null,
                currentBodyFat: null,
                startBodyFat: null,
                bodyFatDelta: null,
                bodyFatDeltaPrev: null,
                currentWaist: null,
                startWaist: null,
                waistDelta: null,
                waistDeltaPrev: null,
                streak: 0,
                goalProgress: 0,
                workoutsCount: 0,
                totalWorkoutsAllTime: 0,
                progressScore: 0,
              }
            }
            aiInsights={
              analytics?.aiInsights || {
                primaryInsight:
                  "Start tracking your journey consistently to reveal intelligent transformation trends.",
                focusForNextWeek:
                  "Log your measurements once per week and complete at least 3 workouts.",
                statusBadge: "Building Baseline",
              }
            }
            hasData={hasEntries}
          />

          {/* 6. Empty State Hero (if no entries exist yet) */}
          {!hasEntries ? (
            <ProgressEmptyState
              onOpenAddModal={() => {
                setEditingEntry(null);
                setIsAddModalOpen(true);
              }}
            />
          ) : (
            <>
              {/* 7. Transformation Hero (Before / After Slider) */}
              <TransformationHero
                comparison={
                  analytics?.comparison || {
                    before: null,
                    current: null,
                    deltas: {},
                    hasEnoughPhotos: false,
                  }
                }
                onOpenAddModal={() => {
                  setEditingEntry(null);
                  setIsAddModalOpen(true);
                }}
                unitSystem={unitSystem}
              />

              {/* 8. Body Metrics Analytics & Workout Cadence Charts */}
              <ProgressCharts
                charts={
                  analytics?.charts || {
                    weightTrend: [],
                    bodyFatTrend: [],
                    waistTrend: [],
                    chestTrend: [],
                    armsTrend: [],
                    thighsTrend: [],
                    workoutFrequency: [],
                  }
                }
                unitSystem={unitSystem}
              />

              {/* 9. Goals & Milestones */}
              <GoalsAndMilestones
                goals={analytics?.goals || []}
                milestones={analytics?.milestones || []}
                onOpenAddModal={() => {
                  setEditingEntry(null);
                  setIsAddModalOpen(true);
                }}
                unitSystem={unitSystem}
              />

              {/* 10. Consistency 90-Day Heatmap */}
              <ConsistencyHeatmap
                heatmap={analytics?.heatmap || []}
                streak={analytics?.kpis?.streak || 0}
              />

              {/* 11. Visual Photo Timeline & History Log */}
              <ProgressTimeline
                entries={entries}
                onViewEntry={(entry) => setViewingEntry(entry)}
                onEditEntry={(entry) => {
                  setEditingEntry(entry);
                  setIsAddModalOpen(true);
                }}
                onDeleteEntry={(id) => setDeletingEntryId(id)}
                unitSystem={unitSystem}
              />
            </>
          )}
        </>
      )}

      {/* MODALS */}
      {/* Add / Edit Progress Modal */}
      <AddProgressModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingEntry(null);
        }}
        onSubmit={handleModalSubmit}
        initialEntry={editingEntry}
      />

      {/* Progress Detail Modal */}
      <ProgressDetailModal
        isOpen={Boolean(viewingEntry)}
        onClose={() => setViewingEntry(null)}
        entry={viewingEntry}
        onEdit={(entry) => {
          setViewingEntry(null);
          setEditingEntry(entry);
          setIsAddModalOpen(true);
        }}
        onDelete={(id) => {
          setViewingEntry(null);
          setDeletingEntryId(id);
        }}
        unitSystem={unitSystem}
      />

      {/* Delete Confirmation Alert Dialog */}
      <DeleteProgressDialog
        isOpen={Boolean(deletingEntryId)}
        onClose={() => setDeletingEntryId(null)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default ProgressPage;