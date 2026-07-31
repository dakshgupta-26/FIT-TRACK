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
  Share2
} from 'lucide-react';

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

export const InteractiveFeaturesShowcase: React.FC = () => {
  const [activeFeatureId, setActiveFeatureId] = useState<string>('ai-dashboard');
  const activeFeature = FEATURES_DATA.find((f) => f.id === activeFeatureId) || FEATURES_DATA[0];

  return (
    <section 
      role="region" 
      aria-label="FitTracker Platform Features Showcase"
      className="relative overflow-hidden bg-[#020617] py-24 lg:py-36 border-t border-white/[0.06] text-white selection:bg-[#14b8a6]/30 selection:text-white"
    >
      {/* Background Aurora Gradient & Mesh */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[600px] w-[900px] rounded-full bg-gradient-to-tr from-[#14b8a6]/15 via-[#0d9488]/10 to-cyan-500/10 blur-[150px]" 
      />
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(20,184,166,0.05),transparent_70%)]" 
      />

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#14b8a6]/10 border border-[#14b8a6]/25 text-[#2dd4bf] text-xs font-semibold tracking-wider uppercase shadow-[0_0_20px_rgba(20,184,166,0.2)]"
          >
            <Sparkles className="h-3.5 w-3.5 text-[#2dd4bf] animate-pulse" />
            <span>Platform Capabilities</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-white via-white/95 to-white/70 bg-clip-text text-transparent"
          >
            Everything You Need to Build a Healthier Life
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-base sm:text-lg text-white/65 leading-relaxed max-w-2xl mx-auto font-normal"
          >
            FitTracker combines AI, analytics, nutrition, workout planning, health monitoring, and intelligent coaching into one seamless experience.
          </motion.p>
        </div>

        {/* Split Screen Layout: Left Nav List + Right Live iPhone & SaaS Dashboard Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* LEFT SIDE: Interactive Feature Navigation List */}
          <div className="lg:col-span-5 space-y-2.5 max-h-[640px] overflow-y-auto pr-1 sm:pr-2 custom-scrollbar">
            {FEATURES_DATA.map((feature) => {
              const IconComponent = feature.icon;
              const isActive = feature.id === activeFeatureId;

              return (
                <motion.button
                  key={feature.id}
                  onClick={() => setActiveFeatureId(feature.id)}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.99 }}
                  className={`w-full text-left p-4 sm:p-4.5 rounded-2xl border transition-all duration-300 relative overflow-hidden flex items-start gap-4 ${
                    isActive 
                      ? 'bg-white/[0.06] border-[#14b8a6]/50 shadow-[0_0_25px_rgba(20,184,166,0.15)] text-white' 
                      : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04] hover:border-white/20 text-white/70'
                  }`}
                  aria-selected={isActive}
                  role="tab"
                >
                  {/* Left Active Glow Indicator Strip */}
                  {isActive && (
                    <motion.div 
                      layoutId="activeFeatureIndicator" 
                      className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-[#14b8a6] to-[#2dd4bf] rounded-r" 
                    />
                  )}

                  {/* Icon */}
                  <div className={`p-2.5 rounded-xl border flex-shrink-0 transition-colors duration-300 ${
                    isActive 
                      ? 'bg-[#14b8a6]/20 border-[#14b8a6]/40 text-[#2dd4bf]' 
                      : 'bg-white/[0.04] border-white/[0.08] text-white/60'
                  }`}>
                    <IconComponent className="h-5 w-5" />
                  </div>

                  {/* Feature Text Info */}
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

          {/* RIGHT SIDE: Interactive Dual Showcase (iPhone 16 Pro + SaaS Desktop Dashboard) */}
          <div className="lg:col-span-7 sticky top-24">
            
            <div className="relative rounded-3xl bg-white/[0.02] border border-white/[0.08] p-4 sm:p-6 lg:p-8 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden">
              
              {/* Dynamic Feature Subtitle Bar */}
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

              {/* Dual Product Showcase Container (Desktop Window + iPhone 16 Pro Floating) */}
              <div className="relative flex flex-col lg:flex-row items-center justify-center gap-6 min-h-[460px] py-2">
                
                {/* 1. DESKTOP SAAS DASHBOARD WINDOW PREVIEW */}
                <motion.div 
                  className="w-full lg:w-[68%] rounded-2xl bg-[#07111f] border border-white/10 shadow-2xl overflow-hidden flex flex-col"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  {/* Browser Mac Controls Top Bar */}
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

                  {/* Morphing Live Dashboard Inner Content */}
                  <div className="p-4 sm:p-5 space-y-4 min-h-[340px]">
                    
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeFeature.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4"
                      >
                        {/* Top Stats Strip */}
                        <div className="grid grid-cols-3 gap-3">
                          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                            <div className="text-[10px] text-white/50 font-medium uppercase">Active Calories</div>
                            <div className="text-lg font-extrabold text-[#2dd4bf] mt-0.5">1,840 kcal</div>
                            <div className="text-[9px] text-emerald-400 mt-0.5">↑ 12% vs yesterday</div>
                          </div>

                          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                            <div className="text-[10px] text-white/50 font-medium uppercase">Heart Rate</div>
                            <div className="text-lg font-extrabold text-rose-400 mt-0.5">68 BPM</div>
                            <div className="text-[9px] text-white/40 mt-0.5">Normal Resting</div>
                          </div>

                          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                            <div className="text-[10px] text-white/50 font-medium uppercase">AI Health Score</div>
                            <div className="text-lg font-extrabold text-teal-300 mt-0.5">94 / 100</div>
                            <div className="text-[9px] text-emerald-400 mt-0.5">Optimal Condition</div>
                          </div>
                        </div>

                        {/* Interactive Feature Live Canvas Area */}
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

                          {/* Dynamic SVG Analytics Graph Wave */}
                          <div className="h-28 w-full flex items-end justify-between gap-1 pt-2 px-1">
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

                          {/* Dynamic Bottom Status Bar */}
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

                {/* 2. REALISTIC FLOATING IPHONE 16 PRO MOCKUP */}
                <motion.div 
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="relative w-64 h-[420px] rounded-[42px] bg-[#020617] p-3 border-4 border-slate-700/80 shadow-[0_25px_60px_rgba(0,0,0,0.8)] flex-shrink-0 z-20"
                >
                  {/* Glass Reflection Accent */}
                  <div 
                    aria-hidden="true" 
                    className="pointer-events-none absolute top-0 right-0 w-32 h-64 bg-gradient-to-b from-white/10 to-transparent rounded-tr-[38px] z-30" 
                  />

                  {/* Inner Screen Container */}
                  <div className="relative w-full h-full rounded-[34px] bg-[#07111f] overflow-hidden border border-white/10 flex flex-col justify-between p-3.5">
                    
                    {/* iPhone 16 Pro Dynamic Island */}
                    <div className="absolute top-2.5 left-1/2 -translate-x-1/2 h-4 w-20 bg-black rounded-full z-40 flex items-center justify-end px-2">
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

                    {/* Live Morphing Phone Screen Body */}
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeFeature.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
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

                        {/* Card Graphic */}
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

                        {/* Interactive Widget Button */}
                        <div className="w-full py-2 rounded-xl bg-gradient-to-r from-[#14b8a6] to-[#0d9488] text-white text-[11px] font-semibold text-center shadow-lg flex items-center justify-center gap-1.5">
                          <Zap className="h-3.5 w-3.5" />
                          <span>Active on FitTracker iOS</span>
                        </div>
                      </motion.div>
                    </AnimatePresence>

                    {/* Bottom Navigation Pill */}
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

      </div>
    </section>
  );
};
