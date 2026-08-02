import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, Lock, EyeOff, Check, Sparkles } from 'lucide-react';

interface PrivacySettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacySettingsModal: React.FC<PrivacySettingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [profileVisibility, setProfileVisibility] = useState('public');
  const [privacyToggles, setPrivacyToggles] = useState({
    hideCalories: false,
    hideSteps: false,
    hideWeight: true,
    hideWorkouts: false,
    hideSleep: true,
    hideHeartRate: false,
    hideActiveStatus: false,
    hideLocation: true,
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const toggleField = (key: keyof typeof privacyToggles) => {
    setPrivacyToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const togglesList: { id: keyof typeof privacyToggles; label: string; desc: string }[] = [
    { id: 'hideCalories', label: 'Hide Calories Burned', desc: 'Prevent followers from viewing active calorie counts' },
    { id: 'hideSteps', label: 'Hide Daily Step Count', desc: 'Conceal pedometer metrics on global leaderboards' },
    { id: 'hideWeight', label: 'Hide Weight & Body Fat', desc: 'Keep weight metrics strictly private to your AI profile' },
    { id: 'hideWorkouts', label: 'Hide Workout Details', desc: 'Only share summary achievements' },
    { id: 'hideSleep', label: 'Hide Sleep Recovery Score', desc: 'Do not publish sleep telemetry' },
    { id: 'hideHeartRate', label: 'Hide Heart Rate Telemetry', desc: 'Hide peak & average BPM metrics' },
    { id: 'hideActiveStatus', label: 'Hide Online Active Status', desc: 'Do not show active online indicator' },
    { id: 'hideLocation', label: 'Hide GPS & Route Maps', desc: 'Fuzz start and end locations of runs' },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-2xl font-sans">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-slate-950/95 border border-teal-500/40 backdrop-blur-2xl shadow-[0_25px_80px_rgba(0,0,0,0.9)] text-white space-y-5 max-h-[85vh] overflow-y-auto"
        >
          <div className="flex justify-between items-start border-b border-white/10 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-mono font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                <span>Granular Security & Privacy</span>
              </div>
              <h3 className="text-2xl font-black text-white mt-2">Community Privacy Controls</h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-slate-900 border border-white/10 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Profile Visibility Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-2">Profile Visibility</label>
            <div className="grid grid-cols-3 gap-2">
              {['public', 'followers', 'private'].map((vis) => (
                <button
                  key={vis}
                  onClick={() => setProfileVisibility(vis)}
                  className={`py-2 rounded-xl text-xs font-bold uppercase border transition ${
                    profileVisibility === vis
                      ? 'bg-teal-500/20 border-teal-400 text-teal-300'
                      : 'bg-slate-900 border-white/10 text-slate-400'
                  }`}
                >
                  {vis}
                </button>
              ))}
            </div>
          </div>

          {/* Individual Field Privacy Toggles */}
          <div className="space-y-2 pt-2 border-t border-white/10">
            <label className="block text-xs font-bold text-slate-300 mb-2">
              Individual Metric Visibility Toggles
            </label>
            {togglesList.map((item) => {
              const isHidden = privacyToggles[item.id];
              return (
                <div
                  key={item.id}
                  onClick={() => toggleField(item.id)}
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/60 border border-white/5 hover:border-white/20 cursor-pointer transition"
                >
                  <div>
                    <div className="text-xs font-bold text-white">{item.label}</div>
                    <div className="text-[10px] text-slate-400">{item.desc}</div>
                  </div>

                  <div
                    className={`w-10 h-6 rounded-full p-1 transition-colors ${
                      isHidden ? 'bg-teal-400' : 'bg-slate-800'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-slate-950 transition-transform ${
                        isHidden ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {savedSuccess ? (
            <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold text-center">
              ✓ Privacy Configuration Saved!
            </div>
          ) : (
            <button
              onClick={handleSave}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-teal-400 to-cyan-400 text-slate-950 font-black text-xs shadow-[0_0_20px_rgba(45,212,191,0.5)]"
            >
              Save Privacy Settings
            </button>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
