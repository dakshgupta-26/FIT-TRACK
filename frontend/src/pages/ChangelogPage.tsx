import React from 'react';
import { PublicPageLayout } from '@/components/layout/PublicPageLayout';
import { Sparkles, CheckCircle2 } from 'lucide-react';

export const ChangelogPage: React.FC = () => {
  const releases = [
    {
      version: 'v2.1',
      date: 'July 2026',
      highlights: [
        'Redesigned Split-Screen Interactive Feature Showcase with iPhone 16 Pro mockup',
        '3D Mouse Spotlight and Lenis smooth scrolling integration',
        'Complete enterprise-grade company & legal navigation pages',
      ],
    },
    {
      version: 'v2.0',
      date: 'June 2026',
      highlights: [
        'AI Food Camera Recognition with 99% calorie estimation',
        'Dark glassmorphic UI overhaul with custom SVG telemetry',
      ],
    },
  ];

  return (
    <PublicPageLayout
      title="Product Changelog & Release Notes"
      subtitle="Track the latest features, performance improvements, and security updates added to FitTracker."
      badge="Product Updates"
      seoTitle="Changelog & Releases - FitTracker AI"
      seoDescription="Detailed product release notes, feature updates, and changelog for FitTracker AI."
    >
      <div className="space-y-8 max-w-4xl mx-auto">
        {releases.map((rel, i) => (
          <div key={i} className="p-8 rounded-3xl bg-white/[0.02] border border-white/[0.06] space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-lg bg-[#14b8a6]/20 text-[#2dd4bf] font-mono text-sm font-bold">
                {rel.version}
              </span>
              <span className="text-xs font-mono text-white/50">{rel.date}</span>
            </div>
            <div className="space-y-2">
              {rel.highlights.map((h, j) => (
                <div key={j} className="flex items-center gap-2 text-sm text-white/80">
                  <CheckCircle2 className="h-4 w-4 text-[#2dd4bf] flex-shrink-0" />
                  <span>{h}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </PublicPageLayout>
  );
};

export default ChangelogPage;
