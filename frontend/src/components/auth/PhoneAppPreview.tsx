import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  Camera,
  Dumbbell,
  Utensils,
  TrendingUp,
  Bot,
  Watch,
  Users,
  FileText,
  Award,
  Sparkles,
  Heart,
  CheckCircle2,
  Zap,
  Flame,
  ChevronRight,
  ShieldCheck,
  Volume2
} from 'lucide-react';

export const FEATURES = [
  { id: 'dashboard', label: 'AI Dashboard', icon: Activity, badge: 'Live 94/100' },
  { id: 'camera', label: 'Food Camera AI', icon: Camera, badge: '99.4% Scan' },
  { id: 'workouts', label: 'Workout Planner', icon: Dumbbell, badge: 'Hypertrophy' },
  { id: 'nutrition', label: 'Nutrition Planner', icon: Utensils, badge: '1,840 Kcal' },
  { id: 'analytics', label: 'Progress Analytics', icon: TrendingUp, badge: '+2.8kg Muscle' },
  { id: 'coach', label: 'AI Coach', icon: Bot, badge: 'HRV 68ms' },
  { id: 'smartwatch', label: 'Smartwatch Sync', icon: Watch, badge: '128 BPM' },
  { id: 'community', label: 'Community', icon: Users, badge: '#3 Rank' },
  { id: 'reports', label: 'Health Reports', icon: FileText, badge: 'Grade A+' },
  { id: 'achievements', label: 'Achievements', icon: Award, badge: 'Unlocked!' }
];

