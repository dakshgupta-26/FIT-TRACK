// src/hooks/useProfileImageMongo.ts (Recommended Secure Version)

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

const API_BASE_URL = "http://localhost:5000/api";

export const useProfileImageMongo = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState<string>("");
  const { currentUser, updateUserData } = useAuth();
  const { toast } = useToast();

  const loadUserProfileImage = useCallback(() => {
    if (currentUser?.profileImageUrl) {
      setProfileImageUrl(`http://localhost:5000${currentUser.profileImageUrl}`);
    } else {
      setProfileImageUrl("");
    }
  }, [currentUser?.profileImageUrl]);

  const uploadProfileImage = async (file: File) => {
    if (!currentUser) return;
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("image", file);
      const token = localStorage.getItem("authToken");

      // --- Use the new, more secure route ---
      const response = await fetch(`${API_BASE_URL}/user/profile/image`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setProfileImageUrl(`http://localhost:5000${result.imageUrl}`);
        if (updateUserData) {
          updateUserData(result.user);
        }
        toast({ title: "Success", description: "Profile image uploaded!" });
        return result.imageUrl;
      } else {
        const error = await response.json();
        throw new Error(error.error || "Upload failed");
      }
    } catch (error: any) {
      console.error("Error uploading image:", error);
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const deleteProfileImage = async () => {
    if (!currentUser) return;
    const token = localStorage.getItem("authToken");

    try {
      // --- Use the new, more secure route ---
      const response = await fetch(`${API_BASE_URL}/user/profile/image`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        setProfileImageUrl("");
        if (updateUserData) {
          updateUserData(result.user);
        }
        toast({ title: "Success", description: "Profile image deleted!" });
      } else {
        const error = await response.json();
        throw new Error(error.error || "Delete failed");
      }
    } catch (error: any) {
      console.error("Error deleting image:", error);
      toast({
        title: "Delete Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    loadUserProfileImage();
  }, [loadUserProfileImage]);

  return {
    isUploading,
    profileImageUrl,
    uploadProfileImage,
    deleteProfileImage,
    loadUserProfileImage,
    setProfileImageUrl,
  };
};
