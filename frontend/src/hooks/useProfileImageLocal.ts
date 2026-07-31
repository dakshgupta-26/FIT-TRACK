import { useState, useEffect, useCallback } from 'react';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { storage, db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

export const useProfileImageLocal = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState<string>('');
  const { currentUser } = useAuth();
  const { toast } = useToast();

  // Load user's profile image from Firestore
  const loadUserProfileImage = useCallback(async () => {
    if (!currentUser) return;

    try {
      const userDocRef = doc(db, 'Data', currentUser.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.profileImageUrl) {
          setProfileImageUrl(userData.profileImageUrl);
        }
      }
    } catch (error) {
      console.error('Error loading profile image:', error);
    }
  }, [currentUser]);

  // Upload profile image to Firebase Storage
  const uploadProfileImage = async (file: File) => {
    if (!currentUser) {
      toast({
        title: "Error",
        description: "You must be logged in to upload images.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid File Type",
          description: "Please select an image file (PNG, JPG, JPEG, etc.)",
          variant: "destructive",
        });
        return;
      }

      // Validate file size (max 5MB for Firebase Storage)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please select an image smaller than 5MB",
          variant: "destructive",
        });
        return;
      }

      // Create a unique filename
      const timestamp = Date.now();
      const fileName = `profile-images/${currentUser.uid}/${timestamp}-${file.name}`;
      
      // Create a reference to the file in Firebase Storage
      const imageRef = ref(storage, fileName);
      
      // Upload the file
      await uploadBytes(imageRef, file);
      
      // Get the download URL
      const downloadURL = await getDownloadURL(imageRef);
      
      // Update user profile in Firestore
      const userDocRef = doc(db, 'Data', currentUser.uid);
      await updateDoc(userDocRef, {
        profileImageUrl: downloadURL,
        updatedAt: new Date()
      });
      
      setProfileImageUrl(downloadURL);
      
      toast({
        title: "Success",
        description: "Profile image uploaded successfully!",
        duration: 3000,
      });
      
      return downloadURL;
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload image. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  // Delete profile image
  const deleteProfileImage = async () => {
    if (!currentUser) return;

    try {
      // Get current user data
      const userDocRef = doc(db, 'Data', currentUser.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const currentImageUrl = userData.profileImageUrl;
        
        if (currentImageUrl) {
          // Extract the file path from the URL
          const imageRef = ref(storage, currentImageUrl);
          await deleteObject(imageRef);
        }
        
        // Remove image URL from user document
        await updateDoc(userDocRef, {
          profileImageUrl: null,
          updatedAt: new Date()
        });
        
        setProfileImageUrl('');
        
        toast({
          title: "Success",
          description: "Profile image deleted successfully!",
          duration: 3000,
        });
      }
    } catch (error: any) {
      console.error('Error deleting image:', error);
      toast({
        title: "Delete Failed",
        description: error.message || "Failed to delete image. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  // Load image on component mount
  useEffect(() => {
    loadUserProfileImage();
  }, [loadUserProfileImage]);

  return {
    isUploading,
    profileImageUrl,
    uploadProfileImage,
    deleteProfileImage,
    loadUserProfileImage,
    setProfileImageUrl
  };
};
