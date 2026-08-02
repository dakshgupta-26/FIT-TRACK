import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigation, Star, Sparkles, X, MapPin, Zap, Activity } from 'lucide-react';
import { GymData } from '@/data/gymsData';
import { MapStyleType } from './AiSearchHeader';

// Custom Marker Generator
const createCustomMarkerIcon = (gym: GymData, isSelected: boolean) => {
  const color = gym.occupancyPercent < 35 ? '#2dd4bf' : gym.occupancyPercent < 70 ? '#fbbf24' : '#f43f5e';
  const scale = isSelected ? 'scale-125 z-50' : 'scale-100';

  const html = `
    <div class="relative group cursor-pointer ${scale} transition-transform duration-300">
      <!-- Pulsing Glow Ring -->
      <div class="absolute -inset-2 rounded-full blur-md opacity-75 animate-pulse" style="background: ${color};"></div>
      
      <!-- Marker Badge Pill -->
      <div class="relative flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/20 backdrop-blur-xl shadow-2xl text-white font-sans text-[11px] font-extrabold" style="background: #04060a;">
        <span class="w-2 h-2 rounded-full animate-ping" style="background: ${color};"></span>
        <span class="text-white">${gym.name.split(' ')[0]}</span>
        <span class="text-[10px] font-mono text-teal-300 px-1 py-0.2 rounded bg-teal-500/20">${gym.occupancyPercent}%</span>
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-leaflet-marker',
    iconSize: [120, 36],
    iconAnchor: [60, 18],
  });
};

const createUserLocationMarkerIcon = () => {
  const html = `
    <div class="relative flex items-center justify-center">
      <div class="absolute w-8 h-8 rounded-full bg-teal-400/40 animate-ping"></div>
      <div class="relative w-4 h-4 rounded-full bg-teal-300 border-2 border-slate-950 shadow-[0_0_15px_#2dd4bf]"></div>
    </div>
  `;
  return L.divIcon({
    html,
    className: 'user-location-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

// Map Recenter Helper Component
const MapRecenter: React.FC<{ center: [number, number]; zoom?: number }> = ({ center, zoom = 14 }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.2 });
  }, [center, zoom, map]);
  return null;
};

interface GymMapProps {
  gyms: GymData[];
  selectedGym: GymData | null;
  onSelectGym: (gym: GymData | null) => void;
  userLocation: [number, number];
  mapStyle: MapStyleType;
  onNavigate: (gym: GymData) => void;
  onExploreDetails: (gym: GymData) => void;
}

export const GymMap: React.FC<GymMapProps> = ({
  gyms,
  selectedGym,
  onSelectGym,
  userLocation,
  mapStyle,
  onNavigate,
  onExploreDetails,
}) => {
  const mapCenter: [number, number] = selectedGym
    ? [selectedGym.latitude, selectedGym.longitude]
    : userLocation;

  // Select Tile URL based on style
  const getTileUrl = (style: MapStyleType) => {
    switch (style) {
      case 'satellite':
        return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      case 'midnight-oled':
      case 'cyber-teal':
      case 'apple-dark':
      default:
        return 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
    }
  };

  // Route Polyline Points
  const routePositions: [number, number][] = selectedGym
    ? [userLocation, [selectedGym.latitude, selectedGym.longitude]]
    : [];

  return (
    <div className="relative w-full h-full min-h-[500px] lg:min-h-[680px] rounded-[32px] overflow-hidden border border-teal-500/30 shadow-[0_20px_80px_rgba(20,184,166,0.15)] bg-slate-950">
      {/* Animated Glowing Neon Border Tracer */}
      <div className="absolute inset-0 rounded-[32px] pointer-events-none border border-teal-400/20 shadow-[inset_0_0_30px_rgba(45,212,191,0.1)] z-20" />

      <MapContainer
        center={mapCenter}
        zoom={14}
        scrollWheelZoom={true}
        className="w-full h-full z-10 font-sans"
        zoomControl={false}
      >
        <MapRecenter center={mapCenter} />

        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url={getTileUrl(mapStyle)}
        />

        {/* User Location Pulse Beacon */}
        <Marker position={userLocation} icon={createUserLocationMarkerIcon()} />

        {/* Interactive Gym Markers */}
        {gyms.map((gym) => (
          <Marker
            key={gym.id}
            position={[gym.latitude, gym.longitude]}
            icon={createCustomMarkerIcon(gym, selectedGym?.id === gym.id)}
            eventHandlers={{
              click: () => onSelectGym(gym),
            }}
          />
        ))}

        {/* Animated Polyline Route Drawer */}
        {selectedGym && routePositions.length === 2 && (
          <Polyline
            positions={routePositions}
            pathOptions={{
              color: '#2dd4bf',
              weight: 4,
              dashArray: '8, 12',
              opacity: 0.9,
            }}
          />
        )}
      </MapContainer>

      {/* Route Telemetry Floating Banner */}
      <AnimatePresence>
        {selectedGym && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-4 left-4 right-4 z-30 flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/90 border border-teal-500/40 backdrop-blur-2xl shadow-2xl text-xs font-sans text-white"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-teal-500/20 border border-teal-500/40 text-teal-300">
                <Navigation className="w-4 h-4 animate-pulse" />
              </div>
              <div>
                <div className="font-bold text-teal-300">Route to {selectedGym.name}</div>
                <div className="text-[11px] text-slate-300 font-mono">
                  ETA ~{Math.round(selectedGym.distanceMiles * 6)} mins ({selectedGym.distanceMiles} mi) • 🔥 {Math.round(selectedGym.distanceMiles * 35)} kcal walk
                </div>
              </div>
            </div>

            <button
              onClick={() => onSelectGym(null)}
              className="p-1.5 rounded-full bg-slate-900 border border-white/20 text-slate-300 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selected Gym Quick Map Popup Card */}
      <AnimatePresence>
        {selectedGym && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            className="absolute bottom-6 left-4 right-4 sm:left-6 sm:right-auto sm:w-96 z-30 p-4 rounded-3xl bg-slate-950/95 border border-teal-400/50 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.9)] text-white font-sans space-y-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-[10px] font-bold uppercase font-mono">
                  {selectedGym.category}
                </span>
                <h4 className="text-base font-black text-white mt-1 line-clamp-1">
                  {selectedGym.name}
                </h4>
              </div>
              <button
                onClick={() => onSelectGym(null)}
                className="p-1.5 rounded-full bg-slate-900 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-300 pt-1">
              <div className="flex items-center gap-1 font-bold text-amber-400">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>{selectedGym.rating}</span>
              </div>
              <div className="text-teal-400 font-mono font-bold">{selectedGym.priceDetails.split('•')[0]}</div>
              <div className="text-slate-300">{selectedGym.distanceMiles} mi away</div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => onNavigate(selectedGym)}
                className="flex-1 py-2 rounded-xl bg-slate-900 border border-teal-500/40 text-teal-300 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-slate-800 transition"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Directions</span>
              </button>
              <button
                onClick={() => onExploreDetails(selectedGym)}
                className="flex-1 py-2 rounded-xl bg-gradient-to-r from-teal-400 to-cyan-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(45,212,191,0.4)] transition"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Explore Full</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
