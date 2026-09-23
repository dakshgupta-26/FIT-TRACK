import React from 'react';
import { Heart, Flame, Droplet, Moon, Dumbbell, Activity, BellRing, Sparkles } from 'lucide-react';
import { HealthGoalsSettings } from '../types';
import { Switch } from '@/components/ui/switch';

interface HealthGoalsPanelProps {
  settings: HealthGoalsSettings;
  onChange: (updated: Partial<HealthGoalsSettings>) => void;
}

export const HealthGoalsPanel: React.FC<HealthGoalsPanelProps> = ({ settings, onChange }) => {
  return (
    <div className="space-y-6">
      {/* Panel Header */}
      <div>
        <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
          <Heart className="w-4 h-4 text-rose-400" />
          Health Goals & Biometric Targets
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Establish biological baseline thresholds, daily caloric expenditure, and cardiovascular upper limits.
        </p>
      </div>

      {/* Numerical Targets Grid */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/60 border border-white/10 space-y-5">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
          Daily Biomarker Targets
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Target Weight */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-white/5 space-y-2">
            <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-teal-400" />
              <span>Target Weight (kg)</span>
            </label>
            <input
              type="number"
              step="0.5"
              value={settings.targetWeight}
              onChange={(e) => onChange({ targetWeight: e.target.value })}
              placeholder="e.g. 72"
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/10 hover:border-teal-500/30 focus:border-teal-400 text-xs font-mono font-bold text-white focus:outline-none focus:ring-1 focus:ring-teal-400"
            />
            <span className="text-[10px] text-slate-500 block">Baseline scale measurement.</span>
          </div>

          {/* Daily Calories */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-white/5 space-y-2">
            <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Caloric Budget (kcal)</span>
            </label>
            <input
              type="number"
              step="50"
              value={settings.dailyCalories}
              onChange={(e) => onChange({ dailyCalories: e.target.value })}
              placeholder="2200"
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/10 hover:border-teal-500/30 focus:border-teal-400 text-xs font-mono font-bold text-white focus:outline-none focus:ring-1 focus:ring-teal-400"
            />
            <span className="text-[10px] text-slate-500 block">Active maintenance expenditure.</span>
          </div>

          {/* Daily Water */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-white/5 space-y-2">
            <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
              <Droplet className="w-3.5 h-3.5 text-cyan-400" />
              <span>Hydration Goal (Liters)</span>
            </label>
            <input
              type="number"
              step="0.2"
              value={settings.dailyWater}
              onChange={(e) => onChange({ dailyWater: e.target.value })}
              placeholder="3.0"
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/10 hover:border-teal-500/30 focus:border-teal-400 text-xs font-mono font-bold text-white focus:outline-none focus:ring-1 focus:ring-teal-400"
            />
            <span className="text-[10px] text-slate-500 block">Fluid intake throughout daytime.</span>
          </div>

          {/* Sleep Hours */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-white/5 space-y-2">
            <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
              <Moon className="w-3.5 h-3.5 text-indigo-400" />
              <span>Sleep Opportunity (Hours)</span>
            </label>
            <input
              type="number"
              step="0.5"
              value={settings.sleepGoal}
              onChange={(e) => onChange({ sleepGoal: e.target.value })}
              placeholder="8.0"
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/10 hover:border-teal-500/30 focus:border-teal-400 text-xs font-mono font-bold text-white focus:outline-none focus:ring-1 focus:ring-teal-400"
            />
            <span className="text-[10px] text-slate-500 block">Target nocturnal circadian duration.</span>
          </div>

          {/* Workout Days */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-white/5 space-y-2">
            <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
              <Dumbbell className="w-3.5 h-3.5 text-emerald-400" />
              <span>Weekly Workouts (Days)</span>
            </label>
            <input
              type="number"
              min="1"
              max="7"
              value={settings.workoutDays}
              onChange={(e) => onChange({ workoutDays: e.target.value })}
              placeholder="4"
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/10 hover:border-teal-500/30 focus:border-teal-400 text-xs font-mono font-bold text-white focus:outline-none focus:ring-1 focus:ring-teal-400"
            />
            <span className="text-[10px] text-slate-500 block">Scheduled training days per micro-cycle.</span>
          </div>

          {/* Heart Rate Alert */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-white/5 space-y-2">
            <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-rose-400" />
              <span>Peak HR Limit Alert (BPM)</span>
            </label>
            <input
              type="number"
              value={settings.heartRateAlert}
              onChange={(e) => onChange({ heartRateAlert: e.target.value })}
              placeholder="165"
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/10 hover:border-teal-500/30 focus:border-teal-400 text-xs font-mono font-bold text-white focus:outline-none focus:ring-1 focus:ring-teal-400"
            />
            <span className="text-[10px] text-slate-500 block">Triggers vibration when threshold exceeded.</span>
          </div>
        </div>
      </div>

      {/* Group 2: Behavioral Triggers */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/60 border border-white/10 space-y-4">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
          Telemetry Automated Triggers
        </h3>

        <div className="divide-y divide-white/5 space-y-3">
          <div className="pt-3 first:pt-0 flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <div className="text-xs font-semibold text-white flex items-center gap-2">
                <span>Intelligent hydration nudges</span>
                <span className="text-[9px] font-mono text-cyan-400 bg-cyan-500/10 px-1.5 py-0.2 rounded">Smart</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Dynamically adjusts reminders based on workout intensity and ambient temperature.
              </p>
            </div>
            <Switch
              checked={settings.hydrationAlerts}
              onCheckedChange={(checked) => onChange({ hydrationAlerts: checked })}
            />
          </div>

          <div className="pt-3 flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <div className="text-xs font-semibold text-white">Daily recovery and HRV strain modeling</div>
              <p className="text-[11px] text-slate-400">
                Calculates daily central nervous system readiness score before scheduled sessions.
              </p>
            </div>
            <Switch
              checked={settings.recoveryTracking}
              onCheckedChange={(checked) => onChange({ recoveryTracking: checked })}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
