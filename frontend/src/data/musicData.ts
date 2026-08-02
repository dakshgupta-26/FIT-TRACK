export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  cover: string;
  duration: string;
  durationSeconds: number;
  bpm: number;
  genre: string;
  lyricsSnippet?: string;
  audioPreviewUrl?: string;
}

export interface AiAudioMode {
  id: string;
  name: string;
  iconName: string;
  targetBpm: number;
  confidence: number;
  caloriesEst: number;
  mood: string;
  description: string;
  gradient: string;
  tracksCount: number;
  sampleTracks: Track[];
}

export interface PlaylistData {
  id: string;
  title: string;
  workoutType: 'HIIT' | 'Strength' | 'Cardio' | 'Yoga' | 'Recovery' | 'Focus';
  mood: string;
  duration: string;
  trackCount: number;
  likes: number;
  bpm: number;
  aiScore: number;
  coverImage: string;
  isFavorite: boolean;
  tracks: Track[];
}

export interface FriendActivity {
  id: string;
  name: string;
  avatar: string;
  workout: string;
  trackTitle: string;
  artist: string;
  bpm: number;
  heartRate: number;
  timeAgo: string;
}

export const sampleTracks: Track[] = [
  {
    id: 'tr-1',
    title: 'Cybernetic Voltage (Hypertrophy Edit)',
    artist: 'KAVINSKY & Synthwave AI',
    album: 'FitTracker Cyber Sessions 2026',
    cover: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=600&auto=format&fit=crop',
    duration: '3:45',
    durationSeconds: 225,
    bpm: 165,
    genre: 'Cyber Phonk / Darksynth',
    lyricsSnippet: '⚡ Heavy bass drop incoming • Synchronizing heart rate to 165 BPM • Maximum power output engaged',
  },
  {
    id: 'tr-2',
    title: 'Titanium Energy (PR Mode)',
    artist: 'David Guetta ft. Sia (AI Remaster)',
    album: 'Heavy Metal & Powerlifting Vol 4',
    cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600&auto=format&fit=crop',
    duration: '4:12',
    durationSeconds: 252,
    bpm: 145,
    genre: 'EDM / Heavy Workout',
    lyricsSnippet: 'You shoot me down, but I won\'t fall • I am Titanium • Push through the last 2 reps',
  },
  {
    id: 'tr-3',
    title: 'Somatic Delta Flow (-160°C)',
    artist: 'Marconi Union & Bio-Ambient',
    album: 'Cold Plunge & Cryotherapy',
    cover: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=600&auto=format&fit=crop',
    duration: '6:30',
    durationSeconds: 390,
    bpm: 68,
    genre: 'Ambient / Somatic',
    lyricsSnippet: 'Deep slow nasal inhale 4 seconds • Hold 4 seconds • Exhale 6 seconds • Lowering parasympathetic nervous tone',
  },
  {
    id: 'tr-4',
    title: 'Till I Collapse (160 BPM Sprint)',
    artist: 'Eminem ft. Nate Dogg',
    album: 'Cardio Overdrive 2026',
    cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=600&auto=format&fit=crop',
    duration: '4:57',
    durationSeconds: 297,
    bpm: 160,
    genre: 'Hip-Hop / Workout Classic',
    lyricsSnippet: 'Cause sometimes you feel tired, feel weak • And when you feel like you\'re ready to quit you gotta find that inner strength',
  },
];

