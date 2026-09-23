import React from 'react';
import { Bell, Dumbbell, Utensils, Moon, Droplet, Trophy, Mail, Smartphone, MessageSquare } from 'lucide-react';
import { NotificationSettings } from '../types';
import { Switch } from '@/components/ui/switch';

interface NotificationsPanelProps {
  settings: NotificationSettings;
  onChange: (updated: Partial<NotificationSettings>) => void;
}

export const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ settings, onChange }) => {
  return (
    <div className="space-y-6">
      {/* Panel Header */}
      <div>
        <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
          <Bell className="w-4 h-4 text-teal-400" />
          Notifications & Telemetry Alerts
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Configure proactive biological reminders, milestone celebrations, and cross-device dispatch channels.
        </p>
      </div>

      {/* Group 1: Circadian & Behavioral Alerts */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/60 border border-white/10 space-y-4">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
          Proactive Circadian Triggers
        </h3>

        <div className="divide-y divide-white/5 space-y-3">
          {/* Workouts */}
          <div className="pt-3 first:pt-0 flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <div className="text-xs font-semibold text-white flex items-center gap-2">
                <Dumbbell className="w-3.5 h-3.5 text-teal-400" />
                <span>Daily workout schedule reminder</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Dispatched 45 minutes prior to your optimal circadian training window.
              </p>
            </div>
            <Switch
              checked={settings.workoutReminders}
              onCheckedChange={(checked) => onChange({ workoutReminders: checked })}
            />
          </div>

          {/* Meals */}
          <div className="pt-3 flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <div className="text-xs font-semibold text-white flex items-center gap-2">
                <Utensils className="w-3.5 h-3.5 text-amber-400" />
                <span>Macronutrient & meal timing alerts</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Prompts for post-workout protein synthesis window and intermittent fasting intervals.
              </p>
            </div>
            <Switch
              checked={settings.mealReminders}
              onCheckedChange={(checked) => onChange({ mealReminders: checked })}
            />
          </div>

          {/* Sleep */}
          <div className="pt-3 flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <div className="text-xs font-semibold text-white flex items-center gap-2">
                <Moon className="w-3.5 h-3.5 text-indigo-400" />
                <span>Optimal sleep opportunity wind-down</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Nudge 30 minutes before sleep target with blue-light reduction and magnesium cues.
              </p>
            </div>
            <Switch
              checked={settings.sleepReminder}
              onCheckedChange={(checked) => onChange({ sleepReminder: checked })}
            />
          </div>

          {/* Hydration */}
          <div className="pt-3 flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <div className="text-xs font-semibold text-white flex items-center gap-2">
                <Droplet className="w-3.5 h-3.5 text-cyan-400" />
                <span>Smart daytime fluid intake triggers</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Calculates sweat rate from recent training load and prompts water/electrolyte intake.
              </p>
            </div>
            <Switch
              checked={settings.hydrationReminder}
              onCheckedChange={(checked) => onChange({ hydrationReminder: checked })}
            />
          </div>

          {/* Milestones */}
          <div className="pt-3 flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <div className="text-xs font-semibold text-white flex items-center gap-2">
                <Trophy className="w-3.5 h-3.5 text-yellow-400" />
                <span>Goal completions & PR milestones</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Celebrate personal records, weekly streak completions, and milestone badges.
              </p>
            </div>
            <Switch
              checked={settings.goalCompletion}
              onCheckedChange={(checked) => onChange({ goalCompletion: checked })}
            />
          </div>
        </div>
      </div>

      {/* Group 2: Delivery Channels */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/60 border border-white/10 space-y-4">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
          Delivery Channels
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Push */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Smartphone className="w-4 h-4 text-teal-400" />
              <div>
                <div className="text-xs font-bold text-white">Push Notifications</div>
                <div className="text-[10px] text-slate-400">Mobile & Watch</div>
              </div>
            </div>
            <Switch
              checked={settings.push}
              onCheckedChange={(checked) => onChange({ push: checked })}
            />
          </div>

          {/* Email */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-indigo-400" />
              <div>
                <div className="text-xs font-bold text-white">Email Digest</div>
                <div className="text-[10px] text-slate-400">Weekly Analytics</div>
              </div>
            </div>
            <Switch
              checked={settings.email}
              onCheckedChange={(checked) => onChange({ email: checked })}
            />
          </div>

          {/* SMS */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <div>
                <div className="text-xs font-bold text-white">SMS Telemetry</div>
                <div className="text-[10px] text-slate-400">Critical Alerts Only</div>
              </div>
            </div>
            <Switch
              checked={settings.sms}
              onCheckedChange={(checked) => onChange({ sms: checked })}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
