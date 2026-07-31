import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Activity, 
  Github, 
  Linkedin, 
  Twitter, 
  Instagram, 
  Mail, 
  Check, 
  Sparkles, 
  ArrowRight,
  ArrowUp
} from 'lucide-react';
import { toast } from 'sonner';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoveredLegal, setHoveredLegal] = useState<string | null>(null);

  // Mouse follow spotlight tracking for bottom bar
  const bottomBarRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHoveringBar, setIsHoveringBar] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!bottomBarRef.current) return;
    const rect = bottomBarRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

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

  // Scroll to Top utilizing Lenis if present or smooth native scroll
  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      const lenis = (window as any).lenis;
      if (lenis && typeof lenis.scrollTo === 'function') {
        lenis.scrollTo(0, { duration: 1.2 });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

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
    { name: 'API Docs', href: '/docs' },
    { name: 'Integrations', href: '/partners' },
    { name: 'Changelog', href: '/changelog' },
  ];

  const resourceLinks = [
    { name: 'Help Center', href: '/help' },
    { name: 'Documentation', href: '/docs' },
    { name: 'Blog', href: '/blog' },
    { name: 'Community', href: '/community' },
    { name: 'FAQs', href: '/help' },
    { name: 'Contact Us', href: '/contact' },
  ];

  const companyLinks = [
    { name: 'About', href: '/about' },
    { name: 'Our Mission', href: '/mission' },
    { name: 'Press', href: '/press' },
    { name: 'Partners', href: '/partners' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookie Policy', href: '/cookies' },
    { name: 'Accessibility', href: '/accessibility' },
  ];

  const legalLinks = [
    { name: 'Privacy', href: '/privacy' },
    { name: 'Terms', href: '/terms' },
    { name: 'Cookies', href: '/cookies' },
    { name: 'Accessibility', href: '/accessibility' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <footer 
      role="contentinfo" 
      aria-label="Site Footer"
      className="relative overflow-visible bg-[#020617] text-white selection:bg-[#14b8a6]/30 selection:text-white border-t border-white/[0.08]"
    >
      {/* Soft Teal Aurora Glow Background Accent */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute -top-40 -left-40 h-[450px] w-[450px] rounded-full bg-[#14b8a6]/10 blur-[130px]" 
      />
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute bottom-0 right-0 h-[400px] w-[500px] rounded-full bg-[#0d9488]/10 blur-[140px]" 
      />

      {/* Modern Radial Gradient & Mesh Grid Overlay */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(20,184,166,0.06),rgba(255,255,255,0))]" 
      />

      <motion.div 
        className="container relative mx-auto px-4 pt-16 pb-12 sm:px-6 lg:px-8 max-w-7xl overflow-visible"
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
                      <motion.span className="inline-block transition-transform duration-200 group-hover:translate-x-1">
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

        {/* Thin Gradient Top Divider */}
        <div className="relative mb-6 h-px w-full bg-gradient-to-r from-transparent via-[#14b8a6]/30 to-transparent" />

        {/* --------------------------------------------------------- */}
        {/* ULTRA-MINIMAL, ELEGANT BOTTOM LEGAL BAR                    */}
        {/* --------------------------------------------------------- */}
        <motion.div 
          ref={bottomBarRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHoveringBar(true)}
          onMouseLeave={() => setIsHoveringBar(false)}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative group rounded-2xl sm:rounded-3xl border border-white/[0.08] bg-[#030914]/80 backdrop-blur-2xl p-5 sm:p-6 shadow-[0_15px_40px_rgba(0,0,0,0.6),0_0_1px_rgba(255,255,255,0.1)] hover:border-[#14b8a6]/30 transition-all duration-500 overflow-visible z-20"
        >
          {/* Subtle Mouse-Follow Spotlight Lighting */}
          <div 
            className="pointer-events-none absolute -inset-px rounded-2xl sm:rounded-3xl transition-opacity duration-500"
            style={{
              opacity: isHoveringBar ? 1 : 0,
              background: `radial-gradient(450px circle at ${mousePos.x}px ${mousePos.y}px, rgba(20, 184, 166, 0.08), transparent 80%)`,
            }}
          />

          {/* Thin Glass Reflection Line */}
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8 text-xs font-normal">
            
            {/* LEFT: Copyright Notice */}
            <div className="flex items-center justify-center lg:justify-start gap-2.5 text-white/50 text-center lg:text-left whitespace-nowrap">
              <span className="font-medium text-white/70">© 2026 FitTracker. All rights reserved.</span>
            </div>

            {/* CENTER: Legal Links (Privacy, Terms, Cookies, Accessibility, Contact) */}
            <nav aria-label="Legal navigation" className="flex items-center justify-center gap-5 sm:gap-8 whitespace-nowrap">
              {legalLinks.map((link, index) => (
                <React.Fragment key={link.name}>
                  <div className="relative group/link py-1">
                    <Link
                      to={link.href}
                      onMouseEnter={() => setHoveredLegal(link.name)}
                      onMouseLeave={() => setHoveredLegal(null)}
                      className="relative inline-block text-white/65 hover:text-white transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#14b8a6] rounded"
                    >
                      <motion.span
                        whileHover={{ y: -2 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                        className="inline-block hover:bg-gradient-to-r hover:from-white hover:to-[#2dd4bf] hover:bg-clip-text hover:text-transparent font-medium"
                      >
                        {link.name}
                      </motion.span>

                      {/* Animated Teal Underline with Glow */}
                      {hoveredLegal === link.name && (
                        <motion.span
                          layoutId="legalUnderline"
                          initial={{ opacity: 0, scaleX: 0 }}
                          animate={{ opacity: 1, scaleX: 1 }}
                          exit={{ opacity: 0, scaleX: 0 }}
                          transition={{ duration: 0.2 }}
                          className="absolute -bottom-0.5 left-0 right-0 h-[1.5px] bg-gradient-to-r from-[#14b8a6] to-[#2dd4bf] rounded-full shadow-[0_0_8px_rgba(45,212,191,0.8)]"
                        />
                      )}
                    </Link>
                  </div>

                  {/* Animated Subtle Separator Dot */}
                  {index < legalLinks.length - 1 && (
                    <motion.span 
                      animate={{ opacity: [0.2, 0.6, 0.2] }} 
                      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }} 
                      className="h-1 w-1 rounded-full bg-[#14b8a6]/40 inline-block" 
                    />
                  )}
                </React.Fragment>
              ))}
            </nav>

            {/* FAR RIGHT: ONLY Back To Top Button (Unmodified) */}
            <div className="flex items-center justify-end">
              <motion.button
                onClick={scrollToTop}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.92 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                className="relative flex items-center justify-center h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-gradient-to-br from-white/10 via-white/[0.04] to-transparent border border-[#14b8a6]/40 hover:border-[#2dd4bf] backdrop-blur-xl text-white shadow-[0_0_15px_rgba(20,184,166,0.2)] hover:shadow-[0_0_25px_rgba(45,212,191,0.5)] transition-all duration-300 group/topbtn focus-visible:ring-2 focus-visible:ring-[#14b8a6]"
                aria-label="Scroll back to top"
              >
                <ArrowUp className="h-4 w-4 text-[#2dd4bf] group-hover/topbtn:-translate-y-0.5 transition-transform duration-200" />
                <span className="absolute inset-0 rounded-full bg-[#14b8a6]/20 animate-ping opacity-0 group-hover/topbtn:opacity-30 transition-opacity" />
              </motion.button>
            </div>

          </div>
        </motion.div>

      </motion.div>
    </footer>
  );
};

export default Footer;
