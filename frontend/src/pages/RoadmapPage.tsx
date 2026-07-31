import React from 'react';
import { motion } from 'framer-motion';
import { PublicPageLayout } from '@/components/layout/PublicPageLayout';
import { Sparkles, CheckCircle2, Clock, Zap, Cpu, Compass, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export const RoadmapPage: React.FC = () => {
  const roadmapItems = [
    {
      quarter: 'Q1 2026',
      title: 'AI Neural Core & Telemetry v2.0',
      status: 'Completed',
      statusColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      icon: CheckCircle2,
      description: 'Continuous biometric telemetry, real-time heart rate sync, and AI meal camera scanner integration.',
      features: ['Food Camera AI Vision Scanner', 'Continuous HRV & Cardiac Monitoring', 'Stripe & Lenis Smooth UX'],
    },
    {
      quarter: 'Q2 2026',
      title: 'Smartwatch Ecosystem & Hardware Sync',
      status: 'Completed',
      statusColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      icon: CheckCircle2,
      description: 'Direct bluetooth and cloud telemetry integration with Apple Watch Ultra, Wear OS, Garmin, and Fitbit.',
      features: ['Apple HealthKit & Google Health Connect Sync', 'Live Sleep & Step Telemetry', 'Automatic Exercise Set Detection'],
    },
    {
      quarter: 'Q3 2026',
      title: 'Predictive Health AI & Adaptive Music Engine',
      status: 'In Development',
      statusColor: 'bg-[#14b8a6]/20 text-[#2dd4bf] border-[#14b8a6]/40',
      icon: Zap,
      description: 'Biometric cadence-matching workout music player and predictive recovery injury prevention engine.',
      features: ['Spotify BPM Synchronization', 'AI Overtraining Alert Engine', 'Personalized Macro & Micronutrient Forecast'],
    },
    {
      quarter: 'Q4 2026',
      title: 'Enterprise Multi-User & Trainer Portal',
      status: 'Planned',
      statusColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
      icon: Compass,
      description: 'Unified management dashboard for certified personal trainers, gyms, and corporate wellness programs.',
      features: ['Client Telemetry Dashboard', 'Custom Branded PDF Reports', 'Team Leaderboards & Gamification'],
    },
  ];

  return (
    <PublicPageLayout
      title="Product Roadmap"
      subtitle="Discover what we're building to revolutionize health intelligence and AI-driven fitness coaching."
      badge="FitTracker Future Roadmap"
      seoTitle="Product Roadmap & AI Innovation"
      seoDescription="Explore the upcoming features, hardware integrations, and AI health models planned for FitTracker in 2026."
    >
      <div className="space-y-12">
        <div className="relative border-l-2 border-[#14b8a6]/30 ml-4 md:ml-8 space-y-12 pl-6 md:pl-10">
          {roadmapItems.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <motion.div
                key={item.quarter}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="relative group"
              >
                {/* Timeline Dot */}
                <div className="absolute -left-[31px] md:-left-[47px] top-1 h-7 w-7 rounded-full bg-[#020617] border-2 border-[#14b8a6] flex items-center justify-center text-[#2dd4bf] shadow-[0_0_15px_rgba(20,184,166,0.5)] group-hover:scale-110 transition-transform">
                  <IconComponent className="h-3.5 w-3.5" />
                </div>

                {/* Card Container */}
                <div className="p-6 md:p-8 rounded-3xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl shadow-xl hover:border-[#14b8a6]/40 transition-all duration-300 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-mono font-bold text-[#2dd4bf]">{item.quarter}</span>
                      <h3 className="text-xl font-extrabold text-white">{item.title}</h3>
                    </div>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${item.statusColor}`}>
                      {item.status}
                    </span>
                  </div>

                  <p className="text-sm text-white/70 leading-relaxed font-normal">
                    {item.description}
                  </p>

                  <div className="pt-3 border-t border-white/[0.06] flex flex-wrap gap-2">
                    {item.features.map((feat) => (
                      <span
                        key={feat}
                        className="px-3 py-1 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs font-medium text-white/80"
                      >
                        ✓ {feat}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Feature Request CTA Box */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-[#14b8a6]/15 via-teal-500/10 to-cyan-500/15 border border-[#14b8a6]/30 text-center space-y-4 shadow-2xl">
          <Rocket className="h-8 w-8 text-[#2dd4bf] mx-auto animate-bounce" />
          <h3 className="text-2xl font-extrabold text-white">Have a Feature Request?</h3>
          <p className="text-sm text-white/70 max-w-xl mx-auto">
            We build FitTracker based on athlete & user feedback. Share your suggestions directly with our engineering team.
          </p>
          <Button asChild size="lg" className="bg-[#14b8a6] hover:bg-[#0d9488] text-white rounded-xl shadow-[0_0_20px_rgba(20,184,166,0.4)]">
            <Link to="/contact">Submit Feature Idea</Link>
          </Button>
        </div>
      </div>
    </PublicPageLayout>
  );
};

export default RoadmapPage;
