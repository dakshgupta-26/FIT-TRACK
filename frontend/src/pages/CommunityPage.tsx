import React from 'react';
import { PublicPageLayout } from '@/components/layout/PublicPageLayout';
import { Users, Trophy, Flame, Award } from 'lucide-react';

export const CommunityPage: React.FC = () => {
  return (
    <PublicPageLayout
      title="FitTracker Global Fitness Community"
      subtitle="Connect with 50,000+ members, share workout milestones, and climb weekly step challenges."
      badge="Global Community"
      seoTitle="Community & Challenges - FitTracker AI"
      seoDescription="Join FitTracker global community fitness challenges and step leaderboards."
    >
      <div className="space-y-8 max-w-4xl mx-auto">
        <div className="p-8 rounded-3xl bg-gradient-to-r from-teal-500/10 via-white/[0.02] to-transparent border border-[#14b8a6]/30 text-center space-y-4">
          <Trophy className="h-10 w-10 text-amber-400 mx-auto animate-pulse" />
          <h2 className="text-2xl font-bold text-white">July 100K Step Challenge</h2>
          <p className="text-sm text-white/70 max-w-xl mx-auto">
            Over 14,200 members have completed this month's challenge! Join now to unlock exclusive profile badges.
          </p>
        </div>
      </div>
    </PublicPageLayout>
  );
};

export default CommunityPage;
