import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Sparkles, 
  ArrowRight, 
  Play, 
  CheckCircle2, 
  ShieldCheck, 
  Star, 
  Heart, 
  Flame, 
  Droplets, 
  Zap, 
  Activity, 
  Wifi, 
  Lock, 
  X,
  Award,
  ChevronRight,
  Shield,
  Smartphone
} from 'lucide-react';

// SVG Apple-style Activity Rings Component for CTA mockup
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
      animate={{ strokeDashoffset: 35 }}
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
      animate={{ strokeDashoffset: 25 }}
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
      animate={{ strokeDashoffset: 10 }}
      transition={{ duration: 1.5, delay: 0.4, ease: 'easeOut' }}
      strokeLinecap="round"
    />
  </svg>
);

// SVG Cardiac Waveform Component
const CardiacECGSVG: React.FC = () => (
  <svg viewBox="0 0 200 50" className="w-full h-9 text-[#2dd4bf] overflow-visible">
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

export const KeynoteCtaSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 500, y: 300 });
  const [demoOpen, setDemoOpen] = useState(false);

  const headlineWords = ["Your", "Health.", "Powered", "by", "AI."];

  const benefits = [
    "No Credit Card Required",
    "Free Forever Tier",
    "AI Neural Coaching",
    "256-bit AES Encryption",
    "Cross-Platform Sync",
    "Instant Setup (30 Sec)",
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
    <section 
      id="faq"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative pt-8 pb-20 lg:pt-12 lg:pb-28 bg-[#020617] text-white overflow-hidden"
    >
      {/* 0. Top Ambient Aurora Transition Blur */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-[320px] w-[750px] rounded-full bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(20,184,166,0.15),transparent_70%)] blur-[100px]" 
      />

      {/* 1. Dynamic Mouse Follow Spotlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-px opacity-60 transition-opacity duration-300 z-0"
        style={{
          background: `radial-gradient(750px circle at ${mousePos.x}px ${mousePos.y}px, rgba(45, 212, 191, 0.13), transparent 75%)`,
        }}
      />

      {/* 2. Ambient Aurora Mesh Gradients */}
      <div 
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[1000px] rounded-full bg-gradient-to-tr from-[#14b8a6]/20 via-[#0d9488]/15 to-cyan-500/15 blur-[160px]" 
      />

      {/* Grid Pattern Overlay */}
      <div 
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(#14b8a6_1px,transparent_1px)] [background-size:28px_28px] opacity-[0.06]" 
      />

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl z-10">
        
        {/* Main Large Glass Card */}
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-[36px] sm:rounded-[44px] bg-white/[0.02] border border-white/15 backdrop-blur-3xl p-8 sm:p-12 lg:p-16 shadow-[0_35px_100px_rgba(0,0,0,0.85)] overflow-hidden"
        >
          {/* Top Subtle Shimmer Highlight */}
          <div 
            aria-hidden="true"
            className="pointer-events-none absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#14b8a6]/50 to-transparent" 
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* LEFT SIDE: Copywriting & Actions */}
            <div className="lg:col-span-7 space-y-8 text-left">
              
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#14b8a6]/10 border border-[#14b8a6]/30 text-[#2dd4bf] text-xs font-semibold tracking-wider uppercase shadow-[0_0_20px_rgba(20,184,166,0.2)]"
              >
                <Sparkles className="h-3.5 w-3.5 text-[#2dd4bf] animate-pulse" />
                <span>The Future of Health • FitTracker AI</span>
              </motion.div>

              {/* Word-by-Word Animated Headline */}
              <div className="space-y-2">
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1] flex flex-wrap gap-x-3 gap-y-1">
                  {headlineWords.map((word, idx) => (
                    <motion.span
                      key={idx}
                      initial={{ opacity: 0, y: 24 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.08 * idx }}
                      className={idx >= 2 ? 'bg-gradient-to-r from-[#2dd4bf] via-[#14b8a6] to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(45,212,191,0.35)]' : ''}
                    >
                      {word}
                    </motion.span>
                  ))}
                </h2>
              </div>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-white/70 leading-relaxed font-normal max-w-xl">
                Join over 50,000+ athletes, personal trainers, and health-conscious individuals building daily vitality habits with real-time AI guidance.
              </p>

              {/* Benefit Chips Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
                {benefits.map((b, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center gap-2 p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs font-medium text-white/85"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#2dd4bf] flex-shrink-0" />
                    <span className="truncate">{b}</span>
                  </div>
                ))}
              </div>

              {/* Buttons Group */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Button
                  asChild
                  size="lg"
                  className="h-13 px-8 bg-gradient-to-r from-[#14b8a6] to-[#0d9488] hover:from-[#0d9488] hover:to-[#0f766e] text-white font-bold rounded-2xl shadow-[0_0_35px_rgba(20,184,166,0.4)] transition-all hover:scale-105 group"
                >
                  <Link to="/signup" className="flex items-center gap-2">
                    <span>Start Free</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>

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
                  <span>Watch Demo</span>
                </Button>

                <Button
                  asChild
                  variant="ghost"
                  size="lg"
                  className="h-13 px-4 text-white/60 hover:text-white text-xs font-mono"
                >
                  <Link to="/dashboard">Explore Dashboard →</Link>
                </Button>
              </div>

              {/* Trust Bar */}
              <div className="pt-6 border-t border-white/[0.08] flex flex-wrap items-center gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="font-bold text-white">4.9 / 5.0</span>
                </div>
                <span className="text-white/30">•</span>
                <span className="text-white/65">50,000+ Active Users</span>
                <span className="text-white/30">•</span>
                <span className="text-[#2dd4bf] font-mono font-semibold">SOC2 & HIPAA Ready</span>
              </div>

            </div>

            {/* RIGHT SIDE: Floating Hardware Mockup & Levitating Widgets */}
            <div className="lg:col-span-5 relative flex justify-center items-center min-h-[440px]">
              
              {/* REALISTIC FLOATING IPHONE 16 PRO MOCKUP */}
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="relative w-64 h-[430px] rounded-[42px] bg-gradient-to-b from-slate-700 via-slate-900 to-slate-950 p-3 border-[3px] border-slate-600/80 shadow-[0_30px_80px_rgba(0,0,0,0.9)] z-20"
              >
                {/* Soft Glass Glare Overlay */}
                <div 
                  aria-hidden="true"
                  className="pointer-events-none absolute top-0 right-0 w-32 h-64 bg-gradient-to-b from-white/15 via-white/5 to-transparent rounded-tr-[38px] z-30" 
                />

                <div className="relative w-full h-full rounded-[34px] bg-[#07111f] overflow-hidden border border-white/10 p-3.5 flex flex-col justify-between">
                  {/* Dynamic Island */}
                  <div className="absolute top-2.5 left-1/2 -translate-x-1/2 h-3.5 w-18 bg-black rounded-full z-40 flex items-center justify-between px-2">
                    <div className="h-1 w-1 rounded-full bg-slate-700" />
                    <div className="h-1.5 w-1.5 rounded-full bg-[#14b8a6] animate-pulse" />
                  </div>

                  <div className="pt-2 flex items-center justify-between text-[9px] font-mono text-white/50">
                    <span>09:41</span>
                    <span>5G</span>
                  </div>

                  {/* Inner Content */}
                  <div className="my-auto space-y-3">
                    <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-around">
                      <ActivityRingsSVG />
                      <div className="text-right space-y-0.5 text-[9px] font-mono text-white/60">
                        <div>MOVE 600 kcal</div>
                        <div>EXERCISE 45m</div>
                        <div>STAND 12h</div>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] space-y-1">
                      <div className="text-[9px] text-rose-400 font-mono font-bold">CARDIAC TELEMETRY</div>
                      <CardiacECGSVG />
                    </div>
                  </div>

                  <div className="py-2 rounded-xl bg-gradient-to-r from-[#14b8a6] to-[#0d9488] text-white text-[11px] font-bold text-center shadow-md">
                    FitTracker AI Ready
                  </div>
                </div>
              </motion.div>

              {/* LEVITATING TELEMETRY WIDGETS */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                className="absolute -top-4 -left-6 z-30 hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.08] border border-white/20 backdrop-blur-md text-xs font-semibold text-white shadow-2xl"
              >
                <Droplets className="h-4 w-4 text-cyan-400" />
                <span>Hydration 2.4L (Optimal)</span>
              </motion.div>

              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute -bottom-4 -right-4 z-30 hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.08] border border-white/20 backdrop-blur-md text-xs font-semibold text-white shadow-2xl"
              >
                <Flame className="h-4 w-4 text-amber-400" />
                <span>24-Day Streak 🔥</span>
              </motion.div>

            </div>

          </div>
        </motion.div>

      </div>

      {/* DEMO VIDEO MODAL */}
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
                  <span className="font-bold text-white text-lg">FitTracker AI Keynote Stream</span>
                </div>
                <button 
                  onClick={() => setDemoOpen(false)}
                  className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

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
    </section>
  );
};

export default KeynoteCtaSection;
