import React from 'react';
import { motion } from 'framer-motion';
import { BackgroundAurora } from './BackgroundAurora';
import { PhoneShowcase } from './PhoneShowcase';
import { AuthCard } from './AuthCard';
import { Sparkles } from 'lucide-react';

interface AuthContainerProps {
  initialMode?: 'login' | 'signup';
  children?: React.ReactNode;
}

export const AuthContainer: React.FC<AuthContainerProps> = ({ initialMode = 'signup', children }) => {
  // Staggered Spring Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05,
      },
    },
  };

  const itemFadeUp = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.25, 1, 0.5, 1] },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.94, x: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      x: 0,
      transition: { type: 'spring', stiffness: 350, damping: 25, delay: 0.15 },
    },
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#04060a] text-white flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans select-none">
      {/* Background Animated Mesh, Aurora, Particles & Noise */}
      <BackgroundAurora />

      {/* Main Viewport Container (Zero Scrollable 100vh Centered Workspace) */}
      <div className="relative z-10 w-full max-w-[1400px] h-full flex items-center justify-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full h-full flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-8 xl:gap-12"
        >
          {/* ================= LEFT SIDE: Product Showcase (58% width on desktop) ================= */}
          <div className="w-full lg:w-[58%] flex flex-col justify-center items-center lg:items-start text-center lg:text-left space-y-3 xl:space-y-4 max-h-full">
            
            {/* Feature Badge */}
            <motion.div variants={itemFadeUp}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-[11px] font-mono backdrop-blur-md shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
                <span>Next-Gen AI Health Operating System</span>
              </div>
            </motion.div>

            {/* Very Large Headline */}
            <motion.h1
              variants={itemFadeUp}
              className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black tracking-tight leading-[1.08] text-white"
            >
              Health Intelligence,
              <br />
              <span className="bg-gradient-to-r from-teal-300 via-emerald-400 to-cyan-300 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(45,212,191,0.35)]">
                Powered by AI.
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              variants={itemFadeUp}
              className="text-xs sm:text-sm lg:text-base text-slate-300 leading-relaxed font-normal max-w-xl"
            >
              One intelligent platform for fitness, nutrition, AI coaching, meal recognition, smartwatch telemetry, and predictive health insights.
            </motion.p>

            {/* Floating Realistic iPhone Product Showcase */}
            <motion.div
              variants={itemFadeUp}
              className="w-full flex justify-center lg:justify-start pt-1"
            >
              <PhoneShowcase />
            </motion.div>
          </div>

          {/* ================= RIGHT SIDE: Authentication Card or OTP Verification Card ================= */}
          <div className="w-full lg:w-[42%] flex justify-center lg:justify-end items-center max-h-full">
            <motion.div variants={cardVariants} className="w-full flex justify-center lg:justify-end">
              {children || <AuthCard initialMode={initialMode} />}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
