// src/pages/Profile.tsx

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { useProfileImageMongo } from '@/hooks/useProfileImageMongo';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import api from '@/services/api'; // Import the centralized API service
import {
  Camera,
  CalendarIcon,
  Save,
  X,
  Trash2
} from 'lucide-react';

const Profile = () => {
  const { toast } = useToast();
  // Destructure currentUser and the new updateUserData function from the context
  const { currentUser, updateUserData } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    isUploading,
    profileImageUrl,
    uploadProfileImage,
    deleteProfileImage,
    loadUserProfileImage
  } = useProfileImageMongo();

  // State for form fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthDate, setBirthDate] = useState<Date | undefined>();
  const [gender, setGender] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  useEffect(() => {
    if (currentUser) {
      loadUserProfileImage();
    }
  }, [currentUser, loadUserProfileImage]);

  // Simplified useEffect to populate form from the single source of truth: currentUser
  useEffect(() => {
    if (currentUser) {
      setFirstName(currentUser.firstName || '');
      setLastName(currentUser.lastName || '');
      // Ensure we handle the date string correctly to avoid timezone issues
      if (currentUser.birthDate) setBirthDate(new Date(currentUser.birthDate));
      else setBirthDate(undefined);
      setGender(currentUser.gender || "");
      setHeight(currentUser.height || "");
      setWeight(currentUser.weight || "");
    }
  }, [currentUser]);

  const getUserInitials = () => {
    if (firstName && lastName) return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    if (currentUser?.firstName) return `${currentUser.firstName.charAt(0)}${currentUser.lastName ? currentUser.lastName.charAt(0) : ''}`.toUpperCase();
    return currentUser?.email?.charAt(0).toUpperCase() || 'U';
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast({ title: "Invalid File Type", variant: "destructive", description: "Please select an image file." });
      return;
    }
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast({ title: "File Too Large", description: "Profile pictures must be smaller than 5MB.", variant: "destructive" });
      return;
    }
    await uploadProfileImage(file);
  };

  // Implemented save profile functionality using the centralized api service
  const handleSaveProfile = async () => {
    if (!currentUser) return;
    setIsSavingProfile(true);

    const profileData = {
      firstName,
      lastName,
      // Format date to YYYY-MM-DD to avoid timezone issues on the backend
      birthDate: birthDate ? birthDate.toISOString().split('T')[0] : null,
      gender: gender || null,
      height: height || null,
      weight: weight || null,
    };

    try {
      // Use the api instance and a RESTful endpoint (e.g., PUT to update the user profile)
      // Your backend should handle this endpoint and return the updated user document.
      const response = await api.put('/user/profile', profileData);

      // Update the user data in the AuthContext and localStorage
      updateUserData(response.data);

      toast({ title: "✅ Profile Updated", description: "Your information has been saved successfully." });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "An unknown error occurred.";
      toast({ title: "❌ Save Failed", description: errorMessage, variant: "destructive" });
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Added a function to reset form changes
  const handleCancel = () => {
    if (currentUser) {
      setFirstName(currentUser.firstName || '');
      setLastName(currentUser.lastName || '');
      if (currentUser.birthDate) setBirthDate(new Date(currentUser.birthDate));
      else setBirthDate(undefined);
      setGender(currentUser.gender || "");
      setHeight(currentUser.height || "");
      setWeight(currentUser.weight || "");
    }
    toast({ title: "Changes Discarded" });
  };


  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8 flex items-center justify-center">
      <Card className="w-full max-w-4xl shadow-lg border-border/50 bg-card/95">
        <CardHeader className="border-b border-border/50 p-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative group">
              <Avatar className="h-24 w-24 ring-4 ring-primary/20">
                <AvatarImage src={profileImageUrl || ""} className="object-cover" />
                <AvatarFallback className="bg-primary text-primary-foreground text-3xl font-bold">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              <Button size="icon" variant="outline" className="absolute bottom-0 right-0 rounded-full h-8 w-8 bg-background group-hover:bg-muted" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
                <Camera className="h-4 w-4" />
              </Button>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </div>
            <div className="text-center sm:text-left">
              <CardTitle className="text-2xl">Personal Information</CardTitle>
              <CardDescription className="mt-1">Update your personal details and profile information.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2"><Label htmlFor="first-name">First Name</Label><Input id="first-name" placeholder="John" value={firstName} onChange={e => setFirstName(e.target.value)} /></div>
            <div className="space-y-2"><Label htmlFor="last-name">Last Name</Label><Input id="last-name" placeholder="Doe" value={lastName} onChange={e => setLastName(e.target.value)} /></div>
          </div>
          <div className="space-y-2"><Label htmlFor="email">Email Address</Label><Input id="email" type="email" value={currentUser?.email || ''} readOnly disabled /></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Birth Date</Label>
              <Popover>
                <PopoverTrigger asChild><Button variant="outline" className={cn("w-full justify-start font-normal", !birthDate && "text-muted-foreground")}><CalendarIcon className="mr-2 h-4 w-4" />{birthDate ? format(birthDate, "PPP") : <span>Pick a date</span>}</Button></PopoverTrigger>
                <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={birthDate} onSelect={setBirthDate} disabled={(date) => date > new Date() || date < new Date("1900-01-01")} initialFocus /></PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label>Gender</Label>
              <Select value={gender} onValueChange={setGender}>
                <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                  <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2"><Label htmlFor="height">Height (cm)</Label><Input id="height" type="number" placeholder="180" value={height} onChange={(e) => setHeight(e.target.value)} /></div>
            <div className="space-y-2"><Label htmlFor="weight">Weight (kg)</Label><Input id="weight" type="number" placeholder="75" value={weight} onChange={(e) => setWeight(e.target.value)} /></div>
          </div>
          {profileImageUrl && (
            <div className="pt-4 border-t"><Button size="sm" variant="destructive" onClick={deleteProfileImage} disabled={isUploading}><Trash2 className="h-4 w-4 mr-2" />Remove Profile Picture</Button></div>
          )}
        </CardContent>
        <CardFooter className="bg-muted/30 border-t p-6 flex justify-end gap-3">
          <Button variant="outline" onClick={handleCancel} disabled={isSavingProfile}><X className="mr-2 h-4 w-4" />Cancel</Button>
          <Button onClick={handleSaveProfile} disabled={isSavingProfile}>
            {isSavingProfile ? <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent mr-2" /> : <Save className="mr-2 h-4 w-4" />}
            Save Changes
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Profile;