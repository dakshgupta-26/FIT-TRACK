export interface CommunityPost {
  id: string;
  authorName: string;
  authorAvatar: string;
  authorBadge: string;
  timeAgo: string;
  type: 'workout' | 'transformation' | 'reel' | 'meal' | 'route' | 'voice';
  caption: string;
  mediaUrls: string[];
  audioUrl?: string;
  workoutMetrics?: {
    workoutType: string;
    caloriesBurned: number;
    durationMinutes: number;
    stepsCount: number;
    avgHeartRate: number;
    distanceMiles?: number;
    routeMapUrl?: string;
    beforeImage?: string;
    afterImage?: string;
  };
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  isLiked: boolean;
  isBookmarked: boolean;
  aiSummary?: string;
  comments?: { id: string; author: string; avatar: string; text: string; timeAgo: string }[];
}

export interface CommunityGroup {
  id: string;
  name: string;
  category: string;
  membersCount: number;
  icon: string;
  bannerImage: string;
  description: string;
  weeklyGoal: string;
  isJoined: boolean;
}

export interface CommunityChallenge {
  id: string;
  title: string;
  description: string;
  type: 'steps' | 'calories' | 'workouts';
  targetValue: number;
  currentProgress: number;
  participantsCount: number;
  daysRemaining: number;
  badgeIcon: string;
  rewardXP: number;
  isJoined: boolean;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  avatar: string;
  score: number; // e.g. steps or calories
  metricLabel: string;
  badge: string;
  isCurrentUser?: boolean;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  time: string;
  isMe: boolean;
  workoutAttachment?: { type: string; calories: number; duration: string };
}

