import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Flame, Heart, Dumbbell, Zap, Play, Activity } from 'lucide-react';
import { sampleAiModes, AiAudioMode } from '@/data/musicData';

interface AiAudioModesProps {
  selectedModeId: string;
  onSelectMode: (mode: AiAudioMode) => void;
}

export const AiAudioModes: React.FC<AiAudioModesProps> = ({
  selectedModeId,
  onSelectMode,
}) => {
  return (
    <div className="w-full space-y-4 font-sans select-none">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-black text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-teal-400" />
            <span>AI Adaptive Audio Modes</span>
          </h3>
          <p className="text-xs text-slate-300">
            Smart soundscapes dynamically tuned to your target biometrics & heart rate zone.
          </p>
        </div>
        <span className="text-xs font-mono text-teal-400 font-bold px-2.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/30">
          ChatGPT Audio v4.0
        </span>
      </div>

      {/* Grid of AI Mode Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {sampleAiModes.map((mode) => {
          const isSelected = selectedModeId === mode.id;

          return (
            <motion.div
              key={mode.id}
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectMode(mode)}
              className={`relative rounded-3xl p-5 border backdrop-blur-2xl transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between h-56 shadow-xl ${
                isSelected
                  ? 'border-teal-400 ring-2 ring-teal-500/40 bg-slate-950/90 shadow-[0_0_35px_rgba(45,212,191,0.25)]'
                  : 'bg-slate-950/70 border-white/10 hover:border-white/20'
              }`}
            >
              {/* Background Glow */}
              <div
                className={`absolute inset-0 bg-gradient-to-b ${mode.gradient} opacity-40 pointer-events-none`}
              />

              {/* Top Row: Title & Confidence Pill */}
              <div className="relative z-10">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-950/80 border border-teal-400/40 text-teal-300 font-bold text-[10px] font-mono">
                    {mode.confidence}% AI Match
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-300">
                    {mode.targetBpm} BPM
                  </span>
                </div>

                <h4 className="text-base font-black text-white">{mode.name}</h4>
                <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                  {mode.description}
                </p>
              </div>

              {/* Bottom Row: Specs & Play Trigger */}
              <div className="relative z-10 pt-3 border-t border-white/10 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-mono text-slate-400">Est. Burn</div>
                  <div className="text-xs font-black text-teal-300">🔥 {mode.caloriesEst} kcal</div>
                </div>

                <div
                  className={`p-2.5 rounded-full border transition ${
                    isSelected
                      ? 'bg-teal-400 text-slate-950 border-teal-300 shadow-[0_0_15px_rgba(45,212,191,0.6)]'
                      : 'bg-slate-900 border-white/20 text-white hover:bg-slate-800'
                  }`}
                >
                  <Play className="w-4 h-4 fill-current" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
