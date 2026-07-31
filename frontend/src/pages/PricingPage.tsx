import React from 'react';
import { PublicPageLayout } from '@/components/layout/PublicPageLayout';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Sparkles, Camera, Bot, Watch, Zap, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PricingPage: React.FC = () => {
  const plans = [
    {
      name: 'Free Starter',
      tagline: 'Experience AI',
      price: '₹0',
      period: 'Forever free',
      description: 'Essential health logging & daily limited AI access for individuals.',
      aiFeatures: [
        { name: 'Food Camera AI Scanner', limit: '10 scans/day' },
        { name: 'AI Health Coach', limit: '20 chats/day' },
        { name: 'AI Workout Suggestions', limit: 'Basic' },
        { name: 'AI Nutrition Suggestions', limit: 'Basic' },
      ],
      unavailableFeatures: [
        'Smartwatch Hardware Sync',
        'Adaptive Workout Music Sync',
      ],
      features: [
        'Basic Health Dashboard',
        'Manual Workout Logger',
        'Nutrition & Water Tracker',
        'Community Forum Access',
      ],
      cta: 'Start Free',
      popular: false,
    },
    {
      name: 'Pro AI',
      tagline: 'Full AI Ecosystem',
      price: '₹499',
      period: 'per month (or ₹399/mo yearly)',
      description: 'Unrestricted AI, smartwatch hardware integration & continuous telemetry.',
      aiFeatures: [
        { name: 'Unlimited AI Health Coach', limit: 'UNLIMITED' },
        { name: 'Unlimited Food Camera AI', limit: 'UNLIMITED' },
        { name: 'Smartwatch Integration', limit: 'Apple, Galaxy, Wear OS, Garmin, Fitbit' },
      ],
      features: [
        'Adaptive Workout Music Sync',
        'Live Heart Rate, HRV & Sleep Sync',
        'Automatic Workout Detection',
        'AI Recovery Insights & Readiness',
        'AI Meal Planning & Macro Optimizer',
        'AI Weekly Predictive PDF Reports',
        'Advanced Analytics Dashboard',
        'Priority 24/7 Support',
        'Early Access to Experimental AI Features',
      ],
      cta: 'Start 14-Day Free Trial',
      popular: true,
    },
    {
      name: 'Enterprise',
      tagline: 'Gyms & Healthcare',
      price: 'Custom',
      period: 'volume pricing',
      description: 'For gyms, personal trainers, hospitals, and fitness organizations.',
      features: [
        'Everything in Pro AI',
        'Multi-User Gym Admin Dashboard',
        'Client Analytics & Telemetry',
        'REST API & Webhooks Access',
        'SAML SSO & Custom Branding',
        'HIPAA & SOC2 Compliance Export',
        'Dedicated Account Manager & SLA',
      ],
      cta: 'Contact Sales',
      popular: false,
    },
  ];

  return (
    <PublicPageLayout
      title="Transparent & Predictable Pricing"
      subtitle="Experience AI for free with daily limits, or unlock the full AI health ecosystem with Pro."
      badge="Pricing Plans"
      seoTitle="Pricing Plans - FitTracker AI"
      seoDescription="Explore FitTracker's free tier and Pro AI subscription plans for food camera AI, smartwatch integration, and cardiac telemetry."
    >
      <div className="space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((p, idx) => (
            <div
              key={idx}
              className={`p-8 rounded-3xl backdrop-blur-xl flex flex-col justify-between space-y-6 relative transition-all ${
                p.popular
                  ? 'bg-gradient-to-b from-[#14b8a6]/20 via-[#071728] to-transparent border-2 border-[#14b8a6] shadow-[0_0_40px_rgba(20,184,166,0.3)] md:-translate-y-3'
                  : 'bg-white/[0.02] border border-white/[0.06] hover:border-white/20'
              }`}
            >
              {p.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#14b8a6] to-[#0d9488] text-[10px] font-extrabold uppercase tracking-wider text-white shadow-lg flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  <span>FULL AI ECOSYSTEM</span>
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-white">{p.name}</h3>
                    <span className="text-[10px] font-mono text-[#2dd4bf] bg-[#14b8a6]/10 px-2 py-0.5 rounded border border-[#14b8a6]/20">
                      {p.tagline}
                    </span>
                  </div>
                  <p className="text-xs text-white/60 mt-1">{p.description}</p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-white">{p.price}</span>
                  <span className="text-xs text-white/50">{p.period}</span>
                </div>

                {/* AI Feature Limits */}
                {p.aiFeatures && (
                  <div className="space-y-2 pt-2 border-t border-white/[0.08]">
                    <div className="text-[11px] font-bold text-[#2dd4bf] uppercase tracking-wider">AI Capabilities:</div>
                    {p.aiFeatures.map((af, i) => (
                      <div key={i} className="flex items-center justify-between text-xs text-white/80 p-2 rounded-lg bg-white/[0.03] border border-white/[0.05]">
                        <span>{af.name}</span>
                        <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                          af.limit === 'UNLIMITED' ? 'bg-[#14b8a6] text-white' : 'bg-amber-400/10 text-amber-300'
                        }`}>
                          {af.limit}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Exclusions in Free */}
                {p.unavailableFeatures && (
                  <div className="space-y-2 pt-2 border-t border-white/[0.08]">
                    <div className="text-[11px] font-bold text-white/50 uppercase tracking-wider">Unavailable in Free:</div>
                    {p.unavailableFeatures.map((uf, i) => (
                      <div key={i} className="flex items-center justify-between text-xs text-white/40 p-2 rounded-lg bg-rose-950/10 border border-rose-500/10">
                        <div className="flex items-center gap-2">
                          <X className="h-4 w-4 text-rose-500/80 flex-shrink-0" />
                          <span className="line-through decoration-rose-500/40">{uf}</span>
                        </div>
                        <span className="text-[9px] font-mono text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20">
                          Pro Only
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="space-y-2 pt-2 border-t border-white/[0.08]">
                  <div className="text-[11px] font-bold text-white/70 uppercase tracking-wider">Included Features:</div>
                  {p.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-white/80">
                      <CheckCircle2 className="h-4 w-4 text-[#2dd4bf] flex-shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                asChild
                className={`w-full h-11 rounded-xl font-semibold transition-all ${
                  p.popular
                    ? 'bg-[#14b8a6] hover:bg-[#0d9488] text-white shadow-[0_0_20px_rgba(20,184,166,0.4)] hover:scale-105'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                <Link to={p.cta === 'Contact Sales' ? '/contact' : '/signup'}>{p.cta}</Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </PublicPageLayout>
  );
};

export default PricingPage;
