import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Activity, Menu, X, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';

export const Navbar: React.FC = () => {
  const { t } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('hero');
  const location = useLocation();
  const navigate = useNavigate();

  // Scroll detection & Section Active Tracker
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      if (location.pathname === '/') {
        const sections = ['hero', 'features', 'testimonials', 'pricing', 'faq'];
        const scrollPosition = window.scrollY + 200;

        for (const sectionId of sections) {
          const el = document.getElementById(sectionId);
          if (el) {
            const top = el.offsetTop;
            const height = el.offsetHeight;
            if (scrollPosition >= top && scrollPosition < top + height) {
              setActiveSection(sectionId);
              break;
            }
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  const scrollToSection = (targetId: string) => {
    const element = document.getElementById(targetId);
    if (element) {
      if ((window as any).lenis) {
        (window as any).lenis.scrollTo(element, { offset: -90, duration: 1.2 });
      } else {
        const yOffset = -90;
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
      setActiveSection(targetId);
    }
  };

  const handleNavClick = (e: React.MouseEvent, item: { labelKey: string; defaultLabel: string; targetId: string; path?: string }) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    if (item.path && item.path !== '/') {
      navigate(item.path);
      return;
    }

    if (location.pathname === '/') {
      scrollToSection(item.targetId);
    } else {
      navigate('/', { state: { scrollTo: item.targetId } });
    }
  };

  const navItems = [
    { labelKey: 'nav.features', defaultLabel: 'Features', targetId: 'features' },
    { labelKey: 'nav.pricing', defaultLabel: 'Pricing', targetId: 'pricing' },
    { labelKey: 'nav.community', defaultLabel: 'Community', targetId: 'testimonials' },
    { labelKey: 'nav.faq', defaultLabel: 'FAQ', targetId: 'faq' },
    { labelKey: 'nav.roadmap', defaultLabel: 'Roadmap', targetId: 'roadmap', path: '/roadmap' },
  ];

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-4 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 pointer-events-none"
    >
      <nav
        aria-label="Global Navigation"
        className={`pointer-events-auto mx-auto max-w-6xl transition-all duration-300 rounded-full flex items-center justify-between px-4 sm:px-6 ${
          isScrolled
            ? 'py-2 bg-[#020617]/90 dark:bg-[#020617]/90 backdrop-blur-2xl border border-[#14b8a6]/30 shadow-[0_20px_50px_rgba(20,184,166,0.15)]'
            : 'py-3 bg-[#020617]/70 dark:bg-[#020617]/70 backdrop-blur-xl border border-white/15 shadow-[0_10px_35px_rgba(0,0,0,0.5)]'
        }`}
      >
        {/* LEFT: FitTracker Logo */}
        <Link 
          to="/" 
          onClick={(e) => {
            if (location.pathname === '/') {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
              setActiveSection('hero');
            }
          }}
          className="flex items-center gap-2.5 group"
        >
          <div className="h-9 w-9 rounded-xl bg-[#14b8a6]/20 border border-[#14b8a6]/40 flex items-center justify-center text-[#2dd4bf] shadow-[0_0_15px_rgba(20,184,166,0.3)] group-hover:scale-105 transition-transform duration-200">
            <Activity className="h-4 w-4 animate-pulse" />
          </div>
          <span className="text-lg font-extrabold tracking-tight text-white group-hover:text-[#2dd4bf] transition-colors duration-200">
            FitTracker
          </span>
        </Link>

        {/* CENTER: Desktop Navigation Items */}
        <div className="hidden md:flex items-center gap-1 bg-white/[0.03] border border-white/[0.08] p-1 rounded-full backdrop-blur-md">
          {navItems.map((item) => {
            const isActive = location.pathname === '/' && activeSection === item.targetId;
            return (
              <a
                key={item.labelKey}
                href={item.path || `#${item.targetId}`}
                onClick={(e) => handleNavClick(e, item)}
                className={`relative px-4 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 ${
                  isActive
                    ? 'text-white'
                    : 'text-white/70 hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavPill"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-[#14b8a6]/30 to-[#2dd4bf]/20 border border-[#14b8a6]/50 shadow-[0_0_15px_rgba(20,184,166,0.3)] z-0"
                  />
                )}
                <span className="relative z-10">{t(item.labelKey, item.defaultLabel)}</span>
              </a>
            );
          })}
        </div>

        {/* RIGHT: Desktop Auth Actions */}
        <div className="hidden md:flex items-center gap-3">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-xs font-semibold text-white/80 hover:text-white hover:bg-white/10 rounded-full px-4"
          >
            <Link to="/login">{t('nav.sign_in', 'Sign In')}</Link>
          </Button>

          <Button
            asChild
            size="sm"
            className="h-9 px-5 bg-gradient-to-r from-[#14b8a6] to-[#0d9488] hover:from-[#0d9488] hover:to-[#0f766e] text-white text-xs font-bold rounded-full shadow-[0_0_20px_rgba(20,184,166,0.35)] transition-all hover:scale-105 group"
          >
            <Link to="/signup" className="flex items-center gap-1.5">
              <span>{t('nav.get_started', 'Start Free')}</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </Button>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl bg-white/[0.06] border border-white/10 text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* MOBILE GLASSMORPHISM SLIDE-OUT DRAWER */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-auto mx-auto mt-2 max-w-6xl rounded-3xl bg-[#030914]/95 border border-white/10 p-5 shadow-2xl backdrop-blur-2xl md:hidden"
          >
            <div className="flex flex-col gap-3">
              {navItems.map((item) => (
                <a
                  key={item.labelKey}
                  href={item.path || `#${item.targetId}`}
                  onClick={(e) => handleNavClick(e, item)}
                  className="px-4 py-2.5 text-sm font-medium text-white/80 hover:text-white hover:bg-white/[0.06] rounded-xl transition-colors"
                >
                  {t(item.labelKey, item.defaultLabel)}
                </a>
              ))}
              <div className="h-px w-full bg-white/10 my-1" />
              <div className="flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 text-center text-sm font-semibold text-white/90 hover:text-white bg-white/[0.04] rounded-xl border border-white/10"
                >
                  {t('nav.sign_in', 'Sign In')}
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 text-center text-sm font-bold text-white bg-gradient-to-r from-[#14b8a6] to-[#0d9488] rounded-xl shadow-lg"
                >
                  {t('nav.get_started', 'Start Free')}
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;
