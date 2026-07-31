import React from 'react';
import { motion } from 'framer-motion';
import { PublicPageLayout } from '@/components/layout/PublicPageLayout';
import { 
  Target, 
  Heart, 
  Sparkles, 
  Globe, 
  CheckCircle2, 
  Compass, 
  ShieldCheck,
  TrendingUp
} from 'lucide-react';

export const Mission: React.FC = () => {
  const pillars = [
    {
      title: 'Healthy Living as a Right',
      description: 'We believe clean health guidance, calorie insights, and physical training should be available to everyone without expensive personal trainer retainers.',
      icon: Heart,
    },
    {
      title: 'Intelligent AI Assistance',
      description: 'Leveraging modern AI to convert raw physiological signals into actionable daily advice for sleep, workouts, and nutrition.',
      icon: Sparkles,
    },
    {
      title: 'Universal Accessibility',
      description: 'Designing intuitive, high-contrast dark interfaces that cater to athletes, beginners, and users of all accessibility levels.',
      icon: Globe,
    },
    {
      title: 'Long-Term Consistency',
      description: 'Fostering sustainable life habits over extreme short-term diets through positive reinforcement and gamified achievements.',
      icon: TrendingUp,
    },
  ];

  return (
    <PublicPageLayout
      title="Our Mission & Future Vision"
      subtitle="To democratize elite personal coaching, intelligent nutrition tracking, and health analytics for everyone across the globe."
      badge="Mission & Vision"
      seoTitle="Our Mission - FitTracker AI Health Platform"
      seoDescription="Discover FitTracker's core mission to make health tracking, fitness coaching, and AI nutrition accessible to all."
    >
      <div className="space-y-16 lg:space-y-20">
        
        {/* Main Mission Statement Banner */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#14b8a6]/15 via-white/[0.03] to-cyan-500/10 border border-[#14b8a6]/30 text-center space-y-6 shadow-2xl">
          <Compass className="h-12 w-12 text-[#2dd4bf] mx-auto animate-pulse" />
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight max-w-3xl mx-auto">
            "To empower 10 Million people across India and worldwide to achieve optimal physical and mental vitality by 2030."
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto text-base">
            We are building the world's most intuitive health operating system—one that learns from your daily habits and grows with you.
          </p>
        </div>

        {/* Core Pillars */}
        <div className="space-y-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center">The Pillars of Our Mission</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pillars.map((pillar, idx) => {
              const IconComp = pillar.icon;
              return (
                <div key={idx} className="p-6 sm:p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-[#14b8a6]/40 transition-all space-y-4">
                  <div className="p-3 rounded-xl bg-[#14b8a6]/10 border border-[#14b8a6]/20 text-[#2dd4bf] w-fit">
                    <IconComp className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white">{pillar.title}</h3>
                  <p className="text-white/65 text-sm leading-relaxed">{pillar.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Future Vision Section */}
        <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/[0.08] space-y-6">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-6 w-6 text-[#2dd4bf]" />
            <h2 className="text-2xl font-bold text-white">Our Vision for 2030</h2>
          </div>
          <p className="text-white/70 text-sm sm:text-base leading-relaxed">
            By combining continuous wearable telemetry, AI computer vision for food logging, and personalized biometric coaching, FitTracker is building an ecosystem where preventive health care is effortless.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs font-mono text-[#2dd4bf]">
            <div className="flex items-center gap-2 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <CheckCircle2 className="h-4 w-4 text-[#14b8a6]" />
              <span>Real-Time Biomarker AI</span>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <CheckCircle2 className="h-4 w-4 text-[#14b8a6]" />
              <span>Zero Manual Data Entry</span>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <CheckCircle2 className="h-4 w-4 text-[#14b8a6]" />
              <span>Global Fitness Equity</span>
            </div>
          </div>
        </div>

      </div>
    </PublicPageLayout>
  );
};

export default Mission;
