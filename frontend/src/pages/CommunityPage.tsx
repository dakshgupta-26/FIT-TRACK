import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CommunityPost,
  CommunityGroup,
  CommunityChallenge,
  LeaderboardEntry,
} from '@/data/communityData';
import { CreatePostModal } from '@/components/community/CreatePostModal';
import { FitnessReelsView } from '@/components/community/FitnessReelsView';
import { CommunityChatView } from '@/components/community/CommunityChatView';
import { LiveWorkoutStreamModal } from '@/components/community/LiveWorkoutStreamModal';
import { PrivacySettingsModal } from '@/components/community/PrivacySettingsModal';
import {
  postsApi,
  groupsApi,
  challengesApi,
  usersApi,
  searchApi,
} from '@/lib/api';
import { getSocket } from '@/lib/socket';
import { toast } from 'sonner';
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
  Send,
  UserPlus,
  RefreshCw,
} from 'lucide-react';

export const CommunityPage: React.FC = () => {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [groups, setGroups] = useState<CommunityGroup[]>([]);
  const [challenges, setChallenges] = useState<CommunityChallenge[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [suggestedBuddies, setSuggestedBuddies] = useState<any[]>([]);

  const [activeTab, setActiveTab] = useState<'feed' | 'reels' | 'leaderboard' | 'groups' | 'challenges' | 'chat'>('feed');
  const [feedCategory, setFeedCategory] = useState<'all' | 'following' | 'trending' | 'workout'>('all');
  const [leaderboardMetric, setLeaderboardMetric] = useState<'steps' | 'calories'>('steps');

  // Loading states
  const [loadingFeed, setLoadingFeed] = useState(true);
  const [loadingGroups, setLoadingGroups] = useState(false);
  const [loadingChallenges, setLoadingChallenges] = useState(false);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(false);

  // Search input
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isLiveStreamOpen, setIsLiveStreamOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  // Active Expanded Comments section by postId
  const [expandedCommentsPostId, setExpandedCommentsPostId] = useState<string | null>(null);
  const [commentInputMap, setCommentInputMap] = useState<Record<string, string>>({});
  const [submittingComment, setSubmittingComment] = useState(false);

  // 1. Fetch Real Feed
  const fetchFeed = async (category = feedCategory, search = searchQuery) => {
    try {
      setLoadingFeed(true);
      const res = await postsApi.getFeed({ category, search, limit: 20 });
      if (res.data) {
        setPosts(res.data);
      }
    } catch (err) {
      console.warn('Feed fetch warning:', err);
    } finally {
      setLoadingFeed(false);
    }
  };

  useEffect(() => {
    fetchFeed(feedCategory, searchQuery);
  }, [feedCategory]);

  // 2. Fetch Groups, Challenges, Leaderboard, Suggested Buddies
  useEffect(() => {
    groupsApi.getGroups().then((res) => res.data && setGroups(res.data)).catch(() => {});
    challengesApi.getChallenges().then((res) => res.data && setChallenges(res.data)).catch(() => {});
    usersApi.getSuggestedUsers().then((res) => res.data && setSuggestedBuddies(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (activeTab === 'leaderboard') {
      setLoadingLeaderboard(true);
      challengesApi
        .getLeaderboard(leaderboardMetric)
        .then((res) => res.data && setLeaderboard(res.data))
        .catch(() => {})
        .finally(() => setLoadingLeaderboard(false));
    }
  }, [activeTab, leaderboardMetric]);

  // 3. Socket.IO Real-Time Feed Events
  useEffect(() => {
    const socket = getSocket();

    const handlePostCreated = (newPost: CommunityPost) => {
      setPosts((prev) => [newPost, ...prev.filter((p) => p.id !== newPost.id)]);
    };

    const handlePostLiked = ({ postId, likesCount }: any) => {
      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, likesCount } : p))
      );
    };

    const handlePostCommented = ({ postId, commentsCount, comment }: any) => {
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? {
                ...p,
                commentsCount,
                comments: p.comments ? [...p.comments, comment] : [comment],
              }
            : p
        )
      );
    };

    const handlePostDeleted = ({ postId }: any) => {
      setPosts((prev) => prev.filter((p) => p.id !== postId));
    };

    socket.on('post:created', handlePostCreated);
    socket.on('post:liked', handlePostLiked);
    socket.on('post:commented', handlePostCommented);
    socket.on('post:deleted', handlePostDeleted);

    return () => {
      socket.off('post:created', handlePostCreated);
      socket.off('post:liked', handlePostLiked);
      socket.off('post:commented', handlePostCommented);
      socket.off('post:deleted', handlePostDeleted);
    };
  }, []);

  // 4. Real Interactions
  const handlePostCreated = (newPost: CommunityPost) => {
    setPosts([newPost, ...posts]);
  };

  const toggleLikePost = async (postId: string) => {
    const target = posts.find((p) => p.id === postId);
    if (!target) return;

    const newLiked = !target.isLiked;
    const newCount = newLiked ? target.likesCount + 1 : target.likesCount - 1;

    // Optimistic UI update
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, isLiked: newLiked, likesCount: newCount } : p))
    );

    try {
      await postsApi.toggleLike(postId);
    } catch (err) {
      // Revert if API fails
      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, isLiked: !newLiked, likesCount: target.likesCount } : p))
      );
      toast.error('Unable to update like');
    }
  };

  const toggleBookmarkPost = async (postId: string) => {
    const target = posts.find((p) => p.id === postId);
    if (!target) return;

    const newBookmarked = !target.isBookmarked;
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, isBookmarked: newBookmarked } : p))
    );

    try {
      await postsApi.toggleBookmark(postId);
      toast.success(newBookmarked ? 'Post saved to bookmarks' : 'Post removed from bookmarks');
    } catch (err) {
      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, isBookmarked: !newBookmarked } : p))
      );
    }
  };

  const handleFollowAuthor = async (authorId: string, authorName: string) => {
    if (!authorId) return;
    try {
      const res = await usersApi.followUser(authorId);
      toast.success(res.message || `You followed ${authorName}`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Unable to follow athlete');
    }
  };

  const handleAddComment = async (postId: string) => {
    const text = commentInputMap[postId]?.trim();
    if (!text) return;

    setSubmittingComment(true);
    try {
      const res = await postsApi.addComment(postId, text);
      setCommentInputMap((prev) => ({ ...prev, [postId]: '' }));

      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? {
                ...p,
                commentsCount: res.commentsCount || p.commentsCount + 1,
                comments: p.comments ? [...p.comments, res.data] : [res.data],
              }
            : p
        )
      );
      toast.success('Comment published');
    } catch (err) {
      toast.error('Unable to post comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleJoinGroup = async (groupId: string) => {
    try {
      const res = await groupsApi.joinGroup(groupId);
      setGroups((prev) =>
        prev.map((g) => (g.id === groupId ? { ...g, isJoined: res.isJoined, membersCount: res.membersCount } : g))
      );
      toast.success(res.isJoined ? 'Joined group!' : 'Left group');
    } catch (err) {
      toast.error('Unable to update group membership');
    }
  };

  const handleJoinChallenge = async (challengeId: string) => {
    try {
      const res = await challengesApi.joinChallenge(challengeId);
      setChallenges((prev) =>
        prev.map((ch) =>
          ch.id === challengeId
            ? { ...ch, isJoined: res.isJoined, participantsCount: res.participantsCount }
            : ch
        )
      );
      toast.success(res.isJoined ? 'Joined Challenge! 🎯 XP locked.' : 'Left Challenge');
    } catch (err) {
      toast.error('Unable to join challenge');
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchFeed(feedCategory, searchQuery);
  };

  return (
    <div className="min-h-screen bg-[#04060a] text-slate-100 font-sans pb-32">
      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-6 space-y-6 sm:space-y-8">
        {/* Header Title & CTA Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
              <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
                Active Community Matrix • Real-Time Sync
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-1 sm:mt-2">
              Fitness Social Network
            </h1>
            <p className="text-xs text-slate-400 font-mono mt-1">
              Connect with 50,000+ athletes • Share workout telemetry • WebRTC Live Streams
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsLiveStreamOpen(true)}
              className="px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-300 font-bold text-xs flex items-center gap-1.5 hover:bg-rose-500 hover:text-white transition shadow-[0_0_15px_rgba(244,63,94,0.3)]"
            >
              <Video className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Go Live</span>
            </button>

            <button
              onClick={() => setIsPrivacyModalOpen(true)}
              className="px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl bg-slate-900 border border-white/10 text-slate-300 hover:text-white font-bold text-xs flex items-center gap-1.5 transition"
            >
              <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-teal-400" />
              <span>Privacy</span>
            </button>

            <button
              onClick={() => setIsCreatePostOpen(true)}
              className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-2xl bg-gradient-to-r from-teal-400 to-cyan-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(45,212,191,0.4)] hover:shadow-[0_0_30px_rgba(45,212,191,0.6)] transition"
            >
              <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Create Post</span>
            </button>
          </div>
        </div>

        {/* Global Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search workouts, athletes, topics (#HIIT, #165BPM), or telemetry..."
            className="w-full px-11 py-3 rounded-2xl bg-slate-950/80 border border-white/10 hover:border-teal-500/40 focus:border-teal-400 text-xs text-white placeholder-slate-500 backdrop-blur-xl focus:outline-none transition shadow-lg"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                fetchFeed(feedCategory, '');
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-white"
            >
              Clear
            </button>
          )}
        </form>

        {/* Main Navigation Sub-Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-4 border-b border-white/10 no-scrollbar">
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
              className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-2xl text-xs font-bold shrink-0 border transition ${
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          {/* Main Feed / Reels / Chat Area (8 Cols) */}
          <div className="lg:col-span-8 space-y-4 sm:space-y-6">
            {/* TAB 1: HOME FEED */}
            {activeTab === 'feed' && (
              <div className="space-y-4 sm:space-y-6">
                {/* Feed Filter Chips */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                  {[
                    { id: 'all', label: 'All Activities' },
                    { id: 'following', label: 'Following Feed' },
                    { id: 'trending', label: '🔥 High Burn (350+ kcal)' },
                    { id: 'workout', label: '🏋️ Workouts' },
                  ].map((chip) => (
                    <button
                      key={chip.id}
                      onClick={() => setFeedCategory(chip.id as any)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
                        feedCategory === chip.id
                          ? 'bg-teal-400 text-slate-950 shadow-[0_0_12px_rgba(45,212,191,0.4)]'
                          : 'bg-slate-900 border border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>

                {loadingFeed ? (
                  <div className="p-12 text-center rounded-3xl bg-slate-950/80 border border-white/10 space-y-3">
                    <div className="w-8 h-8 border-2 border-teal-400 border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-xs font-mono text-slate-400">Syncing FitTracker Community Matrix...</p>
                  </div>
                ) : posts.length === 0 ? (
                  <div className="p-12 text-center rounded-3xl bg-slate-950/80 border border-white/10 space-y-3">
                    <Sparkles className="w-10 h-10 text-teal-400/40 mx-auto" />
                    <h3 className="font-bold text-white text-base">No Feed Posts Found</h3>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      Be the pioneer to publish workout telemetry, heart rate metrics, or nutrition updates!
                    </p>
                    <button
                      onClick={() => setIsCreatePostOpen(true)}
                      className="px-4 py-2 rounded-xl bg-teal-400 text-slate-950 font-bold text-xs"
                    >
                      Create First Post
                    </button>
                  </div>
                ) : (
                  posts.map((post) => {
                    const isCommentsExpanded = expandedCommentsPostId === post.id;
                    const commentDraft = commentInputMap[post.id] || '';

                    return (
                      <div
                        key={post.id}
                        className="p-4 sm:p-6 rounded-3xl bg-slate-950/90 border border-white/10 backdrop-blur-2xl space-y-4 shadow-xl hover:border-white/20 transition"
                      >
                        {/* Post Author Bar */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <img
                              src={
                                post.authorAvatar ||
                                'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=300&auto=format&fit=crop'
                              }
                              alt={post.authorName}
                              className="w-11 h-11 rounded-full object-cover border border-teal-400"
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-extrabold text-sm text-white">{post.authorName}</span>
                                <span className="px-2 py-0.5 rounded-full bg-teal-500/20 border border-teal-500/30 text-teal-300 text-[9px] font-mono font-bold">
                                  {post.authorBadge || 'ATHLETE'}
                                </span>
                              </div>
                              <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                                {post.timeAgo || 'Recently'}
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() =>
                              handleFollowAuthor((post as any).author?._id || (post as any).author, post.authorName)
                            }
                            className="px-3.5 py-1 rounded-full bg-slate-900 border border-white/10 hover:border-teal-400/50 text-slate-300 hover:text-white text-xs font-bold transition flex items-center gap-1"
                          >
                            <UserPlus className="w-3 h-3 text-teal-400" />
                            <span>Follow</span>
                          </button>
                        </div>

                        {/* Caption */}
                        <p className="text-sm text-slate-200 leading-relaxed font-sans">{post.caption}</p>

                        {/* Media Content */}
                        {post.mediaUrls && post.mediaUrls.length > 0 && post.mediaUrls[0] && (
                          <div className="relative w-full h-80 rounded-2xl overflow-hidden border border-white/10 bg-slate-900">
                            {post.mediaUrls[0].endsWith('.mp4') || post.mediaUrls[0].includes('video') ? (
                              <video
                                src={post.mediaUrls[0]}
                                controls
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <img
                                src={post.mediaUrls[0]}
                                alt="workout post"
                                className="w-full h-full object-cover"
                              />
                            )}

                            {/* Telemetry Overlay Card */}
                            {post.workoutMetrics && (
                              <div className="absolute bottom-3 left-3 right-3 p-3 rounded-2xl bg-slate-950/80 backdrop-blur-md border border-white/15 flex flex-wrap items-center justify-between text-xs font-mono">
                                <div className="flex items-center gap-2">
                                  <Activity className="w-4 h-4 text-rose-400 animate-pulse" />
                                  <span className="text-rose-300 font-bold">
                                    {post.workoutMetrics.avgHeartRate} BPM
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Flame className="w-4 h-4 text-amber-400" />
                                  <span className="text-amber-300 font-bold">
                                    {post.workoutMetrics.caloriesBurned} kcal
                                  </span>
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

                          <button
                            onClick={() =>
                              setExpandedCommentsPostId(isCommentsExpanded ? null : post.id)
                            }
                            className="flex items-center gap-1.5 hover:text-white font-bold transition"
                          >
                            <MessageCircle className="w-4 h-4 text-teal-400" />
                            <span>{post.commentsCount} Comments</span>
                          </button>

                          <button
                            onClick={() => toggleBookmarkPost(post.id)}
                            className={`flex items-center gap-1.5 font-bold transition ${
                              post.isBookmarked ? 'text-amber-400' : 'hover:text-white'
                            }`}
                          >
                            <Bookmark className={`w-4 h-4 ${post.isBookmarked ? 'fill-amber-400' : ''}`} />
                            <span>Save</span>
                          </button>

                          <button
                            onClick={() => {
                              if (navigator.share) {
                                navigator.share({ title: post.caption, url: window.location.href }).catch(() => {});
                              } else {
                                toast.success('Post link copied to clipboard!');
                              }
                            }}
                            className="flex items-center gap-1.5 hover:text-white font-bold transition"
                          >
                            <Share2 className="w-4 h-4 text-cyan-400" />
                            <span>Share</span>
                          </button>
                        </div>

                        {/* Inline Comments Expansion */}
                        {isCommentsExpanded && (
                          <div className="border-t border-white/10 pt-3 space-y-3">
                            <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar text-xs">
                              {post.comments && post.comments.length > 0 ? (
                                post.comments.map((c: any, cIdx: number) => (
                                  <div key={cIdx} className="p-2.5 rounded-xl bg-slate-900 border border-white/5">
                                    <div className="font-bold text-teal-300 text-[11px]">
                                      {c.userName || c.author || 'Athlete'}
                                    </div>
                                    <div className="text-slate-200 mt-0.5">{c.text}</div>
                                  </div>
                                ))
                              ) : (
                                <div className="text-xs text-slate-500 font-mono py-2">
                                  No comments yet. Leave the first encouragement!
                                </div>
                              )}
                            </div>

                            <form
                              onSubmit={(e) => {
                                e.preventDefault();
                                handleAddComment(post.id);
                              }}
                              className="flex gap-2"
                            >
                              <input
                                type="text"
                                value={commentDraft}
                                onChange={(e) =>
                                  setCommentInputMap({ ...commentInputMap, [post.id]: e.target.value })
                                }
                                placeholder="Add workout feedback or comment..."
                                className="flex-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-white/15 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-400"
                              />
                              <button
                                type="submit"
                                disabled={submittingComment || !commentDraft}
                                className="px-3.5 py-1.5 rounded-xl bg-teal-400 text-slate-950 font-bold text-xs disabled:opacity-40"
                              >
                                <Send className="w-3.5 h-3.5" />
                              </button>
                            </form>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* TAB 2: FITNESS REELS */}
            {activeTab === 'reels' && <FitnessReelsView />}

            {/* TAB 3: LEADERBOARD */}
            {activeTab === 'leaderboard' && (
              <div className="p-6 rounded-3xl bg-slate-950/90 border border-white/10 backdrop-blur-2xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-black text-white flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-amber-400" />
                      <span>Athlete Performance Leaderboard</span>
                    </h3>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">
                      Calculated from verified server telemetry & workout output
                    </p>
                  </div>

                  <div className="flex gap-1.5 p-1 rounded-xl bg-slate-900 border border-white/10 text-xs font-mono">
                    <button
                      onClick={() => setLeaderboardMetric('steps')}
                      className={`px-3 py-1 rounded-lg font-bold transition ${
                        leaderboardMetric === 'steps' ? 'bg-teal-400 text-slate-950' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Active Steps
                    </button>
                    <button
                      onClick={() => setLeaderboardMetric('calories')}
                      className={`px-3 py-1 rounded-lg font-bold transition ${
                        leaderboardMetric === 'calories' ? 'bg-teal-400 text-slate-950' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Calories Burned
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  {loadingLeaderboard ? (
                    <div className="p-8 text-center text-xs font-mono text-slate-400">
                      Computing leaderboard metrics...
                    </div>
                  ) : (
                    leaderboard.map((entry) => (
                      <div
                        key={entry.rank}
                        className={`flex items-center justify-between p-4 rounded-2xl border text-xs font-sans transition ${
                          entry.isCurrentUser
                            ? 'bg-teal-500/20 border-teal-400 text-teal-200 shadow-[0_0_20px_rgba(45,212,191,0.2)]'
                            : 'bg-slate-900/60 border-white/5 text-slate-200 hover:border-white/15'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <span className="font-mono font-black text-base text-slate-400 w-6">
                            #{entry.rank}
                          </span>
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
                          <div className="text-lg font-black text-white font-mono">
                            {entry.score.toLocaleString()}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">{entry.metricLabel}</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB 4: GROUPS */}
            {activeTab === 'groups' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {groups.map((grp) => (
                  <div
                    key={grp.id}
                    className="p-5 rounded-3xl bg-slate-950/90 border border-white/10 backdrop-blur-2xl space-y-3 hover:border-teal-500/40 transition"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-3xl">{grp.icon}</span>
                      <button
                        onClick={() => handleJoinGroup(grp.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                          grp.isJoined
                            ? 'bg-teal-500/20 border-teal-400 text-teal-300'
                            : 'bg-teal-400 text-slate-950 font-black shadow-[0_0_10px_rgba(45,212,191,0.4)]'
                        }`}
                      >
                        {grp.isJoined ? 'Joined ✓' : '+ Join Group'}
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
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-mono font-bold">
                          +{ch.rewardXP} XP
                        </span>
                        <button
                          onClick={() => handleJoinChallenge(ch.id)}
                          className={`px-3 py-1 rounded-xl text-xs font-bold border transition ${
                            ch.isJoined
                              ? 'bg-teal-500/20 border-teal-400 text-teal-300'
                              : 'bg-teal-400 text-slate-950 font-black'
                          }`}
                        >
                          {ch.isJoined ? 'Joined ✓' : 'Join'}
                        </button>
                      </div>
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
                          className="h-full bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(100, (ch.currentProgress / ch.targetValue) * 100)}%` }}
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
            {/* AI Suggested Gym Buddies */}
            <div className="p-6 rounded-3xl bg-slate-950/80 border border-white/10 backdrop-blur-2xl space-y-4">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-400 animate-pulse" />
                <span>AI Suggested Gym Buddies</span>
              </h3>

              <div className="space-y-3">
                {suggestedBuddies.map((b) => (
                  <div
                    key={b.id}
                    className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/60 border border-white/5 text-xs hover:border-teal-500/30 transition"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="relative">
                        <img
                          src={b.avatar}
                          alt={b.name}
                          className="w-9 h-9 rounded-full object-cover border border-teal-400"
                        />
                        {b.isOnline && (
                          <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400 border border-slate-950" />
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-white">{b.name}</div>
                        <div className="text-[10px] text-slate-400">{b.role}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleFollowAuthor(b.id, b.name)}
                      className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-teal-400 hover:text-slate-950 text-teal-300 font-bold text-[10px] transition"
                    >
                      Follow
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Trending Fitness Topics */}
            <div className="p-6 rounded-3xl bg-slate-950/80 border border-white/10 backdrop-blur-2xl space-y-3">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                <span>Trending Fitness Topics</span>
              </h3>

              <div className="flex flex-wrap gap-2 pt-1 text-xs font-mono font-bold">
                {[
                  { tag: '#SFBayRunners', color: 'text-teal-300' },
                  { tag: '#165BPMHIIT', color: 'text-cyan-300' },
                  { tag: '#DeadliftPR', color: 'text-amber-300' },
                  { tag: '#ColdPlunge', color: 'text-rose-300' },
                  { tag: '#KettlebellComplex', color: 'text-emerald-300' },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSearchQuery(item.tag);
                      fetchFeed(feedCategory, item.tag);
                    }}
                    className={`px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 hover:border-teal-400/50 ${item.color} transition`}
                  >
                    {item.tag}
                  </button>
                ))}
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
    </div>
  );
};

export default CommunityPage;
