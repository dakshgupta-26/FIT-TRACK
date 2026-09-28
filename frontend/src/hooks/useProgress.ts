import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import api from "@/services/api";
import { getSocket } from "@/lib/socket";
import {
  ProgressEntry,
  NewProgressData,
  ProgressAnalytics,
} from "@/types/progress";

export type { ProgressEntry, NewProgressData, ProgressAnalytics };

export const useProgress = (isUserLoggedIn: boolean) => {
  const { toast } = useToast();
  const [entries, setEntries] = useState<ProgressEntry[]>([]);
  const [analytics, setAnalytics] = useState<ProgressAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRange, setSelectedRange] = useState<"7d" | "30d" | "90d" | "6m" | "1y" | "all">("90d");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Fetch chronological entries list
  const fetchEntries = useCallback(async () => {
    if (!isUserLoggedIn) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, string> = { range: selectedRange };
      if (selectedCategory && selectedCategory !== "All") {
        params.category = selectedCategory;
      }
      const { data } = await api.get("/progress", { params });
      setEntries(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.warn("[useProgress] Failed to fetch entries:", err.message);
      // Friendly, non-technical error message
      setError("Your progress data couldn't be loaded at this moment.");
    } finally {
      setLoading(false);
    }
  }, [isUserLoggedIn, selectedRange, selectedCategory]);

  // Fetch full analytics (KPIs, charts, before/after, milestones, AI insights)
  const fetchAnalytics = useCallback(async () => {
    if (!isUserLoggedIn) {
      setAnalyticsLoading(false);
      return;
    }
    setAnalyticsLoading(true);
    try {
      const { data } = await api.get("/progress/analytics", {
        params: { range: selectedRange },
      });
      setAnalytics(data);
    } catch (err: any) {
      console.warn("[useProgress] Failed to fetch analytics:", err.message);
    } finally {
      setAnalyticsLoading(false);
    }
  }, [isUserLoggedIn, selectedRange]);

  // Initial and reactive fetch
  useEffect(() => {
    fetchEntries();
    fetchAnalytics();
  }, [fetchEntries, fetchAnalytics]);

  // Real-time socket event subscription
  useEffect(() => {
    if (!isUserLoggedIn) return;

    try {
      const socket = getSocket();
      if (!socket) return;

      const handleRemoteUpdate = () => {
        fetchEntries();
        fetchAnalytics();
      };

      socket.on("progress:created", handleRemoteUpdate);
      socket.on("progress:updated", handleRemoteUpdate);
      socket.on("progress:deleted", handleRemoteUpdate);

      return () => {
        socket.off("progress:created", handleRemoteUpdate);
        socket.off("progress:updated", handleRemoteUpdate);
        socket.off("progress:deleted", handleRemoteUpdate);
      };
    } catch (e) {
      // Non-fatal if socket is offline
    }
  }, [isUserLoggedIn, fetchEntries, fetchAnalytics]);

  // Add Progress Entry
  const addProgressEntry = async (data: NewProgressData): Promise<ProgressEntry> => {
    const formData = new FormData();

    if (data.image) {
      formData.append("image", data.image);
    }

    if (data.photos && data.photos.length > 0) {
      data.photos.forEach((item) => {
        formData.append("photos", item.file);
      });
    }

    if (data.imageUrl) formData.append("imageUrl", data.imageUrl);
    if (data.category) formData.append("category", data.category);
    if (data.weight !== undefined) formData.append("weight", String(data.weight));
    if (data.waist !== undefined) formData.append("waist", String(data.waist));
    if (data.bodyFat !== undefined) formData.append("bodyFat", String(data.bodyFat));
    if (data.chest !== undefined) formData.append("chest", String(data.chest));
    if (data.arms !== undefined) formData.append("arms", String(data.arms));
    if (data.thighs !== undefined) formData.append("thighs", String(data.thighs));
    if (data.hips !== undefined) formData.append("hips", String(data.hips));
    if (data.neck !== undefined) formData.append("neck", String(data.neck));
    if (data.notes) formData.append("notes", data.notes);
    if (data.date) formData.append("date", data.date);
    if (data.unitPreference) formData.append("unitPreference", data.unitPreference);

    if (data.workoutSnapshot) {
      formData.append("workoutSnapshot", JSON.stringify(data.workoutSnapshot));
    }

    try {
      const response = await api.post<ProgressEntry>("/progress", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const newEntry = response.data;
      setEntries((prev) => [newEntry, ...prev]);

      // Refresh analytics in background
      fetchAnalytics();

      toast({
        title: "✨ Transformation Logged!",
        description: "Your progress metrics and photos have been securely updated.",
      });

      return newEntry;
    } catch (err: any) {
      const msg = err.response?.data?.message || "Unable to save progress entry. Please check your data and retry.";
      toast({
        variant: "destructive",
        title: "Entry Save Error",
        description: msg,
      });
      throw new Error(msg);
    }
  };

  // Update Progress Entry
  const updateProgressEntry = async (id: string, data: Partial<NewProgressData>): Promise<ProgressEntry> => {
    const formData = new FormData();

    if (data.image) formData.append("image", data.image);
    if (data.category) formData.append("category", data.category);
    if (data.weight !== undefined) formData.append("weight", String(data.weight));
    if (data.waist !== undefined) formData.append("waist", String(data.waist));
    if (data.bodyFat !== undefined) formData.append("bodyFat", String(data.bodyFat));
    if (data.chest !== undefined) formData.append("chest", String(data.chest));
    if (data.arms !== undefined) formData.append("arms", String(data.arms));
    if (data.thighs !== undefined) formData.append("thighs", String(data.thighs));
    if (data.hips !== undefined) formData.append("hips", String(data.hips));
    if (data.neck !== undefined) formData.append("neck", String(data.neck));
    if (data.notes !== undefined) formData.append("notes", data.notes);
    if (data.date) formData.append("date", data.date);
    if (data.unitPreference) formData.append("unitPreference", data.unitPreference);

    if (data.workoutSnapshot) {
      formData.append("workoutSnapshot", JSON.stringify(data.workoutSnapshot));
    }

    try {
      const response = await api.patch<ProgressEntry>(`/progress/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const updated = response.data;
      setEntries((prev) => prev.map((e) => (e.id === id || e._id === id ? updated : e)));
      fetchAnalytics();

      toast({
        title: "Progress Updated",
        description: "Your entry has been updated successfully.",
      });

      return updated;
    } catch (err: any) {
      const msg = err.response?.data?.message || "Unable to update progress entry.";
      toast({
        variant: "destructive",
        title: "Update Error",
        description: msg,
      });
      throw new Error(msg);
    }
  };

  // Delete Progress Entry
  const deleteProgressEntry = async (entryId: string) => {
    try {
      await api.delete(`/progress/${entryId}`);
      setEntries((prev) => prev.filter((e) => e.id !== entryId && e._id !== entryId));
      fetchAnalytics();

      toast({
        title: "Entry Removed",
        description: "Your progress record and associated images were deleted.",
      });
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to delete progress entry.";
      toast({
        variant: "destructive",
        title: "Delete Error",
        description: msg,
      });
      throw new Error(msg);
    }
  };

  const refresh = async () => {
    await Promise.all([fetchEntries(), fetchAnalytics()]);
  };

  return {
    entries,
    analytics,
    loading,
    analyticsLoading,
    error,
    selectedRange,
    setSelectedRange,
    selectedCategory,
    setSelectedCategory,
    addProgressEntry,
    updateProgressEntry,
    deleteProgressEntry,
    refresh,
  };
};