import React from 'react';
import { User, Mail, Phone, AlertCircle, ShieldCheck, CheckCircle2, AtSign } from 'lucide-react';
import { AccountSettings } from '../types';

interface AccountPanelProps {
  settings: AccountSettings;
  onChange: (updated: Partial<AccountSettings>) => void;
}

export const AccountPanel: React.FC<AccountPanelProps> = ({ settings, onChange }) => {
  return (
    <div className="space-y-6">
      {/* Panel Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <User className="w-4 h-4 text-teal-400" />
            Account Specifications
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage your personal identity credentials, contact channels, and emergency athlete dispatch records.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-emerald-500/20 text-emerald-300 text-xs shrink-0 self-start sm:self-auto">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-mono font-semibold text-[11px]">Profile 94% Complete</span>
        </div>
      </div>

      {/* Main Specs Form Container */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/60 border border-white/10 space-y-5">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
          Athlete Identity
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* First Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">First Name</label>
            <input
              type="text"
              value={settings.firstName}
              onChange={(e) => onChange({ firstName: e.target.value })}
              placeholder="e.g. Alex"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 hover:border-teal-500/30 focus:border-teal-400 text-xs text-white transition focus:outline-none focus:ring-1 focus:ring-teal-400 placeholder:text-slate-600"
            />
          </div>

          {/* Last Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Last Name</label>
            <input
              type="text"
              value={settings.lastName}
              onChange={(e) => onChange({ lastName: e.target.value })}
              placeholder="e.g. Mercer"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 hover:border-teal-500/30 focus:border-teal-400 text-xs text-white transition focus:outline-none focus:ring-1 focus:ring-teal-400 placeholder:text-slate-600"
            />
          </div>

          {/* Username */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
              <AtSign className="w-3 h-3 text-teal-400" />
              <span>Username Handle</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={settings.username}
                onChange={(e) => onChange({ username: e.target.value })}
                placeholder="athlete_handle"
                className="w-full pl-3.5 pr-14 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 hover:border-teal-500/30 focus:border-teal-400 text-xs text-white transition focus:outline-none focus:ring-1 focus:ring-teal-400 placeholder:text-slate-600"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-emerald-400">
                AVAILABLE
              </span>
            </div>
          </div>

          {/* Email Address (Read-only security) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <Mail className="w-3 h-3 text-teal-400" />
                <span>Primary Email Address</span>
              </label>
              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> VERIFIED
              </span>
            </div>
            <input
              type="email"
              value={settings.email}
              disabled
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/40 border border-white/5 text-xs text-slate-400 cursor-not-allowed select-all"
            />
            <p className="text-[11px] text-slate-500">Contact security team or 2FA vault to update login email.</p>
          </div>

          {/* Phone Number */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
              <Phone className="w-3 h-3 text-teal-400" />
              <span>Phone Number (SMS Telemetry)</span>
            </label>
            <input
              type="text"
              value={settings.phone}
              onChange={(e) => onChange({ phone: e.target.value })}
              placeholder="+1 (555) 019-2834"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 hover:border-teal-500/30 focus:border-teal-400 text-xs text-white transition focus:outline-none focus:ring-1 focus:ring-teal-400 placeholder:text-slate-600"
            />
          </div>

          {/* Emergency Contact */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
              <AlertCircle className="w-3 h-3 text-amber-400" />
              <span>Emergency Dispatcher Contact</span>
            </label>
            <input
              type="text"
              value={settings.emergencyContact}
              onChange={(e) => onChange({ emergencyContact: e.target.value })}
              placeholder="e.g. Dr. Sarah Vance (+1 555-0129)"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 hover:border-teal-500/30 focus:border-teal-400 text-xs text-white transition focus:outline-none focus:ring-1 focus:ring-teal-400 placeholder:text-slate-600"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