export const samplePosts: CommunityPost[] = [
  {
    id: 'post-1',
    authorName: 'Sarah Connor',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop',
    authorBadge: 'PRO ATHLETE',
    timeAgo: '12 mins ago',
    type: 'workout',
    caption: 'Crushed a 10km morning run around SF Bay Bridge! Pushed heart rate to 168 BPM during the final hill sprint. AI recommended 20min cold plunge recovery next. 🏃‍♀️🔥',
    mediaUrls: [
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop',
    ],
    workoutMetrics: {
      workoutType: 'Outdoor Run',
      caloriesBurned: 640,
      durationMinutes: 48,
      stepsCount: 11450,
      avgHeartRate: 158,
      distanceMiles: 6.2,
      routeMapUrl: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=600&auto=format&fit=crop',
    },
    likesCount: 184,
    commentsCount: 24,
    sharesCount: 9,
    isLiked: true,
    isBookmarked: false,
    aiSummary: '⚡ Outstanding VO2 Max output! 640 kcal burned in Peak HR Zone 4.',
    comments: [
      { id: 'c1', author: 'Alex Rivera', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop', text: 'Incredible pace Sarah! Let us run together this Saturday.', timeAgo: '5m ago' },
    ],
  },
  {
    id: 'post-2',
    authorName: 'Alex Rivera',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop',
    authorBadge: 'POWERLIFTER',
    timeAgo: '1 hour ago',
    type: 'transformation',
    caption: '12 Weeks AI Hypertrophy Program Results! Body fat dropped from 18% to 11% while keeping all bench press PR strength. Consistency beats motivation every single time. 💪🔥',
    mediaUrls: [
      'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=800&auto=format&fit=crop',
    ],
    workoutMetrics: {
      workoutType: '12-Week Transformation',
      caloriesBurned: 14500,
      durationMinutes: 180,
      stepsCount: 142000,
      avgHeartRate: 135,
      beforeImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=400&auto=format&fit=crop',
      afterImage: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=400&auto=format&fit=crop',
    },
    likesCount: 412,
    commentsCount: 58,
    sharesCount: 31,
    isLiked: false,
    isBookmarked: true,
    aiSummary: '🏆 Top 1% Transformation Progress! Hypertrophy Index: 98/100.',
  },
  {
    id: 'post-3',
    authorName: 'Elena Rostova',
    authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=300&auto=format&fit=crop',
    authorBadge: 'SOMATIC COACH',
    timeAgo: '3 hours ago',
    type: 'meal',
    caption: 'Post-workout High Protein Salmon & Quinoa Fuel Bowl! 48g Protein • 520 kcal • 14g Clean Healthy Fats. Essential for muscle repair & inflammation reduction. 🥗🐟',
    mediaUrls: [
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop',
    ],
    workoutMetrics: {
      workoutType: 'Nutritional Meal',
      caloriesBurned: 520,
      durationMinutes: 15,
      stepsCount: 0,
      avgHeartRate: 72,
    },
    likesCount: 295,
    commentsCount: 18,
    sharesCount: 12,
    isLiked: true,
    isBookmarked: false,
    aiSummary: '🥗 Optimal Nutrient Density Ratio! Macro Balance: 40% P / 40% C / 20% F.',
  },
];

export const sampleGroups: CommunityGroup[] = [
  {
    id: 'grp-1',
    name: 'San Francisco Bay Runners',
    category: 'Running',
    membersCount: 4280,
    icon: '🏃‍♀️',
    bannerImage: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?q=80&w=800&auto=format&fit=crop',
    description: 'Weekly sunrise runs along Embarcadero & Golden Gate Bridge.',
    weeklyGoal: 'Run 10,000 km collectively',
    isJoined: true,
  },
  {
    id: 'grp-2',
    name: 'TITAN Heavy Powerlifting Club',
    category: 'Powerlifting',
    membersCount: 2150,
    icon: '🏋️‍♂️',
    bannerImage: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop',
    description: 'Barbell deadlifts, squat PRs, and strength science discussions.',
    weeklyGoal: 'Lift 100,000 kg total volume',
    isJoined: false,
  },
  {
    id: 'grp-3',
    name: 'Zenith Somatic Yoga & Cold Plunge',
    category: 'Yoga',
    membersCount: 1890,
    icon: '🧘‍♀️',
    bannerImage: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=800&auto=format&fit=crop',
    description: 'Mindfulness, breathwork, HRV recovery, and ice bath therapy.',
    weeklyGoal: '1,000 Hours Recovery Meditation',
    isJoined: true,
  },
];

export const sampleChallenges: CommunityChallenge[] = [
  {
    id: 'ch-1',
    title: 'August 100,000 Step Master',
    description: 'Walk or run 100,000 steps this month to earn the Gold Finisher Badge and +1,000 FitTracker XP!',
    type: 'steps',
    targetValue: 100000,
    currentProgress: 64200,
    participantsCount: 14200,
    daysRemaining: 12,
    badgeIcon: '🥇',
    rewardXP: 1000,
    isJoined: true,
  },
  {
    id: 'ch-2',
    title: '🔥 10,000 Calorie Burn Sprint',
    description: 'Burn 10k total active calories through HIIT, running, or strength workouts in 14 days.',
    type: 'calories',
    targetValue: 10000,
    currentProgress: 3850,
    participantsCount: 8900,
    daysRemaining: 6,
    badgeIcon: '🔥',
    rewardXP: 1500,
    isJoined: false,
  },
];

export const sampleLeaderboard: LeaderboardEntry[] = [
  { rank: 1, name: 'Sarah Connor', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop', score: 148200, metricLabel: 'Steps', badge: '🥇 CHAMPION' },
  { rank: 2, name: 'Daksh Gupta', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop', score: 132400, metricLabel: 'Steps', badge: '🥈 PRO RANK', isCurrentUser: true },
  { rank: 3, name: 'Alex Rivera', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop', score: 119800, metricLabel: 'Steps', badge: '🥉 ELITE' },
  { rank: 4, name: 'Elena Rostova', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=300&auto=format&fit=crop', score: 105600, metricLabel: 'Steps', badge: 'TOP 5%' },
];

export const sampleChatMessages: ChatMessage[] = [
  { id: 'm1', senderId: 'user-2', senderName: 'Sarah Connor', senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop', text: 'Hey Daksh! Ready for our 10km morning run along Golden Gate tomorrow at 6:30 AM?', time: '10:14 AM', isMe: false },
  { id: 'm2', senderId: 'user-me', senderName: 'Daksh Gupta', senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop', text: 'Absolutely Sarah! Just set my alarm. Syncing my 165 BPM Spotify playlist now.', time: '10:16 AM', isMe: true },
];
