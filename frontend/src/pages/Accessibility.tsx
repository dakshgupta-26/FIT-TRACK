import React from 'react';
import { PublicPageLayout } from '@/components/layout/PublicPageLayout';
import { Accessibility as AccessibilityIcon, Eye, Keyboard, Volume2, Sparkles, Mail, CheckCircle2 } from 'lucide-react';

export const Accessibility: React.FC = () => {
  const standards = [
    {
      title: 'Keyboard Navigation & Focus States',
      description: '100% of interactive elements, forms, and modals can be navigated seamlessly via standard Keyboard Tab, Shift+Tab, and Enter/Space controls with high-visibility focus rings.',
      icon: Keyboard,
    },
    {
      title: 'Screen Reader Support (WCAG 2.1 AA)',
      description: 'Built with semantic HTML5 markup, explicit ARIA labels, live region status notifications (`aria-live`), and descriptive alt text for screen readers.',
      icon: Volume2,
    },
    {
      title: 'High Contrast Dark Palette',
      description: 'Carefully engineered color schemes meeting strict 4.5:1 text-to-background contrast ratios for enhanced legibility across all ambient lighting conditions.',
      icon: Eye,
    },
    {
      title: 'Reduced Motion Preferences',
      description: 'Respects OS-level `prefers-reduced-motion` settings to automatically disable intensive parallax effects, floating particles, and entrance transitions.',
      icon: AccessibilityIcon,
    },
  ];

  return (
    <PublicPageLayout
      title="Accessibility Commitment"
      subtitle="Ensuring FitTracker is inclusive, usable, and accessible for everyone across devices and screen readers."
      badge="Digital Inclusion"
      seoTitle="Accessibility Commitment - FitTracker AI"
      seoDescription="FitTracker's commitment to WCAG 2.1 AA digital accessibility standards, screen reader compatibility, and keyboard navigation."
    >
      <div className="space-y-16 lg:space-y-20">
        
        {/* Commitment Statement */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-white/[0.03] via-[#14b8a6]/10 to-transparent border border-[#14b8a6]/30 space-y-4 text-center max-w-3xl mx-auto">
          <AccessibilityIcon className="h-10 w-10 text-[#2dd4bf] mx-auto animate-pulse" />
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Fitness for All Abilities</h2>
          <p className="text-white/70 text-sm sm:text-base leading-relaxed">
            FitTracker believes that personal health monitoring should be accessible to everyone regardless of visual, auditory, motor, or cognitive impairments. We continuously test our user interfaces against W3C WCAG 2.1 AA standards.
          </p>
        </div>

        {/* Accessibility Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {standards.map((std, idx) => {
            const IconComp = std.icon;
            return (
              <div key={idx} className="p-8 rounded-3xl bg-white/[0.02] border border-white/[0.06] hover:border-[#14b8a6]/40 transition-all space-y-4">
                <div className="p-3 rounded-2xl bg-[#14b8a6]/10 border border-[#14b8a6]/20 text-[#2dd4bf] w-fit">
                  <IconComp className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-white">{std.title}</h3>
                <p className="text-white/65 text-sm leading-relaxed">{std.description}</p>
              </div>
            );
          })}
        </div>

        {/* Accessibility Contact Box */}
        <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/[0.06] text-center space-y-4 max-w-xl mx-auto">
          <Mail className="h-8 w-8 text-[#2dd4bf] mx-auto" />
          <h3 className="text-xl font-bold text-white">Feedback & Assistance</h3>
          <p className="text-white/65 text-sm">
            If you encounter any accessibility barriers while using FitTracker, please notify our accessibility team so we can remediate the issue immediately.
          </p>
          <a 
            href="mailto:accessibility@fittracker.ai" 
            className="inline-block text-sm font-mono text-[#2dd4bf] underline hover:text-white transition-colors"
          >
            accessibility@fittracker.ai
          </a>
        </div>

      </div>
    </PublicPageLayout>
  );
};

export default Accessibility;
