import React from 'react';
import { PublicPageLayout } from '@/components/layout/PublicPageLayout';
import { 
  ShieldCheck, 
  Lock, 
  Key, 
  Database, 
  FileCheck, 
  Server, 
  Eye, 
  AlertTriangle,
  Mail,
  CheckCircle2
} from 'lucide-react';

export const Security: React.FC = () => {
  const securityFeatures = [
    {
      title: '256-bit AES Encryption',
      description: 'All biometric metrics, workout logs, and health records are encrypted at rest using AES-256 and in transit via TLS 1.3.',
      icon: Lock,
    },
    {
      title: 'OAuth 2.0 & Google Auth',
      description: 'Industry-standard authentication with Multi-Factor Authentication (MFA) support and encrypted token rotation.',
      icon: Key,
    },
    {
      title: 'HIPAA-Ready Architecture',
      description: 'Designed following strict health data isolation standards to prevent unauthorized access or biometric data leaks.',
      icon: FileCheck,
    },
    {
      title: 'GDPR & CCPA Compliant',
      description: 'You own 100% of your data. Export your entire history or request permanent deletion with a single click.',
      icon: Database,
    },
    {
      title: 'Role-Based Access Control',
      description: 'Strict internal access controls ensure engineers cannot view raw user biometric logs without explicit user consent.',
      icon: Eye,
    },
    {
      title: 'Immutable Audit Logging',
      description: 'All data access events and authentication requests are logged to immutable, tamper-evident security audit trails.',
      icon: Server,
    },
  ];

  return (
    <PublicPageLayout
      title="Enterprise-Grade Security & Trust"
      subtitle="How FitTracker protects your biometric, health, and personal data with bank-level encryption and strict isolation."
      badge="Security & Compliance"
      seoTitle="Security & Privacy Architecture - FitTracker AI"
      seoDescription="Learn how FitTracker implements 256-bit AES encryption, HIPAA-ready architecture, and GDPR compliance."
    >
      <div className="space-y-16 lg:space-y-24">
        
        {/* Security Overview Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {securityFeatures.map((sec, idx) => {
            const IconComp = sec.icon;
            return (
              <div key={idx} className="p-8 rounded-3xl bg-white/[0.02] border border-white/[0.06] hover:border-[#14b8a6]/40 transition-all space-y-4">
                <div className="p-3.5 rounded-2xl bg-[#14b8a6]/10 border border-[#14b8a6]/20 text-[#2dd4bf] w-fit">
                  <IconComp className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-white">{sec.title}</h3>
                <p className="text-white/65 text-sm leading-relaxed">{sec.description}</p>
              </div>
            );
          })}
        </div>

        {/* Responsible Disclosure Program */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-amber-500/10 via-white/[0.03] to-transparent border border-amber-500/30 space-y-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-6 w-6 text-amber-400" />
            <h2 className="text-2xl font-bold text-white">Responsible Vulnerability Disclosure</h2>
          </div>
          <p className="text-white/70 text-sm leading-relaxed max-w-3xl">
            We value security researchers and developers who help keep FitTracker safe. If you discover a security vulnerability or bug in our infrastructure, please report it to our security team immediately.
          </p>
          <div className="pt-2 flex items-center gap-3">
            <Mail className="h-4 w-4 text-[#2dd4bf]" />
            <a href="mailto:security@fittracker.ai" className="text-sm font-mono text-[#2dd4bf] underline hover:text-white">
              security@fittracker.ai
            </a>
          </div>
        </div>

      </div>
    </PublicPageLayout>
  );
};

export default Security;
