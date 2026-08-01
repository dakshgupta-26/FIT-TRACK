import React from 'react';
import { motion } from 'framer-motion';
import { PhoneAppPreview } from './PhoneAppPreview';
import { Wifi, Signal, Battery } from 'lucide-react';

export const PhoneShowcase: React.FC = () => {
  return (
    <div className="relative w-[235px] sm:w-[250px] h-[430px] sm:h-[450px] mx-auto select-none shrink-0">
      {/* Floating Levitation Motion Wrapper: 1 deg rotate, 6px translation */}
      <motion.div
        animate={{
          y: [0, -6, 0],
          rotate: [0, 1, 0, -1, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="relative w-full h-full"
      >
        {/* Floating Ambient Teal Glow Underneath */}
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-4/5 h-6 bg-teal-500/25 rounded-[100%] blur-lg pointer-events-none" />

        {/* iPhone Outer Hardware Frame */}
        <div className="relative w-full h-full rounded-[44px] p-2.5 bg-gradient-to-b from-slate-700 via-slate-800 to-slate-950 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.9),0_0_35px_rgba(20,184,166,0.25)] border border-slate-600/40 flex flex-col">
          {/* Outer Side Buttons Details */}
          <div className="absolute -left-[3px] top-20 w-[3px] h-6 bg-slate-600 rounded-l" />
          <div className="absolute -left-[3px] top-32 w-[3px] h-9 bg-slate-600 rounded-l" />
          <div className="absolute -left-[3px] top-44 w-[3px] h-9 bg-slate-600 rounded-l" />
          <div className="absolute -right-[3px] top-28 w-[3px] h-14 bg-slate-600 rounded-r" />

          {/* Inner Screen Container */}
          <div className="relative w-full h-full rounded-[36px] bg-black overflow-hidden border border-slate-900 flex flex-col">
            
            {/* Status Bar & Dynamic Island */}
            <div className="relative z-30 pt-2.5 px-4 flex items-center justify-between text-white text-[10px] font-semibold tracking-tight bg-slate-950/90 backdrop-blur-md">
              <span>9:41</span>

              {/* Dynamic Island */}
              <div className="w-16 h-3.5 bg-black rounded-full border border-slate-800 flex items-center justify-end px-1 gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                <div className="w-1 h-1 rounded-full bg-slate-700" />
              </div>

              {/* Status Icons */}
              <div className="flex items-center gap-1 text-slate-300">
                <Signal className="w-2.5 h-2.5" />
                <Wifi className="w-2.5 h-2.5" />
                <Battery className="w-3 h-3 text-emerald-400" />
              </div>
            </div>

            {/* REAL FitTracker App Interactive Preview Screen */}
            <div className="relative flex-1 overflow-hidden">
              <PhoneAppPreview />
            </div>

            {/* Home Indicator Bar */}
            <div className="relative z-30 py-1 bg-slate-950 flex justify-center">
              <div className="w-24 h-1 bg-white/40 rounded-full" />
            </div>

            {/* Glass Reflection Sheen */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/[0.05] to-transparent z-40" />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

