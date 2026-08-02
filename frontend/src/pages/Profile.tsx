import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { useProfileImageMongo } from '@/hooks/useProfileImageMongo';
import api from '@/services/api';
import {
  Activity,
  User,
  Mail,
  Heart,
  Zap,
  Flame,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Camera,
  Trash2,
  RefreshCw,
  Clock,
  Watch,
  Award,
  Lock,
  Download,
  TrendingUp,
  Save,
  Check,
  Loader2,
  Droplet,
  Moon,
  Scale,
  Target,
  Smartphone,
  ChevronRight,
  X,
  Sliders,
  Brain,
  Cpu,
  BarChart3,
  Calendar,
  Compass,
  ArrowUpRight,
  Shield
} from 'lucide-react';

export const Profile: React.FC = () => {
  const { toast } = useToast();
  const { currentUser, updateUserData } = useAuth();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const {
    isUploading,
    profileImageUrl,
    uploadProfileImage,
    deleteProfileImage,
    loadUserProfileImage
  } = useProfileImageMongo();

  // Profile Drawer Open State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Active Body Hotspot for Section 6
  const [activeBodyPart, setActiveBodyPart] = useState<'heart' | 'muscles' | 'fat' | 'water' | 'brain'>('heart');

  // Editable Profile Form (Drawer)
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    height: '182',
    weight: '75',
    birthDate: '',
    gender: 'Male',
    fitnessGoal: 'Hypertrophy & Shred',
    activityLevel: 'High Activity',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Sync user data
  useEffect(() => {
    if (currentUser) {
      loadUserProfileImage();
      setForm((prev) => ({
        ...prev,
        firstName: currentUser.firstName || 'Athlete',
        lastName: currentUser.lastName || '',
        email: currentUser.email || '',
        birthDate: currentUser.birthDate ? currentUser.birthDate.split('T')[0] : '',
        height: currentUser.height || prev.height,
        weight: currentUser.weight || prev.weight,
      }));
    }
  }, [currentUser, loadUserProfileImage]);

  const getUserInitials = () => {
    if (form.firstName && form.lastName) {
      return `${form.firstName.charAt(0)}${form.lastName.charAt(0)}`.toUpperCase();
    }
    return currentUser?.email?.charAt(0).toUpperCase() || 'FT';
  };

  const handleImageFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({ title: 'Invalid File Type', variant: 'destructive', description: 'Please upload an image file.' });
      return;
    }
    await uploadProfileImage(file);
    toast({ title: 'Hologram Portrait Updated', description: 'Profile avatar synced to FitTracker cloud.' });
  };

  const handleSaveDrawer = async () => {
    setIsSaving(true);
    try {
      if (currentUser) {
        const response = await api.put('/user/profile', {
          firstName: form.firstName,
          lastName: form.lastName,
          height: form.height,
          weight: form.weight,
          birthDate: form.birthDate || null,
        });
        updateUserData(response.data);
      }
      setIsDrawerOpen(false);
      toast({
        title: '⚡ Identity Specs Updated',
        description: 'Personal AI Health parameters saved.',
      });
    } catch (err: any) {
      toast({ title: 'Save Failed', description: err.message || 'Error updating profile', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSyncAll = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      toast({ title: '⚡ Hardware Matrix Synced', description: 'Apple Watch, WHOOP & Oura data pulled.' });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-teal-500 selection:text-slate-950 pb-36 overflow-x-hidden">
      {/* Dynamic Animated Aurora Background & Floating Lights */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div
          animate={{ scale: [1, 1.25, 1], opacity: [0.15, 0.3, 0.15], rotate: [0, 120, 0] }}
          transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full bg-gradient-to-tr from-teal-500/20 via-cyan-500/15 to-emerald-500/20 blur-[150px]"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.35, 0.2], rotate: [120, 0, 120] }}
          transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
          className="absolute top-1/2 -right-40 w-[700px] h-[700px] rounded-full bg-gradient-to-br from-emerald-500/20 via-teal-600/15 to-cyan-400/20 blur-[150px]"
        />
        <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:32px_32px] opacity-25" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-12">
        {/* TOP COMMAND BAR */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-ping" />
            <span className="text-xs font-mono text-slate-300 uppercase tracking-widest">
              PERSONAL AI HEALTH IDENTITY • FITTRACKER OS v3.4
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSyncAll}
              disabled={isSyncing}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-white/10 text-xs font-bold text-teal-300 flex items-center gap-2 transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-teal-400' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync Telemetry'}</span>
            </button>

            <button
              onClick={() => setIsDrawerOpen(true)}
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 shadow-lg shadow-teal-500/20 hover:scale-105 active:scale-95 transition"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Edit Specs</span>
            </button>
          </div>
        </div>

        {/* HERO SECTION: HOLOGRAM IDENTITY & MASSIVE AI HEALTH MATRIX */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative rounded-[36px] bg-slate-900/80 border border-white/10 backdrop-blur-2xl p-6 sm:p-10 shadow-[0_30px_80px_rgba(0,0,0,0.8),0_0_60px_rgba(20,184,166,0.15)] overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* LEFT: Hologram Profile Portrait */}
            <div className="lg:col-span-6 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
              <div
                className="relative group cursor-pointer shrink-0"
                onClick={() => fileInputRef.current?.click()}
              >
                {/* Rotating Neon Hologram Border */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
                  className="absolute -inset-2 rounded-[32px] bg-gradient-to-tr from-teal-400 via-emerald-400 to-cyan-400 opacity-75 blur-sm group-hover:opacity-100 transition"
                />

                <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-[28px] bg-slate-950 border-2 border-slate-900 overflow-hidden flex items-center justify-center shadow-2xl">
                  {profileImageUrl ? (
                    <img src={profileImageUrl} alt="Hologram Portrait" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl font-black text-teal-400 tracking-wider">
                      {getUserInitials()}
                    </span>
                  )}

                  <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center text-teal-300 text-xs font-bold gap-1">
                    <Camera className="w-5 h-5" />
                    <span>Upload Image</span>
                  </div>
                </div>

                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-slate-950 shadow-[0_0_12px_rgba(16,185,129,1)]" />

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleImageFile(f);
                  }}
                />
              </div>

              {/* Bio Details */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                    {form.firstName || 'Daksh'} {form.lastName || 'Gupta'}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-[10px] font-mono font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-teal-400" /> VERIFIED AI ATHLETE
                  </span>
                </div>

                <p className="text-xs font-mono text-slate-400">
                  {form.email || 'user@fittrack.ai'} • Member since Jan 2025
                </p>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                  <span className="px-3 py-1 rounded-xl bg-slate-950/80 border border-white/10 text-xs font-bold text-orange-400 flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 fill-orange-400" /> 18-Day Streak
                  </span>
                  <span className="px-3 py-1 rounded-xl bg-slate-950/80 border border-white/10 text-xs font-bold text-teal-300 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-teal-400 fill-teal-400" /> Level 14 AI Pro
                  </span>
                </div>
              </div>
            </div>

            {/* RIGHT: Massive AI Health Score Matrix */}
            <div className="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-950/90 via-slate-900/90 to-slate-950/90 border border-teal-500/30 shadow-[0_0_40px_rgba(45,212,191,0.15)] flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="relative w-32 h-32 sm:w-36 sm:h-36 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path className="text-slate-800" strokeWidth="3.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className="text-teal-400 stroke-current drop-shadow-[0_0_12px_rgba(45,212,191,0.9)]" strokeDasharray="94, 100" strokeWidth="3.5" strokeLinecap="round" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-3xl sm:text-4xl font-black text-white">94</span>
                  <span className="text-[9px] font-mono text-slate-400 uppercase">/ 100</span>
                </div>
              </div>

              <div className="space-y-3 text-center sm:text-left flex-1">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-teal-400 font-bold">
                    AI Health Operating Index
                  </span>
                  <h3 className="text-xl font-black text-white">OPTIMAL RANGE</h3>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded-xl bg-slate-900 border border-white/5">
                    <span className="text-[9px] text-slate-400 block">Recovery</span>
                    <strong className="text-emerald-400 font-bold">96% Optimal</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900 border border-white/5">
                    <span className="text-[9px] text-slate-400 block">Sleep Architecture</span>
                    <strong className="text-indigo-400 font-bold">94 Score</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900 border border-white/5">
                    <span className="text-[9px] text-slate-400 block">Cardio Strain</span>
                    <strong className="text-cyan-400 font-bold">Superior</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900 border border-white/5">
                    <span className="text-[9px] text-slate-400 block">Stress Level</span>
                    <strong className="text-rose-400 font-bold">Low (14%)</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FLOATING PARALLAX MINI-WIDGETS */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-8 pt-6 border-t border-white/10">
            {[
              { label: 'Resting HR', val: '58 bpm', sub: 'Low stress avg', icon: Heart, color: 'text-rose-400' },
              { label: 'Active Cal', val: '2,840 kcal', sub: '+14% target', icon: Flame, color: 'text-orange-400' },
              { label: 'VO₂ Max', val: '48.5', sub: 'Superior status', icon: Zap, color: 'text-teal-400' },
              { label: 'Hydration', val: '3.2 Liters', sub: 'Target reached', icon: Droplet, color: 'text-cyan-400' },
              { label: 'Recovery', val: '95%', sub: 'PR Attempt Ready', icon: Activity, color: 'text-emerald-400' },
              { label: 'Sleep Score', val: '92 / 100', sub: '7h 45m deep', icon: Moon, color: 'text-indigo-400' },
            ].map((widget) => (
              <motion.div
                key={widget.label}
                whileHover={{ y: -4, scale: 1.02 }}
                className="p-3.5 rounded-2xl bg-slate-950/70 border border-white/5 hover:border-teal-500/30 transition shadow-md flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono text-slate-400 uppercase">{widget.label}</span>
                  <widget.icon className={`w-4 h-4 ${widget.color}`} />
                </div>
                <div className="mt-2">
                  <span className="text-base font-black text-white">{widget.val}</span>
                  <p className="text-[9px] text-slate-400 mt-0.5">{widget.sub}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* SECTION 2: TODAY'S AI SUMMARY & CORTEX ASSISTANT */}
        <div className="p-6 sm:p-8 rounded-[32px] bg-slate-900/80 border border-teal-500/30 backdrop-blur-2xl shadow-xl relative overflow-hidden">
          <div className="flex items-start gap-5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-400 to-cyan-400 p-0.5 shrink-0 shadow-lg shadow-teal-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Brain className="w-6 h-6 text-teal-400 animate-pulse" />
              </div>
            </div>

            <div className="space-y-2 flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  FitTracker AI Cortex • Daily Briefing
                </h3>
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  REAL-TIME SYNTHESIZED
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                "You slept 32 minutes longer today than your weekly average. Recovery index improved by +8%. Your metabolic baseline indicates an optimal window for a heavy resistance hypertrophy workout at 4:30 PM today. Increase protein intake by 28g post-workout."
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
                <div className="px-3 py-1 rounded-xl bg-slate-950/80 border border-white/5 text-slate-300">
                  🌤️ Weather Temp: <strong className="text-white">22°C (Optimal for Cardio)</strong>
                </div>
                <div className="px-3 py-1 rounded-xl bg-slate-950/80 border border-white/5 text-slate-300">
                  💧 Hydration: <strong className="text-cyan-400">Drink 500mL water before 6 PM</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3 & 4 BENTO: TIMELINE & INTERACTIVE 3D ACHIEVEMENTS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Section 3: Today's Health Timeline */}
          <div className="lg:col-span-6 p-6 sm:p-8 rounded-[32px] bg-slate-900/80 border border-white/10 backdrop-blur-2xl space-y-6 shadow-xl">
            <h3 className="text-lg font-black text-white flex items-center gap-2 border-b border-white/10 pb-4">
              <Clock className="w-5 h-5 text-teal-400" /> Today's Telemetry Timeline
            </h3>

            <div className="space-y-4 relative before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-800">
              {[
                { time: '07:00 AM', title: 'Deep Sleep End', desc: '7h 45m logged, 92 Quality Score', icon: Moon, color: 'text-indigo-400' },
                { time: '09:30 AM', title: 'Metabolic Hydration', desc: '500mL Electrolytes consumed', icon: Droplet, color: 'text-cyan-400' },
                { time: '01:15 PM', title: 'High Protein Fuel', desc: '780 kcal (45g Protein, 65g Carbs)', icon: Flame, color: 'text-orange-400' },
                { time: '05:00 PM', title: 'Hypertrophy Session Target', desc: 'Leg & Core PR Attempt Scheduled', icon: Activity, color: 'text-emerald-400' },
              ].map((item) => (
                <div key={item.time} className="flex items-start gap-4 relative pl-8">
                  <div className="absolute left-0 top-1 w-7 h-7 rounded-full bg-slate-950 border border-white/10 flex items-center justify-center shrink-0">
                    <item.icon className={`w-3.5 h-3.5 ${item.color}`} />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-slate-400">{item.time}</span>
                    <h4 className="text-xs font-bold text-white">{item.title}</h4>
                    <p className="text-[11px] text-slate-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Achievements & Badges */}
          <div className="lg:col-span-6 p-6 sm:p-8 rounded-[32px] bg-slate-900/80 border border-white/10 backdrop-blur-2xl space-y-6 shadow-xl">
            <h3 className="text-lg font-black text-white flex items-center gap-2 border-b border-white/10 pb-4">
              <Award className="w-5 h-5 text-amber-400" /> Milestone Badges & Trophies
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { name: '100 Workouts', desc: 'Century Athlete', icon: Activity, unlocked: true },
                { name: 'Marathon Ready', desc: 'VO2 Max 48.5', icon: Zap, unlocked: true },
                { name: '18-Day Streak', desc: 'Consistency PR', icon: Flame, unlocked: true },
                { name: 'Perfect Sleep', desc: '8h+ Deep 5x', icon: Moon, unlocked: true },
                { name: 'Hydration Master', desc: 'Target hit 30d', icon: Droplet, unlocked: true },
                { name: 'AI Elite Athlete', desc: 'Score > 90', icon: Sparkles, unlocked: true },
              ].map((badge) => (
                <motion.div
                  key={badge.name}
                  whileHover={{ rotateX: 10, rotateY: -10, scale: 1.05 }}
                  className="p-4 rounded-2xl bg-slate-950/80 border border-teal-500/30 text-center space-y-2 flex flex-col items-center justify-center shadow-lg"
                >
                  <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-300">
                    <badge.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{badge.name}</h4>
                    <p className="text-[9px] text-slate-400">{badge.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* SECTION 6: INTERACTIVE BODY INSIGHTS */}
        <div className="p-6 sm:p-8 rounded-[36px] bg-slate-900/80 border border-white/10 backdrop-blur-2xl space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-teal-400" /> Interactive Biometric Anatomy Insights
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Click any biomarker hotspot to view deep anatomical metrics.</p>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto">
              {[
                { id: 'heart', label: 'Heart & HRV', icon: Heart },
                { id: 'muscles', label: 'Muscle Mass', icon: Zap },
                { id: 'fat', label: 'Body Composition', icon: Scale },
                { id: 'water', label: 'Hydration', icon: Droplet },
                { id: 'brain', label: 'Sleep & Brain', icon: Moon },
              ].map((part) => (
                <button
                  key={part.id}
                  onClick={() => setActiveBodyPart(part.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    activeBodyPart === part.id
                      ? 'bg-teal-400 text-slate-950 shadow-md'
                      : 'bg-slate-950 text-slate-400 hover:text-white'
                  }`}
                >
                  <part.icon className="w-3.5 h-3.5" />
                  <span>{part.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-slate-950/80 border border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 flex-1">
              <span className="text-[10px] font-mono text-teal-400 uppercase tracking-widest font-bold">
                BIOMARKER ANALYSIS: {activeBodyPart.toUpperCase()}
              </span>
              <h4 className="text-2xl font-black text-white">
                {activeBodyPart === 'heart' && '58 bpm Resting Heart Rate • HRV 78ms'}
                {activeBodyPart === 'muscles' && '62.4 kg Skeletal Muscle • 95% Leg Recovery'}
                {activeBodyPart === 'fat' && '14.8% Body Fat • Visceral Level 3'}
                {activeBodyPart === 'water' && '64.2% Total Body Hydration (Optimal)'}
                {activeBodyPart === 'brain' && '94 Sleep Score • 2h 10m Deep REM'}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {activeBodyPart === 'heart' && 'Autonomic nervous system recovery is high. Cardiovascular strain capacity is optimal for intensity.'}
                {activeBodyPart === 'muscles' && 'Protein synthesis rates are elevated following yesterday’s resistance stimulus.'}
                {activeBodyPart === 'fat' && 'Body composition ratio is within top 3% of trained endurance/strength athletes.'}
                {activeBodyPart === 'water' && 'Intracellular water ratio is optimal, supporting optimal cognitive and muscular power.'}
                {activeBodyPart === 'brain' && 'Delta-wave sleep architecture was prolonged, accelerating central nervous system recovery.'}
              </p>
            </div>

            <div className="px-6 py-4 rounded-2xl bg-slate-900 border border-teal-500/30 text-center shrink-0">
              <span className="text-[10px] font-mono text-slate-400 uppercase block">Status Assessment</span>
              <strong className="text-lg font-black text-emerald-400">OPTIMAL RANGE</strong>
            </div>
          </div>
        </div>
      </div>

      {/* EDIT PROFILE FLOATING SIDE DRAWER */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50"
            />

            {/* Side Drawer Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              className="fixed top-0 right-0 h-full w-full sm:w-[450px] bg-slate-900/95 border-l border-white/10 backdrop-blur-2xl z-50 p-6 sm:p-8 space-y-6 shadow-2xl overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-teal-400" /> Edit Personal AI Identity
                </h3>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-mono text-slate-400 uppercase">First Name</label>
                  <input
                    type="text"
                    value={form.firstName}
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-mono text-slate-400 uppercase">Last Name</label>
                  <input
                    type="text"
                    value={form.lastName}
                    onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-mono text-slate-400 uppercase">Height (cm)</label>
                  <input
                    type="number"
                    value={form.height}
                    onChange={(e) => setForm({ ...form, height: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-mono text-slate-400 uppercase">Weight (kg)</label>
                  <input
                    type="number"
                    value={form.weight}
                    onChange={(e) => setForm({ ...form, weight: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveDrawer}
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-teal-400 to-emerald-400 text-slate-950 font-extrabold text-xs flex items-center gap-1.5"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>Save Identity</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;