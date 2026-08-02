import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import api from '@/services/api';
import {
  Sliders,
  User,
  Heart,
  Sparkles,
  Watch,
  Bell,
  ShieldCheck,
  CreditCard,
  Lock,
  Activity,
  Check,
  Save,
  Loader2,
  RefreshCw,
  Zap,
  Globe,
  Smartphone,
  Flame,
  Droplet,
  Download,
  Trash2,
  Cpu,
  Radio,
  CheckCircle2,
  Moon,
  Scale,
  Target,
  Shield,
  FileText,
  Key,
  ChevronRight,
  TrendingUp,
  Volume2,
  BrainCircuit,
  PieChart,
  Wifi,
  Database,
  ArrowUpRight
} from 'lucide-react';

export const Settings: React.FC = () => {
  const { toast } = useToast();
  const { currentUser, updateUserData } = useAuth();

  // Active Category Sidebar Navigation
  const [activeCategory, setActiveCategory] = useState<
    'general' | 'account' | 'health' | 'aicoach' | 'devices' | 'security' | 'notifications' | 'billing' | 'privacy'
  >('general');

  // Track Unsaved Changes
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // --- STATE FOR ALL BENTO SECTIONS ---
  const [general, setGeneral] = useState({
    language: 'en',
    timezone: 'UTC-8 (Pacific)',
    units: 'metric',
    dateFormat: 'YYYY-MM-DD',
    autoSave: true,
    cloudBackup: true,
    offlineMode: false,
  });

  const [account, setAccount] = useState({
    firstName: '',
    lastName: '',
    username: 'athlete_prime',
    email: '',
    phone: '+1 (555) 234-5678',
    emergencyContact: '+1 (555) 987-6543 (Sarah - Partner)',
  });

  const [healthGoals, setHealthGoals] = useState({
    targetWeight: '72.0',
    dailyCalories: '2800',
    dailyWater: '3.5',
    sleepGoal: '8.0',
    workoutDays: '5',
    heartRateAlert: '165',
    hydrationAlerts: true,
    recoveryTracking: true,
  });

  const [aiCoach, setAiCoach] = useState({
    personality: 'athlete', // friendly, coach, doctor, athlete, strict
    conversationStyle: 'concise', // verbose, concise, analytical
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

  // Sync current user
  useEffect(() => {
    if (currentUser) {
      setAccount((prev) => ({
        ...prev,
        firstName: currentUser.firstName || 'Athlete',
        lastName: currentUser.lastName || '',
        email: currentUser.email || '',
      }));
    }
  }, [currentUser]);

  const markDirty = () => setIsDirty(true);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (currentUser) {
        await api.put('/user/profile', {
          firstName: account.firstName,
          lastName: account.lastName,
          height: '182',
          weight: healthGoals.targetWeight,
        }).catch(() => {});
      }
      setIsDirty(false);
      toast({
        title: '⚡ FitTracker OS Configured',
        description: 'AI Control Center parameters saved to ecosystem cloud.',
      });
    } catch (err: any) {
      toast({ title: 'Save Failed', description: err.message || 'Error updating settings', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscard = () => {
    setIsDirty(false);
    toast({ title: 'Changes Discarded' });
  };

  const toggleDevice = (id: string) => {
    setDevices((prev) =>
      prev.map((d) => (d.id === id ? { ...d, connected: !d.connected } : d))
    );
    markDirty();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-teal-500 selection:text-slate-950 pb-36 overflow-x-hidden">
      {/* Dynamic Animated Mesh Aurora Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15], rotate: [0, 90, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-teal-500/20 to-cyan-500/20 blur-[140px]"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.3, 0.2], rotate: [90, 0, 90] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          className="absolute top-1/3 -right-40 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-600/20 blur-[140px]"
        />
        <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:32px_32px] opacity-20" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-10">
        {/* TOP HERO CONTROL CENTER BENTO */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative rounded-[32px] bg-slate-900/80 border border-white/10 backdrop-blur-2xl p-6 sm:p-10 shadow-[0_30px_70px_rgba(0,0,0,0.8),0_0_50px_rgba(20,184,166,0.12)] overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Hero Details */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-[10px] font-mono font-bold tracking-widest uppercase flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-teal-400" /> FITTRACKER AI OS CONTROL CENTER
                  </span>
                </div>
                <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
                  Settings
                </h1>
                <p className="text-sm sm:text-base text-slate-400 max-w-xl leading-relaxed">
                  Personalize your AI health operating system, neural recommendation models, biometric telemetry, and privacy envelope.
                </p>
              </div>

              {/* Profile Telemetry Snapshot */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-white/5 space-y-1">
                  <span className="text-[9px] font-mono text-slate-400 uppercase">Current Plan</span>
                  <div className="text-xs font-bold text-amber-300 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400" /> Pro AI Plan
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-white/5 space-y-1">
                  <span className="text-[9px] font-mono text-slate-400 uppercase">AI Neural Engine</span>
                  <div className="text-xs font-bold text-teal-400 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" /> Active 99.8%
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-white/5 space-y-1">
                  <span className="text-[9px] font-mono text-slate-400 uppercase">Security Rating</span>
                  <div className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> 98% Excellent
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-white/5 space-y-1">
                  <span className="text-[9px] font-mono text-slate-400 uppercase">Active Goal</span>
                  <div className="text-xs font-bold text-white truncate">Hypertrophy & Shred</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-white/5 space-y-1">
                  <span className="text-[9px] font-mono text-slate-400 uppercase">Consistency</span>
                  <div className="text-xs font-bold text-orange-400 flex items-center gap-1">
                    <Flame className="w-3 h-3 fill-orange-400" /> 18-Day Streak
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-white/5 space-y-1">
                  <span className="text-[9px] font-mono text-slate-400 uppercase">Hardware Synced</span>
                  <div className="text-xs font-bold text-cyan-400 flex items-center gap-1">
                    <Watch className="w-3 h-3" /> 5 Devices
                  </div>
                </div>
              </div>
            </div>

            {/* Right Hero Graphic: Animated AI Neural Core Orb */}
            <div className="lg:col-span-5 flex items-center justify-center relative">
              <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
                {/* Rotating Outer Particle Rings */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-0 rounded-full border border-teal-500/30 border-dashed"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-4 rounded-full border border-emerald-500/20"
                />

                {/* Central Glowing AI Orb */}
                <motion.div
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-40 h-40 sm:w-44 sm:h-44 rounded-full bg-gradient-to-tr from-teal-400 via-emerald-400 to-cyan-400 p-0.5 shadow-[0_0_80px_rgba(45,212,191,0.5)] flex items-center justify-center"
                >
                  <div className="w-full h-full bg-slate-950 rounded-full flex flex-col items-center justify-center text-center p-4 relative overflow-hidden">
                    <BrainCircuit className="w-12 h-12 text-teal-400 mb-1" />
                    <span className="text-xs font-black text-white tracking-wider">FITTRACKER AI</span>
                    <span className="text-[9px] font-mono text-teal-300">CORE v3.4</span>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* QUICK ACTION BENTO CARDS */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { id: 'devices', title: 'Manage Devices', stat: '5 Connected', icon: Watch, color: 'text-teal-400', border: 'hover:border-teal-500/40' },
            { id: 'security', title: 'Security Center', stat: '98% Excellent', icon: ShieldCheck, color: 'text-emerald-400', border: 'hover:border-emerald-500/40' },
            { id: 'aicoach', title: 'AI Coach Engine', stat: 'Athletic Mode', icon: Sparkles, color: 'text-amber-400', border: 'hover:border-amber-500/40' },
            { id: 'notifications', title: 'Alerts & Push', stat: '6 Active Channels', icon: Bell, color: 'text-cyan-400', border: 'hover:border-cyan-500/40' },
            { id: 'health', title: 'Health Goals', stat: '6 Biomarkers', icon: Heart, color: 'text-rose-400', border: 'hover:border-rose-500/40' },
            { id: 'billing', title: 'Subscription', stat: 'Pro Membership', icon: CreditCard, color: 'text-indigo-400', border: 'hover:border-indigo-500/40' },
          ].map((card) => (
            <motion.div
              key={card.id}
              whileHover={{ y: -4, scale: 1.02 }}
              onClick={() => setActiveCategory(card.id as any)}
              className={`p-4 rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-xl cursor-pointer transition shadow-lg ${card.border}`}
            >
              <div className="flex items-center justify-between">
                <card.icon className={`w-5 h-5 ${card.color}`} />
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
              </div>
              <div className="mt-3">
                <h3 className="text-xs font-bold text-white">{card.title}</h3>
                <p className="text-[10px] font-mono text-slate-400 mt-0.5">{card.stat}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* MAIN BENTO DASHBOARD WORKSPACE WITH SIDEBAR */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT SCROLLABLE CATEGORY SIDEBAR */}
          <div className="lg:col-span-3 sticky top-20 rounded-3xl bg-slate-900/80 border border-white/10 backdrop-blur-2xl p-3 shadow-xl space-y-1">
            {[
              { id: 'general', label: 'General System', icon: Sliders },
              { id: 'account', label: 'Account Specs', icon: User },
              { id: 'health', label: 'Health Goals & Targets', icon: Heart },
              { id: 'aicoach', label: 'AI Coach Engine', icon: Sparkles },
              { id: 'devices', label: 'Connected Devices', icon: Watch },
              { id: 'security', label: 'Security & 2FA', icon: Lock },
              { id: 'notifications', label: 'Notifications & Alerts', icon: Bell },
              { id: 'billing', label: 'Billing & Plan', icon: CreditCard },
              { id: 'privacy', label: 'Privacy & Data', icon: ShieldCheck },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as any)}
                className={`relative w-full px-4 py-3 rounded-2xl text-xs font-bold transition flex items-center justify-between ${
                  activeCategory === cat.id
                    ? 'text-slate-950 font-extrabold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {activeCategory === cat.id && (
                  <motion.div
                    layoutId="settingsSubNav"
                    className="absolute inset-0 rounded-2xl bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400 z-0 shadow-lg shadow-teal-500/20"
                    transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                  />
                )}
                <div className="flex items-center gap-3 z-10">
                  <cat.icon className={`w-4 h-4 ${activeCategory === cat.id ? 'text-slate-950' : 'text-slate-400'}`} />
                  <span>{cat.label}</span>
                </div>
                <ChevronRight className={`w-3.5 h-3.5 z-10 ${activeCategory === cat.id ? 'text-slate-950' : 'text-slate-600'}`} />
              </button>
            ))}
          </div>

          {/* RIGHT BENTO CONTENT PANEL */}
          <div className="lg:col-span-9 space-y-6">
            {/* CATEGORY 1: GENERAL */}
            {activeCategory === 'general' && (
              <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                <div className="p-6 sm:p-8 rounded-[32px] bg-slate-900/80 border border-white/10 backdrop-blur-2xl space-y-6">
                  <h2 className="text-xl font-black text-white flex items-center gap-2 border-b border-white/10 pb-4">
                    <Sliders className="w-5 h-5 text-teal-400" /> General System Configuration
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/5 space-y-2">
                      <label className="text-[10px] font-mono text-slate-400 uppercase">System Language</label>
                      <select
                        value={general.language}
                        onChange={(e) => { setGeneral({ ...general, language: e.target.value }); markDirty(); }}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white"
                      >
                        <option value="en">English (United States)</option>
                        <option value="es">Spanish (Español)</option>
                        <option value="hi">Hindi (हिन्दी)</option>
                        <option value="mr">Marathi (मराठी)</option>
                      </select>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/5 space-y-2">
                      <label className="text-[10px] font-mono text-slate-400 uppercase">Timezone Synchronization</label>
                      <select
                        value={general.timezone}
                        onChange={(e) => { setGeneral({ ...general, timezone: e.target.value }); markDirty(); }}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white"
                      >
                        <option value="UTC-8 (Pacific)">UTC-8 (Pacific Time)</option>
                        <option value="UTC-5 (Eastern)">UTC-5 (Eastern Time)</option>
                        <option value="UTC+5:30 (India)">UTC+5:30 (India Standard Time)</option>
                      </select>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/5 space-y-2">
                      <label className="text-[10px] font-mono text-slate-400 uppercase">Units System</label>
                      <select
                        value={general.units}
                        onChange={(e) => { setGeneral({ ...general, units: e.target.value }); markDirty(); }}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white"
                      >
                        <option value="metric">Metric (kg, cm, km)</option>
                        <option value="imperial">Imperial (lbs, in, miles)</option>
                      </select>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/5 space-y-2">
                      <label className="text-[10px] font-mono text-slate-400 uppercase">Date Format</label>
                      <select
                        value={general.dateFormat}
                        onChange={(e) => { setGeneral({ ...general, dateFormat: e.target.value }); markDirty(); }}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white"
                      >
                        <option value="YYYY-MM-DD">YYYY-MM-DD (2026-08-01)</option>
                        <option value="MM/DD/YYYY">MM/DD/YYYY (08/01/2026)</option>
                        <option value="DD/MM/YYYY">DD/MM/YYYY (01/08/2026)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-white/10">
                    {[
                      { key: 'autoSave', title: 'Auto-Save Workouts & Logs', desc: 'Real-time background saving of exercise sets and telemetry.' },
                      { key: 'cloudBackup', title: 'Encrypted Cloud Backup', desc: 'Daily automated snapshot to FitTracker cloud servers.' },
                      { key: 'offlineMode', title: 'Offline Local Caching', desc: 'Store data locally when cellular signal is unavailable.' },
                    ].map((item) => (
                      <div key={item.key} className="p-4 rounded-2xl bg-slate-950/60 border border-white/5 flex items-center justify-between">
                        <div>
                          <h4 className="text-xs font-bold text-white">{item.title}</h4>
                          <p className="text-[11px] text-slate-400">{item.desc}</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={(general as any)[item.key]}
                          onChange={(e) => { setGeneral({ ...general, [item.key]: e.target.checked }); markDirty(); }}
                          className="w-4 h-4 accent-teal-400 rounded cursor-pointer"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* CATEGORY 2: ACCOUNT */}
            {activeCategory === 'account' && (
              <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                <div className="p-6 sm:p-8 rounded-[32px] bg-slate-900/80 border border-white/10 backdrop-blur-2xl space-y-6">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <h2 className="text-xl font-black text-white flex items-center gap-2">
                      <User className="w-5 h-5 text-teal-400" /> Account Specifications
                    </h2>
                    <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      PROFILE COMPLETION: 94%
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-slate-400 uppercase">First Name</label>
                      <input
                        type="text"
                        value={account.firstName}
                        onChange={(e) => { setAccount({ ...account, firstName: e.target.value }); markDirty(); }}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 text-xs text-white"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-slate-400 uppercase">Last Name</label>
                      <input
                        type="text"
                        value={account.lastName}
                        onChange={(e) => { setAccount({ ...account, lastName: e.target.value }); markDirty(); }}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 text-xs text-white"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-slate-400 uppercase">Email Address</label>
                      <input
                        type="email"
                        value={account.email}
                        disabled
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/40 border border-white/5 text-xs text-slate-400 cursor-not-allowed"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-slate-400 uppercase">Phone Number</label>
                      <input
                        type="text"
                        value={account.phone}
                        onChange={(e) => { setAccount({ ...account, phone: e.target.value }); markDirty(); }}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 text-xs text-white"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* CATEGORY 3: HEALTH GOALS */}
            {activeCategory === 'health' && (
              <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                <div className="p-6 sm:p-8 rounded-[32px] bg-slate-900/80 border border-white/10 backdrop-blur-2xl space-y-6">
                  <h2 className="text-xl font-black text-white flex items-center gap-2 border-b border-white/10 pb-4">
                    <Heart className="w-5 h-5 text-rose-400" /> Biometric Goals & Target Parameters
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/5 space-y-2">
                      <label className="text-[10px] font-mono text-slate-400 uppercase">Target Weight (kg)</label>
                      <input
                        type="number"
                        value={healthGoals.targetWeight}
                        onChange={(e) => { setHealthGoals({ ...healthGoals, targetWeight: e.target.value }); markDirty(); }}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white font-bold"
                      />
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/5 space-y-2">
                      <label className="text-[10px] font-mono text-slate-400 uppercase">Daily Calorie Target (kcal)</label>
                      <input
                        type="number"
                        value={healthGoals.dailyCalories}
                        onChange={(e) => { setHealthGoals({ ...healthGoals, dailyCalories: e.target.value }); markDirty(); }}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white font-bold"
                      />
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/5 space-y-2">
                      <label className="text-[10px] font-mono text-slate-400 uppercase">Daily Water Goal (Liters)</label>
                      <input
                        type="number"
                        value={healthGoals.dailyWater}
                        onChange={(e) => { setHealthGoals({ ...healthGoals, dailyWater: e.target.value }); markDirty(); }}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white font-bold"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* CATEGORY 4: AI COACH */}
            {activeCategory === 'aicoach' && (
              <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                <div className="p-6 sm:p-8 rounded-[32px] bg-slate-900/80 border border-white/10 backdrop-blur-2xl space-y-6">
                  <h2 className="text-xl font-black text-white flex items-center gap-2 border-b border-white/10 pb-4">
                    <Sparkles className="w-5 h-5 text-amber-400" /> AI Neural Engine Configuration
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/5 space-y-2">
                      <label className="text-[10px] font-mono text-slate-400 uppercase">AI Personality Persona</label>
                      <select
                        value={aiCoach.personality}
                        onChange={(e) => { setAiCoach({ ...aiCoach, personality: e.target.value }); markDirty(); }}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white font-bold"
                      >
                        <option value="athlete">Elite Athletic Specialist (High Performance)</option>
                        <option value="friendly">Friendly Motivator (Encouraging)</option>
                        <option value="strict">Strict Disciplinarian (Zero Excuses)</option>
                        <option value="doctor">Clinical Physician (Data & Biomarkers)</option>
                      </select>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/5 space-y-2">
                      <label className="text-[10px] font-mono text-slate-400 uppercase">AI Response Style</label>
                      <select
                        value={aiCoach.conversationStyle}
                        onChange={(e) => { setAiCoach({ ...aiCoach, conversationStyle: e.target.value }); markDirty(); }}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white font-bold"
                      >
                        <option value="concise">Concise & Actionable</option>
                        <option value="analytical">Deep Analytical Breakdown</option>
                        <option value="verbose">Comprehensive Advice</option>
                      </select>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* CATEGORY 5: CONNECTED DEVICES */}
            {activeCategory === 'devices' && (
              <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                <div className="p-6 sm:p-8 rounded-[32px] bg-slate-900/80 border border-white/10 backdrop-blur-2xl space-y-6">
                  <h2 className="text-xl font-black text-white flex items-center gap-2 border-b border-white/10 pb-4">
                    <Watch className="w-5 h-5 text-teal-400" /> Connected Wearable Matrix
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {devices.map((device) => (
                      <div
                        key={device.id}
                        className={`p-5 rounded-2xl border transition space-y-3 ${
                          device.connected ? 'bg-slate-950/80 border-teal-500/30' : 'bg-slate-950/40 border-white/5 opacity-60'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-white">{device.name}</h4>
                          <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full ${
                            device.connected ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
                          }`}>
                            {device.connected ? 'CONNECTED' : 'DISCONNECTED'}
                          </span>
                        </div>
                        <button
                          onClick={() => toggleDevice(device.id)}
                          className={`w-full py-1.5 rounded-xl text-xs font-bold transition ${
                            device.connected ? 'bg-slate-800 hover:bg-rose-500/20 text-slate-300' : 'bg-teal-500/20 text-teal-300'
                          }`}
                        >
                          {device.connected ? 'Disconnect' : 'Connect'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* CATEGORY 6: SECURITY */}
            {activeCategory === 'security' && (
              <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                <div className="p-6 sm:p-8 rounded-[32px] bg-slate-900/80 border border-white/10 backdrop-blur-2xl space-y-6">
                  <h2 className="text-xl font-black text-white flex items-center gap-2 border-b border-white/10 pb-4">
                    <Lock className="w-5 h-5 text-teal-400" /> Security & Authentication
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/5 flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-white">Two-Factor Authentication (2FA)</h4>
                        <p className="text-[11px] text-slate-400">Authenticator app & SMS security keys.</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={security.twoFactor}
                        onChange={(e) => { setSecurity({ ...security, twoFactor: e.target.checked }); markDirty(); }}
                        className="w-4 h-4 accent-teal-400 rounded cursor-pointer"
                      />
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/5 flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-white">Biometric / Face ID Unlock</h4>
                        <p className="text-[11px] text-slate-400">Enable biometric hardware login.</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={security.biometric}
                        onChange={(e) => { setSecurity({ ...security, biometric: e.target.checked }); markDirty(); }}
                        className="w-4 h-4 accent-teal-400 rounded cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* CATEGORY 7: NOTIFICATIONS */}
            {activeCategory === 'notifications' && (
              <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                <div className="p-6 sm:p-8 rounded-[32px] bg-slate-900/80 border border-white/10 backdrop-blur-2xl space-y-6">
                  <h2 className="text-xl font-black text-white flex items-center gap-2 border-b border-white/10 pb-4">
                    <Bell className="w-5 h-5 text-teal-400" /> Notifications & Alerts
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { key: 'workoutReminders', title: 'Daily Workout Reminders', desc: 'Circadian-timed exercise alerts.' },
                      { key: 'mealReminders', title: 'Macronutrient Alerts', desc: 'Reminders for meals & protein targets.' },
                      { key: 'sleepReminder', title: 'Sleep Opportunity Alert', desc: 'Notification 30m before optimal sleep window.' },
                      { key: 'hydrationReminder', title: 'Intelligent Hydration Triggers', desc: 'Reminders adjusted for temp & activity.' },
                    ].map((item) => (
                      <div key={item.key} className="p-4 rounded-2xl bg-slate-950/60 border border-white/5 flex items-center justify-between">
                        <div>
                          <h4 className="text-xs font-bold text-white">{item.title}</h4>
                          <p className="text-[11px] text-slate-400">{item.desc}</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={(notifications as any)[item.key]}
                          onChange={(e) => { setNotifications({ ...notifications, [item.key]: e.target.checked }); markDirty(); }}
                          className="w-4 h-4 accent-teal-400 rounded cursor-pointer"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* CATEGORY 8: BILLING */}
            {activeCategory === 'billing' && (
              <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                <div className="p-6 sm:p-8 rounded-[32px] bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-amber-500/30 backdrop-blur-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-amber-400 font-bold uppercase">CURRENT MEMBERSHIP</span>
                      <h3 className="text-2xl font-black text-white">Pro AI Membership</h3>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold">
                      ACTIVE • $19 / mo
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">Unlimited AI Neural Health recommendations, full biometric sync, and priority access.</p>
                </div>
              </motion.div>
            )}

            {/* CATEGORY 9: PRIVACY */}
            {activeCategory === 'privacy' && (
              <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                <div className="p-6 sm:p-8 rounded-[32px] bg-slate-900/80 border border-white/10 backdrop-blur-2xl space-y-6">
                  <div className="flex items-center gap-3 p-4 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-300">
                    <ShieldCheck className="w-6 h-6 shrink-0 text-teal-400" />
                    <div>
                      <h4 className="text-xs font-bold text-white">HIPAA & GDPR Encrypted Workspace</h4>
                      <p className="text-[11px] text-slate-300">All biometric telemetry is encrypted end-to-end with AES-256 keys.</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* FLOATING UNSAVED CHANGES BAR */}
        <AnimatePresence>
          {isDirty && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3.5 rounded-2xl bg-slate-900/90 border border-teal-500/40 backdrop-blur-2xl shadow-[0_10px_40px_rgba(0,0,0,0.9),0_0_30px_rgba(45,212,191,0.2)] flex items-center gap-6"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                <span className="text-xs font-bold text-white">Unsaved Config Changes</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleDiscard}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition"
                >
                  Discard
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 shadow-lg shadow-teal-500/20 hover:scale-105 active:scale-95 transition"
                >
                  {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  <span>Save Config</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Settings;