export const PhoneAppPreview: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % FEATURES.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const feature = FEATURES[activeIdx];

  return (
    <div className="w-full h-full flex flex-col justify-between bg-[#0b0f19] text-white select-none overflow-hidden font-sans">
      {/* Dynamic Feature Header Tag */}
      <div className="px-4 pt-2 pb-1 bg-black/40 border-b border-white/10 flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-1.5 text-teal-400 font-medium">
          <feature.icon className="w-3.5 h-3.5 animate-pulse" />
          <span>{feature.label}</span>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-[10px] border border-teal-500/30 font-mono">
          {feature.badge}
        </span>
      </div>

      {/* Screen Content Container with App Navigation Slide Animation */}
      <div className="relative flex-1 p-3 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={feature.id}
            initial={{ opacity: 0, x: 20, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
            className="w-full h-full flex flex-col"
          >
            {/* 1. AI DASHBOARD */}
            {feature.id === 'dashboard' && (
              <div className="space-y-2.5">
                <div className="p-3 rounded-xl bg-gradient-to-br from-teal-900/40 to-slate-900/60 border border-teal-500/20 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-teal-300/80 uppercase tracking-wider">Health Score</p>
                      <h4 className="text-2xl font-bold text-white flex items-baseline gap-1">
                        94 <span className="text-xs font-normal text-teal-400">/ 100</span>
                      </h4>
                    </div>
                    <div className="w-10 h-10 rounded-full border-2 border-teal-400 flex items-center justify-center bg-teal-500/10 shadow-[0_0_12px_rgba(45,212,191,0.4)]">
                      <Sparkles className="w-5 h-5 text-teal-300" />
                    </div>
                  </div>
                  <div className="mt-2 text-[10px] text-slate-300 bg-black/30 p-1.5 rounded-lg border border-white/5 flex items-center gap-1.5">
                    <Zap className="w-3 h-3 text-amber-400 shrink-0" />
                    <span>AI Insight: Optimal recovery state. Ready for leg day!</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/10">
                    <div className="flex items-center gap-1 text-[10px] text-slate-400">
                      <Flame className="w-3 h-3 text-orange-400" /> Calories
                    </div>
                    <p className="text-base font-bold mt-1 text-white">680 / 850</p>
                    <div className="w-full bg-slate-800 rounded-full h-1 mt-1 overflow-hidden">
                      <div className="bg-orange-500 h-full w-[80%]" />
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/10">
                    <div className="flex items-center gap-1 text-[10px] text-slate-400">
                      <Heart className="w-3 h-3 text-rose-400 animate-ping" /> BPM
                    </div>
                    <p className="text-base font-bold mt-1 text-white">128 <span className="text-[10px] text-slate-400 font-normal">avg</span></p>
                    <div className="w-full bg-slate-800 rounded-full h-1 mt-1 overflow-hidden">
                      <div className="bg-rose-500 h-full w-[65%]" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. FOOD CAMERA AI SCANNER */}
            {feature.id === 'camera' && (
              <div className="relative w-full h-full rounded-xl bg-slate-950 border border-teal-500/30 overflow-hidden flex flex-col justify-between p-2.5">
                {/* Camera Viewfinder & Bounding Box */}
                <div className="absolute inset-0 bg-cover bg-center opacity-40" style={{ backgroundImage: 'radial-gradient(#14b8a6 1px, transparent 1px)', backgroundSize: '12px 12px' }} />
                
                {/* Laser Scanning Line */}
                <motion.div
                  animate={{ y: [0, 140, 0] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-teal-400 to-transparent shadow-[0_0_15px_#2dd4bf]"
                />

                <div className="relative z-10 flex justify-between items-center text-[10px] text-teal-300 bg-black/60 px-2 py-1 rounded-md">
                  <span className="flex items-center gap-1"><Camera className="w-3 h-3 text-teal-400" /> AI Vision v4.2</span>
                  <span className="text-emerald-400">● 99.4% Match</span>
                </div>

                <div className="relative z-10 my-auto border-2 border-dashed border-teal-400/80 rounded-xl p-3 bg-teal-500/10 text-center">
                  <p className="text-xs font-semibold text-white">Salmon & Quinoa Bowl</p>
                  <p className="text-[10px] text-teal-300">540 Kcal • 42g Protein</p>
                </div>

                <div className="relative z-10 grid grid-cols-3 gap-1 text-[9px] text-center bg-black/70 p-1.5 rounded-lg border border-white/10">
                  <div className="text-emerald-400">P: 42g</div>
                  <div className="text-amber-400">C: 48g</div>
                  <div className="text-sky-400">F: 18g</div>
                </div>
              </div>
            )}

            {/* 3. WORKOUT PLANNER */}
            {feature.id === 'workouts' && (
              <div className="space-y-2">
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-teal-500/30 flex items-center justify-between">
                  <div>
                    <h5 className="text-xs font-bold text-white">Hypertrophy Chest & Tri</h5>
                    <p className="text-[10px] text-slate-400">Set 3 of 4 • 85 kg</p>
                  </div>
                  <span className="px-2 py-1 rounded bg-teal-500/20 text-teal-300 text-[10px] font-mono">00:45 Rest</span>
                </div>

                <div className="space-y-1.5">
                  {['Barbell Bench Press (4x10)', 'Incline Dumbbell Press (3x12)', 'Cable Chest Flyes (3x15)'].map((item, idx) => (
                    <div key={idx} className={`p-2 rounded-lg text-[10px] flex items-center justify-between ${idx === 0 ? 'bg-teal-950/60 border border-teal-500/40 text-teal-200' : 'bg-slate-900/40 text-slate-400'}`}>
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className={`w-3 h-3 ${idx === 0 ? 'text-teal-400' : 'text-slate-600'}`} />
                        {item}
                      </span>
                      <span className="text-[9px] text-slate-400">Active</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. NUTRITION PLANNER */}
            {feature.id === 'nutrition' && (
              <div className="space-y-2.5">
                <div className="p-3 rounded-xl bg-slate-900/70 border border-white/10 text-center">
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider">Daily Target</p>
                  <p className="text-xl font-bold text-white mt-0.5">1,840 <span className="text-xs text-slate-400 font-normal">/ 2,400 Kcal</span></p>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden flex">
                    <div className="bg-teal-400 h-full w-[45%]" />
                    <div className="bg-amber-400 h-full w-[30%]" />
                    <div className="bg-sky-400 h-full w-[15%]" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-1.5 text-center">
                  <div className="p-2 rounded-lg bg-teal-950/30 border border-teal-500/20">
                    <div className="text-[9px] text-teal-300">Protein</div>
                    <div className="text-xs font-bold text-white">140g</div>
                  </div>
                  <div className="p-2 rounded-lg bg-amber-950/30 border border-amber-500/20">
                    <div className="text-[9px] text-amber-300">Carbs</div>
                    <div className="text-xs font-bold text-white">190g</div>
                  </div>
                  <div className="p-2 rounded-lg bg-sky-950/30 border border-sky-500/20">
                    <div className="text-[9px] text-sky-300">Fats</div>
                    <div className="text-xs font-bold text-white">55g</div>
                  </div>
                </div>
              </div>
            )}

            {/* 5. PROGRESS ANALYTICS */}
            {feature.id === 'analytics' && (
              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-slate-900/70 border border-teal-500/30">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-400">Body Composition Trend</span>
                    <span className="text-emerald-400 font-bold">-3.2kg Fat • +2.8kg Muscle</span>
                  </div>
                  <div className="h-20 mt-2 flex items-end justify-between gap-1 border-b border-white/10 pb-1">
                    {[40, 55, 48, 65, 70, 82, 95].map((val, i) => (
                      <div key={i} className="w-full flex flex-col items-center gap-1">
                        <div
                          className="w-full bg-gradient-to-t from-teal-600 to-teal-400 rounded-t"
                          style={{ height: `${val}%` }}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between text-[8px] text-slate-500 mt-1">
                    <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                  </div>
                </div>
              </div>
            )}

            {/* 6. AI COACH */}
            {feature.id === 'coach' && (
              <div className="space-y-2 flex flex-col justify-between h-full">
                <div className="p-2.5 rounded-xl bg-teal-950/40 border border-teal-500/30 text-xs">
                  <div className="flex items-center gap-1.5 text-teal-300 mb-1 font-semibold text-[10px]">
                    <Bot className="w-3.5 h-3.5" /> AI Coach fit-bot
                  </div>
                  <p className="text-[10px] text-slate-200 leading-relaxed">
                    "Your HRV of 68ms indicates prime neurological recovery. I recommend progressive overload on squats today."
                  </p>
                </div>
                {/* Voice Waveform animation */}
                <div className="p-2 rounded-xl bg-slate-900/60 border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Volume2 className="w-3.5 h-3.5 text-teal-400" />
                    <span className="text-[9px] text-slate-400">Voice Synthesis</span>
                  </div>
                  <div className="flex items-center gap-0.5 h-4">
                    {[40, 90, 60, 100, 70, 30, 80, 50].map((h, i) => (
                      <motion.div
                        key={i}
                        animate={{ height: ['20%', `${h}%`, '20%'] }}
                        transition={{ repeat: Infinity, duration: 0.8 + i * 0.1 }}
                        className="w-0.5 bg-teal-400 rounded-full"
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 7. SMARTWATCH SYNC */}
            {feature.id === 'smartwatch' && (
              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-slate-900/70 border border-teal-500/30 text-center">
                  <div className="flex items-center justify-center gap-2 text-teal-300 text-xs font-semibold">
                    <Watch className="w-4 h-4 text-teal-400" /> Apple Watch Ultra 2
                  </div>
                  <div className="mt-2 text-2xl font-bold text-white flex items-center justify-center gap-1">
                    128 <span className="text-xs text-rose-400 font-normal">BPM Live</span>
                  </div>
                  <div className="h-8 mt-1 flex items-center justify-center">
                    <svg className="w-full h-full text-rose-500 overflow-visible" viewBox="0 0 100 20">
                      <path
                        d="M 0 10 Q 15 10 20 10 L 25 0 L 30 20 L 35 5 L 40 10 Q 60 10 100 10"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-slate-900/40 border border-white/10 text-[10px] flex justify-between">
                  <span className="text-slate-400">SpO2 Oxygen</span>
                  <span className="text-emerald-400 font-bold">99% Normal</span>
                </div>
              </div>
            )}

            {/* 8. COMMUNITY */}
            {feature.id === 'community' && (
              <div className="space-y-2">
                <div className="p-2.5 rounded-xl bg-gradient-to-r from-teal-950 to-slate-900 border border-teal-500/30 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-teal-500/20 text-teal-300 flex items-center justify-center font-bold text-xs">
                      #3
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">Global Leaderboard</p>
                      <p className="text-[9px] text-teal-300">Passed @alex_fit today!</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </div>
                <div className="p-2 rounded-lg bg-slate-900/40 border border-white/10 text-[10px] space-y-1">
                  <p className="text-slate-300 font-medium">Sarah M. completed 10.5 km Run</p>
                  <button className="px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 text-[9px] hover:bg-teal-500/30 transition">
                    🙌 High Five (14)
                  </button>
                </div>
              </div>
            )}

            {/* 9. HEALTH REPORTS */}
            {feature.id === 'reports' && (
              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-slate-900/70 border border-teal-500/30">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider">Weekly Medical Index</span>
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded">Grade A+</span>
                  </div>
                  <div className="mt-2 space-y-1.5 text-[10px]">
                    <div className="flex justify-between text-slate-300">
                      <span>Sleep Quality Score</span>
                      <span className="text-white font-semibold">88%</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Metabolic Rate Index</span>
                      <span className="text-teal-300 font-semibold">High (2,450)</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>VO2 Max Estimation</span>
                      <span className="text-sky-300 font-semibold">48.5 ml/kg</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 10. ACHIEVEMENTS */}
            {feature.id === 'achievements' && (
              <div className="w-full h-full flex flex-col items-center justify-center text-center space-y-2 p-2">
                <motion.div
                  initial={{ scale: 0.5, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.6)]"
                >
                  <Award className="w-7 h-7" />
                </motion.div>
                <h5 className="text-xs font-bold text-white">100k Steps Milestone!</h5>
                <p className="text-[9px] text-slate-400">Unlocked Master Athlete Badge</p>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[9px] font-mono border border-amber-500/30">
                  +500 AI XP Points
                </span>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Mini Dynamic App Bottom Navigation Bar */}
      <div className="px-3 py-2 bg-slate-950/90 border-t border-white/10 flex items-center justify-around">
        {FEATURES.slice(0, 5).map((f, i) => {
          const isActive = activeIdx % 5 === i;
          return (
            <div key={f.id} className="relative flex flex-col items-center">
              <f.icon className={`w-4 h-4 transition-colors ${isActive ? 'text-teal-400' : 'text-slate-600'}`} />
              {isActive && (
                <motion.div
                  layoutId="bottomTabIndicator"
                  className="absolute -bottom-1 w-1 h-1 rounded-full bg-teal-400 shadow-[0_0_8px_#2dd4bf]"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
