import React, { useState } from 'react';
import { PublicPageLayout } from '@/components/layout/PublicPageLayout';
import { Button } from '@/components/ui/button';
import { Cookie, Check, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export const Cookies: React.FC = () => {
  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: true,
    functional: true,
    marketing: false,
  });

  const handleSave = () => {
    toast.success('Cookie preferences updated and saved successfully.');
  };

  const categories = [
    {
      key: 'necessary',
      title: 'Strictly Necessary Cookies',
      required: true,
      description: 'Essential for site navigation, secure authentication, and session persistence. Cannot be disabled.',
    },
    {
      key: 'analytics',
      title: 'Performance & Analytics Cookies',
      required: false,
      description: 'Help us measure aggregate page visits, crash reports, and app performance to improve user experience.',
    },
    {
      key: 'functional',
      title: 'Functional & Preference Cookies',
      required: false,
      description: 'Remember user settings like dark mode preference, language selection, and metric units (kg vs lbs).',
    },
    {
      key: 'marketing',
      title: 'Targeting & Marketing Cookies',
      required: false,
      description: 'Used by authorized partners to measure campaign effectiveness. FitTracker does not serve 3rd party ads.',
    },
  ];

  return (
    <PublicPageLayout
      title="Cookie Policy & Preferences"
      subtitle="Understand how we use cookies and local storage tokens to deliver a smooth, secure application experience."
      badge="Cookie Management"
      seoTitle="Cookie Policy & Preferences - FitTracker AI"
      seoDescription="Manage your cookie preferences and learn how FitTracker uses session cookies and local storage."
    >
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="p-8 rounded-3xl bg-gradient-to-r from-white/[0.03] via-[#14b8a6]/10 to-transparent border border-[#14b8a6]/30 space-y-4">
          <div className="flex items-center gap-3">
            <Cookie className="h-6 w-6 text-[#2dd4bf]" />
            <h2 className="text-2xl font-bold text-white">Manage Consent Preferences</h2>
          </div>
          <p className="text-white/70 text-sm leading-relaxed">
            Customize which cookie categories you permit during your sessions. Strictly necessary cookies remain active to preserve login security.
          </p>
        </div>

        <div className="space-y-4">
          {categories.map((cat) => {
            const key = cat.key as keyof typeof preferences;
            const isChecked = preferences[key];

            return (
              <div key={cat.key} className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-white">{cat.title}</h3>
                    {cat.required && (
                      <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-white/[0.08] text-white/60">
                        Always Active
                      </span>
                    )}
                  </div>
                  <p className="text-white/60 text-xs leading-relaxed max-w-xl">{cat.description}</p>
                </div>

                <button
                  type="button"
                  disabled={cat.required}
                  onClick={() => setPreferences({ ...preferences, [key]: !isChecked })}
                  className={`w-12 h-6 rounded-full transition-colors relative flex items-center p-1 self-start sm:self-center ${
                    isChecked ? 'bg-[#14b8a6]' : 'bg-white/10'
                  }`}
                >
                  <div className={`h-4 w-4 rounded-full bg-white transition-transform ${isChecked ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>
            );
          })}
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={handleSave} size="lg" className="bg-[#14b8a6] hover:bg-[#0d9488] text-white rounded-xl shadow-[0_0_20px_rgba(20,184,166,0.3)]">
            <Check className="h-4 w-4 mr-2" />
            Save Preferences
          </Button>
        </div>

      </div>
    </PublicPageLayout>
  );
};

export default Cookies;
