import React, { useState } from 'react';
import { Lock, ShieldCheck, Key, Smartphone, Laptop, AlertTriangle, Check, RefreshCw } from 'lucide-react';
import { SecuritySettings } from '../types';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';

interface SecurityPanelProps {
  settings: SecuritySettings;
  onChange: (updated: Partial<SecuritySettings>) => void;
}

export const SecurityPanel: React.FC<SecurityPanelProps> = ({ settings, onChange }) => {
  const { toast } = useToast();
  const [sessions, setSessions] = useState([
    {
      id: 'session-1',
      device: 'MacBook Pro 16" (Sonoma)',
      location: 'San Francisco, US',
      ip: '192.88.99.1',
      lastActive: 'Current Session (Live)',
      current: true,
      icon: Laptop,
    },
    {
      id: 'session-2',
      device: 'iPhone 15 Pro Max (iOS 18)',
      location: 'San Francisco, US',
      ip: '192.88.99.14',
      lastActive: '12 minutes ago',
      current: false,
      icon: Smartphone,
    },
    {
      id: 'session-3',
      device: 'iPad Pro M4 (iPadOS 18)',
      location: 'New York, US',
      ip: '172.56.21.8',
      lastActive: 'Yesterday at 8:42 PM',
      current: false,
      icon: Laptop,
    },
  ]);

  const [passwordState, setPasswordState] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordState.currentPassword || !passwordState.newPassword) {
      toast({ title: 'Error', description: 'Please fill in all password fields.', variant: 'destructive' });
      return;
    }
    if (passwordState.newPassword !== passwordState.confirmPassword) {
      toast({ title: 'Error', description: 'New passwords do not match.', variant: 'destructive' });
      return;
    }
    toast({
      title: 'Password Updated',
      description: 'Your account credentials have been updated securely.',
    });
    setPasswordState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleRevokeSession = (id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
    toast({
      title: 'Session Revoked',
      description: 'The selected device has been signed out.',
    });
  };

  return (
    <div className="space-y-6">
      {/* Panel Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Lock className="w-4 h-4 text-teal-400" />
            Security & Authentication Vault
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage multi-factor verification, hardware biometrics, and active session cryptographic keys.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-emerald-500/20 text-emerald-300 text-xs shrink-0 self-start sm:self-auto font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Security Score: 98% (High)</span>
        </div>
      </div>

      {/* Group 1: Multi-Factor & Biometric Switches */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/60 border border-white/10 space-y-4">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
          Hardware & Identity Verification
        </h3>

        <div className="divide-y divide-white/5 space-y-3">
          <div className="pt-3 first:pt-0 flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <div className="text-xs font-semibold text-white flex items-center gap-2">
                <span>Two-Factor Authentication (2FA)</span>
                <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded">Enforced</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Requires TOTP authenticator code (1Password, Google Authenticator) for sign-ins.
              </p>
            </div>
            <Switch
              checked={settings.twoFactor}
              onCheckedChange={(checked) => onChange({ twoFactor: checked })}
            />
          </div>

          <div className="pt-3 flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <div className="text-xs font-semibold text-white">Biometric Face ID / Touch ID Unlock</div>
              <p className="text-[11px] text-slate-400">
                Allows instant biometric hardware decryption when reopening FitTracker on this device.
              </p>
            </div>
            <Switch
              checked={settings.biometric}
              onCheckedChange={(checked) => onChange({ biometric: checked })}
            />
          </div>

          <div className="pt-3 flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <div className="text-xs font-semibold text-white">New device login alerts</div>
              <p className="text-[11px] text-slate-400">
                Receive instant email notification whenever an unknown browser or IP signs into your athlete profile.
              </p>
            </div>
            <Switch
              checked={settings.loginAlerts}
              onCheckedChange={(checked) => onChange({ loginAlerts: checked })}
            />
          </div>
        </div>
      </div>

      {/* Group 2: Password Update */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/60 border border-white/10 space-y-4">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
          Password Credential
        </h3>

        <form onSubmit={handleUpdatePassword} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Current Password</label>
            <input
              type="password"
              value={passwordState.currentPassword}
              onChange={(e) => setPasswordState({ ...passwordState, currentPassword: e.target.value })}
              placeholder="••••••••••••"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950/80 border border-white/10 hover:border-teal-500/30 focus:border-teal-400 text-xs text-white transition focus:outline-none focus:ring-1 focus:ring-teal-400"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">New Password</label>
            <input
              type="password"
              value={passwordState.newPassword}
              onChange={(e) => setPasswordState({ ...passwordState, newPassword: e.target.value })}
              placeholder="Min 8 chars, 1 number"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950/80 border border-white/10 hover:border-teal-500/30 focus:border-teal-400 text-xs text-white transition focus:outline-none focus:ring-1 focus:ring-teal-400"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Confirm Password</label>
            <div className="flex gap-2">
              <input
                type="password"
                value={passwordState.confirmPassword}
                onChange={(e) => setPasswordState({ ...passwordState, confirmPassword: e.target.value })}
                placeholder="Repeat password"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950/80 border border-white/10 hover:border-teal-500/30 focus:border-teal-400 text-xs text-white transition focus:outline-none focus:ring-1 focus:ring-teal-400"
              />
              <button
                type="submit"
                className="px-3.5 py-2 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold text-xs shrink-0 transition"
              >
                Update
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Group 3: Active Sessions */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/60 border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
            Active Cryptographic Sessions
          </h3>
          <span className="text-[10px] font-mono text-slate-400">{sessions.length} Authorized</span>
        </div>

        <div className="divide-y divide-white/5 space-y-3">
          {sessions.map((sess) => {
            const Icon = sess.icon;
            return (
              <div key={sess.id} className="pt-3 first:pt-0 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-950 border border-white/10 flex items-center justify-center text-slate-400 shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{sess.device}</span>
                      {sess.current && (
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          THIS DEVICE
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono flex items-center gap-2 mt-0.5">
                      <span>{sess.location}</span>
                      <span>•</span>
                      <span>{sess.ip}</span>
                      <span>•</span>
                      <span className="text-slate-500">{sess.lastActive}</span>
                    </div>
                  </div>
                </div>

                {!sess.current && (
                  <button
                    onClick={() => handleRevokeSession(sess.id)}
                    className="text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 px-2.5 py-1 rounded-lg transition"
                  >
                    Revoke
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
