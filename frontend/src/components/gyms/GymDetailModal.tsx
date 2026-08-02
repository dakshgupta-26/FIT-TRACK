import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Star,
  MapPin,
  Clock,
  Phone,
  Globe,
  Sparkles,
  Navigation,
  CheckCircle2,
  Users,
  Dumbbell,
  ShieldCheck,
  Zap,
  Activity,
  Award,
  Calendar,
} from 'lucide-react';
import { GymData } from '@/data/gymsData';

interface GymDetailModalProps {
  gym: GymData | null;
  onClose: () => void;
  onNavigate: (gym: GymData) => void;
}

export const GymDetailModal: React.FC<GymDetailModalProps> = ({
  gym,
  onClose,
  onNavigate,
}) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isBookedSuccess, setIsBookedSuccess] = useState(false);
  const [selectedPlanIndex, setSelectedPlanIndex] = useState(0);

  if (!gym) return null;

  const images = gym.galleryImages.length > 0 ? gym.galleryImages : [gym.heroImage];

  const handleBookTrial = (e: React.FormEvent) => {
    e.preventDefault();
    setIsBookedSuccess(true);
    setTimeout(() => {
      setIsBookedSuccess(false);
    }, 4000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-2xl overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-4xl bg-slate-950/95 border border-white/15 rounded-3xl overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,0.9)] max-h-[90vh] flex flex-col font-sans"
        >
          {/* Top Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-slate-900/80 border border-white/20 text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Scrollable Content */}
          <div className="overflow-y-auto p-4 sm:p-8 space-y-6">
            {/* Header Hero Section */}
            <div className="relative rounded-2xl overflow-hidden border border-white/10 h-64 sm:h-80">
              <img
                src={images[selectedImage]}
                alt={gym.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

              {/* AI Match Badge */}
              <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-950/90 border border-teal-400/50 backdrop-blur-md text-teal-300 font-bold text-xs">
                <Sparkles className="w-4 h-4 text-teal-400 animate-pulse" />
                <span>{gym.aiMatchScore}% AI Match</span>
              </div>

              {/* Title & Category Bottom */}
              <div className="absolute bottom-4 left-4 right-4">
                <div className="inline-block px-2.5 py-1 rounded-full bg-teal-500/20 border border-teal-500/30 text-teal-300 text-[11px] font-mono font-bold uppercase mb-1.5">
                  {gym.category} • Verified Health Club
                </div>
                <h2 className="text-2xl sm:text-4xl font-black text-white">{gym.name}</h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">{gym.tagline}</p>
              </div>
            </div>

            {/* Thumbnail Carousel */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative w-20 h-14 rounded-xl overflow-hidden border shrink-0 transition ${
                      selectedImage === idx ? 'border-teal-400 ring-2 ring-teal-500/40' : 'border-white/10 opacity-60'
                    }`}
                  >
                    <img src={img} alt="gallery" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Live Telemetry Dashboard Widgets */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/10">
                <div className="text-[11px] font-mono text-slate-400">Live Crowd</div>
                <div className="text-lg font-black text-emerald-400 mt-0.5">{gym.occupancyPercent}% Full</div>
                <div className="text-[10px] text-slate-400">{gym.occupancyStatus}</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/10">
                <div className="text-[11px] font-mono text-slate-400">Distance</div>
                <div className="text-lg font-black text-teal-300 mt-0.5">{gym.distanceMiles} Miles</div>
                <div className="text-[10px] text-slate-400">~6 mins walk</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/10">
                <div className="text-[11px] font-mono text-slate-400">Environment</div>
                <div className="text-lg font-black text-cyan-300 mt-0.5">{gym.temperature}</div>
                <div className="text-[10px] text-slate-400">AQI {gym.aqi} (Optimal)</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/10">
                <div className="text-[11px] font-mono text-slate-400">Rating</div>
                <div className="text-lg font-black text-amber-400 mt-0.5 flex items-center gap-1">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>{gym.rating}</span>
                </div>
                <div className="text-[10px] text-slate-400">{gym.reviewCount} Reviews</div>
              </div>
            </div>

            {/* FitTracker AI Recommendation Reason */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-teal-950/40 to-slate-900 border border-teal-500/30">
              <div className="flex items-center gap-2 text-teal-300 font-bold text-xs uppercase tracking-wider mb-1.5">
                <Sparkles className="w-4 h-4 text-teal-400 animate-pulse" />
                <span>FitTracker AI Intelligence Analysis</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">{gym.aiReason}</p>
            </div>

            {/* Peak Hours Forecast Bar Chart */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10">
              <div className="flex items-center justify-between text-xs font-bold text-white mb-3">
                <span>Today's Live Crowd Forecast</span>
                <span className="text-teal-400 font-mono text-[11px]">Lowest at 2:00 PM & 8:00 PM</span>
              </div>
              <div className="flex items-end justify-between h-20 gap-1 pt-2">
                {gym.peakHours.map((val, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1 group">
                    <div
                      style={{ height: `${val}%` }}
                      className={`w-full rounded-t-md transition-all ${
                        val > 75 ? 'bg-rose-500' : val > 45 ? 'bg-amber-400' : 'bg-teal-400'
                      }`}
                    />
                    <span className="text-[9px] text-slate-400 font-mono">{idx + 6}h</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Equipment Inventory */}
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2.5 flex items-center gap-2">
                <Dumbbell className="w-4 h-4 text-teal-400" />
                <span>Pro Fitness Equipment Inventory</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {gym.equipment.map((item, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-slate-200 font-medium"
                  >
                    ⚡ {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Amenities Grid */}
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2.5 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-teal-400" />
                <span>Amenities & Facilities</span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {gym.amenities.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/60 border border-white/5 text-xs text-slate-300"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Membership Pass Plans Selector */}
            {gym.plans.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
                  Select Membership Pass
                </h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {gym.plans.map((plan, idx) => (
                    <div
                      key={idx}
                      onClick={() => setSelectedPlanIndex(idx)}
                      className={`p-4 rounded-2xl border cursor-pointer transition ${
                        selectedPlanIndex === idx
                          ? 'bg-teal-950/30 border-teal-400 ring-1 ring-teal-500/40'
                          : 'bg-slate-900/60 border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-bold text-white text-sm">{plan.name}</div>
                          <div className="text-xs text-teal-300 font-extrabold font-mono mt-0.5">
                            {plan.price} <span className="text-slate-400 font-normal">{plan.period}</span>
                          </div>
                        </div>
                        {plan.recommended && (
                          <span className="px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-[10px] font-bold uppercase">
                            Popular
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Trial Booking Form */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-white/10">
              <h3 className="text-sm font-bold text-white mb-2">Book a 1-Day Free Trial Pass</h3>
              {isBookedSuccess ? (
                <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold text-center">
                  🎉 Pass Confirmed! We sent your digital QR pass to your email.
                </div>
              ) : (
                <form onSubmit={handleBookTrial} className="flex flex-col sm:flex-row gap-2 mt-3">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email for instant QR pass"
                    className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-white/15 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-teal-400"
                  />
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-400 to-cyan-400 text-slate-950 font-black text-xs hover:shadow-[0_0_20px_rgba(45,212,191,0.5)] transition"
                  >
                    Get Free Pass
                  </button>
                </form>
              )}
            </div>

            {/* Bottom Action Footer */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => onNavigate(gym)}
                className="flex-1 py-3 rounded-2xl bg-teal-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(45,212,191,0.4)] hover:scale-[1.02] transition"
              >
                <Navigation className="w-4 h-4" />
                <span>Start Navigation Now</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
