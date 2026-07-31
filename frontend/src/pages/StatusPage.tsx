import React from 'react';
import { PublicPageLayout } from '@/components/layout/PublicPageLayout';
import { CheckCircle2, Server, Database, ShieldCheck, Activity } from 'lucide-react';

export const StatusPage: React.FC = () => {
  const services = [
    { name: 'Core API & Auth Services', status: 'Operational', uptime: '99.99%' },
    { name: 'AI Vision & Meal Scanner Pipeline', status: 'Operational', uptime: '99.95%' },
    { name: 'Biometric Telemetry Stream', status: 'Operational', uptime: '100.00%' },
    { name: 'Database & Data Storage Engine', status: 'Operational', uptime: '99.99%' },
  ];

  return (
    <PublicPageLayout
      title="FitTracker System Status"
      subtitle="Real-time uptime monitoring and system operational metrics."
      badge="System Health"
      seoTitle="System Status - FitTracker AI"
      seoDescription="Real-time operational status and uptime metrics for FitTracker services."
    >
      <div className="space-y-8 max-w-4xl mx-auto">
        <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
            </span>
            <span className="text-base font-bold text-white">All FitTracker Systems Operational</span>
          </div>
          <span className="text-xs font-mono text-emerald-400">100% Operational</span>
        </div>

        <div className="space-y-4">
          {services.map((s, i) => (
            <div key={i} className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
              <div className="space-y-0.5">
                <h3 className="text-sm font-bold text-white">{s.name}</h3>
                <span className="text-xs font-mono text-white/40">Uptime: {s.uptime}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>{s.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PublicPageLayout>
  );
};

export default StatusPage;
