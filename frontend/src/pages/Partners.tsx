import React, { useState } from 'react';
import { PublicPageLayout } from '@/components/layout/PublicPageLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Building2, 
  Cpu, 
  HeartHandshake, 
  Code, 
  CheckCircle2, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { toast } from 'sonner';

export const Partners: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [org, setOrg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const categories = [
    {
      title: 'Wearable & Hardware Integration',
      description: 'Sync seamless biometric streams with Apple Watch, Garmin, Fitbit, WHOOP, and Oura Ring.',
      icon: Cpu,
    },
    {
      title: 'Fitness Coaches & Gym Ecosystems',
      description: 'Empower personal trainers and boutique gym chains to track client workouts with white-label AI tools.',
      icon: HeartHandshake,
    },
    {
      title: 'Corporate Wellness Programs',
      description: 'Enterprise health plans for employee wellness, step challenges, and biometric health scoring.',
      icon: Building2,
    },
    {
      title: 'Developer API & HealthKit',
      description: 'Build custom health apps on top of FitTracker RESTful APIs and real-time webhook architecture.',
      icon: Code,
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) {
      toast.error('Please complete all required fields.');
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      toast.success('Partner application submitted! Our team will reach out within 24 hours.');
      setName('');
      setEmail('');
      setOrg('');
    }, 1000);
  };

  return (
    <PublicPageLayout
      title="Partner & Integration Ecosystem"
      subtitle="Join the network of health hardware, fitness studios, corporate wellness programs, and developers building on FitTracker."
      badge="Partnerships"
      seoTitle="Partners & Integrations - FitTracker AI"
      seoDescription="Explore partnership opportunities, wearable hardware integrations, and corporate wellness programs with FitTracker."
    >
      <div className="space-y-16 lg:space-y-24">
        
        {/* Partner Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((cat, idx) => {
            const IconComp = cat.icon;
            return (
              <div key={idx} className="p-8 rounded-3xl bg-white/[0.02] border border-white/[0.06] hover:border-[#14b8a6]/40 transition-all space-y-4">
                <div className="p-3.5 rounded-2xl bg-[#14b8a6]/10 border border-[#14b8a6]/20 text-[#2dd4bf] w-fit">
                  <IconComp className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-white">{cat.title}</h3>
                <p className="text-white/65 text-sm leading-relaxed">{cat.description}</p>
              </div>
            );
          })}
        </div>

        {/* Partner Benefits */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#14b8a6]/10 via-white/[0.03] to-transparent border border-[#14b8a6]/30 space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-semibold tracking-wider text-[#2dd4bf] uppercase">WHY PARTNER WITH US</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Partner Program Benefits</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {['Co-Marketing & Growth', 'Priority API Access', 'Dedicated Partner Support', 'White-Label Branding', 'Revenue Share Model', 'Security Compliance Audit'].map((b, i) => (
              <div key={i} className="flex items-center gap-2.5 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs font-medium text-white">
                <CheckCircle2 className="h-4 w-4 text-[#2dd4bf]" />
                <span>{b}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Become a Partner Form */}
        <div className="max-w-2xl mx-auto p-8 rounded-3xl bg-white/[0.02] border border-white/[0.08] space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-white">Become a FitTracker Partner</h2>
            <p className="text-white/60 text-sm">Fill out the details below to start the partnership conversation.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-white/70">Your Name *</label>
                <Input 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Sharma" 
                  required 
                  className="bg-white/[0.04] border-white/10 text-white"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-white/70">Work Email *</label>
                <Input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com" 
                  required 
                  className="bg-white/[0.04] border-white/10 text-white"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-white/70">Organization / Company Name</label>
              <Input 
                value={org}
                onChange={(e) => setOrg(e.target.value)}
                placeholder="Company or Gym Name" 
                className="bg-white/[0.04] border-white/10 text-white"
              />
            </div>

            <Button 
              type="submit" 
              disabled={submitting} 
              className="w-full h-11 bg-[#14b8a6] hover:bg-[#0d9488] text-white rounded-xl shadow-[0_0_20px_rgba(20,184,166,0.3)] font-semibold"
            >
              {submitting ? 'Submitting...' : 'Submit Application'}
            </Button>
          </form>
        </div>

      </div>
    </PublicPageLayout>
  );
};

export default Partners;
