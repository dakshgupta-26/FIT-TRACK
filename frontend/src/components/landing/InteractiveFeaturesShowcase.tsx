import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  Dumbbell, 
  Utensils, 
  TrendingUp, 
  Heart, 
  Sparkles, 
  Users, 
  Trophy, 
  BellRing, 
  ShieldCheck, 
  FileText, 
  Smartphone,
  ChevronRight,
  Flame,
  Droplets,
  Moon,
  CheckCircle2,
  Lock,
  Download,
  Wifi,
  Zap,
  Clock,
  Scan,
  Share2,
  Award,
  Shield,
  BarChart3,
  Cpu,
  RefreshCw,
  Search,
  Maximize2
} from 'lucide-react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export interface FeatureItem {
  id: string;
  title: string;
  category: string;
  icon: React.ElementType;
  tagline: string;
  description: string;
  highlights: string[];
  gradient: string;
  color: string;
}

export const FEATURES_DATA: FeatureItem[] = [
  {
    id: 'ai-dashboard',
    title: 'AI Health Dashboard',
    category: 'INTELLIGENT OVERVIEW',
    icon: Activity,
    tagline: 'Your complete vital stats in one real-time view',
    description: 'Centralized health command center driven by AI to monitor daily metrics, calorie burn, sleep, and heart rate seamlessly.',
    highlights: ['Daily Health Score (94/100)', 'Live Heart Rate & Vitals', 'Water & Sleep Tracking'],
    gradient: 'from-teal-500 via-emerald-500 to-cyan-500',
    color: '#14b8a6',
  },
  {
    id: 'workout-planner',
    title: 'Workout Planner',
    category: 'TRAINING & ROUTINES',
    icon: Dumbbell,
    tagline: 'Custom routines & AI exercise recommendations',
    description: 'Smart workout builder with real-time rest timers, progressive overload tracking, and over 500+ exercise video guides.',
    highlights: ['AI-Generated Workout Plans', '500+ Exercise Library', 'Rest Timer & Set Logger'],
    gradient: 'from-cyan-500 via-teal-500 to-blue-500',
    color: '#06b6d4',
  },
  {
    id: 'nutrition-tracking',
    title: 'Nutrition Tracking',
    category: 'MEALS & MACROS',
    icon: Utensils,
    tagline: 'Instant AI meal recognition & barcode scanner',
    description: 'Snap a picture of your food or scan barcodes to instantly calculate calories, protein, carbs, and fats with 99% accuracy.',
    highlights: ['AI Food Recognition', 'Macro & Micronutrient Rings', 'Barcode Scanner'],
    gradient: 'from-[#14b8a6] via-emerald-400 to-[#2dd4bf]',
    color: '#2dd4bf',
  },
  {
    id: 'progress-analytics',
    title: 'Progress Analytics',
    category: 'DATA & INSIGHTS',
    icon: TrendingUp,
    tagline: 'Interactive body composition charts & trends',
    description: 'Visualize your weight loss, muscle gain, BMI, and strength progression over time with interactive vector charts.',
    highlights: ['Interactive Weight Curves', 'BMI & Body Fat Graph', 'Weekly & Monthly Trends'],
    gradient: 'from-emerald-500 via-teal-600 to-cyan-600',
    color: '#10b981',
  },
  {
    id: 'health-monitoring',
    title: 'Health Monitoring',
    category: 'BIOMETRIC TELEMETRY',
    icon: Heart,
    tagline: '24/7 continuous cardiac & sleep tracking',
    description: 'Track heart rate variability, blood pressure, sleep cycles (REM, Deep), and stress levels with precision.',
    highlights: ['HRV & Resting Pulse', 'Blood Pressure Telemetry', 'Sleep Stage Breakdown'],
    gradient: 'from-[#2dd4bf] via-[#14b8a6] to-emerald-600',
    color: '#14b8a6',
  },
  {
    id: 'ai-recommendations',
    title: 'AI Recommendations',
    category: 'PERSONAL COACHING',
    icon: Sparkles,
    tagline: 'Proactive workout & recovery guidance',
    description: 'Personalized AI assistant that analyzes your sleep and fatigue levels to recommend optimal daily training targets.',
    highlights: ['Daily Readiness Score', 'Recovery & Rest Guidance', 'Adaptive Calorie Targets'],
    gradient: 'from-[#14b8a6] via-cyan-400 to-emerald-400',
    color: '#22d3ee',
  },
  {
    id: 'community',
    title: 'Community',
    category: 'SOCIAL & CHALLENGES',
    icon: Users,
    tagline: 'Connect, compete, and share progress',
    description: 'Join local & national fitness challenges, climb competitive leaderboards, and share milestones with friends.',
    highlights: ['National Leaderboards', 'Group Challenges', 'Shared Progress Feed'],
    gradient: 'from-teal-400 via-emerald-500 to-cyan-500',
    color: '#2dd4bf',
  },
  {
    id: 'gamification',
    title: 'Gamification',
    category: 'STREAKS & REWARDS',
    icon: Trophy,
    tagline: 'Earn XP, badges, and maintain streaks',
    description: 'Turn your fitness journey into a game. Earn achievement badges, level up your profile, and unlock exclusive rewards.',
    highlights: ['Daily Workout Streaks 🔥', 'Level & XP System', 'Collectible Badges'],
    gradient: 'from-amber-400 via-[#14b8a6] to-emerald-500',
    color: '#f59e0b',
  },
  {
    id: 'notifications',
    title: 'Notifications',
    category: 'SMART REMINDERS',
    icon: BellRing,
    tagline: 'Timely reminders for hydration & workouts',
    description: 'Intelligent notifications timed to your circadian rhythm for water intake, meal logging, and workout sessions.',
    highlights: ['Hydration Reminders', 'Scheduled Meal Alerts', 'Rest & Sleep Prompt'],
    gradient: 'from-cyan-400 via-teal-500 to-emerald-600',
    color: '#06b6d4',
  },
  {
    id: 'privacy-security',
    title: 'Privacy & Security',
    category: 'ENTERPRISE PROTECTION',
    icon: ShieldCheck,
    tagline: '256-bit encryption for all health data',
    description: 'Your medical and fitness data is protected with military-grade AES 256-bit encryption, strict access control, and private storage.',
    highlights: ['End-to-End Encryption', 'Google Auth Integration', 'Private Local Storage'],
    gradient: 'from-[#14b8a6] via-[#0d9488] to-cyan-800',
    color: '#0d9488',
  },
  {
    id: 'reports',
    title: 'Reports & Export',
    category: 'DOCUMENTS & AUDIT',
    icon: FileText,
    tagline: 'Export comprehensive PDF health audits',
    description: 'Generate clean, shareable PDF health reports for your personal trainer, doctor, or nutritionist with a single tap.',
    highlights: ['Weekly PDF Summaries', 'Monthly Health Audits', 'Export CSV & Data'],
    gradient: 'from-emerald-400 via-teal-500 to-cyan-600',
    color: '#10b981',
  },
  {
    id: 'cross-platform',
    title: 'Cross Platform',
    category: 'SEAMLESS SYNC',
    icon: Smartphone,
    tagline: 'Instant sync across Mobile, Web & Tablet',
    description: 'Access your health dashboard anywhere with real-time cloud synchronization between your phone, tablet, and browser.',
    highlights: ['Real-time Cloud Sync', 'Mobile & Desktop Ready', 'Offline Log Cache'],
    gradient: 'from-[#2dd4bf] via-teal-500 to-cyan-400',
    color: '#2dd4bf',
  },
];

