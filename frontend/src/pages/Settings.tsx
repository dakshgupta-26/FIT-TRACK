import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuth } from '@/contexts/AuthContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Settings as SettingsIcon, Bell, Shield, Palette, Music, Database, Trash2, Download, Lock, Eye, EyeOff 
} from 'lucide-react';

const Settings = () => {
  const { toast } = useToast();
  const { currentUser, userData } = useAuth(); // userData contains saved settings

  // --- STATE MANAGEMENT FOR ALL TABS ---
  
  // General State
  const [language, setLanguage] = useState('en');
  const [timezone, setTimezone] = useState('utc');
  const [autoSave, setAutoSave] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(true);

  // Security State (Password)
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Notifications State
  const [notifications, setNotifications] = useState({
    push: true,
    workoutReminders: true,
    mealReminders: true,
    waterReminders: true,
    achievements: true,
  });

  // Appearance State
  const [theme, setTheme] = useState('auto');
  const [accentColor, setAccentColor] = useState('blue');

  // Load user's saved settings from userData when the component mounts
  useEffect(() => {
    if (userData) {
      setLanguage(userData.language || 'en');
      setTimezone(userData.timezone || 'utc');
      setAutoSave(userData.autoSave !== undefined ? userData.autoSave : true);
      setWeeklyReports(userData.weeklyReports !== undefined ? userData.weeklyReports : true);
      
      if (userData.notifications) {
        setNotifications(prev => ({ ...prev, ...userData.notifications }));
      }

      setTheme(userData.theme || 'auto');
      setAccentColor(userData.accentColor || 'blue');
    }
  }, [userData]);


  // --- HANDLER FUNCTIONS ---

  // Generic function to save any settings object to the backend
  const handleSaveSettings = async (settingsToSave: object, toastTitle: string) => {
    if (!currentUser) {
      toast({ title: "Error", description: "You must be logged in.", variant: "destructive" });
      return;
    }
    try {
      const response = await fetch('http://localhost:5000/api/update-user-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: currentUser.uid, settings: settingsToSave }),
      });
      if (!response.ok) throw new Error("Failed to save settings.");
      
      toast({ title: toastTitle, description: "Your preferences have been updated." });
    } catch (error) {
      toast({ title: "Save Failed", description: "Could not save settings. Please try again.", variant: "destructive" });
    }
  };
  
  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({ title: "Missing Fields", variant: "destructive" }); return;
    }
    if (newPassword !== confirmPassword) {
      toast({ title: "Passwords do not match", variant: "destructive" }); return;
    }
    setIsChangingPassword(true);
    try {
      const { updatePassword, reauthenticateWithCredential, EmailAuthProvider } = await import('firebase/auth');
      if (!currentUser?.email) throw new Error("User not logged in.");
      
      const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
      await reauthenticateWithCredential(currentUser, credential);
      await updatePassword(currentUser, newPassword);

      setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
      toast({ title: "Password Updated Successfully" });
    } catch (error) {
      toast({ title: "Password Change Failed", description: "Your current password may be incorrect.", variant: "destructive" });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleExportData = () => toast({ title: "Data Export Started" });
  const handleDeleteAccount = () => toast({ title: "Account Deletion", description: "Please contact support.", variant: "destructive" });

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account, preferences, and integrations.</p>
      </div>
      
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="data">Data & Privacy</TabsTrigger>
        </TabsList>
        
        {/* --- GENERAL TAB --- */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><SettingsIcon />General Settings</CardTitle>
              <CardDescription>Configure your basic app preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="en">English</SelectItem><SelectItem value="es">Spanish</SelectItem></SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={timezone} onValueChange={setTimezone}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="utc">UTC</SelectItem><SelectItem value="est">Eastern Time (EST)</SelectItem></SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <Label htmlFor="auto-save" className="font-medium">Auto-save data</Label>
                <Switch id="auto-save" checked={autoSave} onCheckedChange={setAutoSave} />
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <Label htmlFor="weekly-reports" className="font-medium">Weekly Reports</Label>
                <Switch id="weekly-reports" checked={weeklyReports} onCheckedChange={setWeeklyReports} />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleSaveSettings({ language, timezone, autoSave, weeklyReports }, "General Settings Saved")}>Save General Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* --- SECURITY TAB --- */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Shield />Security</CardTitle>
              <CardDescription>Manage your account security and password.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Change Password</h3>
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <div className="relative"><Input id="current-password" type={showPassword ? "text" : "password"} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} /><Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1 h-8 w-8" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff /> : <Eye />}</Button></div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <div className="relative"><Input id="new-password" type={showNewPassword ? "text" : "password"} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} /><Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1 h-8 w-8" onClick={() => setShowNewPassword(!showNewPassword)}>{showNewPassword ? <EyeOff /> : <Eye />}</Button></div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <div className="relative"><Input id="confirm-password" type={showConfirmPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} /><Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1 h-8 w-8" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>{showConfirmPassword ? <EyeOff /> : <Eye />}</Button></div>
                  </div>
                </div>
                <Separator />
                <div>
                    <h3 className="text-lg font-semibold">Two-Factor Authentication (2FA)</h3>
                    <p className="text-sm text-muted-foreground mt-1 mb-3">Add an extra layer of security to your account.</p>
                    <Button variant="outline" disabled>Enable 2FA</Button>
                </div>
            </CardContent>
            <CardFooter>
                <Button onClick={handlePasswordChange} disabled={isChangingPassword}>{isChangingPassword ? "Updating..." : "Update Password"}</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* --- NOTIFICATIONS TAB --- */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Bell />Notifications</CardTitle>
              <CardDescription>Control how you receive notifications.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <Label>Push Notifications</Label>
                <Switch checked={notifications.push} onCheckedChange={(checked) => setNotifications(prev => ({...prev, push: checked}))} />
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <Label>Workout Reminders</Label>
                <Switch checked={notifications.workoutReminders} onCheckedChange={(checked) => setNotifications(prev => ({...prev, workoutReminders: checked}))} />
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <Label>Meal Reminders</Label>
                <Switch checked={notifications.mealReminders} onCheckedChange={(checked) => setNotifications(prev => ({...prev, mealReminders: checked}))} />
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <Label>Achievement Milestones</Label>
                <Switch checked={notifications.achievements} onCheckedChange={(checked) => setNotifications(prev => ({...prev, achievements: checked}))} />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleSaveSettings({ notifications }, "Notification Settings Saved")}>Save Notifications</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* --- APPEARANCE TAB --- */}
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Palette />Appearance</CardTitle>
              <CardDescription>Customize the look and feel of the app.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label>Theme</Label>
                    <Select value={theme} onValueChange={setTheme}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="light">Light</SelectItem>
                            <SelectItem value="dark">Dark</SelectItem>
                            <SelectItem value="auto">System</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label>Accent Color</Label>
                    <div className="flex gap-2">
                        {['blue', 'green', 'purple', 'orange', 'pink'].map(color => (
                            <button key={color} onClick={() => setAccentColor(color)} className={`w-8 h-8 rounded-full bg-${color}-500 border-2 ${accentColor === color ? 'border-primary' : 'border-transparent'}`}></button>
                        ))}
                    </div>
                </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleSaveSettings({ theme, accentColor }, "Appearance Settings Saved")}>Save Appearance</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* --- INTEGRATIONS TAB --- */}
        <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Music />Integrations</CardTitle>
              <CardDescription>Connect external services.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Integrations with services like Spotify are coming soon!</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* --- DATA & PRIVACY TAB --- */}
        <TabsContent value="data">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Database />Data & Privacy</CardTitle>
              <CardDescription>Manage your personal data.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                  <h4 className="font-medium mb-2">Export Your Data</h4>
                  <Button onClick={handleExportData} variant="outline"><Download className="h-4 w-4 mr-2" />Export Data</Button>
              </div>
              <Separator />
              <div className="p-4 border border-destructive/50 rounded-lg">
                  <h4 className="font-medium text-destructive">Danger Zone</h4>
                  <p className="text-sm text-muted-foreground mt-1 mb-3">Permanently delete your account and all associated data. This action cannot be undone.</p>
                  <Button onClick={handleDeleteAccount} variant="destructive"><Trash2 className="h-4 w-4 mr-2" />Delete Account</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;