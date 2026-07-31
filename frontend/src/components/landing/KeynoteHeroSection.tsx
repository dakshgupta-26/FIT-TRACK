import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/layout/Navbar';
import { 
  Activity, 
  Sparkles, 
  Play, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Star, 
  Heart, 
  Dumbbell, 
  Utensils, 
  TrendingUp, 
  Zap, 
  Wifi, 
  Lock, 
  Flame, 
  Droplets, 
  Award,
  Maximize2,
  X,
  Volume2,
  VolumeX,
  ChevronRight,
  Shield,
  Smartphone,
  Laptop,
  Watch
} from 'lucide-react';

// SVG Apple-style Activity Rings Component
const ActivityRingsSVG: React.FC = () => (
  <svg viewBox="0 0 100 100" className="w-16 h-16 transform -rotate-90 drop-shadow-[0_0_10px_rgba(20,184,166,0.5)]">
    <circle cx="50" cy="50" r="40" stroke="rgba(255, 45, 85, 0.2)" strokeWidth="8" fill="none" />
    <motion.circle 
      cx="50" cy="50" r="40" 
      stroke="#ff2d55" 
      strokeWidth="8" 
      fill="none"
      strokeDasharray="251.2"
      initial={{ strokeDashoffset: 251.2 }}
      animate={{ strokeDashoffset: 40 }}
      transition={{ duration: 1.5, ease: 'easeOut' }}
      strokeLinecap="round"
    />
    <circle cx="50" cy="50" r="30" stroke="rgba(48, 209, 88, 0.2)" strokeWidth="8" fill="none" />
    <motion.circle 
      cx="50" cy="50" r="30" 
      stroke="#30d158" 
      strokeWidth="8" 
      fill="none"
      strokeDasharray="188.4"
      initial={{ strokeDashoffset: 188.4 }}
      animate={{ strokeDashoffset: 30 }}
      transition={{ duration: 1.5, delay: 0.2, ease: 'easeOut' }}
      strokeLinecap="round"
    />
    <circle cx="50" cy="50" r="20" stroke="rgba(100, 210, 255, 0.2)" strokeWidth="8" fill="none" />
    <motion.circle 
      cx="50" cy="50" r="20" 
      stroke="#64d2ff" 
      strokeWidth="8" 
      fill="none"
      strokeDasharray="125.6"
      initial={{ strokeDashoffset: 125.6 }}
      animate={{ strokeDashoffset: 15 }}
      transition={{ duration: 1.5, delay: 0.4, ease: 'easeOut' }}
      strokeLinecap="round"
    />
  </svg>
);

// SVG Cardiac Waveform ECG Component
const CardiacECGSVG: React.FC = () => (
  <svg viewBox="0 0 200 50" className="w-full h-10 text-[#2dd4bf] overflow-visible">
    <path 
      d="M 0 25 L 30 25 L 38 10 L 46 40 L 54 5 L 62 45 L 70 25 L 100 25 L 108 18 L 116 32 L 124 25 L 160 25 L 168 8 L 176 42 L 184 25 L 200 25" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="drop-shadow-[0_0_10px_rgba(45,212,191,0.8)]"
    />
    <motion.circle
      cx="184" cy="25" r="3.5"
      fill="#2dd4bf"
      animate={{ r: [3.5, 6, 3.5], opacity: [0.6, 1, 0.6] }}
      transition={{ duration: 1.2, repeat: Infinity }}
    />
  </svg>
);