// SVG Apple-style Activity Rings Component
const ActivityRingsSVG: React.FC = () => (
  <svg viewBox="0 0 100 100" className="w-20 h-20 transform -rotate-90 drop-shadow-[0_0_10px_rgba(20,184,166,0.5)]">
    {/* Move Ring - Red/Pink */}
    <circle cx="50" cy="50" r="40" stroke="rgba(255, 45, 85, 0.2)" strokeWidth="8" fill="none" />
    <motion.circle 
      cx="50" cy="50" r="40" 
      stroke="#ff2d55" 
      strokeWidth="8" 
      fill="none"
      strokeDasharray="251.2"
      initial={{ strokeDashoffset: 251.2 }}
      animate={{ strokeDashoffset: 40 }}
      transition={{ duration: 1.2, ease: 'easeOut' }}
      strokeLinecap="round"
    />
    
    {/* Exercise Ring - Green */}
    <circle cx="50" cy="50" r="30" stroke="rgba(48, 209, 88, 0.2)" strokeWidth="8" fill="none" />
    <motion.circle 
      cx="50" cy="50" r="30" 
      stroke="#30d158" 
      strokeWidth="8" 
      fill="none"
      strokeDasharray="188.4"
      initial={{ strokeDashoffset: 188.4 }}
      animate={{ strokeDashoffset: 30 }}
      transition={{ duration: 1.2, delay: 0.2, ease: 'easeOut' }}
      strokeLinecap="round"
    />

    {/* Stand Ring - Cyan */}
    <circle cx="50" cy="50" r="20" stroke="rgba(100, 210, 255, 0.2)" strokeWidth="8" fill="none" />
    <motion.circle 
      cx="50" cy="50" r="20" 
      stroke="#64d2ff" 
      strokeWidth="8" 
      fill="none"
      strokeDasharray="125.6"
      initial={{ strokeDashoffset: 125.6 }}
      animate={{ strokeDashoffset: 15 }}
      transition={{ duration: 1.2, delay: 0.4, ease: 'easeOut' }}
      strokeLinecap="round"
    />
  </svg>
);

