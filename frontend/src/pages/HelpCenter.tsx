import React from 'react';
import { PublicPageLayout } from '@/components/layout/PublicPageLayout';
import { Input } from '@/components/ui/input';
import { Search, HelpCircle, BookOpen, MessageSquare, ShieldCheck, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HelpCenter: React.FC = () => {
  const categories = [
    { title: 'Getting Started', desc: 'Account setup, setting fitness goals, and pairing wearables.', icon: BookOpen, count: '12 articles' },
    { title: 'AI Meal Scanner', desc: 'How food photo logging works and macro calculations.', icon: Zap, count: '8 articles' },
    { title: 'Workout Builder', desc: 'Creating routines, rest timers, and custom exercises.', icon: HelpCircle, count: '15 articles' },
    { title: 'Billing & Subscriptions', desc: 'Managing plans, payment methods, and invoices.', icon: ShieldCheck, count: '6 articles' },
  ];

  return (
    <PublicPageLayout
      title="FitTracker Help Center & Knowledge Base"
      subtitle="Search guides, tutorials, and frequently asked questions about FitTracker AI."
      badge="Support & Docs"
      seoTitle="Help Center & Support - FitTracker AI"
      seoDescription="Search tutorials, setup guides, and FAQs for FitTracker AI health application."
    >
      <div className="space-y-12">
        <div className="relative max-w-2xl mx-auto">
          <Input
            placeholder="Search for articles (e.g., how to scan meals, sync Apple Watch)..."
            className="h-14 pl-12 pr-4 bg-white/[0.04] border-white/10 text-white rounded-2xl text-sm"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#2dd4bf]" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((cat, i) => {
            const IconComp = cat.icon;
            return (
              <div key={i} className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-[#14b8a6]/40 transition-all space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-xl bg-[#14b8a6]/10 border border-[#14b8a6]/20 text-[#2dd4bf]">
                    <IconComp className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-mono text-white/40">{cat.count}</span>
                </div>
                <h3 className="text-lg font-bold text-white">{cat.title}</h3>
                <p className="text-xs text-white/60 leading-relaxed">{cat.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </PublicPageLayout>
  );
};

export default HelpCenter;
