import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Heart,
  Shuffle,
  Repeat,
  Headphones,
  Maximize2,
  FileText,
  Activity,
  Flame,
  ChevronUp,
  X,
} from 'lucide-react';
import { Track } from '@/data/musicData';

interface StickyMusicPlayerProps {
  currentTrack: Track;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onNextTrack: () => void;
  onPrevTrack: () => void;
  userHeartRate: number;
}

export const StickyMusicPlayer: React.FC<StickyMusicPlayerProps> = ({
  currentTrack,
  isPlaying,
  onTogglePlay,
  onNextTrack,
  onPrevTrack,
  userHeartRate,
}) => {
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);
  const [progress, setProgress] = useState(35); // 35% demo progress

  return (
    <>
      {/* Floating Translucent Glass Sticky Bar */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-[480px] z-50 p-4 rounded-3xl bg-slate-950/95 border border-teal-500/40 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(45,212,191,0.2)] text-white font-sans select-none space-y-3"
      >
        {/* Top Progress Bar */}
        <div className="relative w-full h-1.5 rounded-full bg-slate-800 cursor-pointer overflow-hidden group">
          <div
            style={{ width: `${progress}%` }}
            className="h-full bg-gradient-to-r from-teal-400 to-cyan-300 rounded-full transition-all duration-300"
          />
        </div>

        <div className="flex items-center justify-between gap-3">
          {/* Left: Album Cover & Track Info */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="relative w-12 h-12 rounded-2xl overflow-hidden border border-white/15 shrink-0">
              <img src={currentTrack.cover} alt="cover" className="w-full h-full object-cover" />
            </div>

            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-bold text-white truncate">{currentTrack.title}</h4>
              <p className="text-xs text-teal-300 truncate font-semibold">{currentTrack.artist}</p>
            </div>
          </div>

          {/* Center: Playback Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={onPrevTrack}
              className="p-2 text-slate-400 hover:text-white transition"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onTogglePlay}
              className="p-3 rounded-full bg-gradient-to-r from-teal-400 to-cyan-400 text-slate-950 font-black shadow-[0_0_20px_rgba(45,212,191,0.5)]"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-slate-950" /> : <Play className="w-4 h-4 fill-slate-950" />}
            </motion.button>

            <button
              onClick={onNextTrack}
              className="p-2 text-slate-400 hover:text-white transition"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          {/* Right: Telemetry & Lyrics Drawer Trigger */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowLyrics(!showLyrics)}
              className={`p-2 rounded-xl border text-xs font-mono transition ${
                showLyrics
                  ? 'bg-teal-500/20 border-teal-400 text-teal-300'
                  : 'bg-slate-900 border-white/10 text-slate-400 hover:text-white'
              }`}
              title="Toggle AI Lyrics & Telemetry"
            >
              <FileText className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live Telemetry Bar Inside Player */}
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-300 pt-2 border-t border-white/10">
          <div className="flex items-center gap-1.5 text-rose-400 font-bold">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            <span>{userHeartRate} BPM Sync</span>
          </div>

          <div className="flex items-center gap-1.5 text-amber-300 font-bold">
            <Flame className="w-3.5 h-3.5" />
            <span>{currentTrack.bpm} BPM Cadence</span>
          </div>

          <div className="flex items-center gap-1.5 text-teal-300 font-bold">
            <Headphones className="w-3.5 h-3.5" />
            <span>AirPods Max</span>
          </div>
        </div>
      </motion.div>

      {/* Floating Lyrics & Telemetry Drawer */}
      <AnimatePresence>
        {showLyrics && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-32 right-6 w-96 p-5 rounded-3xl bg-slate-950/95 border border-teal-400/50 backdrop-blur-2xl shadow-2xl z-50 text-white font-sans space-y-3"
          >
            <div className="flex justify-between items-center border-b border-white/10 pb-2">
              <span className="text-xs font-mono font-bold text-teal-300 uppercase tracking-wider">
                AI Telemetry & Lyrics Stream
              </span>
              <button
                onClick={() => setShowLyrics(false)}
                className="p-1 rounded-full bg-slate-900 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-xs text-teal-200 leading-relaxed font-mono">
              {currentTrack.lyricsSnippet || 'AI Audio Telemetry Active. Music tempo automatically matching heart rate.'}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