export const sampleAiModes: AiAudioMode[] = [
  {
    id: 'mode-hiit',
    name: '🔥 HIIT Boost',
    iconName: 'Flame',
    targetBpm: 165,
    confidence: 98,
    caloriesEst: 420,
    mood: 'Peak Intensity',
    description: 'High BPM phonk & EDM designed for maximum explosive power during interval sprints.',
    gradient: 'from-rose-500/30 via-orange-500/20 to-slate-950',
    tracksCount: 24,
    sampleTracks: [sampleTracks[0], sampleTracks[1]],
  },
  {
    id: 'mode-recovery',
    name: '🧘 Recovery Mode',
    iconName: 'Heart',
    targetBpm: 72,
    confidence: 96,
    caloriesEst: 95,
    mood: 'Deep Chill',
    description: 'Binaural frequencies & ambient waves to accelerate lactic acid flushing and HRV reset.',
    gradient: 'from-teal-500/30 via-emerald-500/20 to-slate-950',
    tracksCount: 18,
    sampleTracks: [sampleTracks[2]],
  },
  {
    id: 'mode-strength',
    name: '💪 Strength & Heavy Bass',
    iconName: 'Dumbbell',
    targetBpm: 135,
    confidence: 99,
    caloriesEst: 350,
    mood: 'Heavy Aggressive',
    description: 'Heavy metal sub-bass & orchestral drop beats tuned for maximum squat & deadlift PRs.',
    gradient: 'from-purple-500/30 via-cyan-500/20 to-slate-950',
    tracksCount: 30,
    sampleTracks: [sampleTracks[1], sampleTracks[3]],
  },
  {
    id: 'mode-cardio',
    name: '🏃 Steady Cardio Tempo',
    iconName: 'Zap',
    targetBpm: 148,
    confidence: 97,
    caloriesEst: 510,
    mood: 'Endurance Cadence',
    description: 'Continuous 148 BPM pulse matching your running stride frequency for effortless pacing.',
    gradient: 'from-amber-500/30 via-yellow-500/20 to-slate-950',
    tracksCount: 32,
    sampleTracks: [sampleTracks[3]],
  },
];

export const samplePlaylists: PlaylistData[] = [
  {
    id: 'pl-1',
    title: 'HYPER-PUMP 165 BPM (PR Edition)',
    workoutType: 'HIIT',
    mood: 'Aggressive Energy',
    duration: '45 mins',
    trackCount: 16,
    likes: 1420,
    bpm: 165,
    aiScore: 99,
    coverImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop',
    isFavorite: true,
    tracks: sampleTracks,
  },
  {
    id: 'pl-2',
    title: 'ZENITH Somatic Cold Plunge & Sauna',
    workoutType: 'Recovery',
    mood: 'Somatic Ambient',
    duration: '35 mins',
    trackCount: 12,
    likes: 890,
    bpm: 68,
    aiScore: 96,
    coverImage: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=800&auto=format&fit=crop',
    isFavorite: false,
    tracks: [sampleTracks[2]],
  },
  {
    id: 'pl-3',
    title: 'HEAVY METAL POWERLIFTING 140',
    workoutType: 'Strength',
    mood: 'Barbell Motivation',
    duration: '60 mins',
    trackCount: 22,
    likes: 2150,
    bpm: 140,
    aiScore: 97,
    coverImage: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop',
    isFavorite: true,
    tracks: [sampleTracks[1], sampleTracks[3]],
  },
  {
    id: 'pl-4',
    title: 'CYBERPUNK SPRINT OVERDRIVE',
    workoutType: 'Cardio',
    mood: 'High Speed Synth',
    duration: '40 mins',
    trackCount: 18,
    likes: 1780,
    bpm: 155,
    aiScore: 98,
    coverImage: 'https://images.unsplash.com/photo-1517931524326-bdd55a541177?q=80&w=800&auto=format&fit=crop',
    isFavorite: false,
    tracks: sampleTracks,
  },
];

export const sampleFriendsActivity: FriendActivity[] = [
  {
    id: 'fr-1',
    name: 'Sarah Connor',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop',
    workout: 'HIIT Sprints @ AURA Club',
    trackTitle: 'Cybernetic Voltage',
    artist: 'KAVINSKY',
    bpm: 165,
    heartRate: 168,
    timeAgo: 'Now Playing',
  },
  {
    id: 'fr-2',
    name: 'Alex Rivera',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop',
    workout: 'Heavy Deadlifts @ TITAN',
    trackTitle: 'Till I Collapse',
    artist: 'Eminem',
    bpm: 145,
    heartRate: 152,
    timeAgo: '4 mins ago',
  },
];
