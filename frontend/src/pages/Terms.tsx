import React from 'react';
import { PublicPageLayout } from '@/components/layout/PublicPageLayout';

export const Terms: React.FC = () => {
  const termsSections = [
    {
      title: '1. Agreement to Terms',
      content: 'By accessing or using FitTracker, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree, you may not use our services.',
    },
    {
      title: '2. Health Disclaimer',
      content: 'FitTracker provides AI-generated nutrition estimates, exercise tracking, and fitness recommendations for informational purposes only. FitTracker is not a medical provider or licensed healthcare entity. Always consult a physician before beginning any new exercise or dietary routine.',
    },
    {
      title: '3. User Accounts & Responsibilities',
      content: 'You must be at least 13 years old to use FitTracker. You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.',
    },
    {
      title: '4. Subscription Billing & Refunds',
      content: 'Certain premium AI features require a subscription. Subscriptions automatically renew unless canceled at least 24 hours before the renewal period. Refunds are handled in accordance with our 14-day money-back guarantee policy.',
    },
    {
      title: '5. Intellectual Property',
      content: 'All software, AI algorithms, visual interfaces, designs, and content on FitTracker are protected by copyright, trademark, and international IP laws. You retain ownership of your user data.',
    },
    {
      title: '6. Limitation of Liability',
      content: 'To the maximum extent permitted by law, FitTracker shall not be liable for any indirect, incidental, or consequential damages resulting from your use of the application.',
    },
    {
      title: '7. Governing Law & Dispute Resolution',
      content: 'These terms are governed by the laws of India. Any legal proceedings shall be submitted exclusively to courts located in Bengaluru, Karnataka.',
    },
  ];

  return (
    <PublicPageLayout
      title="Terms of Service"
      subtitle="Effective date: July 31, 2026. Legal terms governing your use of FitTracker."
      badge="Terms & Conditions"
      seoTitle="Terms of Service - FitTracker AI"
      seoDescription="Read the Terms of Service governing account creation, subscription billing, health disclaimers, and service usage at FitTracker."
    >
      <div className="max-w-4xl mx-auto space-y-8">
        {termsSections.map((sec, idx) => (
          <div key={idx} className="p-8 rounded-3xl bg-white/[0.02] border border-white/[0.06] space-y-3">
            <h2 className="text-xl font-bold text-white">{sec.title}</h2>
            <p className="text-white/70 text-sm leading-relaxed">{sec.content}</p>
          </div>
        ))}
      </div>
    </PublicPageLayout>
  );
};

export default Terms;
