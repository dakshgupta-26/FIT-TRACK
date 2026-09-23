import React from 'react';
import {
  Sparkles,
  ShieldCheck,
  Watch,
  CloudCheck,
  Search,
  Save,
  RotateCcw,
  Loader2,
  Check,
  SlidersHorizontal,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SettingsHeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenSearchModal: () => void;
  isDirty: boolean;
  isSaving: boolean;
  onSave: () => void;
  onDiscard: () => void;
  activeCount: number;
}

export const SettingsHeader: React.FC<SettingsHeaderProps> = ({
  searchQuery,
  onSearchChange,
  onOpenSearchModal,
  isDirty,
  isSaving,
  onSave,
  onDiscard,
  activeCount,
}) => {
  return (
    <div className="space-y-4 pb-2 border-b border-white/5">
      {/* Top Title & Quick Actions Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold tracking-widest text-teal-400 uppercase bg-teal-500/10 border border-teal-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
              <SlidersHorizontal className="w-3 h-3 text-teal-400" />
              SYSTEM CONTROL CENTER
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
            Manage your account specifications, neural AI models, wearable telemetry, and security protocols.
          </p>
        </div>

        {/* Right Header Status & Save Actions */}
        <div className="flex items-center gap-2.5 shrink-0 self-start md:self-center">
          {isDirty ? (
            <div className="flex items-center gap-2 bg-slate-900/90 border border-amber-500/30 px-3 py-1.5 rounded-xl shadow-lg">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-[11px] font-medium text-amber-200 hidden sm:inline">
                Unsaved changes
              </span>
              <button
                onClick={onDiscard}
                disabled={isSaving}
                className="text-xs px-2.5 py-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition flex items-center gap-1"
                title="Discard changes"
              >
                <RotateCcw className="w-3 h-3" />
                <span className="hidden sm:inline">Discard</span>
              </button>
              <button
                onClick={onSave}
                disabled={isSaving}
                className="text-xs px-3 py-1 rounded-lg bg-teal-400 text-slate-950 font-bold hover:bg-teal-300 transition flex items-center gap-1 shadow-sm"
              >
                {isSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                <span>Save</span>
              </button>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 bg-slate-900/40 border border-white/5 px-3 py-1.5 rounded-xl">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[11px] font-mono text-slate-400">All configurations synced</span>
            </div>
          )}
        </div>
      </div>

      {/* High-Density System Status Strip + Quick Search Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 pt-1">
        {/* Search Input Bar (Linear/Notion style) */}
        <div className="lg:col-span-4">
          <div className="relative group">
            <Search className="w-3.5 h-3.5 text-slate-400 group-focus-within:text-teal-400 absolute left-3 top-1/2 -translate-y-1/2 transition" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search all settings (e.g. 2FA, language, units)..."
              className="w-full pl-9 pr-14 py-2 rounded-xl bg-slate-900/60 hover:bg-slate-900/90 focus:bg-slate-900 border border-white/10 focus:border-teal-500/50 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-teal-500/40 transition shadow-inner"
            />
            <kbd
              onClick={onOpenSearchModal}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] font-mono text-slate-400 bg-slate-800/80 border border-white/10 px-1.5 py-0.5 rounded cursor-pointer hover:text-white hover:border-teal-500/40 transition"
              title="Open settings search modal"
            >
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Compact Telemetry Badges Strip */}
        <div className="lg:col-span-8 flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900/60 border border-white/5 text-[11px] shrink-0">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span className="text-slate-400">Plan:</span>
            <span className="font-bold text-amber-300">Pro AI</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900/60 border border-white/5 text-[11px] shrink-0">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span className="text-slate-400">Security:</span>
            <span className="font-bold text-emerald-300 font-mono">98% High</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900/60 border border-white/5 text-[11px] shrink-0">
            <Watch className="w-3 h-3 text-teal-400" />
            <span className="text-slate-400">Devices:</span>
            <span className="font-bold text-teal-300 font-mono">5 Synced</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900/60 border border-white/5 text-[11px] shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
            <span className="text-slate-400">Backup:</span>
            <span className="font-bold text-slate-200">Encrypted Cloud</span>
          </div>
        </div>
      </div>
    </div>
  );
};
