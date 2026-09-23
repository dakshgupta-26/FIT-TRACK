import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/services/api';

// Settings Components
import { SettingsTabId } from '@/components/settings/types';
import { SETTINGS_TABS } from '@/components/settings/settingsData';
import { SettingsHeader } from '@/components/settings/SettingsHeader';
import { SettingsNavigation } from '@/components/settings/SettingsNavigation';
import { SettingsSearch } from '@/components/settings/SettingsSearch';
import { SettingsSaveBar } from '@/components/settings/SettingsSaveBar';

// Settings Panels
import { GeneralPanel } from '@/components/settings/panels/GeneralPanel';
import { AccountPanel } from '@/components/settings/panels/AccountPanel';
import { HealthGoalsPanel } from '@/components/settings/panels/HealthGoalsPanel';
import { AiCoachPanel } from '@/components/settings/panels/AiCoachPanel';
import { DevicesPanel } from '@/components/settings/panels/DevicesPanel';
import { SecurityPanel } from '@/components/settings/panels/SecurityPanel';
import { NotificationsPanel } from '@/components/settings/panels/NotificationsPanel';
import { BillingPanel } from '@/components/settings/panels/BillingPanel';
import { PrivacyPanel } from '@/components/settings/panels/PrivacyPanel';

export const Settings: React.FC = () => {
  const { toast } = useToast();
  const { currentUser, updateUserData } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const { section } = useParams<{ section?: string }>();
  const navigate = useNavigate();

  // Active Category synced with route param /settings/:section or query param ?tab=...
  const tabParam = (section || searchParams.get('tab')) as SettingsTabId | null;
  const initialTab: SettingsTabId =
    tabParam && SETTINGS_TABS.some((t) => t.id === tabParam) ? tabParam : 'general';

  const [activeCategory, setActiveCategory] = useState<SettingsTabId>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Sync state if URL route or search param changes (e.g. browser back/forward)
  useEffect(() => {
    if (tabParam && SETTINGS_TABS.some((t) => t.id === tabParam)) {
      setActiveCategory(tabParam);
    }
  }, [tabParam]);

  const handleSelectTab = useCallback(
    (tabId: SettingsTabId) => {
      setActiveCategory(tabId);
      if (section) {
        navigate(`/settings/${tabId}`, { replace: true });
      } else {
        setSearchParams({ tab: tabId }, { replace: true });
      }
    },
    [section, navigate, setSearchParams]
  );

  // Track Unsaved Changes
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const markDirty = () => setIsDirty(true);

  // --- STATE FOR ALL CONFIGURATION DOMAINS ---
  const [general, setGeneral] = useState({
    language: 'en',
    timezone: 'UTC+5:30 (India)',
    units: 'metric' as const,
    dateFormat: 'YYYY-MM-DD',
    autoSave: true,
    cloudBackup: true,
    offlineMode: false,
  });

  const [account, setAccount] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    phone: '',
    emergencyContact: '',
  });

  const [healthGoals, setHealthGoals] = useState({
    targetWeight: '',
    dailyCalories: '2200',
    dailyWater: '3.0',
    sleepGoal: '8.0',
    workoutDays: '4',
    heartRateAlert: '165',
    hydrationAlerts: true,
    recoveryTracking: true,
  });

  const [aiCoach, setAiCoach] = useState({
    personality: 'athlete' as const,
    conversationStyle: 'concise' as const,
    aiCreativity: 0.7,
    voiceEnabled: true,
    mealPlanning: true,
    workoutSuggestions: true,
    recoveryInsights: true,
    predictiveAlerts: true,
    weeklySummary: true,
  });

  const [devices, setDevices] = useState([
    { id: 'apple', name: 'Apple Watch Ultra 2', type: 'Smartwatch', battery: 84, sync: '2 mins ago', connected: true, pulse: '62 bpm' },
    { id: 'whoop', name: 'WHOOP 4.0 Strap', type: 'Recovery Band', battery: 62, sync: '5 mins ago', connected: true, pulse: '58 bpm' },
    { id: 'oura', name: 'Oura Ring Gen 3', type: 'Smart Ring', battery: 91, sync: '12 mins ago', connected: true, pulse: '60 bpm' },
    { id: 'garmin', name: 'Garmin Forerunner 965', type: 'GPS Watch', battery: 78, sync: '1 hour ago', connected: true, pulse: '64 bpm' },
    { id: 'scale', name: 'Withings Body Scale', type: 'Smart Scale', battery: 95, sync: 'Today', connected: true, pulse: 'N/A' },
    { id: 'samsung', name: 'Samsung Galaxy Watch 6', type: 'Smartwatch', battery: 0, sync: 'Disconnected', connected: false, pulse: 'N/A' },
  ]);

  const [security, setSecurity] = useState({
    twoFactor: true,
    faceUnlock: true,
    biometric: true,
    loginAlerts: true,
  });

  const [notifications, setNotifications] = useState({
    workoutReminders: true,
    mealReminders: true,
    sleepReminder: true,
    hydrationReminder: true,
    goalCompletion: true,
    weeklyReports: true,
    push: true,
    email: true,
    sms: false,
  });

  const [privacy, setPrivacy] = useState({
    medicalDataSharing: true,
    hipaaCompliant: true,
    gdprCompliant: true,
    analyticsPermission: false,
  });

  // Sync current user into account & health states
  useEffect(() => {
    if (currentUser) {
      setAccount((prev) => ({
        ...prev,
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        email: currentUser.email || '',
        username: currentUser.email?.split('@')[0] || '',
      }));
      if (currentUser.weight) {
        setHealthGoals((prev) => ({
          ...prev,
          targetWeight: currentUser.weight || '',
        }));
      }
    }
  }, [currentUser]);

  // Global keyboard shortcut for ⌘K / Ctrl+K search modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Save changes handler
  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (currentUser) {
        const response = await api.put('/user/profile', {
          firstName: account.firstName,
          lastName: account.lastName,
          height: currentUser.height || '',
          weight: healthGoals.targetWeight || currentUser.weight || '',
        });
        if (response.data) {
          updateUserData(response.data);
        }
      }
      setIsDirty(false);
      toast({
        title: 'Settings Synced',
        description: 'All system configurations updated and encrypted.',
      });
    } catch (err: any) {
      toast({
        title: 'Save Failed',
        description: err.response?.data?.message || err.message || 'Error updating settings',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscard = () => {
    setIsDirty(false);
    toast({
      title: 'Changes Discarded',
      description: 'Reverted unsaved modifications.',
    });
  };

  const toggleDevice = (id: string) => {
    setDevices((prev) =>
      prev.map((d) => (d.id === id ? { ...d, connected: !d.connected } : d))
    );
    markDirty();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-teal-500 selection:text-slate-950 pb-36">
      {/* Subtle Ambient Mesh Glow (Non-distracting, dark & refined) */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full bg-teal-500/5 blur-[120px]" />
        <div className="absolute top-1/2 left-1/3 w-[450px] h-[450px] rounded-full bg-emerald-500/5 blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:32px_32px] opacity-10" />
      </div>

      {/* Main Settings Workspace Container */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-6">
        {/* 1. Modern Lightweight Header */}
        <SettingsHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenSearchModal={() => setIsSearchOpen(true)}
          isDirty={isDirty}
          isSaving={isSaving}
          onSave={handleSave}
          onDiscard={handleDiscard}
          activeCount={devices.filter((d) => d.connected).length}
        />

        {/* 2. Contextual Horizontal Navigation (Desktop/Tablet) + Dropdown (Mobile) */}
        <SettingsNavigation
          activeTab={activeCategory}
          onSelectTab={handleSelectTab}
        />

        {/* 3. Settings Configuration Panel Content (Full Width Workspace) */}
        <main
          id={`panel-${activeCategory}`}
          role="tabpanel"
          aria-labelledby={`tab-${activeCategory}`}
          tabIndex={0}
          className="focus:outline-none"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
            >
              {activeCategory === 'general' && (
                <GeneralPanel
                  settings={general}
                  onChange={(updated) => {
                    setGeneral((prev) => ({ ...prev, ...updated }));
                    markDirty();
                  }}
                />
              )}

              {activeCategory === 'account' && (
                <AccountPanel
                  settings={account}
                  onChange={(updated) => {
                    setAccount((prev) => ({ ...prev, ...updated }));
                    markDirty();
                  }}
                />
              )}

              {activeCategory === 'health' && (
                <HealthGoalsPanel
                  settings={healthGoals}
                  onChange={(updated) => {
                    setHealthGoals((prev) => ({ ...prev, ...updated }));
                    markDirty();
                  }}
                />
              )}

              {activeCategory === 'aicoach' && (
                <AiCoachPanel
                  settings={aiCoach}
                  onChange={(updated) => {
                    setAiCoach((prev) => ({ ...prev, ...updated }));
                    markDirty();
                  }}
                />
              )}

              {activeCategory === 'devices' && (
                <DevicesPanel
                  devices={devices}
                  onToggleDevice={toggleDevice}
                />
              )}

              {activeCategory === 'security' && (
                <SecurityPanel
                  settings={security}
                  onChange={(updated) => {
                    setSecurity((prev) => ({ ...prev, ...updated }));
                    markDirty();
                  }}
                />
              )}

              {activeCategory === 'notifications' && (
                <NotificationsPanel
                  settings={notifications}
                  onChange={(updated) => {
                    setNotifications((prev) => ({ ...prev, ...updated }));
                    markDirty();
                  }}
                />
              )}

              {activeCategory === 'billing' && <BillingPanel />}

              {activeCategory === 'privacy' && (
                <PrivacyPanel
                  settings={privacy}
                  onChange={(updated) => {
                    setPrivacy((prev) => ({ ...prev, ...updated }));
                    markDirty();
                  }}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Floating Bottom Unsaved Changes Bar */}
      <SettingsSaveBar
        isDirty={isDirty}
        isSaving={isSaving}
        onSave={handleSave}
        onDiscard={handleDiscard}
      />

      {/* In-Page Settings Search Command Modal */}
      <SettingsSearch
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        initialQuery={searchQuery}
        onSelectResult={(tabId) => {
          handleSelectTab(tabId);
          setSearchQuery('');
        }}
      />
    </div>
  );
};

export default Settings;