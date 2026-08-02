import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  samplePosts,
  sampleGroups,
  sampleChallenges,
  sampleLeaderboard,
  CommunityPost,
  CommunityGroup,
  CommunityChallenge,
} from '@/data/communityData';
import { CreatePostModal } from '@/components/community/CreatePostModal';
import { FitnessReelsView } from '@/components/community/FitnessReelsView';
import { CommunityChatView } from '@/components/community/CommunityChatView';
import { LiveWorkoutStreamModal } from '@/components/community/LiveWorkoutStreamModal';
import { PrivacySettingsModal } from '@/components/community/PrivacySettingsModal';
import {
  Users,
  Trophy,
  Flame,
  Activity,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Sparkles,
  Plus,
  Video,
  ShieldCheck,
  Search,
  MapPin,
  TrendingUp,
  Award,
  CheckCircle2,
  Lock,
} from 'lucide-react';

export const CommunityPage: React.FC = () => {
  const [posts, setPosts] = useState<CommunityPost[]>(samplePosts);
  const [groups, setGroups] = useState<CommunityGroup[]>(sampleGroups);
  const [challenges, setChallenges] = useState<CommunityChallenge[]>(sampleChallenges);
  const [activeTab, setActiveTab] = useState<'feed' | 'reels' | 'leaderboard' | 'groups' | 'challenges' | 'chat'>('feed');

  // Modals state
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isLiveStreamOpen, setIsLiveStreamOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  const handlePostCreated = (newPost: CommunityPost) => {
    setPosts([newPost, ...posts]);
  };

  const toggleLikePost = (postId: string) => {
    setPosts(
      posts.map((p) =>
        p.id === postId
          ? {
              ...p,
              isLiked: !p.isLiked,
              likesCount: p.isLiked ? p.likesCount - 1 : p.likesCount + 1,
            }
          : p
      )
    );
  };

  return (
    <div className="min-h-screen bg-[#04060a] text-slate-100 p-4 sm:p-6 lg:p-8 font-sans pb-32">
      {/* Header Badges & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-mono font-bold">
              🌐 FitTracker Global Social Network
            </span>
            <span className="px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping inline-block" />
              Live Telemetry
            </span>
          </div>
          <h1 className="text-3xl font-black text-white mt-2">Fitness Social Network</h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Connect with 50,000+ athletes • Share workout telemetry • WebRTC Live Streams
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsLiveStreamOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-300 font-bold text-xs flex items-center gap-1.5 hover:bg-rose-500 hover:text-white transition shadow-[0_0_15px_rgba(244,63,94,0.3)]"
          >
            <Video className="w-4 h-4" />
            <span>Go Live</span>
          </button>

          <button
            onClick={() => setIsPrivacyModalOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-slate-900 border border-white/10 text-slate-300 hover:text-white font-bold text-xs flex items-center gap-1.5 transition"
          >
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            <span>Privacy</span>
          </button>

          <button
            onClick={() => setIsCreatePostOpen(true)}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-teal-400 to-cyan-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(45,212,191,0.4)] hover:shadow-[0_0_30px_rgba(45,212,191,0.6)] transition"
          >
            <Plus className="w-4 h-4" />
            <span>Create Post</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Sub-Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-8 border-b border-white/10">
        {[
          { id: 'feed', label: '📰 Home Feed' },
          { id: 'reels', label: '🎥 Fitness Reels' },
          { id: 'leaderboard', label: '🏆 Leaderboards' },
          { id: 'groups', label: '👥 Fitness Groups' },
          { id: 'challenges', label: '🎯 Challenges' },
          { id: 'chat', label: '💬 Messages' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold shrink-0 border transition ${
              activeTab === tab.id
                ? 'bg-teal-500/20 border-teal-400 text-teal-300 shadow-[0_0_20px_rgba(45,212,191,0.2)]'
                : 'bg-slate-950/80 border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Content Layout (Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Feed / Reels / Chat Area (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* TAB 1: HOME FEED */}
          {activeTab === 'feed' && (
            <div className="space-y-6">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="p-6 rounded-3xl bg-slate-950/90 border border-white/10 backdrop-blur-2xl space-y-4 shadow-xl"
                >
                  {/* Post Author Bar */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={post.authorAvatar}
                        alt={post.authorName}
                        className="w-11 h-11 rounded-full object-cover border border-teal-400"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm text-white">{post.authorName}</span>
                          <span className="px-2 py-0.5 rounded-full bg-teal-500/20 border border-teal-500/30 text-teal-300 text-[9px] font-mono font-bold">
                            {post.authorBadge}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">{post.timeAgo}</div>
                      </div>
                    </div>

                    <button className="px-3 py-1 rounded-full bg-slate-900 border border-white/10 text-slate-300 hover:text-white text-xs font-bold">
                      Follow
                    </button>
                  </div>

                  {/* Caption */}
                  <p className="text-sm text-slate-200 leading-relaxed font-sans">{post.caption}</p>

                  {/* Media Content */}
                  {post.mediaUrls.length > 0 && (
                    <div className="relative w-full h-80 rounded-2xl overflow-hidden border border-white/10">
                      <img
                        src={post.mediaUrls[0]}
                        alt="media"
                        className="w-full h-full object-cover"
                      />

                      {/* Telemetry Overlay Card */}
                      {post.workoutMetrics && (
                        <div className="absolute bottom-3 left-3 right-3 p-3 rounded-2xl bg-slate-950/80 backdrop-blur-md border border-white/15 flex flex-wrap items-center justify-between text-xs font-mono">
                          <div className="flex items-center gap-2">
                            <Activity className="w-4 h-4 text-rose-400 animate-pulse" />
                            <span className="text-rose-300 font-bold">{post.workoutMetrics.avgHeartRate} BPM</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Flame className="w-4 h-4 text-amber-400" />
                            <span className="text-amber-300 font-bold">{post.workoutMetrics.caloriesBurned} kcal</span>
                          </div>
                          <div className="text-teal-300 font-bold">
                            ⏱️ {post.workoutMetrics.durationMinutes} mins
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* AI Telemetry Summary */}
                  {post.aiSummary && (
                    <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/30 text-xs text-teal-200 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-teal-400 shrink-0" />
                      <span>{post.aiSummary}</span>
                    </div>
                  )}

                  {/* Action Bar */}
                  <div className="flex items-center justify-between border-t border-white/10 pt-3 text-xs text-slate-400 font-mono">
                    <button
                      onClick={() => toggleLikePost(post.id)}
                      className={`flex items-center gap-1.5 font-bold transition ${
                        post.isLiked ? 'text-rose-400' : 'hover:text-white'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-rose-400' : ''}`} />
                      <span>{post.likesCount} Likes</span>
                    </button>

                    <button className="flex items-center gap-1.5 hover:text-white font-bold">
                      <MessageCircle className="w-4 h-4 text-teal-400" />
                      <span>{post.commentsCount} Comments</span>
                    </button>

                    <button className="flex items-center gap-1.5 hover:text-white font-bold">
                      <Share2 className="w-4 h-4 text-cyan-400" />
                      <span>{post.sharesCount} Shares</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: FITNESS REELS */}
          {activeTab === 'reels' && <FitnessReelsView />}

          {/* TAB 3: LEADERBOARD */}
          {activeTab === 'leaderboard' && (
            <div className="p-6 rounded-3xl bg-slate-950/90 border border-white/10 backdrop-blur-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-400" />
                  <span>Global Fitness Step Leaderboard</span>
                </h3>
                <span className="text-xs font-mono text-teal-400 font-bold">August 2026</span>
              </div>

              <div className="space-y-3">
                {sampleLeaderboard.map((entry) => (
                  <div
                    key={entry.rank}
                    className={`flex items-center justify-between p-4 rounded-2xl border text-xs font-sans transition ${
                      entry.isCurrentUser
                        ? 'bg-teal-500/20 border-teal-400 text-teal-200 shadow-[0_0_20px_rgba(45,212,191,0.2)]'
                        : 'bg-slate-900/60 border-white/5 text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="font-mono font-black text-base text-slate-400 w-6">#{entry.rank}</span>
                      <img
                        src={entry.avatar}
                        alt={entry.name}
                        className="w-10 h-10 rounded-full object-cover border border-teal-400/50"
                      />
                      <div>
                        <div className="font-extrabold text-white flex items-center gap-2">
                          <span>{entry.name}</span>
                          {entry.isCurrentUser && (
                            <span className="px-2 py-0.5 rounded bg-teal-400 text-slate-950 text-[9px] font-black">
                              YOU
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-teal-300 font-mono mt-0.5">{entry.badge}</div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-lg font-black text-white font-mono">{entry.score.toLocaleString()}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{entry.metricLabel}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: GROUPS */}
          {activeTab === 'groups' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {groups.map((grp) => (
                <div
                  key={grp.id}
                  className="p-5 rounded-3xl bg-slate-950/90 border border-white/10 backdrop-blur-2xl space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-3xl">{grp.icon}</span>
                    <button
                      className={`px-3 py-1 rounded-xl text-xs font-bold border transition ${
                        grp.isJoined
                          ? 'bg-teal-500/20 border-teal-400 text-teal-300'
                          : 'bg-teal-400 text-slate-950 font-black'
                      }`}
                    >
                      {grp.isJoined ? 'Joined' : '+ Join Group'}
                    </button>
                  </div>
                  <h4 className="text-base font-black text-white">{grp.name}</h4>
                  <p className="text-xs text-slate-300">{grp.description}</p>
                  <div className="text-[10px] font-mono text-teal-400 font-bold">
                    👥 {grp.membersCount.toLocaleString()} Members • {grp.weeklyGoal}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 5: CHALLENGES */}
          {activeTab === 'challenges' && (
            <div className="space-y-4">
              {challenges.map((ch) => (
                <div
                  key={ch.id}
                  className="p-6 rounded-3xl bg-slate-950/90 border border-white/10 backdrop-blur-2xl space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{ch.badgeIcon}</span>
                      <div>
                        <h4 className="text-lg font-black text-white">{ch.title}</h4>
                        <p className="text-xs text-slate-300">{ch.description}</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-mono font-bold">
                      +{ch.rewardXP} XP
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-400">Progress</span>
                      <span className="text-teal-300 font-bold">
                        {ch.currentProgress.toLocaleString()} / {ch.targetValue.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full"
                        style={{ width: `${(ch.currentProgress / ch.targetValue) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 6: CHAT */}
          {activeTab === 'chat' && <CommunityChatView />}
        </div>

        {/* Right Sidebar Widgets (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* AI Recommended Gym Buddies */}
          <div className="p-6 rounded-3xl bg-slate-950/80 border border-white/10 backdrop-blur-2xl space-y-4">
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-400 animate-pulse" />
              <span>AI Suggested Gym Buddies</span>
            </h3>

            <div className="space-y-3">
              {[
                { name: 'Marcus Vance', role: 'HIIT & Sprint Athlete', score: '98% Match', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop' },
                { name: 'Chloe Bennett', role: 'Marathon Runner', score: '95% Match', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop' },
              ].map((b, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/60 border border-white/5 text-xs">
                  <div className="flex items-center gap-2.5">
                    <img src={b.avatar} alt={b.name} className="w-9 h-9 rounded-full object-cover border border-teal-400" />
                    <div>
                      <div className="font-bold text-white">{b.name}</div>
                      <div className="text-[10px] text-slate-400">{b.role}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-teal-300 font-bold">{b.score}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Trending Fitness Hashtags */}
          <div className="p-6 rounded-3xl bg-slate-950/80 border border-white/10 backdrop-blur-2xl space-y-3">
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <span>Trending Fitness Topics</span>
            </h3>

            <div className="flex flex-wrap gap-2 pt-1 text-xs font-mono font-bold">
              <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-teal-300">#SFBayRunners</span>
              <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-cyan-300">#165BPMHIIT</span>
              <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-amber-300">#DeadliftPR</span>
              <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-rose-300">#ColdPlunge</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <CreatePostModal
        isOpen={isCreatePostOpen}
        onClose={() => setIsCreatePostOpen(false)}
        onPostCreated={handlePostCreated}
      />

      <LiveWorkoutStreamModal
        isOpen={isLiveStreamOpen}
        onClose={() => setIsLiveStreamOpen(false)}
      />

      <PrivacySettingsModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />
    </div>
  );
};

export default CommunityPage;
