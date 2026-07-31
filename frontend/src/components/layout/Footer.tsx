import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Activity, 
  Github, 
  Linkedin, 
  Twitter, 
  Instagram, 
  Mail, 
  Send, 
  Check, 
  Globe, 
  ChevronDown, 
  Sparkles, 
  ArrowRight,
  Sun,
  Moon,
  Heart
} from 'lucide-react';
import { toast } from 'sonner';

interface FooterProps {
  currentTheme?: string;
  onThemeToggle?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ currentTheme = 'dark', onThemeToggle }) => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English (US)');
  const [isLangOpen, setIsLangOpen] = useState(false);

  const languages = [
    { code: 'en', name: 'English (US)', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
  ];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubscribed(true);
      toast.success('Successfully subscribed to FitTracker updates!');
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 5000);
    }, 800);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const socialLinks = [
    { name: 'GitHub', icon: Github, href: 'https://github.com', ariaLabel: 'FitTracker on GitHub' },
    { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com', ariaLabel: 'FitTracker on LinkedIn' },
    { name: 'Twitter / X', icon: Twitter, href: 'https://twitter.com', ariaLabel: 'FitTracker on Twitter' },
    { name: 'Instagram', icon: Instagram, href: 'https://instagram.com', ariaLabel: 'FitTracker on Instagram' },
    { name: 'Email', icon: Mail, href: 'mailto:support@fittracker.ai', ariaLabel: 'Contact FitTracker Support via Email' },
  ];

  const productLinks = [
    { name: 'Features', href: '/features' },
    { name: 'Workout Planner', href: '/workouts', badge: 'AI' },
    { name: 'AI Nutrition', href: '/meals', badge: 'Popular' },
    { name: 'Calories Tracker', href: '/meals' },
    { name: 'Progress Analytics', href: '/progress' },
    { name: 'Meal Scanner', href: '/meals', badge: 'New' },
    { name: 'Health Reports', href: '/metrics' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Roadmap', href: '/roadmap' },
    { name: 'API', href: '/api-docs' },
    { name: 'Integrations', href: '/integrations' },
    { name: 'Changelog', href: '/changelog' },
  ];

  const resourceLinks = [
    { name: 'Help Center', href: '/help' },
    { name: 'Documentation', href: '/docs' },
    { name: 'Developer API', href: '/api-docs' },
    { name: 'Blog', href: '/blog' },
    { name: 'Community', href: '/community' },
    { name: 'Tutorials', href: '/tutorials' },
    { name: 'Release Notes', href: '/release-notes' },
    { name: 'FAQs', href: '/faqs' },
    { name: 'Support', href: '/support' },
    { name: 'Contact', href: '/contact' },
  ];

  const companyLinks = [
    { name: 'About', href: '/about' },
    { name: 'Our Mission', href: '/mission' },
    { name: 'Careers', href: '/careers', badge: 'Hiring' },
    { name: 'Press', href: '/press' },
    { name: 'Partners', href: '/partners' },
    { name: 'Security', href: '/security' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookie Policy', href: '/cookies' },
    { name: 'Accessibility', href: '/accessibility' },
  ];

  return (
    <footer 
      role="contentinfo" 
      aria-label="Site Footer"
      className="relative overflow-hidden bg-[#020617] text-white selection:bg-[#14b8a6]/30 selection:text-white border-t border-white/[0.08]"
    >
      {/* Subtle Background Glow Accent Gradients */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute -top-40 -left-40 h-[450px] w-[450px] rounded-full bg-[#14b8a6]/10 blur-[130px]" 
      />
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute bottom-0 right-0 h-[400px] w-[500px] rounded-full bg-[#0d9488]/10 blur-[140px]" 
      />

      {/* Modern Mesh Grid Overlay */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.05),rgba(255,255,255,0))]" 
      />

      <motion.div 
        className="container relative mx-auto px-4 pt-16 pb-12 sm:px-6 lg:px-8 max-w-7xl"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
      >
        {/* Top Section: 5-Column Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-16">
          
          {/* Column 1: Brand & Bio */}
          <motion.div variants={itemVariants} className="lg:col-span-1 space-y-5">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14b8a6] rounded-lg p-0.5 transition-all"
              aria-label="FitTracker Home"
            >
              <div className="relative flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-br from-[#14b8a6]/20 via-[#14b8a6]/10 to-transparent border border-[#14b8a6]/30 shadow-[0_0_15px_rgba(20,184,166,0.15)] group-hover:border-[#14b8a6]/60 transition-all duration-300">
                <Activity className="h-5 w-5 text-[#14b8a6] animate-pulse" />
                <span className="absolute inset-0 rounded-xl bg-[#14b8a6]/20 animate-ping opacity-25" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent group-hover:to-[#2dd4bf] transition-all">
                FitTracker
              </span>
            </Link>

            <p className="text-sm leading-relaxed text-white/65 font-normal">
              AI-powered health and fitness platform helping people build healthier lives through intelligent tracking, nutrition insights, workout planning, and personalized coaching.
            </p>

            {/* Social Icons with Micro-Interactions */}
            <div className="pt-2 flex items-center gap-2.5 flex-wrap">
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.ariaLabel}
                    whileHover={{ y: -4, rotate: 3, scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center justify-center h-9 w-9 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white/65 hover:text-[#2dd4bf] hover:bg-white/[0.08] hover:border-[#14b8a6]/40 hover:shadow-[0_0_12px_rgba(20,184,166,0.3)] transition-all duration-300 focus-visible:ring-2 focus-visible:ring-[#14b8a6]"
                  >
                    <IconComponent className="h-4 w-4" />
                  </motion.a>
                );
              })}
            </div>
          </motion.div>

          {/* Column 2: Product Links */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40">
              Product
            </h3>
            <nav aria-label="Product navigation">
              <ul className="space-y-2.5">
                {productLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="group inline-flex items-center text-sm text-white/65 hover:text-white transition-colors duration-200 focus-visible:ring-1 focus-visible:ring-[#14b8a6] rounded"
                    >
                      <motion.span 
                        className="inline-block transition-transform duration-200 group-hover:translate-x-1"
                      >
                        {link.name}
                      </motion.span>
                      {link.badge && (
                        <span className="ml-2 px-1.5 py-0.5 text-[10px] font-semibold rounded-md bg-[#14b8a6]/15 text-[#2dd4bf] border border-[#14b8a6]/30">
                          {link.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </motion.div>

          {/* Column 3: Resources Links */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40">
              Resources
            </h3>
            <nav aria-label="Resources navigation">
              <ul className="space-y-2.5">
                {resourceLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="group inline-flex items-center text-sm text-white/65 hover:text-white transition-colors duration-200 focus-visible:ring-1 focus-visible:ring-[#14b8a6] rounded"
                    >
                      <motion.span className="inline-block transition-transform duration-200 group-hover:translate-x-1">
                        {link.name}
                      </motion.span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </motion.div>

          {/* Column 4: Company Links */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40">
              Company
            </h3>
            <nav aria-label="Company navigation">
              <ul className="space-y-2.5">
                {companyLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="group inline-flex items-center text-sm text-white/65 hover:text-white transition-colors duration-200 focus-visible:ring-1 focus-visible:ring-[#14b8a6] rounded"
                    >
                      <motion.span className="inline-block transition-transform duration-200 group-hover:translate-x-1">
                        {link.name}
                      </motion.span>
                      {link.badge && (
                        <span className="ml-2 px-1.5 py-0.5 text-[10px] font-semibold rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          {link.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </motion.div>

          {/* Column 5: Newsletter Box */}
          <motion.div variants={itemVariants} className="lg:col-span-1 space-y-4">
            <div className="flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-[#14b8a6]" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40">
                Stay Updated
              </h3>
            </div>

            <p className="text-sm text-white/65 leading-relaxed">
              Join 50,000+ fitness enthusiasts receiving monthly product features, health AI insights & tips.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="relative group">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  aria-label="Email subscription input"
                  required
                  className="w-full h-11 px-4 pr-10 text-sm rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-white/40 focus:outline-none focus:border-[#14b8a6] focus:ring-2 focus:ring-[#14b8a6]/25 focus:bg-white/[0.06] shadow-[0_4px_20px_rgba(0,0,0,0.2)] transition-all duration-300"
                />
                <Mail className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40 group-focus-within:text-[#14b8a6] transition-colors" />
              </div>

              <motion.button
                type="submit"
                disabled={isSubmitting || isSubscribed}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="relative w-full h-11 rounded-xl bg-gradient-to-r from-[#14b8a6] to-[#0d9488] hover:from-[#2dd4bf] hover:to-[#14b8a6] text-white text-sm font-semibold shadow-[0_0_20px_rgba(20,184,166,0.3)] hover:shadow-[0_0_25px_rgba(45,212,191,0.5)] transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden border border-white/20 disabled:opacity-75 focus-visible:ring-2 focus-visible:ring-white"
              >
                {/* Micro Light Shimmer Effect */}
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000" />
                
                {isSubmitting ? (
                  <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                ) : isSubscribed ? (
                  <>
                    <Check className="h-4 w-4 text-white" />
                    <span>Subscribed!</span>
                  </>
                ) : (
                  <>
                    <span>Subscribe</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </motion.button>
            </form>

            <p className="text-[12px] text-white/45 flex items-center gap-1.5 pt-1">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#14b8a6]" />
              <span>No spam. Monthly product updates only.</span>
            </p>
          </motion.div>

        </div>

        {/* Horizontal Glass Divider */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/[0.12] to-transparent my-4" />

        {/* Bottom Section */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-white/60">
          
          {/* Left Side: Copyright & Credits */}
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
            <span>© 2026 FitTracker</span>
            <span className="hidden sm:inline text-white/20">•</span>
            <span className="inline-flex items-center gap-1.5">
              Made with <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500 animate-pulse" /> using AI
            </span>
          </div>

          {/* Right Side: Version, Status, Legal & Preferences */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            
            {/* Version Badge */}
            <span className="px-2 py-0.5 text-[11px] font-mono font-medium rounded-full bg-white/[0.05] border border-white/10 text-white/70">
              v2.1
            </span>

            {/* System Status Indicator */}
            <Link 
              to="/status" 
              className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium hover:bg-emerald-500/20 transition-all"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>System Status</span>
            </Link>

            <Link to="/privacy" className="hover:text-white transition-colors">
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-white transition-colors">
              Terms
            </Link>

            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] hover:border-white/20 text-white/70 hover:text-white text-xs transition-all focus-visible:ring-1 focus-visible:ring-[#14b8a6]"
                aria-expanded={isLangOpen}
                aria-label="Select language"
              >
                <Globe className="h-3.5 w-3.5 text-white/50" />
                <span>{selectedLanguage}</span>
                <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${isLangOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isLangOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 bottom-full mb-2 w-36 rounded-xl bg-[#07111f] border border-white/10 shadow-2xl backdrop-blur-xl p-1 z-50 overflow-hidden"
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setSelectedLanguage(lang.name);
                          setIsLangOpen(false);
                          toast.info(`Language set to ${lang.name}`);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-1.5 text-xs rounded-lg transition-colors ${
                          selectedLanguage === lang.name 
                            ? 'bg-[#14b8a6]/20 text-[#2dd4bf] font-medium' 
                            : 'text-white/70 hover:text-white hover:bg-white/[0.06]'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span>{lang.flag}</span>
                          <span>{lang.name}</span>
                        </span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Theme Toggle Button */}
            {onThemeToggle && (
              <button
                type="button"
                onClick={onThemeToggle}
                className="p-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] hover:border-white/20 text-white/70 hover:text-white transition-all focus-visible:ring-1 focus-visible:ring-[#14b8a6]"
                aria-label="Toggle Theme"
              >
                {currentTheme === 'dark' ? (
                  <Moon className="h-3.5 w-3.5 text-teal-400" />
                ) : (
                  <Sun className="h-3.5 w-3.5 text-amber-400" />
                )}
              </button>
            )}

          </div>

        </div>
      </motion.div>
    </footer>
  );
};
