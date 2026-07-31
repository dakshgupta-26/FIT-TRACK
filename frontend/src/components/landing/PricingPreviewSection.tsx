import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  ChevronDown, 
  ChevronUp, 
  Lock, 
  Watch,
  HeartPulse,
  Activity,
  Flame,
  Bot,
  Camera,
  Infinity as InfinityIcon,
  HelpCircle,
  X,
  Music,
  Check
} from 'lucide-react';

export const PricingPreviewSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  const [isYearly, setIsYearly] = useState(true);
  const [showComparison, setShowComparison] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 600, y: 300 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const toggleAndScrollComparison = () => {
    const nextState = !showComparison;
    setShowComparison(nextState);

    if (nextState) {
      setTimeout(() => {
        if ((window as any).lenis) {
          (window as any).lenis.scrollTo(tableRef.current, { offset: -80, duration: 1.2 });
        } else if (tableRef.current) {
          tableRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
    }
  };

  const comparisonFeatures = [
    { name: "AI Health Dashboard", free: "check", pro: "check", enterprise: "check" },
    { name: "AI Health Coach", free: "20 chats/day", pro: "Unlimited 24/7", enterprise: "Unlimited 24/7" },
    { name: "Food Camera AI Scanner", free: "10 scans/day", pro: "Unlimited", enterprise: "Unlimited" },
    { name: "Workout Tracking", free: "check", pro: "check", enterprise: "check" },
    { name: "Nutrition Tracking", free: "check", pro: "check", enterprise: "check" },
    { name: "Sleep Tracking", free: "Basic", pro: "Live Sync", enterprise: "Live Sync" },
    { name: "Water Tracking", free: "check", pro: "check", enterprise: "check" },
    { name: "AI Workout Suggestions", free: "Basic", pro: "Adaptive Real-time", enterprise: "Custom Engine" },
    { name: "AI Nutrition Suggestions", free: "Basic", pro: "Macro Optimizer", enterprise: "Custom Engine" },
    { name: "Smartwatch Integration", free: "cross", pro: "Apple, Garmin, Wear OS, Galaxy, Fitbit", enterprise: "Full Hardware Sync" },
    { name: "Adaptive Workout Music", free: "cross", pro: "Full Spotify Sync", enterprise: "Full Spotify Sync" },
    { name: "Live Heart Rate Sync", free: "cross", pro: "Continuous Live", enterprise: "Continuous Live" },
    { name: "Live Sleep Sync", free: "cross", pro: "Continuous Live", enterprise: "Continuous Live" },
    { name: "Live Step Tracking", free: "Basic Sync", pro: "Real-time Live", enterprise: "Real-time Live" },
    { name: "Automatic Workout Detection", free: "cross", pro: "check", enterprise: "check" },
    { name: "AI Recovery Insights", free: "cross", pro: "Readiness Score", enterprise: "Readiness Score" },
    { name: "AI Meal Planning", free: "cross", pro: "check", enterprise: "check" },
    { name: "AI Weekly Reports", free: "cross", pro: "Full PDF Export", enterprise: "Custom Branding" },
    { name: "Predictive Health Analysis", free: "cross", pro: "check", enterprise: "check" },
    { name: "Advanced Analytics", free: "Basic", pro: "Deep Metrics", enterprise: "Full Telemetry" },
    { name: "PDF Reports", free: "cross", pro: "check", enterprise: "check" },
    { name: "API Access", free: "cross", pro: "cross", enterprise: "REST API & Webhooks" },
    { name: "Team Dashboard", free: "cross", pro: "cross", enterprise: "Multi-User Admin" },
    { name: "Admin Panel", free: "cross", pro: "cross", enterprise: "Included" },
    { name: "SSO (SAML)", free: "cross", pro: "cross", enterprise: "Included" },
    { name: "Priority Support", free: "Community", pro: "24/7 Priority", enterprise: "Dedicated Manager" },
    { name: "Early Access Features", free: "cross", pro: "check", enterprise: "check" },
  ];

  const renderCellContent = (val: string) => {
    if (val === "check") {
      return <CheckCircle2 className="h-4 w-4 text-[#2dd4bf] mx-auto" />;
    }
    if (val === "cross") {
      return <X className="h-4 w-4 text-rose-500/80 mx-auto" />;
    }
    if (val.includes("day") || val === "Basic") {
      return (
        <span className="inline-block text-[10px] font-mono text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20 font-bold">
          {val}
        </span>
      );
    }
    if (val.includes("Unlimited") || val.includes("Full") || val.includes("Live") || val.includes("Readiness")) {
      return (
        <span className="inline-block text-[10px] font-mono text-[#2dd4bf] bg-[#14b8a6]/20 px-2 py-0.5 rounded border border-[#14b8a6]/40 font-bold">
          {val}
        </span>
      );
    }
    return <span className="text-white/80 font-medium">{val}</span>;
  };

  return (
    <section
      id="pricing"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative pt-24 pb-12 lg:pt-32 lg:pb-16 bg-[#020617] text-white overflow-hidden border-t border-white/[0.08]"
    >
      {/* Dynamic Mouse Follow Spotlight Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-px opacity-60 transition-opacity duration-300 z-0"
        style={{
          background: `radial-gradient(800px circle at ${mousePos.x}px ${mousePos.y}px, rgba(45, 212, 191, 0.12), transparent 75%)`,
        }}
      />

      {/* Layered Ambient Aurora Blur */}
      <div 
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 h-[700px] w-[1100px] rounded-full bg-gradient-to-tr from-[#14b8a6]/15 via-[#0d9488]/10 to-cyan-500/15 blur-[170px]" 
      />

      {/* Subtle Grid Pattern */}
      <div 
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(#14b8a6_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.06]" 
      />

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl z-10 space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#14b8a6]/10 border border-[#14b8a6]/30 text-[#2dd4bf] text-xs font-semibold uppercase tracking-wider shadow-[0_0_20px_rgba(20,184,166,0.2)]"
          >
            <Sparkles className="h-3.5 w-3.5 text-[#2dd4bf] animate-pulse" />
            <span>Experience AI Free • Unlock Full Telemetry with Pro</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight"
          >
            Choose the <span className="bg-gradient-to-r from-[#2dd4bf] via-[#14b8a6] to-cyan-400 bg-clip-text text-transparent">Perfect AI Plan</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-white/70 font-normal leading-relaxed"
          >
            Experience AI tools for free with daily limits, or upgrade to Pro to unlock unlimited intelligence and live smartwatch telemetry.
          </motion.p>

          {/* Interactive Billing Toggle */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="pt-4 flex items-center justify-center gap-4"
          >
            <span className={`text-xs font-semibold transition-colors ${!isYearly ? 'text-white font-bold' : 'text-white/50'}`}>
              Monthly Billing
            </span>

            <button
              type="button"
              onClick={() => setIsYearly(!isYearly)}
              className="relative w-14 h-8 rounded-full bg-white/10 p-1 border border-white/15 focus:outline-none transition-colors"
              aria-label="Toggle Billing Cycle"
            >
              <motion.div
                layout
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className={`w-6 h-6 rounded-full bg-gradient-to-r from-[#14b8a6] to-[#2dd4bf] shadow-md ${
                  isYearly ? 'ml-6' : 'ml-0'
                }`}
              />
            </button>

            <span className={`text-xs font-semibold transition-colors flex items-center gap-2 ${isYearly ? 'text-white font-bold' : 'text-white/50'}`}>
              <span>Annual Billing</span>
              <span className="px-2 py-0.5 rounded-full bg-[#14b8a6]/20 border border-[#14b8a6]/40 text-[#2dd4bf] text-[10px] font-bold uppercase tracking-wider">
                Save 20%
              </span>
            </span>
          </motion.div>
        </div>

        {/* 3 Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          
          {/* 1. FREE PLAN */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative rounded-[30px] bg-white/[0.02] border border-white/10 backdrop-blur-2xl p-8 flex flex-col justify-between hover:border-white/25 transition-all hover:scale-[1.02] group shadow-xl"
          >
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">Free Starter</h3>
                  <span className="text-[10px] font-mono text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                    Experience AI
                  </span>
                </div>
                <p className="text-xs text-white/60 mt-1">Try core AI tools daily for personal health tracking.</p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-4xl sm:text-5xl font-extrabold text-white">₹0</span>
                <span className="text-xs text-white/50 font-mono">/ month</span>
              </div>

              <div className="space-y-3 pt-2 border-t border-white/[0.08]">
                <div className="text-xs font-semibold text-white/80 uppercase tracking-wider">AI Features (Daily Limits):</div>
                
                <div className="flex items-center justify-between text-xs text-white/80 p-2 rounded-lg bg-white/[0.03] border border-white/[0.05]">
                  <div className="flex items-center gap-2">
                    <Camera className="h-4 w-4 text-[#2dd4bf]" />
                    <span>Food Camera AI Scanner</span>
                  </div>
                  <span className="text-[10px] font-mono text-amber-300 bg-amber-400/10 px-1.5 py-0.5 rounded">10 scans/day</span>
                </div>

                <div className="flex items-center justify-between text-xs text-white/80 p-2 rounded-lg bg-white/[0.03] border border-white/[0.05]">
                  <div className="flex items-center gap-2">
                    <Bot className="h-4 w-4 text-[#2dd4bf]" />
                    <span>AI Health Coach</span>
                  </div>
                  <span className="text-[10px] font-mono text-amber-300 bg-amber-400/10 px-1.5 py-0.5 rounded">20 chats/day</span>
                </div>

                <div className="flex items-center justify-between text-xs text-white/80 p-2 rounded-lg bg-white/[0.03] border border-white/[0.05]">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-[#2dd4bf]" />
                    <span>AI Workout Suggestions</span>
                  </div>
                  <span className="text-[10px] font-mono text-white/50">Basic</span>
                </div>

                <div className="flex items-center justify-between text-xs text-white/80 p-2 rounded-lg bg-white/[0.03] border border-white/[0.05]">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-[#2dd4bf]" />
                    <span>AI Nutrition Suggestions</span>
                  </div>
                  <span className="text-[10px] font-mono text-white/50">Basic</span>
                </div>

                {/* Exclusions */}
                <div className="pt-2 text-xs font-semibold text-white/50 uppercase tracking-wider">Unavailable in Free:</div>
                
                <div className="flex items-center justify-between text-xs text-white/40 p-2 rounded-lg bg-rose-950/10 border border-rose-500/10">
                  <div className="flex items-center gap-2">
                    <X className="h-4 w-4 text-rose-500/80 flex-shrink-0" />
                    <span className="line-through decoration-rose-500/40">Smartwatch Hardware Sync</span>
                  </div>
                  <span className="text-[9px] font-mono text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20">Pro Only</span>
                </div>

                <div className="flex items-center justify-between text-xs text-white/40 p-2 rounded-lg bg-rose-950/10 border border-rose-500/10">
                  <div className="flex items-center gap-2">
                    <X className="h-4 w-4 text-rose-500/80 flex-shrink-0" />
                    <span className="line-through decoration-rose-500/40">Adaptive Workout Music Sync</span>
                  </div>
                  <span className="text-[9px] font-mono text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20">Pro Only</span>
                </div>

                <div className="pt-2 text-xs font-semibold text-white/80 uppercase tracking-wider">Standard Features:</div>
                {[
                  "Basic Health Dashboard",
                  "Manual Workout & Habit Logger",
                  "Nutrition & Water Tracker",
                  "Community Access",
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-white/70">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#2dd4bf]" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-8 space-y-3">
              <Button asChild variant="outline" className="w-full h-12 bg-white/[0.04] hover:bg-white/[0.1] border-white/15 text-white font-semibold rounded-xl transition-all">
                <a href="/signup">Start Free</a>
              </Button>
              <button 
                type="button" 
                onClick={toggleAndScrollComparison}
                className="block w-full text-center text-[11px] font-mono text-white/50 hover:text-[#2dd4bf] transition-colors"
              >
                {showComparison ? "Hide Full Comparison ↑" : "View Full Feature Comparison ↓"}
              </button>
            </div>
          </motion.div>

          {/* 2. PRO AI PLAN (MOST POPULAR) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="relative rounded-[32px] bg-gradient-to-b from-[#07111f] via-[#071728] to-[#07111f] border-2 border-[#14b8a6] backdrop-blur-3xl p-8 lg:p-9 flex flex-col justify-between shadow-[0_20px_60px_rgba(20,184,166,0.25)] lg:-translate-y-4 group z-20"
          >
            {/* Top Most Popular Badge */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#14b8a6] to-[#2dd4bf] text-white text-[11px] font-extrabold uppercase tracking-wider shadow-lg flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 fill-current" />
              <span>Full AI Ecosystem</span>
            </div>

            <div className="space-y-6 pt-2">
              <div>
                <h3 className="text-2xl font-extrabold text-white flex items-center justify-between">
                  <span>Pro AI</span>
                  <span className="text-xs font-mono text-[#2dd4bf] bg-[#14b8a6]/20 px-2.5 py-0.5 rounded border border-[#14b8a6]/40">
                    Individual
                  </span>
                </h3>
                <p className="text-xs text-white/70 mt-1">Unlock unrestricted AI intelligence, smartwatch hardware telemetry & live ECG.</p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-4xl sm:text-5xl font-extrabold text-white">
                  {isYearly ? "₹399" : "₹499"}
                </span>
                <span className="text-xs text-white/50 font-mono">/ month {isYearly && "(billed annually)"}</span>
              </div>

              <div className="space-y-2.5 pt-2 border-t border-white/10">
                <div className="text-xs font-semibold text-[#2dd4bf] uppercase tracking-wider flex items-center justify-between">
                  <span>Everything in Free, plus:</span>
                  <span className="text-[10px] font-bold text-[#2dd4bf] bg-[#14b8a6]/20 px-2 py-0.5 rounded">UNLIMITED AI</span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-white font-medium p-2 rounded-lg bg-[#14b8a6]/10 border border-[#14b8a6]/25">
                    <div className="flex items-center gap-2">
                      <Bot className="h-4 w-4 text-[#2dd4bf]" />
                      <span>Unlimited AI Health Coach</span>
                    </div>
                    <span className="text-[9px] font-extrabold text-white bg-[#14b8a6] px-1.5 py-0.5 rounded">UNLIMITED</span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-white font-medium p-2 rounded-lg bg-[#14b8a6]/10 border border-[#14b8a6]/25">
                    <div className="flex items-center gap-2">
                      <Camera className="h-4 w-4 text-[#2dd4bf]" />
                      <span>Unlimited Food Camera AI</span>
                    </div>
                    <span className="text-[9px] font-extrabold text-white bg-[#14b8a6] px-1.5 py-0.5 rounded">UNLIMITED</span>
                  </div>
                </div>

                {/* Smartwatch Badge Row */}
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-white">
                    <Watch className="h-3.5 w-3.5 text-[#2dd4bf]" />
                    <span>Smartwatch Live Sync</span>
                  </div>
                  <div className="flex flex-wrap gap-1 text-[9px] font-mono text-white/70">
                    <span className="px-1.5 py-0.5 rounded bg-white/10">Apple Watch</span>
                    <span className="px-1.5 py-0.5 rounded bg-white/10">Galaxy Watch</span>
                    <span className="px-1.5 py-0.5 rounded bg-white/10">Wear OS</span>
                    <span className="px-1.5 py-0.5 rounded bg-white/10">Garmin</span>
                    <span className="px-1.5 py-0.5 rounded bg-white/10">Fitbit</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-white font-medium p-2 rounded-lg bg-[#14b8a6]/10 border border-[#14b8a6]/25">
                  <div className="flex items-center gap-2">
                    <Music className="h-4 w-4 text-[#2dd4bf]" />
                    <span>Adaptive Workout Music Sync</span>
                  </div>
                  <span className="text-[9px] font-extrabold text-white bg-[#14b8a6] px-1.5 py-0.5 rounded">INCLUDED</span>
                </div>

                {[
                  "Live Heart Rate, HRV & Sleep Sync",
                  "Automatic Workout Detection",
                  "AI Recovery Score & Readiness",
                  "AI Meal Planning & Macro Optimizer",
                  "AI Weekly Predictive PDF Reports",
                  "Priority 24/7 Neural Support",
                  "Early Access to Experimental AI",
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs font-medium text-white/95">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#2dd4bf] flex-shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-8 space-y-3">
              <Button asChild className="w-full h-12 bg-gradient-to-r from-[#14b8a6] to-[#0d9488] hover:from-[#0d9488] hover:to-[#0f766e] text-white font-bold rounded-xl shadow-[0_0_25px_rgba(20,184,166,0.4)] transition-all hover:scale-105">
                <a href="/signup">Start 14-Day Free Trial</a>
              </Button>
              <button 
                type="button" 
                onClick={toggleAndScrollComparison}
                className="block w-full text-center text-[11px] font-mono text-[#2dd4bf]/80 hover:text-[#2dd4bf] transition-colors"
              >
                {showComparison ? "Hide Full Comparison ↑" : "View Full Feature Comparison ↓"}
              </button>
            </div>
          </motion.div>

          {/* 3. ENTERPRISE PLAN */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="relative rounded-[30px] bg-white/[0.02] border border-white/10 backdrop-blur-2xl p-8 flex flex-col justify-between hover:border-white/25 transition-all hover:scale-[1.02] group shadow-xl"
          >
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white">Enterprise</h3>
                <p className="text-xs text-white/60 mt-1">For gyms, trainers, hospitals, and fitness organizations.</p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl font-extrabold text-white">Custom</span>
                <span className="text-xs text-white/50 font-mono">/ volume tier</span>
              </div>

              <div className="space-y-3 pt-2 border-t border-white/[0.08]">
                <div className="text-xs font-semibold text-white/80 uppercase tracking-wider">Everything in Pro, plus:</div>
                {[
                  "Multi-User Gym Admin Dashboard",
                  "Client Telemetry & Analytics",
                  "REST API & Webhooks Access",
                  "SAML SSO & Custom Branding",
                  "HIPAA & SOC2 Compliance Export",
                  "Dedicated Account Manager & SLA",
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-white/70">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#2dd4bf]" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-8 space-y-3">
              <Button asChild variant="outline" className="w-full h-12 bg-white/[0.04] hover:bg-white/[0.1] border-white/15 text-white font-semibold rounded-xl transition-all">
                <a href="/contact">Contact Sales</a>
              </Button>
              <button 
                type="button" 
                onClick={toggleAndScrollComparison}
                className="block w-full text-center text-[11px] font-mono text-white/40 hover:text-[#2dd4bf] transition-colors"
              >
                {showComparison ? "Hide Full Comparison ↑" : "View Full Feature Comparison ↓"}
              </button>
            </div>
          </motion.div>

        </div>

        {/* EXPANDABLE COMPREHENSIVE COMPARISON TABLE */}
        <div ref={tableRef} className="pt-6">
          <div className="text-center">
            <button
              type="button"
              onClick={toggleAndScrollComparison}
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#2dd4bf] hover:text-white transition-colors py-3 px-6 rounded-full bg-[#14b8a6]/10 border border-[#14b8a6]/30 shadow-[0_0_20px_rgba(20,184,166,0.2)]"
            >
              <span>{showComparison ? "Hide Feature Comparison Matrix ↑" : "View Full Feature Comparison Matrix ↓"}</span>
              {showComparison ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          </div>

          <AnimatePresence>
            {showComparison && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="mt-8 rounded-3xl bg-[#07111f]/90 border border-white/15 backdrop-blur-2xl p-6 sm:p-8 shadow-[0_30px_90px_rgba(0,0,0,0.8)] overflow-hidden"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-[#2dd4bf]" />
                      <span>Complete Plan & AI Feature Matrix</span>
                    </h3>
                    <p className="text-xs text-white/60 mt-1">Detailed comparison across all 27+ core modules and daily AI limits.</p>
                  </div>
                  <button 
                    onClick={toggleAndScrollComparison}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs font-mono flex items-center gap-1"
                  >
                    <span>Close</span>
                    <ChevronUp className="h-4 w-4" />
                  </button>
                </div>

                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead className="sticky top-0 bg-[#07111f] backdrop-blur-xl border-b border-white/15 z-20">
                      <tr className="text-white/60 font-mono text-[11px]">
                        <th className="py-4 px-4 font-bold text-white">Feature Module</th>
                        <th className="py-4 px-4 text-center font-bold text-white/80">Free Starter</th>
                        <th className="py-4 px-4 text-center font-bold text-[#2dd4bf]">Pro AI</th>
                        <th className="py-4 px-4 text-center font-bold text-white">Enterprise</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.06]">
                      {comparisonFeatures.map((row, idx) => (
                        <tr 
                          key={idx} 
                          className="even:bg-white/[0.02] hover:bg-[#14b8a6]/10 transition-colors"
                        >
                          <td className="py-3.5 px-4 text-white/90 font-medium flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#14b8a6]" />
                            <span>{row.name}</span>
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            {renderCellContent(row.free)}
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            {renderCellContent(row.pro)}
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            {renderCellContent(row.enterprise)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="pt-6 border-t border-white/10 mt-6 flex flex-wrap items-center justify-between text-xs text-white/60">
                  <span>Showing all 27 feature modules. Updated for FitTracker 2.0 AI.</span>
                  <button 
                    onClick={toggleAndScrollComparison}
                    className="text-[#2dd4bf] hover:underline font-mono"
                  >
                    Collapse Comparison Table ↑
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* TRUST & GUARANTEE BAR */}
        <div className="pt-8 border-t border-white/[0.08] flex flex-wrap items-center justify-center gap-6 text-xs text-white/60 font-mono">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-[#2dd4bf]" /> No Credit Card Required
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-[#2dd4bf]" /> Cancel Anytime
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-[#2dd4bf]" /> 30-Day Guarantee
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5 text-white/90 font-bold">
            <Lock className="h-3.5 w-3.5 text-[#2dd4bf]" /> 256-Bit Encrypted Payments
          </span>
        </div>

        {/* SUBTLE GLOWING DIVIDER TO FINAL CTA */}
        <div className="relative mx-auto max-w-5xl h-px bg-gradient-to-r from-transparent via-[#14b8a6]/40 to-transparent mt-12 lg:mt-16" />

      </div>
    </section>
  );
};

export default PricingPreviewSection;
