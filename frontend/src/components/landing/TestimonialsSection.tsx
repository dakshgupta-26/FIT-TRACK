import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { 
  Star, 
  Quote, 
  ShieldCheck, 
  Users, 
  Award, 
  Activity, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight,
  CheckCircle2
} from 'lucide-react';
import Lenis from 'lenis';

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  rating: number;
  review: string;
  avatarBg: string;
  initials: string;
  location?: string;
  isTrainer?: boolean;
  tag?: string;
}

export const TESTIMONIALS_DATA: TestimonialItem[] = [
  {
    id: 'ayush-jha',
    name: 'Ayush Jha',
    role: 'SOFTWARE ENGINEER',
    rating: 5,
    review: 'FitTracker completely changed how I manage my workouts. The AI recommendations are surprisingly accurate, and the dashboard keeps me motivated every single day.',
    avatarBg: 'from-teal-500 to-emerald-700',
    initials: 'AJ',
    location: 'Bengaluru, India',
    tag: 'Tech & Fitness',
  },
  {
    id: 'aryan-pawar',
    name: 'Aryan Pawar',
    role: 'COLLEGE STUDENT',
    rating: 5,
    review: 'I finally became consistent with my fitness routine. The calorie tracking, reminders, and progress insights make everything incredibly easy.',
    avatarBg: 'from-cyan-500 to-[#14b8a6]',
    initials: 'AP',
    location: 'Pune, India',
    tag: 'Consistency',
  },
  {
    id: 'jatin-mehra',
    name: 'Jatin Mehra',
    role: 'ENTREPRENEUR',
    rating: 5,
    review: "I've tried many fitness apps, but FitTracker feels different. The clean interface and intelligent suggestions make healthy living effortless.",
    avatarBg: 'from-emerald-400 to-teal-600',
    initials: 'JM',
    location: 'Delhi NCR, India',
    tag: 'Productivity',
  },
  {
    id: 'harshit-gupta',
    name: 'Harshit Gupta',
    role: 'CERTIFIED FITNESS TRAINER',
    rating: 5,
    review: 'I confidently recommend FitTracker to my clients. The AI workout plans, nutrition guidance, and progress analytics genuinely deliver measurable results.',
    avatarBg: 'from-amber-400 via-teal-500 to-emerald-600',
    initials: 'HG',
    location: 'Mumbai, India',
    isTrainer: true,
    tag: 'Verified Trainer',
  },
];

interface MousePosition {
  x: number;
  y: number;
}

