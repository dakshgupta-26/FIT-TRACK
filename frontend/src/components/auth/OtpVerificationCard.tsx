import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Activity,
  ShieldCheck,
  RefreshCw,
  ArrowRight,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Mail,
  Sparkles,
  ArrowLeft,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export const OtpVerificationCard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyOtp, resendOtp } = useAuth();

  // Retrieve email from navigation state or sessionStorage
  const [email, setEmail] = useState<string>('');
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [timeLeft, setTimeLeft] = useState<number>(300); // 5 minutes in seconds
  const [isResendDisabled, setIsResendDisabled] = useState<boolean>(true);
  const [isResending, setIsResending] = useState<boolean>(false);

  const [status, setStatus] = useState<'idle' | 'verifying' | 'creating' | 'redirecting' | 'success'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [attemptsLeft, setAttemptsLeft] = useState<number | null>(null);
  const [shakeKey, setShakeKey] = useState<number>(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const stateEmail = location.state?.email;
    const storedEmail = sessionStorage.getItem('pendingVerificationEmail');
    const activeEmail = stateEmail || storedEmail;

    if (activeEmail) {
      setEmail(activeEmail);
    } else {
      // Fallback if accessed directly without signup state
      setErrorMessage('No pending email session found. Redirecting to signup...');
      setTimeout(() => navigate('/signup'), 2000);
    }
  }, [location, navigate]);

  // Countdown timer effect
  useEffect(() => {
    if (timeLeft <= 0) {
      setIsResendDisabled(false);
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // Focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0]?.focus();
    }
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    // Handle single digit entry
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setErrorMessage(null);

    // Auto move to next input if digit entered
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto submit if all 6 digits entered
    const fullCode = newOtp.join('');
    if (fullCode.length === 6 && !newOtp.includes('')) {
      handleVerify(fullCode);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split('');
      setOtp(digits);
      inputRefs.current[5]?.focus();
      handleVerify(pastedData);
    }
  };

  // Trigger high performance canvas confetti celebration
  const triggerConfetti = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.parentElement?.clientWidth || 400;
    canvas.height = canvas.parentElement?.clientHeight || 500;

    const particles: { x: number; y: number; vx: number; vy: number; color: string; radius: number; alpha: number }[] = [];
    const colors = ['#2dd4bf', '#38bdf8', '#34d399', '#a7f3d0', '#67e8f9', '#f43f5e'];

    for (let i = 0; i < 70; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 12,
        vy: (Math.random() - 0.7) * 12,
        color: colors[Math.floor(Math.random() * colors.length)],
        radius: Math.random() * 5 + 3,
        alpha: 1,
      });
    }

    let animationFrameId: number;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.2; // gravity
        p.alpha -= 0.015;

        if (p.alpha > 0) {
          alive = true;
          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      });

      if (alive) {
        animationFrameId = requestAnimationFrame(render);
      }
    };
    render();
  };

  const handleVerify = async (codeToVerify?: string) => {
    const finalOtp = codeToVerify || otp.join('');
    if (finalOtp.length !== 6) {
      setErrorMessage('Please enter all 6 digits of the verification code.');
      setShakeKey((prev) => prev + 1);
      return;
    }

    setErrorMessage(null);
    setStatus('verifying');

    try {
      // Step 1: Verifying HASHED OTP
      await new Promise((r) => setTimeout(r, 400));
      setStatus('creating');

      // Step 2: Create User & Issue JWT Token
      await verifyOtp(email, finalOtp);
      setStatus('success');
      triggerConfetti();

      sessionStorage.removeItem('pendingVerificationEmail');

      setTimeout(() => {
        setStatus('redirecting');
      }, 900);

      setTimeout(() => {
        navigate('/dashboard');
      }, 1800);
    } catch (err: any) {
      setStatus('idle');
      const msg = err.message || 'Invalid or expired OTP code.';
      setErrorMessage(msg);
      setShakeKey((prev) => prev + 1);

      if (msg.includes('attempt(s) remaining')) {
        const match = msg.match(/(\d+)\s+attempt/);
        if (match) setAttemptsLeft(parseInt(match[1]));
      } else if (msg.includes('exceeded') || msg.includes('expired')) {
        setOtp(Array(6).fill(''));
        inputRefs.current[0]?.focus();
      }
    }
  };

  const handleResend = async () => {
    if (isResendDisabled || isResending) return;
    setIsResending(true);
    setErrorMessage(null);

    try {
      await resendOtp(email);
      setOtp(Array(6).fill(''));
      setTimeLeft(300);
      setIsResendDisabled(true);
      setAttemptsLeft(null);
      inputRefs.current[0]?.focus();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to resend verification code.');
      setShakeKey((prev) => prev + 1);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <motion.div
      key={shakeKey}
      animate={shakeKey > 0 ? { x: [-10, 10, -8, 8, -4, 4, 0] } : {}}
      transition={{ duration: 0.4 }}
      className="relative w-full max-w-[480px] rounded-[32px] bg-slate-950/80 border border-white/10 backdrop-blur-2xl px-6 py-7 sm:px-8 sm:py-8 shadow-[0_25px_60px_rgba(0,0,0,0.95),0_0_50px_rgba(20,184,166,0.22)] overflow-hidden text-white font-sans shrink-0"
    >
      {/* Canvas Confetti Layer */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-30" />

      {/* Volumetric Glow Backgrounds */}
      <div className="absolute -top-24 -left-24 w-52 h-52 rounded-full bg-teal-500/25 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-52 h-52 rounded-full bg-cyan-500/25 blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex items-center justify-between mb-6">
        <button
          type="button"
          onClick={() => navigate('/signup')}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition group px-2.5 py-1 rounded-full bg-slate-900/60 border border-white/10"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition" />
          <span>Back to Signup</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
          <span className="text-[11px] font-mono text-teal-300 font-bold uppercase tracking-wider">
            Verification Portal
          </span>
        </div>
      </div>

      {/* Title & Email Badge */}
      <div className="text-center mb-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-500/20 to-cyan-500/20 border border-teal-500/40 text-teal-400 mb-3 shadow-[0_0_20px_rgba(45,212,191,0.25)]"
        >
          {status === 'success' || status === 'redirecting' ? (
            <CheckCircle2 className="w-7 h-7 text-emerald-400" />
          ) : (
            <ShieldCheck className="w-7 h-7 text-teal-400 animate-pulse" />
          )}
        </motion.div>

        <h2 className="text-2xl font-black text-white tracking-tight">Verify Your Email</h2>

        <p className="text-xs text-slate-300 mt-1.5 leading-relaxed max-w-sm mx-auto">
          We sent a 6-digit cryptographic security code to
        </p>

        {/* User Email Pill */}
        <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold max-w-full truncate">
          <Mail className="w-3.5 h-3.5 shrink-0 text-teal-400" />
          <span className="truncate">{email || 'your email address'}</span>
        </div>
      </div>

      {/* Error / Attempt Alert */}
      <AnimatePresence>
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5 overflow-hidden"
          >
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <div className="flex-1">
              <span>{errorMessage}</span>
              {attemptsLeft !== null && attemptsLeft > 0 && (
                <span className="block font-bold text-[11px] text-rose-400 mt-0.5">
                  ⚠️ Remaining Attempts: {attemptsLeft}
                </span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 6 Digit Animated Input Boxes */}
      <div className="my-6">
        <div className="flex justify-between items-center gap-1.5 sm:gap-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <motion.div
              key={index}
              whileFocus={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="relative flex-1"
            >
              <input
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={otp[index]}
                disabled={status !== 'idle'}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className={`w-full h-12 sm:h-14 text-center font-mono text-xl sm:text-2xl font-extrabold rounded-xl bg-slate-900/90 border transition-all duration-200 focus:outline-none ${
                  otp[index]
                    ? 'border-teal-400 text-teal-300 shadow-[0_0_15px_rgba(45,212,191,0.35)] bg-teal-950/20'
                    : 'border-white/10 text-white hover:border-white/20'
                } focus:ring-2 focus:ring-teal-500/60 focus:border-teal-400`}
              />
              {otp[index] && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-teal-400 shadow-[0_0_8px_#2dd4bf]"
                />
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Dynamic Status / Action Button */}
      <div className="space-y-4">
        {status !== 'idle' ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full py-3.5 rounded-xl font-bold text-xs bg-slate-900 border border-teal-500/30 text-teal-300 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(45,212,191,0.2)]"
          >
            {status === 'verifying' && (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-teal-400" />
                <span>Verifying HASHED Security OTP...</span>
              </>
            )}
            {status === 'creating' && (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                <span>Creating MongoDB User Profile...</span>
              </>
            )}
            {status === 'success' && (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400 animate-bounce" />
                <span>Account Verified! Preparing Dashboard...</span>
              </>
            )}
            {status === 'redirecting' && (
              <>
                <Sparkles className="w-4 h-4 text-teal-300 animate-spin" />
                <span>Redirecting to FitTracker AI Dashboard...</span>
              </>
            )}
          </motion.div>
        ) : (
          <motion.button
            type="button"
            onClick={() => handleVerify()}
            whileHover={{ y: -2, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            disabled={otp.join('').length !== 6}
            className={`w-full py-3.5 rounded-xl font-bold text-xs text-slate-950 flex items-center justify-center gap-2 transition-all duration-300 shadow-lg ${
              otp.join('').length === 6
                ? 'bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400 hover:shadow-[0_0_30px_rgba(45,212,191,0.7)] cursor-pointer'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5'
            }`}
          >
            <span>Verify & Create Account</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        )}

        {/* Countdown Timer & Resend Button */}
        <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
          <div className="flex items-center gap-1.5 text-slate-400">
            <span>Code expires in:</span>
            <span className={`font-mono font-bold ${timeLeft < 60 ? 'text-rose-400 animate-pulse' : 'text-teal-400'}`}>
              {formatTime(timeLeft)}
            </span>
          </div>

          <button
            type="button"
            disabled={isResendDisabled || isResending || status !== 'idle'}
            onClick={handleResend}
            className={`flex items-center gap-1.5 font-semibold transition ${
              isResendDisabled || isResending || status !== 'idle'
                ? 'text-slate-600 cursor-not-allowed'
                : 'text-teal-400 hover:text-teal-300 cursor-pointer underline underline-offset-4'
            }`}
          >
            {isResending ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Sending...</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Resend Code</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Security Note Footer */}
      <div className="mt-6 pt-4 text-center border-t border-white/5">
        <p className="text-[11px] text-slate-500 leading-normal">
          🔒 Production-Grade Security: Account creation is locked until OTP is verified.
        </p>
      </div>
    </motion.div>
  );
};