// SVG Cardiac ECG Waveform Component
const CardiacWaveformSVG: React.FC = () => (
  <svg viewBox="0 0 300 80" className="w-full h-16 text-[#2dd4bf] overflow-visible">
    <path 
      d="M 0 40 L 40 40 L 50 20 L 60 60 L 70 10 L 80 70 L 90 40 L 130 40 L 140 30 L 150 50 L 160 40 L 210 40 L 220 15 L 230 65 L 240 40 L 300 40" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="drop-shadow-[0_0_12px_rgba(45,212,191,0.8)]"
    />
    <motion.circle
      cx="240" cy="40" r="4"
      fill="#2dd4bf"
      animate={{ r: [4, 7, 4], opacity: [0.7, 1, 0.7] }}
      transition={{ duration: 1.5, repeat: Infinity }}
      className="drop-shadow-[0_0_10px_#2dd4bf]"
    />
  </svg>
);

export const InteractiveFeaturesShowcase: React.FC = () => {
  const stageRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [activeFeatureId, setActiveFeatureId] = useState<string>('ai-dashboard');
  const [mousePos, setMousePos] = useState({ x: 400, y: 300 });

  const activeFeature = FEATURES_DATA.find((f) => f.id === activeFeatureId) || FEATURES_DATA[0];

  // Initialize GSAP ScrollTrigger
  useEffect(() => {
    if (headerRef.current) {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <section 
      id="features"
      ref={stageRef}
      onMouseMove={handleMouseMove}
      role="region" 
      aria-label="FitTracker Product Features Launch Showcase"
      className="relative overflow-hidden bg-[#020617] pt-10 pb-12 lg:pt-14 lg:pb-16 text-white selection:bg-[#14b8a6]/30 selection:text-white"
    >
      {/* Dynamic Mouse-Follow Spotlight Beam */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-px opacity-70 transition-opacity duration-300 z-0"
        style={{
          background: `radial-gradient(650px circle at ${mousePos.x}px ${mousePos.y}px, rgba(45, 212, 191, 0.12), transparent 75%)`,
        }}
      />

      {/* Layered Ambient Mesh & Grid Background */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[700px] w-[1000px] rounded-full bg-gradient-to-tr from-[#14b8a6]/20 via-[#0d9488]/15 to-cyan-500/15 blur-[160px]" 
      />

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl z-10">
        
        {/* Section Header */}
        <div ref={headerRef} className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#14b8a6]/10 border border-[#14b8a6]/30 text-[#2dd4bf] text-xs font-semibold tracking-widest uppercase shadow-[0_0_20px_rgba(20,184,166,0.25)]"
          >
            <Sparkles className="h-3.5 w-3.5 text-[#2dd4bf] animate-pulse" />
            <span>Enterprise Product Showcase</span>
          </motion.div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-white via-white/95 to-white/70 bg-clip-text text-transparent">
            Everything You Need to Build a Healthier Life
          </h2>

          <p className="text-base sm:text-lg text-white/65 leading-relaxed max-w-2xl mx-auto font-normal">
            FitTracker combines AI, analytics, nutrition, workout planning, health monitoring, and intelligent coaching into one seamless experience.
          </p>
        </div>

        {/* Split-Screen Main Stage: Left Interactive Control List + Right Dual Hardware Mockups */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* LEFT SIDE: Interactive Feature Navigation List */}
          <div className="lg:col-span-5 space-y-2.5 max-h-[660px] overflow-y-auto pr-1 sm:pr-2 custom-scrollbar">
            {FEATURES_DATA.map((feature) => {
              const IconComponent = feature.icon;
              const isActive = feature.id === activeFeatureId;

              return (
                <motion.button
                  key={feature.id}
                  onClick={() => setActiveFeatureId(feature.id)}
                  whileHover={{ x: 6 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full text-left p-4 sm:p-4.5 rounded-2xl border transition-all duration-300 relative overflow-hidden flex items-start gap-4 ${
                    isActive 
                      ? 'bg-white/[0.07] border-[#14b8a6]/60 shadow-[0_0_30px_rgba(20,184,166,0.2)] text-white' 
                      : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04] hover:border-white/20 text-white/70'
                  }`}
                  aria-selected={isActive}
                  role="tab"
                >
                  {/* Left Active Glow Strip */}
                  {isActive && (
                    <motion.div 
                      layoutId="activeGlowStrip" 
                      className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-[#14b8a6] via-[#2dd4bf] to-cyan-400 rounded-r shadow-[0_0_12px_#2dd4bf]" 
                    />
                  )}

                  {/* Icon Box */}
                  <div className={`p-2.5 rounded-xl border flex-shrink-0 transition-colors duration-300 ${
                    isActive 
                      ? 'bg-[#14b8a6]/25 border-[#14b8a6]/50 text-[#2dd4bf] shadow-[0_0_15px_rgba(45,212,191,0.4)]' 
                      : 'bg-white/[0.04] border-white/[0.08] text-white/60'
                  }`}>
                    <IconComponent className="h-5 w-5" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold tracking-wider uppercase text-white/40 mb-0.5">
                        {feature.category}
                      </span>
                      {isActive && (
                        <span className="flex h-2 w-2 relative">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2dd4bf] opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#14b8a6]" />
                        </span>
                      )}
                    </div>
                    
                    <h3 className={`text-base font-bold tracking-tight transition-colors ${
                      isActive ? 'text-white' : 'text-white/85'
                    }`}>
                      {feature.title}
                    </h3>
                    
                    <p className="text-xs text-white/55 line-clamp-1 mt-0.5 font-normal">
                      {feature.tagline}
                    </p>
                  </div>

                  <ChevronRight className={`h-4 w-4 flex-shrink-0 self-center transition-transform duration-300 ${
                    isActive ? 'text-[#2dd4bf] translate-x-1' : 'text-white/20'
                  }`} />
                </motion.button>
              );
            })}
          </div>

          {/* RIGHT SIDE: Interactive Dual Showcase (iPhone 16 Pro Titanium + SaaS Desktop Browser) */}
          <div className="lg:col-span-7 sticky top-24">
            
            <div className="relative rounded-3xl bg-white/[0.02] border border-white/[0.08] p-4 sm:p-6 lg:p-7 backdrop-blur-2xl shadow-[0_25px_60px_rgba(0,0,0,0.6)] overflow-hidden">
              
              {/* Dynamic Feature Subtitle Header Bar */}
              <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.08]">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <activeFeature.icon className="h-5 w-5 text-[#2dd4bf]" />
                    <span>{activeFeature.title}</span>
                  </h3>
                  <p className="text-xs text-white/60 mt-1 max-w-lg">
                    {activeFeature.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {activeFeature.highlights.map((h, i) => (
                    <span 
                      key={i} 
                      className="px-2.5 py-1 text-[10px] font-medium rounded-full bg-[#14b8a6]/15 border border-[#14b8a6]/30 text-[#2dd4bf]"
                    >
                      {h}
                    </span>
                  ))}
                </div>
              </div>

              {/* Floating Translucent Glass Toast Popup */}
              <motion.div 
                key={`toast-${activeFeature.id}`}
                initial={{ opacity: 0, y: -20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="absolute top-4 right-4 z-40 hidden sm:flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-white/[0.08] border border-white/20 backdrop-blur-md text-xs text-white shadow-2xl"
              >
                <div className="h-2 w-2 rounded-full bg-[#2dd4bf] animate-ping" />
                <span className="font-medium text-[11px] text-white/90">
                  ⚡ Live Telemetry Active
                </span>
              </motion.div>

              {/* Showcase Dual Mockup Stage */}
              <div className="relative flex flex-col lg:flex-row items-center justify-center gap-6 min-h-[460px] py-2">
                
                {/* 1. DESKTOP SAAS DASHBOARD BROWSER PREVIEW */}
                <motion.div 
                  className="w-full lg:w-[68%] rounded-2xl bg-[#07111f] border border-white/10 shadow-2xl overflow-hidden flex flex-col z-10"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  {/* Safari Dark Mac Window Controls */}
                  <div className="h-8 px-3 bg-white/[0.03] border-b border-white/[0.08] flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                      <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
                      <div className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
                    </div>

                    <div className="px-3 py-0.5 rounded-md bg-white/[0.04] text-[10px] font-mono text-white/50 border border-white/[0.05] flex items-center gap-1.5">
                      <Lock className="h-2.5 w-2.5 text-[#14b8a6]" />
                      <span>app.fittracker.ai/dashboard</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Wifi className="h-3 w-3 text-white/30" />
                    </div>
                  </div>

                  {/* Live SaaS Dashboard Inner Canvas */}
                  <div className="p-4 sm:p-5 space-y-4 min-h-[340px] relative">
                    
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeFeature.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4"
                      >
                        {/* Top Key Metrics Row */}
                        <div className="grid grid-cols-3 gap-3">
                          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                            <div className="text-[10px] text-white/50 font-medium uppercase">Active Calories</div>
                            <div className="text-lg font-extrabold text-[#2dd4bf] mt-0.5">1,840 kcal</div>
                            <div className="text-[9px] text-emerald-400 mt-0.5">↑ 12% vs target</div>
                          </div>

                          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                            <div className="text-[10px] text-white/50 font-medium uppercase">Heart Rate</div>
                            <div className="text-lg font-extrabold text-rose-400 mt-0.5">68 BPM</div>
                            <div className="text-[9px] text-white/40 mt-0.5">Resting Steady</div>
                          </div>

                          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                            <div className="text-[10px] text-white/50 font-medium uppercase">Health Score</div>
                            <div className="text-lg font-extrabold text-teal-300 mt-0.5">94 / 100</div>
                            <div className="text-[9px] text-emerald-400 mt-0.5">Optimal Vital</div>
                          </div>
                        </div>

                        {/* Interactive Feature Canvas Box */}
                        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-white flex items-center gap-1.5">
                              <Sparkles className="h-3.5 w-3.5 text-[#14b8a6]" />
                              <span>Live Activity Analytics — {activeFeature.title}</span>
                            </span>
                            <span className="text-[10px] font-mono text-[#2dd4bf] bg-[#14b8a6]/10 px-2 py-0.5 rounded border border-[#14b8a6]/20">
                              Real-Time Stream
                            </span>
                          </div>

                          {/* Dynamic SVG Analytics Vector Chart */}
                          <div className="h-28 w-full flex items-end justify-between gap-1.5 pt-2 px-1">
                            {[40, 65, 45, 80, 55, 90, 70, 85, 95, 60, 75, 92].map((height, i) => (
                              <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                                <motion.div 
                                  initial={{ height: 0 }}
                                  animate={{ height: `${height}%` }}
                                  transition={{ duration: 0.5, delay: i * 0.03 }}
                                  className={`w-full rounded-t-sm bg-gradient-to-t ${
                                    i === 8 ? 'from-[#14b8a6] to-[#2dd4bf]' : 'from-white/10 to-white/20'
                                  }`} 
                                />
                                <span className="text-[8px] text-white/30 font-mono">{i + 1}h</span>
                              </div>
                            ))}
                          </div>

                          {/* Bottom Status Bar */}
                          <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-white/60">
                            <span className="flex items-center gap-1">
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                              <span>Synced across mobile & desktop cloud</span>
                            </span>
                            <span className="font-mono text-[10px] text-white/40">Updated 2s ago</span>
                          </div>
                        </div>

                      </motion.div>
                    </AnimatePresence>

                  </div>
                </motion.div>

                {/* 2. REALISTIC HARDWARE IPHONE 16 PRO TITANIUM MOCKUP */}
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="relative w-64 h-[440px] rounded-[44px] bg-gradient-to-b from-slate-700 via-slate-900 to-slate-950 p-3 border-[3px] border-slate-600/80 shadow-[0_30px_70px_rgba(0,0,0,0.85)] flex-shrink-0 z-20"
                >
                  {/* Apple Soft Glass Glare Overlay */}
                  <div 
                    aria-hidden="true" 
                    className="pointer-events-none absolute top-0 right-0 w-36 h-72 bg-gradient-to-b from-white/15 via-white/5 to-transparent rounded-tr-[40px] z-30" 
                  />

                  {/* Inner Screen Display */}
                  <div className="relative w-full h-full rounded-[36px] bg-[#07111f] overflow-hidden border border-white/10 flex flex-col justify-between p-3.5">
                    
                    {/* Dynamic Island Pillar */}
                    <div className="absolute top-2.5 left-1/2 -translate-x-1/2 h-4 w-20 bg-black rounded-full z-40 flex items-center justify-between px-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-slate-700" />
                      <div className="h-2 w-2 rounded-full bg-[#14b8a6] animate-pulse" />
                    </div>

                    {/* Top Status Bar */}
                    <div className="pt-3 flex items-center justify-between text-[10px] text-white/60 font-mono">
                      <span>09:41</span>
                      <div className="flex items-center gap-1">
                        <Wifi className="h-3 w-3" />
                        <span>5G</span>
                      </div>
                    </div>

                    {/* Live Morphing Phone Display Body */}
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeFeature.id}
                        initial={{ opacity: 0, scale: 0.94 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.94 }}
                        transition={{ duration: 0.3 }}
                        className="my-auto space-y-3"
                      >
                        {/* Header Badge */}
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-[#2dd4bf] uppercase tracking-wider bg-[#14b8a6]/15 px-2 py-0.5 rounded border border-[#14b8a6]/30">
                            {activeFeature.title}
                          </span>
                          <activeFeature.icon className="h-4 w-4 text-white/70" />
                        </div>

                        {/* Feature Custom Graphics Screen */}
                        {activeFeature.id === 'ai-dashboard' ? (
                          <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-around">
                            <ActivityRingsSVG />
                            <div className="space-y-1 text-right">
                              <div className="text-[10px] text-white/50 font-mono">MOVE 480/600</div>
                              <div className="text-[10px] text-white/50 font-mono">EXERCISE 42m</div>
                              <div className="text-[10px] text-white/50 font-mono">STAND 10/12h</div>
                            </div>
                          </div>
                        ) : activeFeature.id === 'health-monitoring' ? (
                          <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/[0.08] space-y-1">
                            <div className="text-[10px] text-rose-400 font-mono font-bold">CARDIAC TELEMETRY</div>
                            <CardiacWaveformSVG />
                          </div>
                        ) : (
                          <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/[0.08] space-y-2">
                            <div className="text-xs font-bold text-white leading-tight">
                              {activeFeature.tagline}
                            </div>

                            <div className="space-y-1.5 pt-1">
                              {activeFeature.highlights.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-1.5 text-[10px] text-white/70">
                                  <div className="h-1.5 w-1.5 rounded-full bg-[#14b8a6]" />
                                  <span>{item}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Interactive Widget Button */}
                        <div className="w-full py-2 rounded-xl bg-gradient-to-r from-[#14b8a6] to-[#0d9488] text-white text-[11px] font-semibold text-center shadow-lg flex items-center justify-center gap-1.5">
                          <Zap className="h-3.5 w-3.5" />
                          <span>Active on FitTracker iOS</span>
                        </div>
                      </motion.div>
                    </AnimatePresence>

                    {/* Bottom Navigation Toolbar */}
                    <div className="pt-2 border-t border-white/[0.08] flex items-center justify-around text-white/40">
                      <Activity className="h-4 w-4 text-[#2dd4bf]" />
                      <Dumbbell className="h-4 w-4" />
                      <Utensils className="h-4 w-4" />
                      <Users className="h-4 w-4" />
                    </div>

                    {/* Home Bar */}
                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 h-1 w-24 bg-white/30 rounded-full" />
                  </div>
                </motion.div>

              </div>

            </div>

          </div>

        </div>

        {/* SUBTLE GLOWING DIVIDER TO COMMUNITY SECTION */}
        <div className="relative mx-auto max-w-5xl h-px bg-gradient-to-r from-transparent via-[#14b8a6]/40 to-transparent mt-12 lg:mt-16" />

      </div>
    </section>
  );
};
