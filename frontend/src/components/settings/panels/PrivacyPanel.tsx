import React, { useState } from 'react';
import { ShieldCheck, Lock, Download, Trash2, AlertTriangle, FileText, CheckCircle2 } from 'lucide-react';
import { PrivacySettings } from '../types';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';

interface PrivacyPanelProps {
  settings: PrivacySettings;
  onChange: (updated: Partial<PrivacySettings>) => void;
}

export const PrivacyPanel: React.FC<PrivacyPanelProps> = ({ settings, onChange }) => {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleExportData = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      // Simulate file download
      const element = document.createElement('a');
      const file = new Blob([JSON.stringify({ exportedAt: new Date().toISOString(), status: 'COMPLETE' }, null, 2)], {
        type: 'application/json',
      });
      element.href = URL.createObjectURL(file);
      element.download = `fittracker-archive-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);

      toast({
        title: 'Export Archive Generated',
        description: 'Complete JSON archive containing your workouts, metrics, and telemetry downloaded.',
      });
    }, 1200);
  };

  const handleDeleteAccount = () => {
    toast({
      title: 'Deletion Request Scheduled',
      description: 'Account scheduled for cryptographic purge in 30 days per GDPR regulations.',
      variant: 'destructive',
    });
    setShowDeleteConfirm(false);
  };

  return (
    <div className="space-y-6">
      {/* Panel Header */}
      <div>
        <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-teal-400" />
          Privacy Envelope & Data Sovereignty
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Review biometric encryption standards, export telemetry records, and manage personal data rights.
        </p>
      </div>

      {/* Compliance Guarantee Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-300 flex items-start gap-3.5">
        <ShieldCheck className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="text-xs font-bold text-white flex items-center gap-2">
            <span>HIPAA & GDPR Zero-Knowledge Encrypted Vault</span>
            <span className="text-[9px] font-mono font-bold bg-teal-400/20 text-teal-300 px-1.5 py-0.2 rounded">
              AES-256
            </span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            All continuous heart-rate streams, GPS coordinates, and body composition biomarkers are encrypted at rest with
            hardware security module (HSM) keys. Neither staff nor third parties have unauthorized raw access.
          </p>
        </div>
      </div>

      {/* Group 1: Privacy Controls */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/60 border border-white/10 space-y-4">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
          Telemetry Permissions
        </h3>

        <div className="divide-y divide-white/5 space-y-3">
          <div className="pt-3 first:pt-0 flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <div className="text-xs font-semibold text-white">Anonymized research & heuristic modeling</div>
              <p className="text-[11px] text-slate-400">
                Share de-identified workout volume metrics to assist open biomedical exercise science models.
              </p>
            </div>
            <Switch
              checked={settings.analyticsPermission}
              onCheckedChange={(checked) => onChange({ analyticsPermission: checked })}
            />
          </div>

          <div className="pt-3 flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <div className="text-xs font-semibold text-white">Medical provider data sharing portal</div>
              <p className="text-[11px] text-slate-400">
                Generate secure one-time cryptographic link for your physician to view cardio & sleep reports.
              </p>
            </div>
            <Switch
              checked={settings.medicalDataSharing}
              onCheckedChange={(checked) => onChange({ medicalDataSharing: checked })}
            />
          </div>
        </div>
      </div>

      {/* Group 2: Data Export */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/60 border border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              Export Athlete Archive
            </h3>
            <p className="text-[11px] text-slate-400">
              Download your complete raw dataset including exercise sets, nutrition logs, and wearable pulse files.
            </p>
          </div>

          <button
            onClick={handleExportData}
            disabled={isExporting}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition shrink-0 self-start sm:self-auto active:scale-95 disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5 text-teal-400" />
            <span>{isExporting ? 'Packaging Archive...' : 'Download JSON & CSV'}</span>
          </button>
        </div>
      </div>

      {/* Group 3: Danger Zone */}
      <div className="p-5 sm:p-6 rounded-2xl bg-rose-950/20 border border-rose-500/20 space-y-4">
        <div className="flex items-center gap-2 text-rose-400">
          <AlertTriangle className="w-4 h-4" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider">
            Danger Zone: Purge Athlete Account
          </h3>
        </div>

        <p className="text-[11px] text-slate-400 leading-relaxed">
          Permanently deletes your user profile, workout history, wearable biometric links, and subscription. This action
          cannot be reversed.
        </p>

        {showDeleteConfirm ? (
          <div className="p-4 rounded-xl bg-slate-950 border border-rose-500/40 space-y-3">
            <p className="text-xs text-rose-300 font-bold">
              Are you sure? This will immediately cancel your active Pro AI subscription and purge all records.
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={handleDeleteAccount}
                className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition"
              >
                Yes, Purge Everything
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 font-bold text-xs transition flex items-center gap-2"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Request Permanent Account Deletion</span>
          </button>
        )}
      </div>
    </div>
  );
};
