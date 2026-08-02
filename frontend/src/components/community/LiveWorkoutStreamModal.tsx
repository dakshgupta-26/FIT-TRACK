import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Video, Users, Heart, MessageCircle, Flame, Activity, Sparkles, Send } from 'lucide-react';

interface LiveWorkoutStreamModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LiveWorkoutStreamModal: React.FC<LiveWorkoutStreamModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [heartsCount, setHeartsCount] = useState(1420);
  const [comments, setComments] = useState([
    { name: 'Sarah C.', text: 'Awesome form on those kettlebell swings! 🔥' },
    { name: 'Alex R.', text: '165 BPM HR is insane output.' },
  ]);
  const [inputMsg, setInputMsg] = useState('');

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    setComments([...comments, { name: 'You', text: inputMsg }]);
    setInputMsg('');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-2xl font-sans select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-2xl h-[600px] rounded-3xl bg-slate-950 border border-teal-500/40 shadow-[0_25px_80px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col text-white"
        >
          {/* Stream Video Placeholder / Camera View */}
          <div className="relative flex-1 w-full overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop"
              alt="live broadcast"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-slate-950/40" />

            {/* Top Bar Status */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-rose-500 text-white font-black text-xs flex items-center gap-1.5 animate-pulse">
                  <Video className="w-3.5 h-3.5" />
                  <span>LIVE WORKOUT</span>
                </span>
                <span className="px-2.5 py-1 rounded-full bg-slate-950/80 border border-white/20 text-xs font-mono text-slate-200 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-teal-400" />
                  <span>428 Viewers</span>
                </span>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-full bg-slate-900/80 border border-white/20 text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Live HR & Calories Telemetry Overlay */}
            <div className="absolute top-16 left-4 flex gap-2 z-10 font-mono text-xs font-bold">
              <span className="px-3 py-1 rounded-xl bg-slate-950/80 border border-rose-500/40 text-rose-300 flex items-center gap-1">
                <Activity className="w-3.5 h-3.5 text-rose-400 animate-ping" />
                <span>165 BPM</span>
              </span>
              <span className="px-3 py-1 rounded-xl bg-slate-950/80 border border-amber-500/40 text-amber-300 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>520 kcal</span>
              </span>
            </div>

            {/* Floating Live Comments Overlay */}
            <div className="absolute bottom-4 left-4 right-20 max-h-40 overflow-y-auto space-y-1.5 z-10">
              {comments.map((c, idx) => (
                <div
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-slate-950/80 border border-white/10 text-xs backdrop-blur-md"
                >
                  <span className="font-bold text-teal-300 mr-2">{c.name}:</span>
                  <span className="text-slate-200">{c.text}</span>
                </div>
              ))}
            </div>

            {/* Floating Heart Reactions */}
            <button
              onClick={() => setHeartsCount(heartsCount + 1)}
              className="absolute bottom-4 right-4 p-3.5 rounded-full bg-rose-500 text-white shadow-[0_0_20px_rgba(244,63,94,0.7)] animate-bounce z-20"
            >
              <Heart className="w-6 h-6 fill-current" />
            </button>
          </div>

          {/* Bottom Live Chat Input Bar */}
          <form onSubmit={handleSend} className="p-3 bg-slate-900 border-t border-white/10 flex gap-2 z-20">
            <input
              type="text"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              placeholder="Send live message to trainer..."
              className="flex-1 px-4 py-2 rounded-xl bg-slate-950 border border-white/15 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-teal-400"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-teal-400 text-slate-950 font-black text-xs flex items-center gap-1"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
