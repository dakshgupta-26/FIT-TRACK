import React from 'react';
import { Star } from 'lucide-react';

export const SocialProofCounters: React.FC = () => {
  const AVATARS = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
  ];

  return (
    <div className="w-full mt-4 pt-3 border-t border-white/10 select-none">
      {/* Single-Row Premium Glass Strip */}
      <div className="w-full py-2 px-3 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md flex items-center justify-between gap-2 text-xs">
        {/* Avatars + Live Online Indicator */}
        <div className="flex items-center gap-2">
          <div className="relative flex -space-x-2">
            {AVATARS.map((src, i) => (
              <img
                key={i}
                src={src}
                alt="User"
                className="w-6 h-6 rounded-full ring-2 ring-slate-950 object-cover"
              />
            ))}
            {/* Animated Green Online Indicator Dot */}
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-950 flex items-center justify-center">
              <span className="w-full h-full rounded-full bg-emerald-400 animate-ping opacity-75" />
            </span>
          </div>
          <span className="text-[11px] font-medium text-slate-300 whitespace-nowrap">
            Trusted by <strong className="text-white font-semibold">50,000+</strong> athletes
          </span>
        </div>

        {/* 5-Star Rating & 4.9/5 Badge */}
        <div className="flex items-center gap-1.5 shrink-0 bg-teal-500/10 border border-teal-500/20 px-2 py-1 rounded-full text-[11px]">
          <div className="flex text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3 h-3 fill-amber-400 stroke-none" />
            ))}
          </div>
          <span className="font-bold text-white tracking-tight">4.9/5</span>
        </div>
      </div>
    </div>
  );
};

