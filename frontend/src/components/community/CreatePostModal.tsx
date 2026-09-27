import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Image, Flame, Activity, Send, Upload, CheckCircle2, AlertCircle } from 'lucide-react';
import { CommunityPost } from '@/data/communityData';
import { useAuth } from '@/contexts/AuthContext';
import { postsApi } from '@/lib/api';
import { toast } from 'sonner';

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
  const { currentUser } = useAuth();
  const [caption, setCaption] = useState('');
  const [postType, setPostType] = useState<'workout' | 'transformation' | 'meal'>('workout');
  const [imageUrl, setImageUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [workoutType, setWorkoutType] = useState('HIIT Sprints');
  const [calories, setCalories] = useState(480);
  const [duration, setDuration] = useState(45);
  const [avgHeartRate, setAvgHeartRate] = useState(158);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setFilePreview(URL.createObjectURL(file));
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    if (filePreview) {
      URL.revokeObjectURL(filePreview);
      setFilePreview(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!caption.trim()) {
      toast.error('Please enter a caption for your post');
      return;
    }

    setIsSubmitting(true);

    try {
      let createdPost: CommunityPost;

      const metricsObj = {
        workoutType,
        caloriesBurned: calories,
        durationMinutes: duration,
        stepsCount: Math.round(duration * 130),
        avgHeartRate,
      };

      if (selectedFile) {
        const formData = new FormData();
        formData.append('caption', caption.trim());
        formData.append('type', postType);
        formData.append('workoutMetrics', JSON.stringify(metricsObj));
        formData.append('media', selectedFile);

        const res = await postsApi.createPost(formData);
        createdPost = res.data;
      } else {
        const payload = {
          caption: caption.trim(),
          type: postType,
          mediaUrls: imageUrl ? [imageUrl] : [],
          workoutMetrics: metricsObj,
        };

        const res = await postsApi.createPost(payload);
        createdPost = res.data;
      }

      toast.success('🎉 Milestone published to FitTracker Community!');
      onPostCreated(createdPost);
      setCaption('');
      setImageUrl('');
      clearFile();
      onClose();
    } catch (err: any) {
      console.error('Failed to create post:', err);
      toast.error(err?.response?.data?.message || err.message || 'Unable to publish post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-2xl font-sans overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-lg my-auto p-5 sm:p-7 rounded-3xl bg-slate-950/95 border border-teal-500/40 backdrop-blur-2xl shadow-[0_25px_80px_rgba(0,0,0,0.95)] text-white space-y-4 max-h-[92vh] overflow-y-auto custom-scrollbar"
        >
          {/* Header */}
          <div className="flex justify-between items-start border-b border-white/10 pb-3">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-mono font-bold">
                <Sparkles className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
                <span>FitTracker Social Matrix</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white mt-1.5">Publish Workout Milestone</h3>
            </div>
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="p-2 rounded-full bg-slate-900 border border-white/10 text-slate-400 hover:text-white transition"
              aria-label="Close modal"
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
                      ? 'bg-teal-500/20 border-teal-400 text-teal-300 shadow-[0_0_15px_rgba(45,212,191,0.2)]'
                      : 'bg-slate-900 border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Caption */}
            <div>
              <label className="block text-slate-300 font-bold mb-1">Workout Thoughts / Caption</label>
              <textarea
                rows={3}
                required
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Share your heart rate zone, PR accomplishments, routes, or nutrition notes..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:border-teal-400 font-sans"
              />
            </div>

            {/* Media Upload Area */}
            <div>
              <label className="block text-slate-300 font-bold mb-1">Attach Photo or Video</label>
              
              {filePreview ? (
                <div className="relative w-full h-44 rounded-xl overflow-hidden border border-teal-500/40 bg-slate-900">
                  {selectedFile?.type.startsWith('video/') ? (
                    <video src={filePreview} className="w-full h-full object-cover" controls />
                  ) : (
                    <img src={filePreview} alt="Preview" className="w-full h-full object-cover" />
                  )}
                  <button
                    type="button"
                    onClick={clearFile}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-950/80 border border-white/20 text-rose-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-6 px-4 rounded-xl border border-dashed border-white/20 hover:border-teal-400/60 bg-slate-900/50 hover:bg-teal-950/20 flex flex-col items-center justify-center cursor-pointer transition group"
                >
                  <Upload className="w-6 h-6 text-slate-400 group-hover:text-teal-400 transition" />
                  <span className="text-xs text-slate-300 font-bold mt-1">Upload Photo or Workout Clip</span>
                  <span className="text-[10px] text-slate-500 font-mono mt-0.5">PNG, JPG, MP4 up to 50MB</span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              )}

              {/* Or Media URL */}
              {!selectedFile && (
                <div className="mt-2">
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="Or paste image URL (https://images.unsplash.com/...)"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900/70 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-teal-400 font-sans"
                  />
                </div>
              )}
            </div>

            {/* Telemetry Inputs */}
            <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-slate-900/60 border border-white/10">
              <div>
                <label className="block text-[10px] text-slate-400 font-mono mb-1">Workout</label>
                <input
                  type="text"
                  value={workoutType}
                  onChange={(e) => setWorkoutType(e.target.value)}
                  className="w-full px-2 py-1.5 rounded-lg bg-slate-950 border border-white/10 text-teal-300 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 font-mono mb-1">Calories (kcal)</label>
                <input
                  type="number"
                  value={calories}
                  onChange={(e) => setCalories(Number(e.target.value))}
                  className="w-full px-2 py-1.5 rounded-lg bg-slate-950 border border-white/10 text-amber-300 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 font-mono mb-1">Avg HR (BPM)</label>
                <input
                  type="number"
                  value={avgHeartRate}
                  onChange={(e) => setAvgHeartRate(Number(e.target.value))}
                  className="w-full px-2 py-1.5 rounded-lg bg-slate-950 border border-white/10 text-rose-300 text-xs font-bold"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-teal-400 to-cyan-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(45,212,191,0.5)] hover:shadow-[0_0_35px_rgba(45,212,191,0.7)] transition disabled:opacity-50 mt-3"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Publishing Milestone to Matrix...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 fill-slate-950" />
                  <span>Publish Post</span>
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CreatePostModal;
