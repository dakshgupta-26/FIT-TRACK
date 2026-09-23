import React from 'react';
import { Sliders, Globe, Clock, Scale, Calendar, Cloud, Save, WifiOff } from 'lucide-react';
import { GeneralSettings } from '../types';
import { Switch } from '@/components/ui/switch';

interface GeneralPanelProps {
  settings: GeneralSettings;
  onChange: (updated: Partial<GeneralSettings>) => void;
}

export const GeneralPanel: React.FC<GeneralPanelProps> = ({ settings, onChange }) => {
  return (
    <div className="space-y-6">
      {/* Panel Header */}
      <div>
        <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
          <Sliders className="w-4 h-4 text-teal-400" />
          General System Preferences
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Configure localization, regional unit conventions, and background storage sync behavior.
        </p>
      </div>

      {/* Group 1: Localization & Formats */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/60 border border-white/10 space-y-5">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
          Regional & Display Standards
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Language */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-teal-400" />
              <span>System Language</span>
            </label>
            <select
              value={settings.language}
              onChange={(e) => onChange({ language: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 hover:border-teal-500/30 focus:border-teal-400 text-xs text-white transition focus:outline-none focus:ring-1 focus:ring-teal-400"
            >
              <option value="en">English (United States)</option>
              <option value="es">Spanish (Español)</option>
              <option value="hi">Hindi (हिन्दी)</option>
              <option value="mr">Marathi (मराठी)</option>
            </select>
            <p className="text-[11px] text-slate-500">Affects interface copy and workout terminology.</p>
          </div>

          {/* Timezone */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-teal-400" />
              <span>Timezone Synchronization</span>
            </label>
            <select
              value={settings.timezone}
              onChange={(e) => onChange({ timezone: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 hover:border-teal-500/30 focus:border-teal-400 text-xs text-white transition focus:outline-none focus:ring-1 focus:ring-teal-400"
            >
              <option value="UTC-8 (Pacific)">UTC-8 (Pacific Time - US & Canada)</option>
              <option value="UTC-5 (Eastern)">UTC-5 (Eastern Time - US & Canada)</option>
              <option value="UTC+0 (London)">UTC+0 (Greenwich Mean Time - London)</option>
              <option value="UTC+5:30 (India)">UTC+5:30 (India Standard Time - IST)</option>
              <option value="UTC+9 (Tokyo)">UTC+9 (Japan Standard Time - Tokyo)</option>
            </select>
            <p className="text-[11px] text-slate-500">Calculates circadian reset windows and sleep debt.</p>
          </div>

          {/* Units */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-teal-400" />
              <span>Measurement Units</span>
            </label>
            <select
              value={settings.units}
              onChange={(e) => onChange({ units: e.target.value as 'metric' | 'imperial' })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 hover:border-teal-500/30 focus:border-teal-400 text-xs text-white transition focus:outline-none focus:ring-1 focus:ring-teal-400"
            >
              <option value="metric">Metric (Kilograms, Centimeters, Liters, Km)</option>
              <option value="imperial">Imperial (Pounds, Inches, Fluid Oz, Miles)</option>
            </select>
            <p className="text-[11px] text-slate-500">Applied across barbell plates, bodyweight, and distance.</p>
          </div>

          {/* Date Format */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-teal-400" />
              <span>Date Format</span>
            </label>
            <select
              value={settings.dateFormat}
              onChange={(e) => onChange({ dateFormat: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 hover:border-teal-500/30 focus:border-teal-400 text-xs text-white transition focus:outline-none focus:ring-1 focus:ring-teal-400"
            >
              <option value="YYYY-MM-DD">YYYY-MM-DD (e.g. 2026-09-23)</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY (e.g. 23/09/2026)</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY (e.g. 09/23/2026)</option>
            </select>
            <p className="text-[11px] text-slate-500">Display timestamp formatting across logs and reports.</p>
          </div>
        </div>
      </div>

      {/* Group 2: Data Persistence & Synchronization */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/60 border border-white/10 space-y-4">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
          Sync & Storage Protocols
        </h3>

        <div className="divide-y divide-white/5 space-y-3">
          {/* Auto-Save */}
          <div className="pt-3 first:pt-0 flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <div className="text-xs font-semibold text-white flex items-center gap-2">
                <span>Auto-save workouts and sets</span>
                <span className="text-[9px] font-mono text-teal-400 bg-teal-500/10 px-1.5 py-0.2 rounded">Recommended</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Automatically persists exercise sets, heart rate peaks, and rest timers in real-time.
              </p>
            </div>
            <Switch
              checked={settings.autoSave}
              onCheckedChange={(checked) => onChange({ autoSave: checked })}
            />
          </div>

          {/* Cloud Backup */}
          <div className="pt-3 flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <div className="text-xs font-semibold text-white">Encrypted cloud snapshot</div>
              <p className="text-[11px] text-slate-400">
                Keep automated AES-256 cloud backups synchronized to your primary FitTracker profile.
              </p>
            </div>
            <Switch
              checked={settings.cloudBackup}
              onCheckedChange={(checked) => onChange({ cloudBackup: checked })}
            />
          </div>

          {/* Offline Caching */}
          <div className="pt-3 flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <div className="text-xs font-semibold text-white">Offline local database caching</div>
              <p className="text-[11px] text-slate-400">
                Store workout templates and nutritional databases on-device for uninterrupted offline gym sessions.
              </p>
            </div>
            <Switch
              checked={settings.offlineMode}
              onCheckedChange={(checked) => onChange({ offlineMode: checked })}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
