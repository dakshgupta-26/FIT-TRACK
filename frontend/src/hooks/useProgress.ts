import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import api from "@/services/api"; // Your configured axios instance

// Define the shape of a progress entry
export interface ProgressEntry {
  id: string;
  _id: string;
  date: string;
  imageUrl: string;
  weight?: number;
  waist?: number;
  bodyFat?: number;
  category: "Front" | "Back" | "Side";
}

// The data structure for adding a new entry
export interface NewProgressData {
  image: File;
  weight?: number;
  waist?: number;
  bodyFat?: number;
  category: "Front" | "Back" | "Side";
}

export const useProgress = (isUserLoggedIn: boolean) => {
  const { toast } = useToast();
  const [entries, setEntries] = useState<ProgressEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEntries = useCallback(async () => {
    if (!isUserLoggedIn) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get("/progress");
      setEntries(data);
    } catch (err) {
      setError("Failed to fetch progress entries.");
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not load your progress.",
      });
    } finally {
      setLoading(false);
    }
  }, [isUserLoggedIn, toast]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const addProgressEntry = async (data: NewProgressData) => {
    const formData = new FormData();
    formData.append("image", data.image); // 'image' key must match backend
    formData.append("category", data.category);
    if (data.weight) formData.append("weight", String(data.weight));
    if (data.waist) formData.append("waist", String(data.waist));
    if (data.bodyFat) formData.append("bodyFat", String(data.bodyFat));

    try {
      const response = await api.post<ProgressEntry>("/progress", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setEntries((prev) => [response.data, ...prev]);
      toast({
        title: "Success!",
        description: "Your progress has been saved.",
      });
    } catch (err) {
      setError("Failed to save progress entry.");
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not save your progress.",
      });
    }
  };

  const deleteProgressEntry = async (entryId: string) => {
    try {
      await api.delete(`/progress/${entryId}`);
      setEntries((prev) => prev.filter((entry) => entry.id !== entryId));
      toast({
        title: "Deleted",
        description: "Progress entry has been removed.",
      });
    } catch (err) {
      setError("Failed to delete progress entry.");
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not delete the entry.",
      });
    }
  };

  return { entries, loading, error, addProgressEntry, deleteProgressEntry };
};