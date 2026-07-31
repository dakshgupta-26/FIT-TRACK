import React from 'react';
import { PublicPageLayout } from '@/components/layout/PublicPageLayout';
import { Code, Terminal, Server, Key, FileCode } from 'lucide-react';

export const DocumentationPage: React.FC = () => {
  return (
    <PublicPageLayout
      title="Developer API & Technical Documentation"
      subtitle="Integrate FitTracker telemetry, workout streams, and nutrition calculations into your applications."
      badge="Developer API"
      seoTitle="Developer API Docs - FitTracker AI"
      seoDescription="RESTful API documentation and Webhooks reference for FitTracker health telemetry."
    >
      <div className="space-y-8 max-w-4xl mx-auto">
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-4">
          <div className="flex items-center gap-2 text-[#2dd4bf] font-mono text-sm font-bold">
            <Terminal className="h-4 w-4" />
            <span>AUTHENTICATION</span>
          </div>
          <p className="text-white/70 text-sm">
            FitTracker APIs require Bearer token authorization in the request headers:
          </p>
          <pre className="p-4 rounded-xl bg-[#07111f] border border-white/10 text-xs font-mono text-emerald-400 overflow-x-auto">
            Authorization: Bearer fit_sec_live_9981240a1b8c
          </pre>
        </div>

        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-4">
          <div className="flex items-center gap-2 text-[#2dd4bf] font-mono text-sm font-bold">
            <Server className="h-4 w-4" />
            <span>GET /v1/telemetry/daily</span>
          </div>
          <p className="text-white/70 text-sm">Returns calorie burn, heart rate averages, and step counts for the specified user.</p>
          <pre className="p-4 rounded-xl bg-[#07111f] border border-white/10 text-xs font-mono text-[#2dd4bf] overflow-x-auto">
{`{
  "status": 200,
  "data": {
    "date": "2026-07-31",
    "calories_burned": 2450,
    "resting_heart_rate": 62,
    "health_score": 94
  }
}`}
          </pre>
        </div>
      </div>
    </PublicPageLayout>
  );
};

export default DocumentationPage;
