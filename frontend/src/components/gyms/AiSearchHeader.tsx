import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Mic,
  MicOff,
  Sparkles,
  MapPin,
  SlidersHorizontal,
  Layers,
  Check,
  Flame,
  Zap,
} from 'lucide-react';

export type MapStyleType = 'apple-dark' | 'cyber-teal' | 'midnight-oled' | 'satellite';

interface AiSearchHeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  activeFilterCount: number;
  onToggleFilters: () => void;
  mapStyle: MapStyleType;
  setMapStyle: (style: MapStyleType) => void;
  userLocationName: string;
  onRecenterLocation: () => void;
}

export const AiSearchHeader: React.FC<AiSearchHeaderProps> = ({
  searchTerm,
  setSearchTerm,
  activeCategory,
  setActiveCategory,
  activeFilterCount,
  onToggleFilters,
  mapStyle,
  setMapStyle,
  userLocationName,
  onRecenterLocation,
}) => {
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [showMapStyleMenu, setShowMapStyleMenu] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);

  const quickPrompts = [
    'Best gym for muscle gain',
    'Crossfit with lifting platform',
    'Open 24x7',
    'Infrared Sauna & Plunge',
    'Women friendly',
    'High Protein Cafe Nearby',
  ];

  const mapStyleOptions: { id: MapStyleType; label: string; desc: string }[] = [
    { id: 'apple-dark', label: 'Apple Maps Dark', desc: 'Sleek obsidian with soft cyan routes' },
    { id: 'cyber-teal', label: 'Cyber Teal Neon', desc: 'Vibrant neon grid for high contrast' },
    { id: 'midnight-oled', label: 'Midnight OLED', desc: 'Pure black for OLED displays' },
    { id: 'satellite', label: 'Hybrid Dark Satellite', desc: 'Real aerial imagery with dark glow' },
  ];

  const handleVoiceClick = () => {
    if (!isVoiceActive) {
      setIsVoiceActive(true);
      setSearchTerm('Listening for prompt...');
      setTimeout(() => {
        setSearchTerm('Best gym for muscle gain with sauna');
        setIsVoiceActive(false);
      }, 2500);
    } else {
      setIsVoiceActive(false);
    }
  };

  return (
    <div className="w-full space-y-4 mb-6 select-none font-sans">
      {/* Top Title & Location Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-mono mb-2 shadow-[0_0_15px_rgba(45,212,191,0.2)]">
            <Sparkles className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
            <span>AI Health & Fitness Telemetry OS</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            Nearby <span className="bg-gradient-to-r from-teal-300 via-emerald-400 to-cyan-300 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(45,212,191,0.3)]">Fitness</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Discover premium gyms, fitness studios, recovery centers and AI-compatible health clubs around you.
          </p>
        </div>

        {/* Action Pills Bar */}
        <div className="flex items-center gap-2.5 flex-wrap shrink-0">
          {/* Current Location Pill */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onRecenterLocation}
            className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-slate-900/90 border border-white/10 hover:border-teal-500/40 text-xs font-semibold text-slate-200 transition backdrop-blur-xl shadow-lg"
          >
            <div className="relative flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping absolute" />
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            </div>
            <MapPin className="w-3.5 h-3.5 text-teal-400" />
            <span>{userLocationName}</span>
          </motion.button>

          {/* Filter Toggle Pill */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onToggleFilters}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl border text-xs font-semibold transition backdrop-blur-xl shadow-lg ${
              activeFilterCount > 0
                ? 'bg-teal-500/20 border-teal-400 text-teal-300 shadow-[0_0_20px_rgba(45,212,191,0.3)]'
                : 'bg-slate-900/90 border-white/10 hover:border-white/20 text-slate-200'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-teal-400" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-teal-400 text-slate-950 font-extrabold text-[10px] flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </motion.button>

          {/* Map Style Selector Dropdown */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowMapStyleMenu(!showMapStyleMenu)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-slate-900/90 border border-white/10 hover:border-white/20 text-xs font-semibold text-slate-200 transition backdrop-blur-xl shadow-lg"
            >
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>Map Style</span>
            </motion.button>

            <AnimatePresence>
              {showMapStyleMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-64 p-2 rounded-2xl bg-slate-950/95 border border-white/15 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.9)] z-50 space-y-1"
                >
                  <div className="px-3 py-1.5 text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                    Map Aesthetic Skin
                  </div>
                  {mapStyleOptions.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => {
                        setMapStyle(opt.id);
                        setShowMapStyleMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition ${
                        mapStyle === opt.id
                          ? 'bg-teal-500/20 text-teal-300 font-bold border border-teal-500/30'
                          : 'text-slate-300 hover:bg-white/5'
                      }`}
                    >
                      <div>
                        <div>{opt.label}</div>
                        <div className="text-[10px] text-slate-400 font-normal">{opt.desc}</div>
                      </div>
                      {mapStyle === opt.id && <Check className="w-4 h-4 text-teal-400" />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* AI Search Bar Container */}
      <div className="relative w-full">
        <div
          className={`relative w-full rounded-2xl bg-slate-950/80 border transition-all duration-300 backdrop-blur-2xl flex items-center px-4 py-3 shadow-[0_10px_40px_rgba(0,0,0,0.6)] ${
            isInputFocused
              ? 'border-teal-400 ring-2 ring-teal-500/30 shadow-[0_0_30px_rgba(45,212,191,0.25)]'
              : 'border-white/10 hover:border-white/20'
          }`}
        >
          <Search className="w-5 h-5 text-teal-400 shrink-0 mr-3" />

          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setTimeout(() => setIsInputFocused(false), 200)}
            placeholder='Ask AI: "Best gym for muscle gain", "24x7 with sauna", "Powerlifting club"...'
            className="w-full bg-transparent text-white text-sm placeholder-slate-400 focus:outline-none font-sans"
          />

          {/* Voice Search Button */}
          <button
            type="button"
            onClick={handleVoiceClick}
            className={`p-2 rounded-xl border transition-all duration-200 shrink-0 ml-2 ${
              isVoiceActive
                ? 'bg-rose-500/20 border-rose-500 text-rose-400 animate-pulse'
                : 'bg-slate-900/80 border-white/10 text-slate-300 hover:text-white hover:border-white/20'
            }`}
            title="Voice Search AI"
          >
            {isVoiceActive ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>
        </div>

        {/* Quick Prompts Floating Suggestions */}
        <AnimatePresence>
          {isInputFocused && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              className="absolute left-0 right-0 top-full mt-2 p-3 rounded-2xl bg-slate-950/95 border border-white/15 backdrop-blur-2xl shadow-[0_25px_60px_rgba(0,0,0,0.9)] z-40"
            >
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-teal-400 font-bold uppercase tracking-wider mb-2">
                <Zap className="w-3.5 h-3.5" />
                <span>Popular AI Searches</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {quickPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onMouseDown={() => setSearchTerm(prompt)}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 hover:border-teal-400/50 hover:bg-teal-950/30 text-xs text-slate-200 hover:text-teal-300 transition flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3 h-3 text-teal-400" />
                    <span>{prompt}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
