import React, { useState } from 'react';
import { PublicPageLayout } from '@/components/layout/PublicPageLayout';
import { Input } from '@/components/ui/input';
import { Search, Shield, Lock, FileText, CheckCircle2 } from 'lucide-react';

export const Privacy: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    {
      id: 'overview',
      title: '1. Overview & Commitment',
      content: `FitTracker ("we", "our", "us") respects your privacy and is committed to protecting your personal and health telemetry data. This Privacy Policy explains how we collect, use, store, and safeguard your information when you use the FitTracker application, website, and services.`,
    },
    {
      id: 'collection',
      title: '2. Information We Collect',
      content: `We collect information directly from you when you register, sync health devices, or log meals and workouts:
      - Account Information: Name, email address, password hash, profile avatar.
      - Health & Biometric Data: Calorie intake, workout logs, heart rate, sleep duration, weight, body measurements.
      - Device Data: IP address, browser type, device identifiers, app crash telemetry.`,
    },
    {
      id: 'usage',
      title: '3. How We Use Your Information',
      content: `Your data is used strictly to deliver and improve our AI coaching services:
      - Calculating custom daily calorie and macronutrient targets.
      - Generating personalized workout routines and rest recommendations.
      - Analyzing progress trends and health score telemetry.
      We DO NOT sell your personal or health data to third-party advertisers.`,
    },
    {
      id: 'third-party',
      title: '4. Third-Party Services & Integrations',
      content: `FitTracker integrates with trusted infrastructure providers (e.g., Firebase Authentication, Cloud Databases, Spotify SDK for workout audio). Data shared with these services is limited to necessary operation parameters and protected by strict data processor agreements.`,
    },
    {
      id: 'rights',
      title: '5. Your Rights (GDPR & CCPA)',
      content: `Under applicable privacy laws, you have full control over your data:
      - Right to Access & Export: Download your full data archive in JSON/CSV format anytime via Account Settings.
      - Right to Erasure: Permanently delete your account and all associated health records from our servers.
      - Right to Rectify: Update incorrect metrics or profile details anytime.`,
    },
    {
      id: 'contact',
      title: '6. Privacy Contact',
      content: `If you have questions about this Privacy Policy or wish to exercise your rights, please contact our Data Protection Officer at privacy@fittracker.ai.`,
    },
  ];

  const filteredSections = sections.filter(
    (s) =>
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PublicPageLayout
      title="Privacy Policy"
      subtitle="Last updated: July 31, 2026. Version 2.4. Clear, transparent data handling principles."
      badge="Legal & Privacy"
      seoTitle="Privacy Policy - FitTracker AI"
      seoDescription="FitTracker's Privacy Policy details data collection, encryption standards, user rights under GDPR, and data protection practices."
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Sticky Table of Contents Sidebar */}
        <div className="lg:col-span-4 sticky top-24 space-y-4">
          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-4">
            <div className="relative">
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search privacy policy..."
                className="pl-9 bg-white/[0.04] border-white/10 text-white text-xs"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/40" />
            </div>

            <nav aria-label="Table of contents" className="space-y-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-white/40 px-2">
                Table of Contents
              </span>
              {sections.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  onClick={() => setActiveSection(s.id)}
                  className={`block px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    activeSection === s.id
                      ? 'bg-[#14b8a6]/20 text-[#2dd4bf]'
                      : 'text-white/60 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  {s.title}
                </a>
              ))}
            </nav>
          </div>
        </div>

        {/* Policy Body */}
        <div className="lg:col-span-8 space-y-8">
          {filteredSections.map((sec) => (
            <div 
              key={sec.id} 
              id={sec.id} 
              className="p-8 rounded-3xl bg-white/[0.02] border border-white/[0.06] space-y-4 scroll-mt-28"
            >
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Shield className="h-5 w-5 text-[#2dd4bf]" />
                <span>{sec.title}</span>
              </h2>
              <div className="text-white/70 text-sm leading-relaxed whitespace-pre-line">
                {sec.content}
              </div>
            </div>
          ))}
        </div>

      </div>
    </PublicPageLayout>
  );
};

export default Privacy;
