import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Star,
  MapPin,
  Clock,
  Sparkles,
  Heart,
  Navigation,
  Phone,
  Flame,
  CheckCircle2,
  Users,
} from 'lucide-react';
import { GymData } from '@/data/gymsData';

interface GymCardProps {
  gym: GymData;
  isSelected: boolean;
  onSelect: (gym: GymData) => void;
  onNavigate: (gym: GymData) => void;
  onBookTrial: (gym: GymData) => void;
}

export const GymCard: React.FC<GymCardProps> = ({
  gym,
  isSelected,
  onSelect,
  onNavigate,
  onBookTrial,
}) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const getOccupancyBadge = (percent: number, status: string) => {
    if (percent < 35) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>{percent}% Full • Low Crowd</span>
        </span>
      );
    }
    if (percent < 70) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <span>{percent}% Full • Moderate</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-[11px] font-semibold">
        <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
        <span>{percent}% Full • Peak Hours</span>
      </span>
    );
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      onClick={() => onSelect(gym)}
      className={`relative w-full rounded-3xl bg-slate-950/80 border backdrop-blur-2xl p-4 transition-all duration-300 cursor-pointer overflow-hidden group select-none shadow-xl ${
        isSelected
          ? 'border-teal-400 ring-2 ring-teal-500/40 bg-teal-950/20 shadow-[0_0_40px_rgba(45,212,191,0.25)]'
          : 'border-white/10 hover:border-teal-500/30 hover:shadow-[0_15px_40px_rgba(0,0,0,0.8)]'
      }`}
    >
      {/* Glass Light Reflection Beam */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-teal-500/15 rounded-full blur-3xl group-hover:scale-150 transition-all duration-500 pointer-events-none" />

      {/* Image Container with Gradient Overlay */}
      <div className="relative w-full h-44 rounded-2xl overflow-hidden mb-3.5 border border-white/10">
        <img
          src={gym.heroImage}
          alt={gym.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

        {/* AI Score Badge Top-Left */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/80 border border-teal-500/40 backdrop-blur-md text-teal-300 text-xs font-bold shadow-md">
          <Sparkles className="w-3.5 h-3.5 text-teal-400" />
          <span>{gym.aiMatchScore}% AI Match</span>
        </div>

        {/* Favorite Heart Button Top-Right */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsFavorite(!isFavorite);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md border transition-all duration-200 ${
            isFavorite
              ? 'bg-rose-500/20 border-rose-500 text-rose-400'
              : 'bg-slate-950/60 border-white/20 text-white hover:bg-slate-900'
          }`}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-400' : ''}`} />
        </button>

        {/* Rating Pill Bottom-Left */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-950/90 border border-white/15 backdrop-blur-md text-xs font-bold text-white">
          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span>{gym.rating}</span>
          <span className="text-slate-400 text-[10px] font-normal">({gym.reviewCount})</span>
        </div>

        {/* Category Tag Bottom-Right */}
        <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-teal-500/20 border border-teal-500/30 text-teal-300 text-[10px] font-mono uppercase font-bold backdrop-blur-md">
          {gym.category}
        </div>
      </div>

      {/* Gym Title & Specs */}
      <div>
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-black text-white group-hover:text-teal-300 transition-colors line-clamp-1">
            {gym.name}
          </h3>
          <span className="text-xs font-mono font-bold text-slate-300 shrink-0">
            {gym.priceDetails.split('•')[0]}
          </span>
        </div>

        <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{gym.address}</p>

        {/* Telemetry Row: Occupancy & Distance */}
        <div className="flex items-center justify-between gap-2 mt-3 pt-2.5 border-t border-white/5">
          {getOccupancyBadge(gym.occupancyPercent, gym.occupancyStatus)}

          <div className="flex items-center gap-1 text-xs text-slate-300 font-semibold">
            <MapPin className="w-3.5 h-3.5 text-teal-400" />
            <span>{gym.distanceMiles} mi away</span>
          </div>
        </div>

        {/* FitTracker AI Reasoning Snippet */}
        <div className="mt-3 p-2.5 rounded-xl bg-teal-500/5 border border-teal-500/20 text-xs text-teal-200/90 flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
          <p className="line-clamp-2 leading-relaxed text-[11px]">{gym.aiReason}</p>
        </div>

        {/* Action Buttons Row */}
        <div className="flex items-center gap-2 mt-3.5 pt-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => {
              e.stopPropagation();
              onNavigate(gym);
            }}
            className="flex-1 py-2 rounded-xl bg-slate-900 border border-teal-500/30 hover:border-teal-400 text-teal-300 font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-sm"
          >
            <Navigation className="w-3.5 h-3.5 text-teal-400" />
            <span>Directions</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => {
              e.stopPropagation();
              onBookTrial(gym);
            }}
            className="flex-1 py-2 rounded-xl bg-gradient-to-r from-teal-400 to-cyan-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(45,212,191,0.4)] hover:shadow-[0_0_25px_rgba(45,212,191,0.6)] transition"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Book Trial</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
