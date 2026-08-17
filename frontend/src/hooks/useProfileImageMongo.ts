import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import apiClient, { getApiBaseUrl } from "@/lib/api-client";

const formatImageUrl = (url: string | undefined): string => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  const host = getApiBaseUrl().replace(/\/api\/?$/, '');
  return `${host}${url.startsWith('/') ? '' : '/'}${url}`;
};

export const useProfileImageMongo = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState<string>("");
  const { currentUser, updateUserData } = useAuth();
  const { toast } = useToast();

  const loadUserProfileImage = useCallback(() => {
    if (currentUser?.profileImageUrl) {
      setProfileImageUrl(formatImageUrl(currentUser.profileImageUrl));
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

      const { data: result } = await apiClient.post('/user/profile/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const fullUrl = formatImageUrl(result.imageUrl);
      setProfileImageUrl(fullUrl);
      if (updateUserData) {
        updateUserData(result.user);
      }
      toast({ title: "Success", description: "Profile image uploaded!" });
      return result.imageUrl;
    } catch (error: any) {
      console.error("Error uploading image:", error);
      toast({
        title: "Upload Failed",
        description: error.response?.data?.error || error.message || "Upload failed",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const deleteProfileImage = async () => {
    if (!currentUser) return;

    try {
      const { data: result } = await apiClient.delete('/user/profile/image');
      setProfileImageUrl("");
      if (updateUserData) {
        updateUserData(result.user);
      }
      toast({ title: "Success", description: "Profile image deleted!" });
    } catch (error: any) {
      console.error("Error deleting image:", error);
      toast({
        title: "Delete Failed",
        description: error.response?.data?.error || error.message || "Delete failed",
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