export const KeynoteHeroSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 600, y: 300 });
  const [demoOpen, setDemoOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);

  const headlineWords = [
    "Health", "Intelligence,", "Powered", "by", "Artificial", "Intelligence."
  ];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative bg-[#020617] text-white overflow-hidden selection:bg-[#14b8a6]/30 selection:text-white font-sans"
    >
      {/* 1. Dynamic Mouse Follow Radial Light Beam */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-px opacity-60 transition-opacity duration-300 z-0"
        style={{
          background: `radial-gradient(800px circle at ${mousePos.x}px ${mousePos.y}px, rgba(45, 212, 191, 0.14), transparent 75%)`,
        }}
      />

      {/* 2. Layered Ambient Aurora Mesh & Grid Background */}
      <div 
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[800px] w-[1200px] rounded-full bg-gradient-to-tr from-[#14b8a6]/20 via-[#0d9488]/15 to-cyan-500/15 blur-[170px]" 
      />

      {/* SVG Grid Overlay */}
      <div 
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(#14b8a6_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.07]" 
      />

      {/* Global Floating Glassmorphism Navbar */}
      <Navbar />

      {/* Main Hero Container */}
      <section id="hero" className="relative container mx-auto px-4 sm:px-6 lg:px-8 pt-24 lg:pt-28 pb-10 lg:pb-12 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* LEFT SIDE: Copywriting, Staggered Headline & CTAs */}
          <div className="lg:col-span-6 space-y-8 text-left">
            
            {/* Announcement Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#14b8a6]/20 via-white/[0.04] to-cyan-500/20 border border-[#14b8a6]/30 text-xs font-medium text-white shadow-[0_0_25px_rgba(20,184,166,0.2)]"
            >
              <Sparkles className="h-3.5 w-3.5 text-[#2dd4bf] animate-spin" style={{ animationDuration: '6s' }} />
              <span className="font-semibold text-[#2dd4bf]">FitTracker 2.0 Keynote</span>
              <span className="text-white/40">•</span>
              <span className="text-white/80">The AI Health Operating System</span>
              <ChevronRight className="h-3.5 w-3.5 text-white/40" />
            </motion.div>

            {/* Word-by-Word Animated Keynote Headline */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08] flex flex-wrap gap-x-3 gap-y-1">
                {headlineWords.map((word, idx) => (
                  <motion.span
                    key={idx}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * idx, ease: [0.215, 0.61, 0.355, 1] }}
                    className={idx >= 4 ? 'bg-gradient-to-r from-[#2dd4bf] via-[#14b8a6] to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(45,212,191,0.4)]' : ''}
                  >
                    {word}
                  </motion.span>
                ))}
              </h1>
            </div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-base sm:text-lg text-white/70 leading-relaxed font-normal max-w-xl"
            >
              Continuous biometric telemetry, instant AI food camera recognition, adaptive workout planning, and 24/7 cardiac health coaching—unified in one enterprise platform.
            </motion.p>

            {/* CTA Button Trio */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              {/* Primary magnetic CTA */}
              <Button
                asChild
                size="lg"
                className="h-13 px-7 bg-gradient-to-r from-[#14b8a6] to-[#0d9488] hover:from-[#0d9488] hover:to-[#0f766e] text-white font-bold rounded-2xl shadow-[0_0_35px_rgba(20,184,166,0.4)] transition-all hover:scale-105 group"
              >
                <Link to="/signup" className="flex items-center gap-2">
                  <span>Start Free Trial</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>

              {/* Secondary Demo Video CTA */}
              <Button
                type="button"
                onClick={() => setDemoOpen(true)}
                size="lg"
                variant="outline"
                className="h-13 px-6 bg-white/[0.03] hover:bg-white/[0.08] border-white/15 text-white font-semibold rounded-2xl backdrop-blur-md transition-all hover:scale-105 flex items-center gap-2.5"
              >
                <div className="p-1 rounded-full bg-[#14b8a6]/20 text-[#2dd4bf]">
                  <Play className="h-3.5 w-3.5 fill-current" />
                </div>
                <span>Watch Keynote Demo</span>
              </Button>

              {/* Tertiary Live Dashboard */}
              <Button
                asChild
                variant="ghost"
                size="lg"
                className="h-13 px-4 text-white/60 hover:text-white text-xs font-mono"
              >
                <Link to="/dashboard">View Live App →</Link>
              </Button>
            </motion.div>

            {/* Social Proof & Trust Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="pt-6 border-t border-white/[0.08] space-y-3"
            >
              <div className="flex items-center gap-3">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <span className="text-xs font-semibold text-white/90">
                  4.9/5 Rating
                </span>
                <span className="text-white/40 text-xs">•</span>
                <span className="text-xs text-white/65">
                  Trusted by 50,000+ active athletes & trainers
                </span>
              </div>

              <div className="flex flex-wrap gap-2 text-[11px] font-mono text-white/50">
                <span className="px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/[0.06]">500K+ Workouts</span>
                <span className="px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/[0.06]">1.2M+ Meals</span>
                <span className="px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/[0.06]">99.9% Uptime</span>
                <span className="px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/[0.06] text-[#2dd4bf]">SOC2 & HIPAA Ready</span>
              </div>
            </motion.div>

          </div>

          {/* RIGHT SIDE: Massive Multi-Device Interactive Hardware Matrix */}
          <div className="lg:col-span-6 relative flex justify-center items-center min-h-[520px] lg:min-h-[600px]">
            
            {/* 1. CENTER STAGE: FLOATING MACBOOK PRO DARK GLASS DASHBOARD */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="w-full max-w-xl rounded-3xl bg-[#07111f] border border-white/15 shadow-[0_30px_90px_rgba(0,0,0,0.85)] overflow-hidden relative z-10"
            >
              {/* Safari Window Header Bar */}
              <div className="h-9 px-4 bg-white/[0.03] border-b border-white/[0.08] flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-500/80" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                  <div className="h-3 w-3 rounded-full bg-green-500/80" />
                </div>
                <div className="px-4 py-0.5 rounded-md bg-white/[0.04] text-[10px] font-mono text-white/50 border border-white/[0.05] flex items-center gap-2">
                  <Lock className="h-3 w-3 text-[#14b8a6]" />
                  <span>app.fittracker.ai/dashboard</span>
                </div>
                <Wifi className="h-3.5 w-3.5 text-white/40" />
              </div>

              {/* MacBook Screen Body */}
              <div className="p-6 space-y-4">
                {/* Top Metrics Row */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
                    <div className="text-[10px] text-white/50 font-semibold uppercase tracking-wider">Health Score</div>
                    <div className="text-2xl font-extrabold text-[#2dd4bf] mt-1">94 / 100</div>
                    <div className="text-[9px] text-emerald-400 mt-0.5">Optimal Vitality</div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
                    <div className="text-[10px] text-white/50 font-semibold uppercase tracking-wider">Active Calories</div>
                    <div className="text-2xl font-extrabold text-amber-400 mt-1">1,840 kcal</div>
                    <div className="text-[9px] text-emerald-400 mt-0.5">↑ 14% vs target</div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
                    <div className="text-[10px] text-white/50 font-semibold uppercase tracking-wider">Resting Pulse</div>
                    <div className="text-2xl font-extrabold text-rose-400 mt-1">68 BPM</div>
                    <div className="text-[9px] text-white/40 mt-0.5">Continuous HRV</div>
                  </div>
                </div>

                {/* SVG Live Telemetry Graph Box */}
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-[#2dd4bf]" />
                      <span>Live Biometric & Telemetry Stream</span>
                    </span>
                    <span className="text-[10px] font-mono text-[#2dd4bf] bg-[#14b8a6]/10 px-2 py-0.5 rounded border border-[#14b8a6]/20">
                      Real-Time AI
                    </span>
                  </div>

                  {/* SVG Bar Graph */}
                  <div className="h-28 w-full flex items-end justify-between gap-2 pt-2">
                    {[35, 55, 40, 75, 60, 85, 95, 70, 88, 92, 65, 80].map((h, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                        <motion.div 
                          initial={{ height: 0 }}
                          animate={{ height: `${h}%` }}
                          transition={{ duration: 0.8, delay: 0.05 * i }}
                          className={`w-full rounded-t-md bg-gradient-to-t ${
                            i === 9 ? 'from-[#14b8a6] via-[#2dd4bf] to-cyan-300' : 'from-white/10 to-white/25'
                          }`}
                        />
                        <span className="text-[8px] font-mono text-white/30">{i + 1}h</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* 2. OVERLAY RIGHT: FLOATING IPHONE 16 PRO TITANIUM MOCKUP */}
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -bottom-6 -right-4 sm:-right-8 w-56 h-[380px] rounded-[38px] bg-gradient-to-b from-slate-700 via-slate-900 to-slate-950 p-2.5 border-[3px] border-slate-600/80 shadow-[0_30px_70px_rgba(0,0,0,0.9)] z-30 hidden sm:block"
            >
              {/* Soft Glass Reflection Glare */}
              <div 
                aria-hidden="true"
                className="pointer-events-none absolute top-0 right-0 w-28 h-56 bg-gradient-to-b from-white/15 via-white/5 to-transparent rounded-tr-[34px] z-40" 
              />

              <div className="relative w-full h-full rounded-[30px] bg-[#07111f] overflow-hidden border border-white/10 p-3 flex flex-col justify-between">
                {/* Dynamic Island */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 h-3.5 w-16 bg-black rounded-full z-40 flex items-center justify-between px-1.5">
                  <div className="h-1 w-1 rounded-full bg-slate-700" />
                  <div className="h-1.5 w-1.5 rounded-full bg-[#14b8a6] animate-pulse" />
                </div>

                <div className="pt-2 flex items-center justify-between text-[9px] font-mono text-white/50">
                  <span>09:41</span>
                  <span>5G</span>
                </div>

                {/* Content */}
                <div className="my-auto space-y-2.5">
                  <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-around">
                    <ActivityRingsSVG />
                    <div className="text-right space-y-0.5 text-[9px] font-mono text-white/60">
                      <div>MOVE 600 kcal</div>
                      <div>EXERCISE 45m</div>
                      <div>STAND 12h</div>
                    </div>
                  </div>

                  <div className="p-2 rounded-xl bg-white/[0.04] border border-white/[0.08] space-y-1">
                    <div className="text-[9px] text-rose-400 font-mono font-bold">CARDIAC TELEMETRY</div>
                    <CardiacECGSVG />
                  </div>
                </div>

                <div className="py-1.5 rounded-lg bg-[#14b8a6] text-white text-[10px] font-bold text-center">
                  FitTracker iOS Sync
                </div>
              </div>
            </motion.div>

            {/* 3. OVERLAY LEFT: FLOATING APPLE WATCH ULTRA PREVIEW */}
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              className="absolute -top-4 -left-4 sm:-left-8 w-44 p-3 rounded-3xl bg-[#07111f]/90 border border-white/20 backdrop-blur-xl shadow-2xl z-30 hidden sm:block space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#2dd4bf] uppercase">Apple Watch</span>
                <Heart className="h-3.5 w-3.5 text-rose-400 animate-bounce" />
              </div>
              <div className="text-xl font-extrabold text-white">68 <span className="text-xs text-white/50">BPM</span></div>
              <div className="text-[10px] text-white/60">10,420 steps today</div>
              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#14b8a6] to-[#2dd4bf] w-[85%]" />
              </div>
            </motion.div>

            {/* 4. LEVITATING TELEMETRY BADGES */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="absolute top-1/2 -right-12 z-40 hidden lg:flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.08] border border-white/20 backdrop-blur-md text-xs font-semibold text-white shadow-2xl"
            >
              <Droplets className="h-4 w-4 text-cyan-400" />
              <span>Hydration 2.4L (Optimal)</span>
            </motion.div>

            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
              className="absolute bottom-10 left-4 z-40 hidden lg:flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.08] border border-white/20 backdrop-blur-md text-xs font-semibold text-white shadow-2xl"
            >
              <Flame className="h-4 w-4 text-amber-400" />
              <span>24-Day Workout Streak 🔥</span>
            </motion.div>

          </div>

        </div>
      </section>

      {/* Subtle Glowing Divider to Features Section */}
      <div className="relative mx-auto max-w-5xl h-px bg-gradient-to-r from-transparent via-[#14b8a6]/40 to-transparent mt-4 lg:mt-8" />

      {/* KEYNOTE DEMO VIDEO MODAL DIALOG */}
      <AnimatePresence>
        {demoOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-4xl rounded-3xl bg-[#07111f] border border-white/20 p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-[#2dd4bf]" />
                  <span className="font-bold text-white text-lg">FitTracker 2.0 Keynote Demonstration</span>
                </div>
                <button 
                  onClick={() => setDemoOpen(false)}
                  className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Demo Video Frame */}
              <div className="relative aspect-video rounded-2xl bg-slate-900 border border-white/10 overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#14b8a6]/20 via-transparent to-cyan-500/20" />
                <div className="relative text-center space-y-3 p-6">
                  <div className="p-4 rounded-full bg-[#14b8a6]/20 border border-[#14b8a6]/40 text-[#2dd4bf] mx-auto w-fit">
                    <Play className="h-8 w-8 fill-current" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Interactive Keynote Video Stream</h3>
                  <p className="text-xs text-white/60 max-w-md mx-auto">
                    Demonstrating AI Food Recognition, Cardiac ECG Telemetry, and Workout Set Tracking in real time.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-white/60">
                <span>Duration: 2 mins 45 secs • 4K HDR</span>
                <Button onClick={() => setDemoOpen(false)} className="bg-[#14b8a6] hover:bg-[#0d9488] text-white">
                  Close Demo
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default KeynoteHeroSection;
