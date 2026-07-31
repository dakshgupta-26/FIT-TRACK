import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import { Footer } from '@/components/layout/Footer';
import { TestimonialsSection } from '@/components/landing/TestimonialsSection';
import { InteractiveFeaturesShowcase } from '@/components/landing/InteractiveFeaturesShowcase';
import { KeynoteHeroSection } from '@/components/landing/KeynoteHeroSection';
import { KeynoteCtaSection } from '@/components/landing/KeynoteCtaSection';
import { PricingPreviewSection } from '@/components/landing/PricingPreviewSection';

const LandingPage = () => {
  const location = useLocation();

  // Single Root Lenis Smooth Scroll Instance (Bound strictly to document window)
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });

    (window as any).lenis = lenis;

    let animationFrameId: number;

    function raf(time: number) {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    }

    animationFrameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animationFrameId);
      delete (window as any).lenis;
      lenis.destroy();
    };
  }, []);

  // Smooth scroll hash / state handler
  useEffect(() => {
    const scrollToId = (location.state as any)?.scrollTo || location.hash?.replace('#', '');
    if (scrollToId) {
      const timer = setTimeout(() => {
        const el = document.getElementById(scrollToId);
        if (el) {
          if ((window as any).lenis) {
            (window as any).lenis.scrollTo(el, { offset: -90, duration: 1.2 });
          } else {
            const yOffset = -90;
            const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
          }
        }
      }, 250);

      return () => clearTimeout(timer);
    }
  }, [location]);

  return (
    <div className="bg-[#020617] text-white selection:bg-[#14b8a6]/30 selection:text-white">
      {/* Keynote Apple-style Hero Section & Glass Header */}
      <KeynoteHeroSection />

      {/* Features Section */}
      <InteractiveFeaturesShowcase />

      {/* Community / Testimonials Section */}
      <TestimonialsSection />

      {/* Pricing Preview Section (Stripe/Linear Inspired) */}
      <PricingPreviewSection />

      {/* High-End Keynote CTA Section */}
      <KeynoteCtaSection />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;