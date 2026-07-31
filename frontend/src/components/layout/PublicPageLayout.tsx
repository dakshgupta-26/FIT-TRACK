import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Footer } from '@/components/layout/Footer';
import { Navbar } from '@/components/layout/Navbar';

interface PublicPageLayoutProps {
  title: string;
  subtitle: string;
  badge?: string;
  seoTitle?: string;
  seoDescription?: string;
  children: React.ReactNode;
  showCta?: boolean;
}

export const PublicPageLayout: React.FC<PublicPageLayoutProps> = ({
  title,
  subtitle,
  badge = 'FitTracker Legal & Company',
  seoTitle,
  seoDescription,
  children,
  showCta = true,
}) => {
  // Update document title and meta description dynamically
  useEffect(() => {
    document.title = seoTitle ? `${seoTitle} | FitTracker AI` : `${title} | FitTracker AI Health & Fitness`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', seoDescription || subtitle);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = seoDescription || subtitle;
      document.head.appendChild(meta);
    }
  }, [title, subtitle, seoTitle, seoDescription]);

  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col selection:bg-[#14b8a6]/30 selection:text-white pt-16">
      {/* Global Floating Glassmorphism Navbar */}
      <Navbar />

      {/* Hero Header */}
      <section className="relative overflow-hidden pt-16 pb-16 border-b border-white/[0.06]">
        {/* Background Gradients */}
        <div aria-hidden="true" className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-96 w-[800px] rounded-full bg-gradient-to-tr from-[#14b8a6]/15 via-teal-500/10 to-cyan-500/10 blur-[130px]" />
        
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#14b8a6]/10 border border-[#14b8a6]/25 text-[#2dd4bf] text-xs font-semibold tracking-wider uppercase"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>{badge}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white"
          >
            {title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base sm:text-lg text-white/65 max-w-2xl mx-auto leading-relaxed font-normal"
          >
            {subtitle}
          </motion.p>
        </div>
      </section>

      {/* Main Page Content */}
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl py-12 lg:py-16">
        {children}
      </main>

      {/* Optional Shared CTA Section */}
      {showCta && (
        <section className="py-16 border-t border-white/[0.06] bg-gradient-to-b from-transparent to-white/[0.01]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center space-y-6">
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Ready to elevate your health journey?
            </h2>
            <p className="text-white/65 max-w-xl mx-auto text-sm sm:text-base">
              Join over 50,000 users building healthier daily habits with AI-powered guidance on FitTracker.
            </p>
            <div className="flex items-center justify-center gap-4 pt-2">
              <Button asChild size="lg" className="bg-[#14b8a6] hover:bg-[#0d9488] text-white px-8 rounded-xl shadow-[0_0_25px_rgba(20,184,166,0.3)]">
                <Link to="/signup" className="flex items-center gap-2">
                  <span>Start Free Trial</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/[0.06] rounded-xl">
                <Link to="/features">Explore Features</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Global Premium Footer */}
      <Footer />
    </div>
  );
};
