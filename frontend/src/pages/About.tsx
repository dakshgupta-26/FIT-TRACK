import React from 'react';
import { motion } from 'framer-motion';
import { PublicPageLayout } from '@/components/layout/PublicPageLayout';
import { 
  Users, 
  Globe, 
  Activity, 
  Utensils, 
  ShieldCheck, 
  Sparkles, 
  Heart, 
  Cpu, 
  Target, 
  Award,
  CheckCircle2
} from 'lucide-react';

export const About: React.FC = () => {
  const stats = [
    { label: 'ACTIVE USERS', value: '50,000+', icon: Users, color: 'text-[#2dd4bf]' },
    { label: 'COUNTRIES REACHED', value: '15+', icon: Globe, color: 'text-cyan-400' },
    { label: 'WORKOUTS LOGGED', value: '500,000+', icon: Activity, color: 'text-[#14b8a6]' },
    { label: 'MEALS TRACKED', value: '1,200,000+', icon: Utensils, color: 'text-emerald-400' },
  ];

  const values = [
    {
      title: 'Health First',
      description: 'We build technology that puts physiological well-being and long-term vitality before quick fixes or temporary trends.',
      icon: Heart,
    },
    {
      title: 'Data-Driven Precision',
      description: 'Our AI recommendations are powered by evidence-based nutrition science and biomechanics data.',
      icon: Cpu,
    },
    {
      title: 'Radical Accessibility',
      description: 'Health tools should be intuitive, accessible, and empowering for everyone regardless of fitness experience.',
      icon: Target,
    },
    {
      title: 'Uncompromising Privacy',
      description: 'Your biometric and health data remains 100% encrypted, private, and owned exclusively by you.',
      icon: ShieldCheck,
    },
  ];

  const timeline = [
    { year: '2024', title: 'FitTracker Founded', description: 'Started by engineers and sports scientists in India to bring AI precision to daily health.' },
    { year: '2025', title: 'AI Meal Scanner Launch', description: 'Introduced camera-based computer vision food recognition with 99% calorie accuracy.' },
    { year: '2026', title: '50,000 Active Members', description: 'Expanded across 15+ countries with enterprise security, cardiac telemetry, and custom AI workout plans.' },
  ];

  return (
    <PublicPageLayout
      title="Empowering Humanity Through Intelligent Health"
      subtitle="FitTracker is an AI-powered fitness and nutrition platform dedicated to helping millions build consistent, science-backed habits."
      badge="About FitTracker"
      seoTitle="About Us - FitTracker AI Health & Fitness"
      seoDescription="Learn about FitTracker's mission, story, technology stack, and values in building the future of personal health AI."
    >
      <div className="space-y-16 lg:space-y-24">
        
        {/* Key Statistics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, idx) => {
            const IconComp = stat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl space-y-2 text-center"
              >
                <IconComp className={`h-6 w-6 mx-auto ${stat.color}`} />
                <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {stat.value}
                </div>
                <div className="text-[11px] font-semibold tracking-wider text-white/50 uppercase">
                  {stat.label}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Company Story & Mission */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <span className="text-xs font-semibold tracking-wider text-[#2dd4bf] uppercase">OUR STORY</span>
            <h2 className="text-3xl font-bold text-white tracking-tight">
              Built for people who want results, not complexity.
            </h2>
            <p className="text-white/70 leading-relaxed text-sm sm:text-base">
              FitTracker was created in 2024 to solve a fundamental problem: most fitness apps are either bloated with manual input fields or rely on generic cookie-cutter templates.
            </p>
            <p className="text-white/70 leading-relaxed text-sm sm:text-base">
              We combined advanced machine learning, nutrition databases, and biometric tracking into a clean, dark-themed platform that adapts dynamically to your lifestyle, rest levels, and progress.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-gradient-to-br from-[#14b8a6]/10 via-white/[0.03] to-transparent border border-[#14b8a6]/30 space-y-4 shadow-2xl">
            <Sparkles className="h-8 w-8 text-[#2dd4bf]" />
            <h3 className="text-xl font-bold text-white">Our AI Philosophy</h3>
            <p className="text-white/70 text-sm leading-relaxed">
              We view AI as an empowering assistant rather than a replacement for personal initiative. FitTracker evaluates your sleep quality, recovery status, and meal logs to suggest realistic, achievable daily recommendations.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs font-mono text-[#2dd4bf]">
              <CheckCircle2 className="h-4 w-4" />
              <span>100% Privacy-Preserving Neural Models</span>
            </div>
          </div>
        </div>

        {/* Core Values */}
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Our Core Principles</h2>
            <p className="text-white/60 text-sm">The foundational values guiding product design, security, and engineering at FitTracker.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => {
              const IconComponent = v.icon;
              return (
                <div key={i} className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-[#14b8a6]/40 transition-all space-y-3">
                  <div className="p-3 rounded-xl bg-[#14b8a6]/10 border border-[#14b8a6]/20 text-[#2dd4bf] w-fit">
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white">{v.title}</h3>
                  <p className="text-xs text-white/60 leading-relaxed">{v.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Company Timeline */}
        <div className="space-y-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center">Journey & Milestones</h2>
          
          <div className="max-w-3xl mx-auto space-y-6">
            {timeline.map((item, idx) => (
              <div key={idx} className="flex gap-4 items-start p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                <span className="px-3 py-1 rounded-lg bg-[#14b8a6]/20 text-[#2dd4bf] font-mono text-sm font-bold">
                  {item.year}
                </span>
                <div>
                  <h3 className="text-lg font-bold text-white">{item.title}</h3>
                  <p className="text-sm text-white/65 mt-1">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </PublicPageLayout>
  );
};

export default About;
