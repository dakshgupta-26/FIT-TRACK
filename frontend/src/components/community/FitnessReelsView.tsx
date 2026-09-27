import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Flame,
  Activity,
  Music,
  Sparkles,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Upload,
  ChevronUp,
  ChevronDown,
  X,
  Send,
} from 'lucide-react';
import { reelsApi, ReelData } from '@/lib/api/reelsApi';
import { usersApi } from '@/lib/api/usersApi';
import { toast } from 'sonner';

export const FitnessReelsView: React.FC = () => {
  const [reels, setReels] = useState<ReelData[]>([]);
  const [activeReelIndex, setActiveReelIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [newCommentText, setNewCommentText] = useState('');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadSubmitting, setUploadSubmitting] = useState(false);

  // Upload Form State
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadCaption, setUploadCaption] = useState('');
  const [uploadAudioTitle, setUploadAudioTitle] = useState('Cybernetic Phonk (165 BPM)');
  const [uploadWorkoutType, setUploadWorkoutType] = useState('HIIT Sprints');
  const [uploadCalories, setUploadCalories] = useState(540);
  const [uploadHeartRate, setUploadHeartRate] = useState(165);

  const videoRef = useRef<HTMLVideoElement>(null);
  const viewTrackedRef = useRef<Record<string, boolean>>({});

  // 1. Fetch real reels from backend
  const loadReels = async () => {
    try {
      setLoading(true);
      const res = await reelsApi.getReels({ limit: 15 });
      if (res.data && res.data.length > 0) {
        setReels(res.data);
      } else {
        // Fallback baseline starter reels if DB is fresh
        setReels([
          {
            id: 'sample-reel-1',
            author: { _id: '650000000000000000000001', firstName: 'Sarah', lastName: 'Connor' },
            authorName: 'Sarah Connor',
            authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop',
            authorBadge: 'PRO ATHLETE',
            videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-athlete-working-out-with-heavy-ropes-in-a-gym-42795-large.mp4',
            coverImage: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop',
            caption: '165 BPM Battle Rope Finisher! Pushed past anaerobic threshold. Who else is hitting HIIT today?',
            audioTitle: 'KAVINSKY - Cybernetic High Voltage (165 BPM)',
            workoutType: 'HIIT Battle Ropes',
            caloriesBurned: 640,
            heartRate: 168,
            likesCount: 1420,
            commentsCount: 184,
            viewsCount: 4890,
            sharesCount: 310,
            isLiked: false,
            isBookmarked: false,
            createdAt: new Date().toISOString(),
          },
          {
            id: 'sample-reel-2',
            author: { _id: '650000000000000000000002', firstName: 'Alex', lastName: 'Rivera' },
            authorName: 'Alex Rivera',
            authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop',
            authorBadge: 'OLYMPIC LIFT',
            videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-man-training-with-a-kettlebell-in-a-gym-42799-large.mp4',
            coverImage: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=800&auto=format&fit=crop',
            caption: 'Kettlebell clean and press ladder. Explosive hip drive and thoracic brace.',
            audioTitle: 'Heavy Metal Barbell Phonk 140 BPM',
            workoutType: 'Kettlebell Complexes',
            caloriesBurned: 510,
            heartRate: 152,
            likesCount: 2890,
            commentsCount: 310,
            viewsCount: 8920,
            sharesCount: 540,
            isLiked: true,
            isBookmarked: false,
            createdAt: new Date().toISOString(),
          },
        ]);
      }
    } catch (err) {
      console.warn('Unable to load reels from API, using cached:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReels();
  }, []);

  const currentReel = reels[activeReelIndex];

  // 2. Autoplay & View Tracking
  useEffect(() => {
    if (!currentReel) return;

    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }

    // View Tracking Cooldown (trigger after 2s of watching)
    const reelId = currentReel.id;
    if (!viewTrackedRef.current[reelId]) {
      const timer = setTimeout(() => {
        reelsApi.trackReelView(reelId).then((res) => {
          if (res?.viewsCount) {
            setReels((prev) =>
              prev.map((r) => (r.id === reelId ? { ...r, viewsCount: res.viewsCount } : r))
            );
          }
        }).catch(() => {});
        viewTrackedRef.current[reelId] = true;
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [activeReelIndex, currentReel?.id]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentReel) return;

    const newLikedState = !currentReel.isLiked;
    const newCount = newLikedState ? currentReel.likesCount + 1 : currentReel.likesCount - 1;

    // Optimistic UI update
    setReels((prev) =>
      prev.map((r) =>
        r.id === currentReel.id ? { ...r, isLiked: newLikedState, likesCount: newCount } : r
      )
    );

    try {
      await reelsApi.toggleLikeReel(currentReel.id);
    } catch (err) {
      // Revert if API fails
      setReels((prev) =>
        prev.map((r) =>
          r.id === currentReel.id
            ? { ...r, isLiked: !newLikedState, likesCount: currentReel.likesCount }
            : r
        )
      );
    }
  };

  const handleFollow = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentReel?.author?._id) return;
    try {
      const res = await usersApi.followUser(currentReel.author._id);
      toast.success(res.message || `Following ${currentReel.authorName}`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Unable to follow user');
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim() || !currentReel) return;

    try {
      await reelsApi.addReelComment(currentReel.id, newCommentText.trim());
      setReels((prev) =>
        prev.map((r) =>
          r.id === currentReel.id ? { ...r, commentsCount: r.commentsCount + 1 } : r
        )
      );
      toast.success('Comment added to reel');
      setNewCommentText('');
    } catch (err: any) {
      toast.error('Unable to add comment');
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) {
      toast.error('Please select a video file to upload');
      return;
    }

    setUploadSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('video', uploadFile);
      formData.append('caption', uploadCaption);
      formData.append('audioTitle', uploadAudioTitle);
      formData.append('workoutType', uploadWorkoutType);
      formData.append('caloriesBurned', uploadCalories.toString());
      formData.append('heartRate', uploadHeartRate.toString());

      const res = await reelsApi.createReel(formData);
      toast.success('🎥 Fitness Reel published to community!');
      setReels([res.data, ...reels]);
      setActiveReelIndex(0);
      setIsUploadOpen(false);
      setUploadFile(null);
      setUploadCaption('');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err.message || 'Failed to upload reel');
    } finally {
      setUploadSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-sm mx-auto h-[620px] rounded-3xl bg-slate-950 border border-teal-500/30 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-2 border-teal-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-mono text-slate-400">Loading Fitness Reels Matrix...</span>
        </div>
      </div>
    );
  }

  if (!currentReel) {
    return (
      <div className="w-full max-w-sm mx-auto h-[620px] rounded-3xl bg-slate-950 border border-teal-500/30 flex flex-col items-center justify-center p-6 text-center">
        <Sparkles className="w-10 h-10 text-teal-400 mb-2" />
        <h4 className="font-bold text-white text-base">No Fitness Reels Yet</h4>
        <p className="text-xs text-slate-400 mt-1">Be the first athlete to upload high-intensity workout telemetry clips.</p>
        <button
          onClick={() => setIsUploadOpen(true)}
          className="mt-4 px-4 py-2 rounded-xl bg-teal-400 text-slate-950 font-bold text-xs"
        >
          Upload Reel
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-sm mx-auto h-[640px] rounded-3xl overflow-hidden border border-teal-500/40 shadow-[0_25px_80px_rgba(0,0,0,0.95)] bg-slate-950 font-sans select-none">
      {/* Video Element */}
      <div className="relative w-full h-full cursor-pointer" onClick={togglePlay}>
        <video
          ref={videoRef}
          src={currentReel.videoUrl}
          poster={currentReel.coverImage}
          preload="metadata"
          loop
          playsInline
          muted={isMuted}
          className="w-full h-full object-cover"
        />

        {/* Ambient Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-slate-950/50 pointer-events-none" />

        {/* Play/Pause Overlay indicator when paused */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none">
            <div className="p-4 rounded-full bg-slate-950/80 border border-white/20 text-white backdrop-blur-md">
              <Play className="w-8 h-8 fill-white ml-1" />
            </div>
          </div>
        )}

        {/* Top Header Bar */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950/80 border border-teal-400/40 backdrop-blur-md text-teal-300 text-xs font-bold font-mono">
            <Sparkles className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
            <span>FITNESS REEL</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleMute}
              className="p-2 rounded-full bg-slate-950/70 border border-white/20 text-white hover:bg-slate-900 transition"
              aria-label="Toggle mute"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-teal-300" />}
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsUploadOpen(true);
              }}
              className="px-3 py-1 rounded-full bg-teal-400 text-slate-950 font-black text-xs flex items-center gap-1 shadow-[0_0_15px_rgba(45,212,191,0.5)]"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload</span>
            </button>
          </div>
        </div>

        {/* Vertical Reel Switcher Arrows */}
        <div className="absolute top-16 right-4 z-20 flex flex-col gap-1.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (activeReelIndex > 0) setActiveReelIndex(activeReelIndex - 1);
            }}
            disabled={activeReelIndex === 0}
            className="p-1.5 rounded-full bg-slate-950/60 border border-white/15 text-white disabled:opacity-30 hover:bg-slate-900"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (activeReelIndex < reels.length - 1) setActiveReelIndex(activeReelIndex + 1);
            }}
            disabled={activeReelIndex === reels.length - 1}
            className="p-1.5 rounded-full bg-slate-950/60 border border-white/15 text-white disabled:opacity-30 hover:bg-slate-900"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        {/* Right Floating Social Action Bar */}
        <div className="absolute right-3.5 bottom-20 z-20 flex flex-col items-center gap-3.5">
          {/* Like */}
          <button onClick={handleLike} className="flex flex-col items-center gap-1 group">
            <div
              className={`p-3 rounded-full backdrop-blur-md border transition ${
                currentReel.isLiked
                  ? 'bg-rose-500/20 border-rose-500 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.5)]'
                  : 'bg-slate-950/70 border-white/20 text-white hover:border-rose-400/50'
              }`}
            >
              <Heart className={`w-5 h-5 ${currentReel.isLiked ? 'fill-rose-400' : ''}`} />
            </div>
            <span className="text-[10px] font-mono font-bold text-white">
              {currentReel.likesCount.toLocaleString()}
            </span>
          </button>

          {/* Comments */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setCommentsOpen(true);
            }}
            className="flex flex-col items-center gap-1 text-white"
          >
            <div className="p-3 rounded-full bg-slate-950/70 border border-white/20 backdrop-blur-md hover:border-teal-400">
              <MessageCircle className="w-5 h-5 text-teal-300" />
            </div>
            <span className="text-[10px] font-mono font-bold">{currentReel.commentsCount}</span>
          </button>

          {/* Share */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (navigator.share) {
                navigator.share({ title: currentReel.caption, url: window.location.href }).catch(() => {});
              } else {
                toast.success('Reel link copied to clipboard!');
              }
            }}
            className="p-3 rounded-full bg-slate-950/70 border border-white/20 text-white backdrop-blur-md hover:border-cyan-400"
          >
            <Share2 className="w-5 h-5 text-cyan-300" />
          </button>
        </div>

        {/* Bottom Overlay Telemetry & Caption */}
        <div className="absolute bottom-4 left-4 right-16 z-20 space-y-2 text-white pointer-events-auto">
          {/* Author Bar */}
          <div className="flex items-center gap-2">
            <img
              src={currentReel.authorAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=300&auto=format&fit=crop'}
              alt={currentReel.authorName}
              className="w-8 h-8 rounded-full object-cover border border-teal-400"
            />
            <span className="font-extrabold text-sm">{currentReel.authorName}</span>
            <button
              onClick={handleFollow}
              className="px-2.5 py-0.5 rounded-full bg-teal-400 text-slate-950 font-black text-[10px] hover:bg-teal-300 transition"
            >
              Follow
            </button>
          </div>

          {/* Caption */}
          <p className="text-xs line-clamp-2 text-slate-200 leading-snug">{currentReel.caption}</p>

          {/* Telemetry Pills */}
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            <span className="px-2 py-0.5 rounded-md bg-rose-500/25 border border-rose-500/40 text-rose-300 text-[10px] font-mono font-bold flex items-center gap-1">
              <Activity className="w-3 h-3 text-rose-400 animate-pulse" />
              <span>{currentReel.heartRate || 160} BPM</span>
            </span>

            <span className="px-2 py-0.5 rounded-md bg-amber-500/25 border border-amber-500/40 text-amber-300 text-[10px] font-mono font-bold flex items-center gap-1">
              <Flame className="w-3 h-3 text-amber-400" />
              <span>{currentReel.caloriesBurned || 480} kcal</span>
            </span>

            <span className="px-2 py-0.5 rounded-md bg-teal-500/20 border border-teal-500/40 text-teal-300 text-[10px] font-mono font-bold">
              {currentReel.workoutType}
            </span>
          </div>

          {/* Music */}
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-300">
            <Music className="w-3 h-3 text-teal-400 animate-spin" />
            <span className="truncate">{currentReel.audioTitle}</span>
          </div>
        </div>
      </div>

      {/* Reel Comments Drawer */}
      <AnimatePresence>
        {commentsOpen && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
            className="absolute inset-x-0 bottom-0 h-[70%] bg-slate-950/95 border-t border-teal-500/40 backdrop-blur-2xl z-30 flex flex-col p-4 text-white"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-xs font-bold text-teal-300 font-mono">Comments ({currentReel.commentsCount})</span>
              <button onClick={() => setCommentsOpen(false)} className="p-1 rounded-full text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-3 space-y-2.5 custom-scrollbar text-xs">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-white/10">
                <div className="font-bold text-teal-300 text-[11px]">Alex R.</div>
                <div className="text-slate-200 mt-0.5">Insane cadence and heart rate control! 🔥</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-white/10">
                <div className="font-bold text-cyan-300 text-[11px]">Coach Vance</div>
                <div className="text-slate-200 mt-0.5">Solid hip drive through the full lockout.</div>
              </div>
            </div>

            <form onSubmit={handleAddComment} className="flex gap-2 pt-2 border-t border-white/10">
              <input
                type="text"
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                placeholder="Add reel comment..."
                className="flex-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-white/15 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-400"
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-xl bg-teal-400 text-slate-950 font-bold text-xs"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Reel Modal */}
      <AnimatePresence>
        {isUploadOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl font-sans">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md p-6 rounded-3xl bg-slate-950 border border-teal-500/40 shadow-2xl text-white space-y-4"
            >
              <div className="flex justify-between items-center border-b border-white/10 pb-3">
                <h3 className="font-black text-lg text-white">Upload Fitness Reel</h3>
                <button onClick={() => setIsUploadOpen(false)} className="p-1 rounded-full text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleUploadSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Select Video Clip</label>
                  <input
                    type="file"
                    accept="video/*"
                    required
                    onChange={(e) => e.target.files && setUploadFile(e.target.files[0])}
                    className="w-full text-xs text-slate-300 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-teal-500/20 file:text-teal-300"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Caption</label>
                  <textarea
                    rows={2}
                    required
                    value={uploadCaption}
                    onChange={(e) => setUploadCaption(e.target.value)}
                    placeholder="Describe your workout set, PR record, or cardio tempo..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:border-teal-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] text-slate-400 font-mono mb-1">Workout Type</label>
                    <input
                      type="text"
                      value={uploadWorkoutType}
                      onChange={(e) => setUploadWorkoutType(e.target.value)}
                      className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-white/15 text-teal-300 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 font-mono mb-1">Audio Title</label>
                    <input
                      type="text"
                      value={uploadAudioTitle}
                      onChange={(e) => setUploadAudioTitle(e.target.value)}
                      className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-white/15 text-slate-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] text-slate-400 font-mono mb-1">Calories (kcal)</label>
                    <input
                      type="number"
                      value={uploadCalories}
                      onChange={(e) => setUploadCalories(Number(e.target.value))}
                      className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-white/15 text-amber-300 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 font-mono mb-1">Heart Rate (BPM)</label>
                    <input
                      type="number"
                      value={uploadHeartRate}
                      onChange={(e) => setUploadHeartRate(Number(e.target.value))}
                      className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-white/15 text-rose-300 font-bold"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={uploadSubmitting}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-teal-400 to-cyan-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 mt-3 disabled:opacity-50"
                >
                  {uploadSubmitting ? 'Uploading to CDN...' : 'Publish Reel'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FitnessReelsView;
