import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  sampleTracks,
  samplePlaylists,
  sampleFriendsActivity,
  Track,
  PlaylistData,
  AiAudioMode,
} from '@/data/musicData';
import { HeroVinylDeck } from '@/components/music/HeroVinylDeck';
import { AiAudioModes } from '@/components/music/AiAudioModes';
import { StickyMusicPlayer } from '@/components/music/StickyMusicPlayer';
import { AiGeneratorModal } from '@/components/music/AiGeneratorModal';
import {
  Sparkles,
  Search,
  Filter,
  Play,
  Pause,
  Heart,
  Music as MusicIcon,
  Flame,
  Activity,
  Users,
  TrendingUp,
  Radio,
  Share2,
  Plus,
  Headphones,
  Zap,
} from 'lucide-react';

const Music: React.FC = () => {
  const [playlists, setPlaylists] = useState<PlaylistData[]>(samplePlaylists);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedModeId, setSelectedModeId] = useState('mode-hiit');
  const [userHeartRate, setUserHeartRate] = useState(145);
  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isGeneratorModalOpen, setIsGeneratorModalOpen] = useState(false);

  const currentTrack = sampleTracks[currentTrackIndex];

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % sampleTracks.length);
    setIsPlaying(true);
  };

  const handlePrevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + sampleTracks.length) % sampleTracks.length);
    setIsPlaying(true);
  };

  const handleSelectAiMode = (mode: AiAudioMode) => {
    setSelectedModeId(mode.id);
    setUserHeartRate(mode.targetBpm);
    setIsPlaying(true);
  };

  const handlePlaylistGenerated = (newPl: PlaylistData) => {
    setPlaylists([newPl, ...playlists]);
  };

  // Heart Rate Simulator Modes
  const hrSimulations = [
    { label: '🔥 Sprinting (165 BPM)', hr: 165 },
    { label: '🏋️ Heavy Lifting (135 BPM)', hr: 135 },
    { label: '🏃 Steady Run (148 BPM)', hr: 148 },
    { label: '🧘 Somatic Recovery (72 BPM)', hr: 72 },
  ];

  const filteredPlaylists = playlists.filter((pl) => {
    const matchesSearch =
      pl.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pl.mood.toLowerCase().includes(searchTerm.toLowerCase());
    if (activeTab === 'All') return matchesSearch;
    return matchesSearch && pl.workoutType.toLowerCase() === activeTab.toLowerCase();
  });

  return (
    <div className="min-h-screen bg-[#04060a] text-slate-100 p-4 sm:p-6 lg:p-8 font-sans pb-32">
      {/* Header Badges Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-mono font-bold">
            ✨ AI Curated
          </span>
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold">
            🟢 Spotify Connected
          </span>
          <span className="px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono font-bold">
            🍎 Apple Music Ready
          </span>
          <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold">
            ⚡ Heart Rate Adaptive
          </span>
        </div>

        <button
          onClick={() => setIsGeneratorModalOpen(true)}
          className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-teal-400 to-cyan-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(45,212,191,0.4)] hover:shadow-[0_0_30px_rgba(45,212,191,0.6)] transition"
        >
          <Plus className="w-4 h-4" />
          <span>Generate AI Playlist</span>
        </button>
      </div>

      {/* Hero 3D Vinyl Record Deck Section */}
      <div className="mb-8">
        <HeroVinylDeck
          currentTrack={currentTrack}
          isPlaying={isPlaying}
          onTogglePlay={handleTogglePlay}
          userHeartRate={userHeartRate}
        />
      </div>

      {/* ChatGPT + Spotify AI Audio Modes */}
      <div className="mb-10">
        <AiAudioModes
          selectedModeId={selectedModeId}
          onSelectMode={handleSelectAiMode}
        />
      </div>

      {/* Heart Rate Adaptive Workout Simulator Bar */}
      <div className="p-6 rounded-3xl bg-slate-950/80 border border-white/10 backdrop-blur-2xl mb-10 space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-xs font-mono font-bold text-teal-300 uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-4 h-4 text-teal-400 animate-pulse" />
            <span>Real-time Biometric Heart Rate Adaptive Pacing Engine</span>
          </div>
          <span className="text-xs text-slate-400 font-mono">Current HR: {userHeartRate} BPM</span>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {hrSimulations.map((sim) => (
            <button
              key={sim.hr}
              onClick={() => {
                setUserHeartRate(sim.hr);
                setIsPlaying(true);
              }}
              className={`px-4 py-2 rounded-2xl text-xs font-bold border transition ${
                userHeartRate === sim.hr
                  ? 'bg-teal-500/20 border-teal-400 text-teal-300 shadow-[0_0_20px_rgba(45,212,191,0.3)]'
                  : 'bg-slate-900 border-white/10 text-slate-300 hover:border-white/20'
              }`}
            >
              {sim.label}
            </button>
          ))}
        </div>
      </div>

      {/* Spotlight Search & Category Tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-teal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search AI playlists..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-950 border border-white/10 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-teal-400 font-sans"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto w-full sm:w-auto">
          {['All', 'HIIT', 'Strength', 'Cardio', 'Recovery'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold border shrink-0 transition ${
                activeTab === tab
                  ? 'bg-teal-500/20 border-teal-400 text-teal-300'
                  : 'bg-slate-950/80 border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Floating Glass Playlists Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {filteredPlaylists.map((pl) => (
          <motion.div
            key={pl.id}
            whileHover={{ y: -6, scale: 1.02 }}
            className="relative rounded-3xl bg-slate-950/80 border border-white/10 hover:border-teal-500/40 backdrop-blur-2xl p-4 transition-all duration-300 group overflow-hidden shadow-xl select-none"
          >
            {/* Album Cover */}
            <div className="relative w-full h-48 rounded-2xl overflow-hidden mb-3 border border-white/10">
              <img
                src={pl.coverImage}
                alt={pl.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

              {/* AI Score Badge */}
              <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-950/80 border border-teal-400/40 backdrop-blur-md text-teal-300 text-xs font-bold">
                {pl.aiScore}% AI Score
              </div>

              {/* Play Hover Overlay Button */}
              <button
                onClick={() => {
                  setIsPlaying(true);
                  setCurrentTrackIndex(0);
                }}
                className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-teal-400 text-slate-950 font-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_25px_rgba(45,212,191,0.7)]"
              >
                <Play className="w-5 h-5 fill-slate-950 ml-0.5" />
              </button>
            </div>

            {/* Title & Info */}
            <h4 className="text-base font-black text-white group-hover:text-teal-300 transition-colors line-clamp-1">
              {pl.title}
            </h4>

            <div className="flex items-center justify-between text-xs text-slate-400 mt-2 font-mono">
              <span>{pl.duration}</span>
              <span className="text-teal-300 font-bold">{pl.bpm} BPM</span>
              <span>❤️ {pl.likes}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* AI Listening Analytics & Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12">
        {/* Analytics Widgets (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-950/80 border border-white/10 backdrop-blur-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-teal-400" />
              <span>AI Listening Telemetry Analytics</span>
            </h3>
            <span className="text-xs font-mono text-teal-400 font-bold">This Week</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/10">
              <div className="text-[11px] font-mono text-slate-400">Listening</div>
              <div className="text-lg font-black text-teal-300 mt-0.5">14.2 Hrs</div>
              <div className="text-[10px] text-slate-400">+2.4 hrs vs last week</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/10">
              <div className="text-[11px] font-mono text-slate-400">Workout Boost</div>
              <div className="text-lg font-black text-emerald-400 mt-0.5">+14%</div>
              <div className="text-[10px] text-slate-400">Higher Output</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/10">
              <div className="text-[11px] font-mono text-slate-400">Audio Calories</div>
              <div className="text-lg font-black text-cyan-300 mt-0.5">4,850 kcal</div>
              <div className="text-[10px] text-slate-400">Burned with audio</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/10">
              <div className="text-[11px] font-mono text-slate-400">Avg Cadence</div>
              <div className="text-lg font-black text-amber-400 mt-0.5">138 BPM</div>
              <div className="text-[10px] text-slate-400">Optimal Training</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-xs text-teal-200 leading-relaxed">
            💡 <strong>AI Insight:</strong> Listening to 165 BPM Phonk during your first 2 sets increased your average squat volume by 14%. Keep listening to HIIT Boost for maximum strength adaptations.
          </div>
        </div>

        {/* Friends Social Workout Feed (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-950/80 border border-white/10 backdrop-blur-2xl space-y-4">
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-teal-400" />
            <span>Friends Training Audio Feed</span>
          </h3>

          <div className="space-y-3">
            {sampleFriendsActivity.map((friend) => (
              <div
                key={friend.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/60 border border-white/5 text-xs"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={friend.avatar}
                    alt={friend.name}
                    className="w-10 h-10 rounded-full object-cover border border-teal-400/50"
                  />
                  <div>
                    <div className="font-bold text-white">{friend.name}</div>
                    <div className="text-[11px] text-slate-400">{friend.workout}</div>
                    <div className="text-[10px] text-teal-300 font-mono mt-0.5">
                      🎵 {friend.trackTitle} • {friend.heartRate} BPM HR
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setIsPlaying(true)}
                  className="px-3 py-1.5 rounded-xl bg-teal-500/20 border border-teal-400/40 text-teal-300 font-bold text-[11px] hover:bg-teal-400 hover:text-slate-950 transition"
                >
                  Listen Along
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky Translucent Glass Mini-Player */}
      <StickyMusicPlayer
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        onTogglePlay={handleTogglePlay}
        onNextTrack={handleNextTrack}
        onPrevTrack={handlePrevTrack}
        userHeartRate={userHeartRate}
      />

      {/* AI Generator Modal */}
      <AiGeneratorModal
        isOpen={isGeneratorModalOpen}
        onClose={() => setIsGeneratorModalOpen(false)}
        onPlaylistGenerated={handlePlaylistGenerated}
      />
    </div>
  );
};

export default Music;