// Single Testimonial Card with 3D Spotlight Tracking
const TestimonialCard: React.FC<{ testimonial: TestimonialItem; index: number }> = ({ testimonial, index }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState<MousePosition>({ x: -1000, y: -1000 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePos({ x: -1000, y: -1000 });
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="group relative flex flex-col justify-between h-full rounded-3xl bg-white/[0.03] border border-white/[0.08] p-7 md:p-8 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:shadow-[0_20px_40px_rgba(20,184,166,0.15)] hover:border-[#14b8a6]/40 transition-all duration-500 overflow-hidden"
    >
      {/* Dynamic Cursor Light Spotlight Reflection */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
        style={{
          background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(20,184,166,0.15), transparent 80%)`,
        }}
      />

      {/* Subtle Card Border Highlight Gradient */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#14b8a6]/30 to-transparent group-hover:via-[#2dd4bf]/70 transition-all duration-500" 
      />

      <div>
        {/* Top Header: Quote Icon & Rating */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-1.5">
            {[...Array(testimonial.rating)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 + i * 0.05 }}
              >
                <Star className="h-4 w-4 fill-[#14b8a6] text-[#2dd4bf] drop-shadow-[0_0_8px_rgba(45,212,191,0.6)] group-hover:scale-110 transition-transform duration-300" />
              </motion.div>
            ))}
          </div>

          <div className="flex items-center justify-center h-9 w-9 rounded-xl bg-[#14b8a6]/10 border border-[#14b8a6]/20 text-[#2dd4bf] group-hover:rotate-12 group-hover:scale-110 group-hover:bg-[#14b8a6]/20 transition-all duration-300">
            <Quote className="h-4 w-4 fill-current" />
          </div>
        </div>

        {/* Testimonial Review Text */}
        <blockquote className="text-white/85 text-base md:text-base leading-relaxed font-normal mb-8 group-hover:text-white transition-colors duration-300">
          "{testimonial.review}"
        </blockquote>
      </div>

      {/* Profile & Avatar Footer */}
      <div className="pt-5 border-t border-white/[0.08] flex items-center justify-between mt-auto">
        <div className="flex items-center gap-3.5">
          {/* Avatar Circle */}
          <div className="relative">
            <div className={`h-11 w-11 rounded-full bg-gradient-to-br ${testimonial.avatarBg} p-0.5 shadow-[0_0_15px_rgba(20,184,166,0.3)] flex items-center justify-center font-bold text-white text-sm tracking-wider group-hover:scale-105 transition-transform`}>
              <div className="h-full w-full rounded-full bg-[#020617]/40 backdrop-blur-sm flex items-center justify-center text-white font-semibold">
                {testimonial.initials}
              </div>
            </div>
            
            {/* Verified Badge */}
            <div 
              className="absolute -bottom-1 -right-1 flex items-center justify-center h-4 w-4 rounded-full bg-[#020617] text-[#2dd4bf] shadow-md border border-[#14b8a6]/50"
              title="Verified User"
            >
              <CheckCircle2 className="h-3.5 w-3.5 fill-[#14b8a6] text-[#020617]" />
            </div>
          </div>

          {/* Name & Role */}
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="text-sm font-semibold text-white group-hover:text-[#2dd4bf] transition-colors">
                {testimonial.name}
              </h4>
              {testimonial.isTrainer && (
                <span className="px-1.5 py-0.2 text-[9px] font-bold tracking-wide uppercase rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  PRO
                </span>
              )}
            </div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-white/50 group-hover:text-white/70 transition-colors">
              {testimonial.role}
            </p>
          </div>
        </div>

        {/* Location or Tag */}
        {testimonial.location && (
          <span className="hidden sm:inline-block text-[11px] font-mono text-white/40 bg-white/[0.04] px-2 py-1 rounded-md border border-white/[0.05]">
            {testimonial.location.split(',')[0]}
          </span>
        )}
      </div>
    </motion.div>
  );
};

export const TestimonialsSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const blobY1 = useTransform(scrollYProgress, [0, 1], [-40, 40]);
  const blobY2 = useTransform(scrollYProgress, [0, 1], [40, -40]);

  const trustMetrics = [
    { label: 'AVERAGE RATING', value: '4.9/5', sub: 'From 12,000+ reviews', icon: Star, color: 'text-amber-400' },
    { label: 'ACTIVE USERS', value: '50,000+', sub: 'Across India', icon: Users, color: 'text-[#2dd4bf]' },
    { label: 'SATISFACTION', value: '98%', sub: 'Verified members', icon: ShieldCheck, color: 'text-emerald-400' },
    { label: 'WORKOUTS COMPLETED', value: '500K+', sub: 'Tracked with AI', icon: Activity, color: 'text-teal-300' },
  ];

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % TESTIMONIALS_DATA.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + TESTIMONIALS_DATA.length) % TESTIMONIALS_DATA.length);
  };

  return (
    <section 
      id="testimonials"
      ref={containerRef}
      role="region" 
      aria-label="Community Testimonials"
      className="relative overflow-hidden bg-[#020617] pt-8 pb-20 lg:pt-12 lg:pb-28 selection:bg-[#14b8a6]/30 selection:text-white"
    >
      {/* Top Ambient Aurora Glow Transition */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-[320px] w-[750px] rounded-full bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(20,184,166,0.15),transparent_70%)] blur-[100px]" 
      />
      {/* Background Floating Blobs with Parallax Effect */}
      <motion.div 
        style={{ y: blobY1 }}
        aria-hidden="true" 
        className="pointer-events-none absolute top-1/4 -left-48 h-96 w-96 rounded-full bg-[#14b8a6]/15 blur-[140px]" 
      />
      <motion.div 
        style={{ y: blobY2 }}
        aria-hidden="true" 
        className="pointer-events-none absolute bottom-1/4 -right-48 h-[420px] w-[420px] rounded-full bg-[#0d9488]/15 blur-[150px]" 
      />

      {/* Layered Subtle Mesh Grid Background */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(20,184,166,0.04)_0,transparent_70%)]" 
      />

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#14b8a6]/10 border border-[#14b8a6]/25 text-[#2dd4bf] text-xs font-semibold tracking-wider uppercase shadow-[0_0_15px_rgba(20,184,166,0.2)]"
          >
            <Sparkles className="h-3.5 w-3.5 text-[#2dd4bf] animate-pulse" />
            <span>Community Stories</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-white via-white/95 to-white/70 bg-clip-text text-transparent"
          >
            What Our Community Says
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-base sm:text-lg text-white/65 leading-relaxed max-w-2xl mx-auto font-normal"
          >
            Thousands of people across India trust FitTracker every day to achieve healthier lifestyles, smarter nutrition, and consistent fitness progress.
          </motion.p>
        </div>

        {/* Trust Elements Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-16 p-4 md:p-6 rounded-3xl bg-white/[0.02] border border-white/[0.08] backdrop-blur-xl shadow-2xl"
        >
          {trustMetrics.map((metric, idx) => {
            const IconComp = metric.icon;
            return (
              <div 
                key={idx} 
                className="flex items-center gap-4 p-3 md:p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04] hover:border-[#14b8a6]/30 transition-all duration-300"
              >
                <div className={`p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] ${metric.color}`}>
                  <IconComp className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                    {metric.value}
                  </div>
                  <div className="text-[11px] font-semibold tracking-wider text-white/50 uppercase">
                    {metric.label}
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* Desktop & Tablet Layout: 4 Columns Responsive Grid */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-6">
          {TESTIMONIALS_DATA.map((testimonial, index) => (
            <TestimonialCard 
              key={testimonial.id} 
              testimonial={testimonial} 
              index={index} 
            />
          ))}
        </div>

        {/* Mobile Layout: Responsive Interactive Carousel */}
        <div className="md:hidden space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={TESTIMONIALS_DATA[activeIndex].id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <TestimonialCard 
                testimonial={TESTIMONIALS_DATA[activeIndex]} 
                index={0} 
              />
            </motion.div>
          </AnimatePresence>

          {/* Carousel Controls */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-1.5">
              {TESTIMONIALS_DATA.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  aria-label={`Go to testimonial slide ${idx + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    activeIndex === idx 
                      ? 'w-7 bg-[#14b8a6]' 
                      : 'w-2 bg-white/20 hover:bg-white/40'
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                aria-label="Previous Testimonial"
                className="p-2.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-white/70 hover:text-white hover:border-[#14b8a6] transition-all"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={handleNext}
                aria-label="Next Testimonial"
                className="p-2.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-white/70 hover:text-white hover:border-[#14b8a6] transition-all"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
