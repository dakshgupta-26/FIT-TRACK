import React from 'react';

export type SettingsTabId =
  | 'general'
  | 'account'
  | 'health'
  | 'aicoach'
  | 'devices'
  | 'security'
  | 'notifications'
  | 'billing'
  | 'privacy';

export interface SettingsTabMeta {
  id: SettingsTabId;
  label: string;
  shortLabel: string;
  icon: React.ElementType;
  description: string;
  badge?: string;
  keywords: string[];
}

export interface GeneralSettings {
  language: string;
  timezone: string;
  units: 'metric' | 'imperial';
  dateFormat: string;
  autoSave: boolean;
  cloudBackup: boolean;
  offlineMode: boolean;
}

export interface AccountSettings {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  emergencyContact: string;
}

export interface HealthGoalsSettings {
  targetWeight: string;
  dailyCalories: string;
  dailyWater: string;
  sleepGoal: string;
  workoutDays: string;
  heartRateAlert: string;
  hydrationAlerts: boolean;
  recoveryTracking: boolean;
}

export interface AiCoachSettings {
  personality: 'athlete' | 'friendly' | 'doctor' | 'strict';
  conversationStyle: 'concise' | 'analytical' | 'verbose';
  aiCreativity: number;
  voiceEnabled: boolean;
  mealPlanning: boolean;
  workoutSuggestions: boolean;
  recoveryInsights: boolean;
  predictiveAlerts: boolean;
  weeklySummary: boolean;
}

export interface DeviceItem {
  id: string;
  name: string;
  type: string;
  battery: number;
  sync: string;
  connected: boolean;
  pulse: string;
}

export interface SecuritySettings {
  twoFactor: boolean;
  faceUnlock: boolean;
  biometric: boolean;
  loginAlerts: boolean;
}

export interface NotificationSettings {
  workoutReminders: boolean;
  mealReminders: boolean;
  sleepReminder: boolean;
  hydrationReminder: boolean;
  goalCompletion: boolean;
  weeklyReports: boolean;
  push: boolean;
  email: boolean;
  sms: boolean;
}

export interface PrivacySettings {
  medicalDataSharing: boolean;
  hipaaCompliant: boolean;
  gdprCompliant: boolean;
  analyticsPermission: boolean;
}

export interface SearchableSettingItem {
  id: string;
  tabId: SettingsTabId;
  title: string;
  description: string;
  keywords: string[];
  tabLabel: string;
}
