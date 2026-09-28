export type ProgressCategory = 'Front' | 'Side' | 'Back' | 'Other';

export interface ProgressPhoto {
  url: string;
  publicId?: string;
  type: ProgressCategory;
}

export interface WorkoutSnapshot {
  workoutId?: string;
  workoutTitle?: string;
  workoutType?: string;
  duration?: number;
  calories?: number;
  distance?: number;
  prAchieved?: string;
}

export interface ProgressEntry {
  id: string;
  _id?: string;
  userId?: string;
  user?: string;
  imageUrl: string;
  publicId?: string;
  photos?: ProgressPhoto[];
  date: string;
  weight?: number;
  waist?: number;
  bodyFat?: number;
  bodyFatPercentage?: number;
  chest?: number;
  arms?: number;
  thighs?: number;
  hips?: number;
  neck?: number;
  category: ProgressCategory;
  unitPreference?: 'metric' | 'imperial';
  notes?: string;
  workoutSnapshot?: WorkoutSnapshot;
  createdAt?: string;
  updatedAt?: string;
}

export interface NewProgressData {
  image?: File | null;
  photos?: { file: File; type: ProgressCategory }[];
  imageUrl?: string;
  weight?: number;
  waist?: number;
  bodyFat?: number;
  chest?: number;
  arms?: number;
  thighs?: number;
  hips?: number;
  neck?: number;
  category: ProgressCategory;
  unitPreference?: 'metric' | 'imperial';
  notes?: string;
  workoutSnapshot?: WorkoutSnapshot;
  date?: string;
}

export interface TrendDataPoint {
  date: string;
  fullDate: string;
  value: number;
  previous?: number;
  change?: number;
}

export interface WorkoutFrequencyPoint {
  week: string;
  workouts: number;
}

export interface ComparisonSubject {
  id: string;
  date: string;
  weight?: number;
  bodyFat?: number;
  waist?: number;
  frontPhoto?: string | null;
  sidePhoto?: string | null;
  backPhoto?: string | null;
}

export interface ProgressComparison {
  before: ComparisonSubject | null;
  current: ComparisonSubject | null;
  deltas: {
    weight?: number | null;
    bodyFat?: number | null;
    waist?: number | null;
  };
  hasEnoughPhotos: boolean;
}

export interface ProgressGoal {
  id: string;
  title: string;
  type: string;
  category?: string;
  target: number;
  unit: string;
  current: number;
  progress: number;
  targetDate?: string;
}

export interface ProgressMilestone {
  id: string;
  title: string;
  description: string;
  category: string;
  achieved: boolean;
  achievedAt?: string | null;
  progress: number;
  icon: string;
}

export interface AiProgressInsights {
  primaryInsight: string;
  focusForNextWeek: string;
  statusBadge: string;
}

export interface HeatmapDay {
  date: string;
  count: number;
  details: string[];
  level: number;
}

export interface ProgressKPIs {
  currentWeight: number | null;
  startWeight: number | null;
  weightDelta: number | null;
  weightDeltaPrev: number | null;
  weightChangePct: number | null;
  currentBodyFat: number | null;
  startBodyFat: number | null;
  bodyFatDelta: number | null;
  bodyFatDeltaPrev: number | null;
  currentWaist: number | null;
  startWaist: number | null;
  waistDelta: number | null;
  waistDeltaPrev: number | null;
  streak: number;
  goalProgress: number;
  workoutsCount: number;
  totalWorkoutsAllTime: number;
  progressScore: number;
  scoreBreakdown?: {
    goalPts: number;
    streakPts: number;
    workoutPts: number;
    trackingPts: number;
  };
}

export interface ProgressAnalytics {
  hasData: boolean;
  kpis: ProgressKPIs;
  timeline: ProgressEntry[];
  charts: {
    weightTrend: TrendDataPoint[];
    bodyFatTrend: TrendDataPoint[];
    waistTrend: TrendDataPoint[];
    chestTrend: TrendDataPoint[];
    armsTrend: TrendDataPoint[];
    thighsTrend: TrendDataPoint[];
    workoutFrequency: WorkoutFrequencyPoint[];
  };
  comparison: ProgressComparison;
  goals: ProgressGoal[];
  milestones: ProgressMilestone[];
  aiInsights: AiProgressInsights;
  heatmap: HeatmapDay[];
}