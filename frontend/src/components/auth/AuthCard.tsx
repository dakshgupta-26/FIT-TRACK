import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import {
  Activity,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Calendar,
  Check,
  Loader2,
  AlertCircle,
  ShieldAlert,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { SocialProofCounters } from './SocialProofCounters';

interface AuthCardProps {
  initialMode: 'login' | 'signup';
}

export const AuthCard: React.FC<AuthCardProps> = ({ initialMode }) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [capsLockOn, setCapsLockOn] = useState(false);

  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [shakeKey, setShakeKey] = useState(0);

  const navigate = useNavigate();
  const { login, signup, loginWithGoogle, loginWithMicrosoft } = useAuth();

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.getModifierState) {
      setCapsLockOn(e.getModifierState('CapsLock'));
    }
  };

  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: '', color: 'bg-transparent' };
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    switch (score) {
      case 1:
        return { score: 25, label: 'Weak', color: 'bg-rose-500' };
      case 2:
        return { score: 50, label: 'Medium', color: 'bg-amber-400' };
      case 3:
        return { score: 75, label: 'Strong', color: 'bg-emerald-400' };
      case 4:
        return { score: 100, label: 'Unstoppable', color: 'bg-teal-400' };
      default:
        return { score: 15, label: 'Very Weak', color: 'bg-rose-600' };
    }
  };

  const passStrength = getPasswordStrength(password);
  const isEmailValid = email.includes('@') && email.includes('.');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (mode === 'signup') {
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match. Please verify.');
        setShakeKey((prev) => prev + 1);
        return;
      }
      if (!termsAccepted) {
        setErrorMessage('Please accept the Terms of Service to continue.');
        setShakeKey((prev) => prev + 1);
        return;
      }
    }

    setIsLoading(true);

    try {
      if (mode === 'login') {
        await login(email, password);
        setIsSuccess(true);
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      } else {
        await signup(email, password, { firstName, lastName, birthDate });
        sessionStorage.setItem('pendingVerificationEmail', email);
        setIsSuccess(true);
        setTimeout(() => {
          navigate('/signup/verify', { state: { email } });
        }, 600);
      }
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage(err.message || 'Authentication failed. Please check credentials.');
      setShakeKey((prev) => prev + 1);
    }
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      await loginWithGoogle();
      setIsSuccess(true);
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage('Google authentication failed.');
      setShakeKey((prev) => prev + 1);
    }
  };

  const handleMicrosoftAuth = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      await loginWithMicrosoft();
      setIsSuccess(true);
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage(err.message || 'Microsoft authentication failed.');
      setShakeKey((prev) => prev + 1);
    }
  };

  return (
    <motion.div
      key={shakeKey}
      animate={shakeKey > 0 ? { x: [-10, 10, -8, 8, -4, 4, 0] } : {}}
      transition={{ duration: 0.4 }}
      className="relative w-full max-w-[470px] rounded-[32px] bg-slate-950/75 border border-white/10 backdrop-blur-2xl px-6 py-5 sm:px-7 sm:py-6 shadow-[0_25px_60px_rgba(0,0,0,0.95),0_0_50px_rgba(20,184,166,0.18)] overflow-hidden text-white font-sans shrink-0"
    >
      {/* Background Volumetric Glow Accents */}
      <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-teal-500/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-cyan-500/20 blur-3xl pointer-events-none" />

      {/* Header: Logo with Animated Pulse Dot */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <motion.div
              animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
              className="absolute -inset-1 rounded-xl bg-teal-400 blur-sm opacity-60"
            />
            <div className="relative w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-400 p-0.5 shadow-lg">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Activity className="w-4 h-4 text-teal-400" />
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-sm tracking-tight text-white flex items-center gap-1.5">
              FitTracker <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">AI</span>
            </span>
          </div>
        </div>

        {/* Mode Switcher Pills */}
        <div className="flex p-0.5 rounded-full bg-slate-900/80 border border-white/10 text-[11px]">
          <button
            type="button"
            onClick={() => { setMode('login'); setErrorMessage(null); }}
            className={`px-3 py-1 rounded-full font-medium transition-all ${mode === 'login'
                ? 'bg-gradient-to-r from-teal-400 to-emerald-400 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-white'
              }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('signup'); setErrorMessage(null); }}
            className={`px-3 py-1 rounded-full font-medium transition-all ${mode === 'signup'
                ? 'bg-gradient-to-r from-teal-400 to-emerald-400 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-white'
              }`}
          >
            Sign Up
          </button>
        </div>
      </div>

      {/* Welcome Title */}
      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
          className="mb-4"
        >
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {mode === 'login'
              ? 'Enter your credentials to enter your AI health portal.'
              : 'Start your personalized AI fitness & nutrition intelligence today.'}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Error Alert */}
      <AnimatePresence>
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: 'auto', marginBottom: 12 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 overflow-hidden"
          >
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Authentication Form */}
      <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} className="space-y-3">
        {/* Name inputs for Signup */}
        {mode === 'signup' && (
          <div className="grid grid-cols-2 gap-2.5">
            <div className="relative">
              <input
                type="text"
                required
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-white/10 text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/60 focus:border-teal-400 transition"
              />
            </div>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-white/10 text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/60 focus:border-teal-400 transition"
              />
            </div>
          </div>
        )}

        {/* Email Address with Floating Label & Glow validation */}
        <div className="relative pt-2">
          <div className={`relative rounded-xl transition-all duration-300 ${emailFocused ? 'ring-2 ring-teal-500/60 shadow-[0_0_15px_rgba(45,212,191,0.3)]' : ''
            }`}>
            <input
              type="email"
              required
              id="email-input"
              value={email}
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
              onChange={(e) => setEmail(e.target.value)}
              className="peer w-full px-3.5 pt-4 pb-1.5 rounded-xl bg-slate-900/80 border border-white/10 text-white text-xs placeholder-transparent focus:outline-none focus:border-teal-400 transition"
              placeholder="Email"
            />
            <label
              htmlFor="email-input"
              className={`absolute left-3.5 transition-all pointer-events-none text-slate-400 ${emailFocused || email
                  ? 'top-1 text-[9px] font-semibold text-teal-400 uppercase tracking-wider'
                  : 'top-2.5 text-xs'
                }`}
            >
              Email Address
            </label>
            {/* Validation Indicator */}
            {email && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {isEmailValid ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                )}
              </div>
            )}
          </div>
        </div>

        {/* Password Input with Floating Label, Eye, CapsLock & Strength Meter */}
        <div className="relative pt-2">
          <div className={`relative rounded-xl transition-all duration-300 ${passwordFocused ? 'ring-2 ring-teal-500/60 shadow-[0_0_15px_rgba(45,212,191,0.3)]' : ''
            }`}>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              id="password-input"
              value={password}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              onChange={(e) => setPassword(e.target.value)}
              className="peer w-full pl-3.5 pr-10 pt-4 pb-1.5 rounded-xl bg-slate-900/80 border border-white/10 text-white text-xs placeholder-transparent focus:outline-none focus:border-teal-400 transition"
              placeholder="Password"
            />
            <label
              htmlFor="password-input"
              className={`absolute left-3.5 transition-all pointer-events-none text-slate-400 ${passwordFocused || password
                  ? 'top-1 text-[9px] font-semibold text-teal-400 uppercase tracking-wider'
                  : 'top-2.5 text-xs'
                }`}
            >
              Password
            </label>

            {/* Action Buttons inside Password input */}
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
              {capsLockOn && (
                <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/30 flex items-center gap-0.5">
                  <ShieldAlert className="w-2.5 h-2.5" /> CAPS
                </span>
              )}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-400 hover:text-white transition p-1"
                aria-label="Toggle Password Visibility"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Password Strength Meter */}
          {password && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-1 space-y-0.5 px-1">
              <div className="flex justify-between text-[9px]">
                <span className="text-slate-400">Strength:</span>
                <span className="font-bold text-teal-300">{passStrength.label}</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-1 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${passStrength.score}%` }}
                  className={`h-full ${passStrength.color} transition-all duration-300`}
                />
              </div>
            </motion.div>
          )}
        </div>

        {/* Confirm Password for Signup */}
        {mode === 'signup' && (
          <div className="relative pt-2">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              required
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900/80 border border-white/10 text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/60 focus:border-teal-400 transition"
            />
          </div>
        )}

        {/* Options Row */}
        <div className="flex items-center justify-between pt-0.5">
          {mode === 'login' ? (
            <>
              <label className="flex items-center gap-1.5 cursor-pointer select-none text-[11px] text-slate-300">
                <button
                  type="button"
                  onClick={() => setRememberMe(!rememberMe)}
                  className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-all ${rememberMe
                      ? 'bg-teal-400 border-teal-400 text-slate-950'
                      : 'bg-slate-900 border-slate-700'
                    }`}
                >
                  {rememberMe && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                </button>
                <span>Remember me</span>
              </label>

              <Link
                to="/forgot-password"
                className="text-[11px] text-teal-400 hover:text-teal-300 transition"
              >
                Forgot password?
              </Link>
            </>
          ) : (
            <label className="flex items-center gap-1.5 cursor-pointer select-none text-[11px] text-slate-300">
              <button
                type="button"
                onClick={() => setTermsAccepted(!termsAccepted)}
                className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-all ${termsAccepted
                    ? 'bg-teal-400 border-teal-400 text-slate-950'
                    : 'bg-slate-900 border-slate-700'
                  }`}
              >
                {termsAccepted && <Check className="w-2.5 h-2.5 stroke-[3]" />}
              </button>
              <span>Accept Terms & Privacy Policy</span>
            </label>
          )}
        </div>

        {/* Primary Sign In Button with Spring & Glow */}
        <motion.button
          type="submit"
          disabled={isLoading || isSuccess}
          whileHover={{ y: -2, scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          className={`relative w-full py-2.5 rounded-xl font-bold text-xs text-slate-950 flex items-center justify-center gap-2 overflow-hidden shadow-lg transition-all ${isSuccess
              ? 'bg-emerald-400 shadow-[0_0_25px_rgba(52,211,153,0.8)]'
              : 'bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400 hover:shadow-[0_0_25px_rgba(45,212,191,0.6)]'
            }`}
        >
          {isLoading ? (
            <div className="flex items-center gap-1.5 text-slate-950">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{mode === 'signup' ? 'Sending OTP...' : 'Authenticating...'}</span>
            </div>
          ) : isSuccess ? (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-1.5">
              <Check className="w-4 h-4 stroke-[3]" />
              <span>{mode === 'signup' ? 'Verification Code Sent!' : 'Access Granted'}</span>
            </motion.div>
          ) : (
            <div className="flex items-center gap-1.5">
              <span>{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          )}
        </motion.button>
      </form>

      {/* Social Login Separator */}
      <div className="relative my-3 text-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/10" />
        </div>
        <span className="relative bg-[#070b13] px-2.5 text-[9px] uppercase font-mono tracking-wider text-slate-400">
          Or continue with
        </span>
      </div>

      {/* Social Logins: ONLY Google and Microsoft (Equal Width) */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Google Button */}
        <motion.button
          type="button"
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleGoogleAuth}
          className="px-3 py-2 rounded-xl bg-slate-900/90 border border-white/10 hover:bg-slate-800 text-xs font-semibold text-white flex items-center justify-center gap-2 transition shadow-sm"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Google
        </motion.button>

        {/* Microsoft Button */}
        <motion.button
          type="button"
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleMicrosoftAuth}
          className="px-3 py-2 rounded-xl bg-slate-900/90 border border-white/10 hover:bg-slate-800 text-xs font-semibold text-white flex items-center justify-center gap-2 transition shadow-sm"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 23 23">
            <path fill="#f35325" d="M1 1h10v10H1z" />
            <path fill="#81bc06" d="M12 1h10v10H12z" />
            <path fill="#05a6f0" d="M1 12h10v10H1z" />
            <path fill="#ffba08" d="M12 12h10v10H12z" />
          </svg>
          Microsoft
        </motion.button>
      </div>

      {/* Small Divider */}
      <div className="w-full my-3 border-t border-white/5" />

      {/* Single Row Social Proof Strip */}
      <SocialProofCounters />
    </motion.div>
  );
};
