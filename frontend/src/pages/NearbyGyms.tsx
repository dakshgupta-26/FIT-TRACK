import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sampleGyms, GymData } from '@/data/gymsData';
import { AiSearchHeader, MapStyleType } from '@/components/gyms/AiSearchHeader';
import { GymCard } from '@/components/gyms/GymCard';
import { GymMap } from '@/components/gyms/GymMap';
import { GymDetailModal } from '@/components/gyms/GymDetailModal';
import {
  Sparkles,
  Flame,
  Dumbbell,
  Heart,
  Coffee,
  Check,
  X,
  SlidersHorizontal,
  Compass,
} from 'lucide-react';

const NearbyGyms: React.FC = () => {
  const [gyms, setGyms] = useState<GymData[]>(sampleGyms);
  const [selectedGym, setSelectedGym] = useState<GymData | null>(null);
  const [modalGym, setModalGym] = useState<GymData | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [userLocation, setUserLocation] = useState<[number, number]>([37.7749, -122.4194]); // SF Default
  const [userLocationName, setUserLocationName] = useState('San Francisco, CA');
  const [mapStyle, setMapStyle] = useState<MapStyleType>('apple-dark');

  // Filter Chips State
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const filterOptions = [
    'Open Now',
    '24/7 Access',
    'Free Trial',
    'Infrared Sauna',
    'Ice Plunge',
    'CrossFit',
    'Yoga',
    'Swimming Pool',
    'Women Friendly',
    'Personal Trainers',
  ];

  // Category Tabs
  const categories = [
    { id: 'All', label: 'All Places', icon: Compass },
    { id: 'AiPicks', label: '⭐ AI Picks', icon: Sparkles },
    { id: 'Trending', label: '🔥 Trending', icon: Flame },
    { id: 'Gym', label: '🏋️ Goal Match', icon: Dumbbell },
    { id: 'Recovery', label: '🧘 Recovery', icon: Heart },
    { id: 'Cafe', label: '🥗 Fitness Cafes', icon: Coffee },
  ];

  // Geolocation Setup
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          setUserLocation([lat, lon]);
          setUserLocationName('Current Location');
        },
        () => {
          // Keep default SF
        }
      );
    }
  }, []);

  const toggleFilter = (filter: string) => {
    if (selectedFilters.includes(filter)) {
      setSelectedFilters(selectedFilters.filter((f) => f !== filter));
    } else {
      setSelectedFilters([...selectedFilters, filter]);
    }
  };

  // Filter Logic
  const filteredGyms = gyms.filter((gym) => {
    // Search Term Filter
    const matchesSearch =
      gym.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gym.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gym.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gym.amenities.some((a) => a.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;

    // Category Filter
    if (activeCategory === 'AiPicks' && !gym.isAiPick) return false;
    if (activeCategory === 'Trending' && !gym.isTrending) return false;
    if (activeCategory === 'Gym' && gym.category !== 'Gym') return false;
    if (activeCategory === 'Recovery' && !gym.isRecovery) return false;
    if (activeCategory === 'Cafe' && !gym.isCafe) return false;

    // Specific Feature Filters
    if (selectedFilters.includes('Open Now') && !gym.isOpen) return false;
    if (selectedFilters.includes('24/7 Access') && !gym.hoursText.includes('24/7')) return false;
    if (selectedFilters.includes('Free Trial') && !gym.hasFreeTrial) return false;
    if (selectedFilters.includes('Infrared Sauna') && !gym.amenities.some((a) => a.toLowerCase().includes('sauna'))) return false;
    if (selectedFilters.includes('Ice Plunge') && !gym.amenities.some((a) => a.toLowerCase().includes('plunge') || a.toLowerCase().includes('ice'))) return false;

    return true;
  });

  const handleNavigate = (gym: GymData) => {
    setSelectedGym(gym);
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${gym.latitude},${gym.longitude}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#04060a] text-slate-100 p-4 sm:p-6 lg:p-8 font-sans">
      {/* Top AI Search Header */}
      <AiSearchHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        activeFilterCount={selectedFilters.length}
        onToggleFilters={() => setShowFilterDrawer(!showFilterDrawer)}
        mapStyle={mapStyle}
        setMapStyle={setMapStyle}
        userLocationName={userLocationName}
        onRecenterLocation={() => setSelectedGym(null)}
      />

      {/* Expandable Filter Chips Drawer */}
      <AnimatePresence>
        {showFilterDrawer && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 p-4 rounded-2xl bg-slate-950/90 border border-teal-500/30 backdrop-blur-2xl space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="text-xs font-mono font-bold text-teal-300 uppercase tracking-wider flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Filter By Facility & Amenities</span>
              </div>
              {selectedFilters.length > 0 && (
                <button
                  onClick={() => setSelectedFilters([])}
                  className="text-xs text-rose-400 hover:underline font-semibold"
                >
                  Clear All Filters
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {filterOptions.map((filter) => {
                const isActive = selectedFilters.includes(filter);
                return (
                  <button
                    key={filter}
                    onClick={() => toggleFilter(filter)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-teal-500/20 border-teal-400 text-teal-300 shadow-[0_0_15px_rgba(45,212,191,0.3)]'
                        : 'bg-slate-900 border-white/10 text-slate-300 hover:border-white/20'
                    }`}
                  >
                    {isActive && <Check className="w-3.5 h-3.5 text-teal-400" />}
                    <span>{filter}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Split-Screen Main Discovery Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT: Hero Interactive Map (70% width on Desktop = 8 columns) */}
        <div className="lg:col-span-8 h-[550px] sm:h-[650px] lg:h-[760px] sticky top-6">
          <GymMap
            gyms={filteredGyms}
            selectedGym={selectedGym}
            onSelectGym={(gym) => setSelectedGym(gym)}
            userLocation={userLocation}
            mapStyle={mapStyle}
            onNavigate={handleNavigate}
            onExploreDetails={(gym) => setModalGym(gym)}
          />
        </div>

        {/* RIGHT: Floating Discovery Panel (30% width on Desktop = 4 columns) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Category Pill Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 py-2 rounded-2xl text-xs font-bold shrink-0 border transition flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-teal-500/20 border-teal-400 text-teal-300 shadow-[0_0_20px_rgba(45,212,191,0.25)]'
                      : 'bg-slate-950/80 border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 text-teal-400" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Results Counter Header */}
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              {filteredGyms.length} Fitness Centers Found
            </span>
            <span className="text-xs text-teal-400 font-bold">Real-time Telemetry</span>
          </div>

          {/* Gym Cards Scrollable Container */}
          <div className="space-y-4 max-h-[680px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-teal-500/20">
            {filteredGyms.length === 0 ? (
              <div className="p-8 rounded-3xl bg-slate-950/80 border border-white/10 text-center space-y-3">
                <Sparkles className="w-8 h-8 text-teal-400 mx-auto animate-pulse" />
                <h4 className="text-base font-bold text-white">No Gyms Match Your Search</h4>
                <p className="text-xs text-slate-400">
                  Try clearing your filters or searching for "CrossFit", "Sauna", or "Gym".
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedFilters([]);
                    setActiveCategory('All');
                  }}
                  className="px-4 py-2 rounded-xl bg-teal-400 text-slate-950 font-bold text-xs"
                >
                  Reset All Searches
                </button>
              </div>
            ) : (
              filteredGyms.map((gym) => (
                <GymCard
                  key={gym.id}
                  gym={gym}
                  isSelected={selectedGym?.id === gym.id}
                  onSelect={(g) => setSelectedGym(g)}
                  onNavigate={handleNavigate}
                  onBookTrial={(g) => setModalGym(g)}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Full-Screen Luxury Details Modal */}
      <GymDetailModal
        gym={modalGym}
        onClose={() => setModalGym(null)}
        onNavigate={handleNavigate}
      />
    </div>
  );
};

export default NearbyGyms;