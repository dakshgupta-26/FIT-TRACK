import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Image, Flame, Activity, Heart, Send, Dumbbell, MapPin } from 'lucide-react';
import { CommunityPost } from '@/data/communityData';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: (post: CommunityPost) => void;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  onPostCreated,
}) => {
  const [caption, setCaption] = useState('');
  const [postType, setPostType] = useState<'workout' | 'transformation' | 'meal'>('workout');
  const [imageUrl, setImageUrl] = useState('');
  const [workoutType, setWorkoutType] = useState('HIIT Sprints');
  const [calories, setCalories] = useState(480);
  const [duration, setDuration] = useState(45);
  const [avgHeartRate, setAvgHeartRate] = useState(158);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      const newPost: CommunityPost = {
        id: `post-${Date.now()}`,
        authorName: 'Daksh Gupta',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop',
        authorBadge: 'PRO MEMBER',
        timeAgo: 'Just now',
        type: postType,
        caption,
        mediaUrls: [imageUrl || 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop'],
        workoutMetrics: {
          workoutType,
          caloriesBurned: calories,
          durationMinutes: duration,
          stepsCount: 7800,
          avgHeartRate,
        },
        likesCount: 1,
        commentsCount: 0,
        sharesCount: 0,
        isLiked: true,
        isBookmarked: false,
        aiSummary: '⚡ FitTracker AI verified high calorie output in HR Zone 4.',
      };

      onPostCreated(newPost);
      setCaption('');
      setImageUrl('');
      onClose();
    }, 1200);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-2xl font-sans">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-slate-950/95 border border-teal-500/40 backdrop-blur-2xl shadow-[0_25px_80px_rgba(0,0,0,0.9)] text-white space-y-5"
        >
          {/* Header */}
          <div className="flex justify-between items-start border-b border-white/10 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-mono font-bold">
                <Sparkles className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
                <span>FitTracker Social Post</span>
              </div>
              <h3 className="text-2xl font-black text-white mt-2">Publish Workout Milestone</h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-slate-900 border border-white/10 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
            {/* Post Type Selector */}
            <div className="flex gap-2">
              {[
                { id: 'workout', label: '🏋️ Workout' },
                { id: 'transformation', label: '🔥 Transformation' },
                { id: 'meal', label: '🥗 Meal Fuel' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setPostType(tab.id as any)}
                  className={`flex-1 py-2 rounded-xl font-bold border transition ${
                    postType === tab.id
                      ? 'bg-teal-500/20 border-teal-400 text-teal-300'
                      : 'bg-slate-900 border-white/10 text-slate-400'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Caption */}
            <div>
              <label className="block text-slate-300 font-bold mb-1">Caption</label>
              <textarea
                rows={3}
                required
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Share your workout thoughts, PR records, or nutrition tips..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-white placeholder-slate-400 focus:outline-none focus:border-teal-400 font-sans"
              />
            </div>

            {/* Media Image URL */}
            <div>
              <label className="block text-slate-300 font-bold mb-1">Image / Photo URL (Optional)</label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-white placeholder-slate-400 focus:outline-none focus:border-teal-400 font-sans"
              />
            </div>

            {/* Telemetry Inputs */}
            <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-slate-900/60 border border-white/10">
              <div>
                <label className="block text-[10px] text-slate-400 font-mono mb-1">Workout</label>
                <input
                  type="text"
                  value={workoutType}
                  onChange={(e) => setWorkoutType(e.target.value)}
                  className="w-full px-2 py-1 rounded bg-slate-950 border border-white/10 text-teal-300 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 font-mono mb-1">Calories</label>
                <input
                  type="number"
                  value={calories}
                  onChange={(e) => setCalories(Number(e.target.value))}
                  className="w-full px-2 py-1 rounded bg-slate-950 border border-white/10 text-amber-300 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 font-mono mb-1">Avg HR (BPM)</label>
                <input
                  type="number"
                  value={avgHeartRate}
                  onChange={(e) => setAvgHeartRate(Number(e.target.value))}
                  className="w-full px-2 py-1 rounded bg-slate-950 border border-white/10 text-rose-300 text-xs font-bold"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-teal-400 to-cyan-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(45,212,191,0.5)] hover:shadow-[0_0_35px_rgba(45,212,191,0.7)] transition mt-4"
            >
              <Send className="w-4 h-4 fill-slate-950" />
              <span>{isSubmitting ? 'Publishing to Community...' : 'Publish Post'}</span>
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
