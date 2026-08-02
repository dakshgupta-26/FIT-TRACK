import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Sliders, CheckCircle2, Music, Zap, Flame } from 'lucide-react';
import { PlaylistData } from '@/data/musicData';

interface AiGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlaylistGenerated: (newPlaylist: PlaylistData) => void;
}

export const AiGeneratorModal: React.FC<AiGeneratorModalProps> = ({
  isOpen,
  onClose,
  onPlaylistGenerated,
}) => {
  const [workoutType, setWorkoutType] = useState('HIIT Sprints');
  const [targetBpm, setTargetBpm] = useState(160);
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [genre, setGenre] = useState('Cyber Phonk');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressStep, setProgressStep] = useState(0);

  if (!isOpen) return null;

  const handleGenerate = () => {
    setIsGenerating(true);
    setProgressStep(1);

    setTimeout(() => setProgressStep(2), 1200);
    setTimeout(() => setProgressStep(3), 2400);

    setTimeout(() => {
      setIsGenerating(false);
      const generated: PlaylistData = {
        id: `pl-ai-${Date.now()}`,
        title: `AI ${workoutType.toUpperCase()} (${targetBpm} BPM)`,
        workoutType: 'HIIT',
        mood: 'AI Generated Flow',
        duration: `${durationMinutes} mins`,
        trackCount: 16,
        likes: 1,
        bpm: targetBpm,
        aiScore: 99,
        coverImage: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=800&auto=format&fit=crop',
        isFavorite: true,
        tracks: [],
      };

      onPlaylistGenerated(generated);
      onClose();
    }, 3500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-2xl font-sans">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-slate-950/95 border border-teal-500/40 backdrop-blur-2xl shadow-[0_25px_80px_rgba(0,0,0,0.9)] text-white space-y-6"
        >
          {/* Header */}
          <div className="flex justify-between items-start border-b border-white/10 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-mono font-bold">
                <Sparkles className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
                <span>ChatGPT Audio Generator v4.0</span>
              </div>
              <h3 className="text-2xl font-black text-white mt-2">Generate AI Workout Playlist</h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-slate-900 border border-white/10 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form Options */}
          {!isGenerating ? (
            <div className="space-y-4 text-xs font-sans">
              <div>
                <label className="block text-slate-300 font-bold mb-1.5">Workout Focus</label>
                <select
                  value={workoutType}
                  onChange={(e) => setWorkoutType(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-white font-sans focus:outline-none focus:border-teal-400"
                >
                  <option value="HIIT Sprints">🔥 HIIT Explosive Sprints</option>
                  <option value="Heavy Powerlifting">💪 Heavy Powerlifting & PRs</option>
                  <option value="Endurance Run">🏃 Endurance Running (148 Cadence)</option>
                  <option value="Somatic Yoga">🧘 Somatic Yoga & Breathwork</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1.5 flex justify-between">
                  <span>Target Cadence BPM</span>
                  <span className="text-teal-400 font-mono">{targetBpm} BPM</span>
                </label>
                <input
                  type="range"
                  min="60"
                  max="180"
                  value={targetBpm}
                  onChange={(e) => setTargetBpm(Number(e.target.value))}
                  className="w-full accent-teal-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1.5 flex justify-between">
                  <span>Playlist Duration</span>
                  <span className="text-teal-400 font-mono">{durationMinutes} Mins</span>
                </label>
                <input
                  type="range"
                  min="15"
                  max="90"
                  step="15"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                  className="w-full accent-teal-400"
                />
              </div>

              <button
                onClick={handleGenerate}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-teal-400 to-cyan-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(45,212,191,0.5)] hover:shadow-[0_0_35px_rgba(45,212,191,0.7)] transition mt-4"
              >
                <Sparkles className="w-4 h-4 fill-slate-950" />
                <span>Generate Custom AI Playlist</span>
              </button>
            </div>
          ) : (
            /* AI Progress Animation */
            <div className="py-8 text-center space-y-4">
              <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-teal-500/20 animate-ping" />
                <Sparkles className="w-8 h-8 text-teal-400 animate-spin" />
              </div>

              <h4 className="text-lg font-black text-white">Synthesizing AI Audio Waveform</h4>

              <div className="space-y-2 text-xs font-mono text-slate-300">
                <p className={progressStep >= 1 ? 'text-teal-300 font-bold' : 'text-slate-500'}>
                  {progressStep >= 1 ? '✓' : '○'} Step 1: Analyzing Heart Rate & Fitness Telemetry...
                </p>
                <p className={progressStep >= 2 ? 'text-teal-300 font-bold' : 'text-slate-500'}>
                  {progressStep >= 2 ? '✓' : '○'} Step 2: Matching {targetBpm} BPM Beats to {workoutType}...
                </p>
                <p className={progressStep >= 3 ? 'text-teal-300 font-bold' : 'text-slate-500'}>
                  {progressStep >= 3 ? '✓' : '○'} Step 3: Generating 16 High-Energy Tracks...
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
