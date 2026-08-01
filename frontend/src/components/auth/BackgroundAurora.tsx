import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export const BackgroundAurora: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Create particles for canvas
    const particleCount = Math.min(Math.floor((width * height) / 16000), 75);
    const particles: Array<{
      x: number;
      y: number;
      radius: number;
      vx: number;
      vy: number;
      alpha: number;
      maxAlpha: number;
      pulseSpeed: number;
    }> = [];

    for (let i = 0; i < particleCount; i++) {
      const maxAlpha = 0.25 + Math.random() * 0.5;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: 1 + Math.random() * 2.8,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        alpha: Math.random() * maxAlpha,
        maxAlpha,
        pulseSpeed: 0.004 + Math.random() * 0.012,
      });
    }

    let pulseStep = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      pulseStep += 0.01;

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        p.alpha = Math.sin(pulseStep * p.pulseSpeed * 10) * 0.25 + (p.maxAlpha - 0.1);
        if (p.alpha < 0.08) p.alpha = 0.08;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(45, 212, 191, ${p.alpha})`;
        ctx.shadowBlur = 14;
        ctx.shadowColor = 'rgba(20, 184, 166, 0.9)';
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden bg-[#04060a] z-0 select-none">
      {/* Aurora Ambient Gradient Mesh */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="absolute inset-0"
      >
        {/* Radial Light 1: Top Left Teal/Emerald */}
        <div
          className="absolute -top-40 -left-40 w-[650px] h-[650px] rounded-full blur-[140px] opacity-40 animate-pulse"
          style={{
            background: 'radial-gradient(circle, rgba(13,148,136,0.85) 0%, rgba(16,185,129,0.45) 50%, rgba(0,0,0,0) 100%)',
            animationDuration: '7s',
          }}
        />

        {/* Radial Light 2: Bottom Right Cyan/Teal Glow */}
        <div
          className="absolute -bottom-44 -right-28 w-[700px] h-[700px] rounded-full blur-[150px] opacity-35"
          style={{
            background: 'radial-gradient(circle, rgba(6,182,212,0.75) 0%, rgba(15,118,110,0.5) 55%, rgba(0,0,0,0) 100%)',
          }}
        />

        {/* Radial Light 3: Center Soft Volumetric Lighting */}
        <div
          className="absolute top-1/4 left-1/3 w-[500px] h-[500px] rounded-full blur-[130px] opacity-30"
          style={{
            background: 'radial-gradient(circle, rgba(45,212,191,0.65) 0%, rgba(56,189,248,0.3) 65%, rgba(0,0,0,0) 100%)',
          }}
        />

        {/* Moving Teal Light Spotlight Blob */}
        <motion.div
          animate={{
            x: [0, 40, -30, 0],
            y: [0, -30, 40, 0],
            scale: [1, 1.15, 0.95, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[160px] opacity-25"
          style={{
            background: 'radial-gradient(circle, rgba(20,184,166,0.8) 0%, rgba(3,105,161,0.4) 60%, rgba(0,0,0,0) 100%)',
          }}
        />
      </motion.div>

      {/* Particle Canvas Layer */}
      <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full" />

      {/* Micro Noise Texture Overlay */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.5) 1px, transparent 0)`,
          backgroundSize: '24px 24px',
        }}
      />
    </div>
  );
};

