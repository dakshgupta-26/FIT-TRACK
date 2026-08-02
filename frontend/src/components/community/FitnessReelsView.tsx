import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Share2, Bookmark, Flame, Activity, Music, Sparkles, Volume2 } from 'lucide-react';

interface ReelItem {
  id: string;
  authorName: string;
  authorAvatar: string;
  videoUrl: string;
  coverImage: string;
  caption: string;
  audioTitle: string;
  likesCount: number;
  commentsCount: number;
  workoutType: string;
  caloriesBurned: number;
  heartRate: number;
}

const sampleReels: ReelItem[] = [
  {
    id: 'reel-1',
    authorName: 'Sarah Connor',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop',
    videoUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop',
    caption: '165 BPM Sprint Finisher! ⚡ Pushed past limits on hill sprints today. Who else is hitting cardio?',
    audioTitle: 'KAVINSKY - Cybernetic Voltage (165 BPM)',
    likesCount: 1420,
    commentsCount: 184,
    workoutType: 'HIIT Sprints',
    caloriesBurned: 640,
    heartRate: 168,
  },
  {
    id: 'reel-2',
    authorName: 'Alex Rivera',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop',
    videoUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=800&auto=format&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=800&auto=format&fit=crop',
    caption: '220kg Deadlift PR attempt! Keep your back locked and explode through the heels. 💪🔥',
    audioTitle: 'Heavy Metal Barbell Phonk 140 BPM',
    likesCount: 2890,
    commentsCount: 310,
    workoutType: 'Heavy Deadlifts',
    caloriesBurned: 510,
    heartRate: 152,
  },
];

export const FitnessReelsView: React.FC = () => {
  const [activeReelIndex, setActiveReelIndex] = useState(0);
  const [likedReels, setLikedReels] = useState<Record<string, boolean>>({});

  const currentReel = sampleReels[activeReelIndex];

  const toggleLike = (id: string) => {
    setLikedReels((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="relative w-full max-w-sm mx-auto h-[620px] rounded-3xl overflow-hidden border border-teal-500/40 shadow-[0_25px_80px_rgba(0,0,0,0.9)] bg-slate-950 font-sans select-none">
      {/* Media Image / Reel Video Display */}
      <div className="relative w-full h-full">
        <img
          src={currentReel.coverImage}
          alt="reel"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-slate-950/40" />

        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950/80 border border-teal-400/40 backdrop-blur-md text-teal-300 text-xs font-bold font-mono">
            <Sparkles className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
            <span>FITNESS REEL</span>
          </div>

          <div className="flex gap-1">
            {sampleReels.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveReelIndex(idx)}
                className={`w-6 h-1 rounded-full transition ${
                  activeReelIndex === idx ? 'bg-teal-400' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Right Side Floating Social Action Bar */}
        <div className="absolute right-4 bottom-20 z-20 flex flex-col items-center gap-4">
          <button
            onClick={() => toggleLike(currentReel.id)}
            className="flex flex-col items-center gap-1 group"
          >
            <div className={`p-3 rounded-full backdrop-blur-md border transition ${
              likedReels[currentReel.id]
                ? 'bg-rose-500/20 border-rose-500 text-rose-400'
                : 'bg-slate-950/60 border-white/20 text-white'
            }`}>
              <Heart className={`w-5 h-5 ${likedReels[currentReel.id] ? 'fill-rose-400' : ''}`} />
            </div>
            <span className="text-[11px] font-mono font-bold text-white">
              {currentReel.likesCount + (likedReels[currentReel.id] ? 1 : 0)}
            </span>
          </button>

          <button className="flex flex-col items-center gap-1 text-white">
            <div className="p-3 rounded-full bg-slate-950/60 border border-white/20 backdrop-blur-md">
              <MessageCircle className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-mono font-bold">{currentReel.commentsCount}</span>
          </button>

          <button className="p-3 rounded-full bg-slate-950/60 border border-white/20 text-white backdrop-blur-md">
            <Share2 className="w-5 h-5" />
          </button>
        </div>

        {/* Bottom Overlay Telemetry & Caption */}
        <div className="absolute bottom-4 left-4 right-16 z-10 space-y-2 text-white">
          <div className="flex items-center gap-2">
            <img
              src={currentReel.authorAvatar}
              alt="author"
              className="w-8 h-8 rounded-full object-cover border border-teal-400"
            />
            <span className="font-bold text-sm">{currentReel.authorName}</span>
            <button className="px-2.5 py-0.5 rounded-full bg-teal-400 text-slate-950 font-black text-[10px]">
              Follow
            </button>
          </div>

          <p className="text-xs line-clamp-2 text-slate-200">{currentReel.caption}</p>

          {/* Telemetry Overlay Pills */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            <span className="px-2 py-0.5 rounded-md bg-rose-500/20 border border-rose-500/30 text-rose-300 text-[10px] font-mono font-bold flex items-center gap-1">
              <Activity className="w-3 h-3" />
              <span>{currentReel.heartRate} BPM</span>
            </span>

            <span className="px-2 py-0.5 rounded-md bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[10px] font-mono font-bold flex items-center gap-1">
              <Flame className="w-3 h-3" />
              <span>{currentReel.caloriesBurned} kcal</span>
            </span>

            <span className="px-2 py-0.5 rounded-md bg-teal-500/20 border border-teal-500/30 text-teal-300 text-[10px] font-mono font-bold">
              {currentReel.workoutType}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-300">
            <Music className="w-3 h-3 text-teal-400 animate-spin" />
            <span className="truncate">{currentReel.audioTitle}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
