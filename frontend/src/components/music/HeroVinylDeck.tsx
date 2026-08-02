import React from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Disc, Sparkles, Volume2, Music, Radio } from 'lucide-react';
import { Track } from '@/data/musicData';

interface HeroVinylDeckProps {
  currentTrack: Track;
  isPlaying: boolean;
  onTogglePlay: () => void;
  userHeartRate: number;
}

export const HeroVinylDeck: React.FC<HeroVinylDeckProps> = ({
  currentTrack,
  isPlaying,
  onTogglePlay,
  userHeartRate,
}) => {
  return (
    <div className="relative w-full p-6 sm:p-8 rounded-[36px] bg-slate-950/80 border border-teal-500/30 backdrop-blur-2xl overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,0.9),0_0_50px_rgba(45,212,191,0.15)] font-sans select-none group">
      {/* Background Ambient Aurora Gradient */}
      <div className="absolute -top-32 -right-32 w-80 h-80 bg-teal-500/20 rounded-full blur-[100px] pointer-events-none group-hover:scale-125 transition-transform duration-700" />
      <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-cyan-500/20 rounded-full blur-[100px] pointer-events-none" />

      {/* Floating Particles / Music Notes */}
      <div className="absolute top-6 right-10 text-teal-400/40 text-xl font-mono animate-bounce duration-[3000ms] pointer-events-none">
        ♪
      </div>
      <div className="absolute bottom-10 left-12 text-cyan-400/40 text-2xl font-mono animate-bounce duration-[4000ms] pointer-events-none">
        ♫
      </div>

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Left Side: Track Info & Telemetry */}
        <div className="flex-1 space-y-4 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-mono font-bold">
            <Sparkles className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
            <span>AI Heart Rate Adaptive Engine ({userHeartRate} BPM Sync)</span>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight line-clamp-1">
              {currentTrack.title}
            </h2>
            <p className="text-sm font-semibold text-teal-300 mt-1 flex items-center gap-2">
              <span>{currentTrack.artist}</span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-300 text-xs font-mono">{currentTrack.album}</span>
            </p>
          </div>

          {/* Equalizer Waveform Audio Visualizer */}
          <div className="flex items-end gap-1.5 h-10 pt-2">
            {[40, 75, 90, 60, 100, 45, 80, 65, 95, 50, 85, 40].map((heightPercent, idx) => (
              <div
                key={idx}
                style={{ height: isPlaying ? `${heightPercent}%` : '15%' }}
                className={`w-1.5 rounded-full transition-all duration-300 ${
                  isPlaying ? 'bg-gradient-to-t from-teal-400 to-cyan-300 animate-pulse' : 'bg-slate-800'
                }`}
              />
            ))}
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-4 pt-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onTogglePlay}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-teal-400 to-cyan-400 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-[0_0_25px_rgba(45,212,191,0.5)] hover:shadow-[0_0_35px_rgba(45,212,191,0.7)] transition"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-slate-950" /> : <Play className="w-4 h-4 fill-slate-950" />}
              <span>{isPlaying ? 'Pause Audio' : 'Start Audio Session'}</span>
            </motion.button>

            <div className="flex items-center gap-2 text-xs font-mono text-slate-300 px-3.5 py-2 rounded-xl bg-slate-900/80 border border-white/10">
              <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>{currentTrack.bpm} BPM Cadence</span>
            </div>
          </div>
        </div>

        {/* Right Side: 3D Vinyl Player Deck */}
        <div className="relative shrink-0 flex items-center justify-center">
          {/* Vinyl Disc Container */}
          <div className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-full p-2 bg-gradient-to-b from-slate-800 to-slate-950 border border-white/20 shadow-[0_0_50px_rgba(0,0,0,0.9)]">
            {/* Spinning Vinyl Record */}
            <div
              className={`w-full h-full rounded-full bg-slate-950 border-4 border-slate-900 relative flex items-center justify-center shadow-2xl transition-transform duration-1000 ${
                isPlaying ? 'animate-[spin_8s_linear_infinite]' : ''
              }`}
            >
              {/* Vinyl Grooves Texture */}
              <div className="absolute inset-2 rounded-full border border-white/10" />
              <div className="absolute inset-6 rounded-full border border-white/10" />
              <div className="absolute inset-10 rounded-full border border-white/10" />
              <div className="absolute inset-14 rounded-full border border-white/10" />

              {/* Album Center Sticker */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-teal-400 shadow-md relative z-10">
                <img src={currentTrack.cover} alt="album" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-slate-950/20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-slate-950 border-2 border-teal-300" />
                </div>
              </div>
            </div>

            {/* Tonearm Arm Needle Overlay */}
            <div
              className={`absolute top-2 right-4 w-20 h-28 origin-top-right transition-transform duration-700 pointer-events-none z-20 ${
                isPlaying ? 'rotate-12' : '-rotate-12'
              }`}
            >
              <div className="w-2 h-16 bg-gradient-to-b from-slate-400 to-slate-600 rounded-full mx-auto shadow-lg" />
              <div className="w-4 h-6 bg-teal-400 rounded-md mx-auto shadow-[0_0_10px_#2dd4bf]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
