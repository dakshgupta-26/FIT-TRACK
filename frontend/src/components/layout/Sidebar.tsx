import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { AiCommandSearchModal } from './AiCommandSearchModal';
import { useAuth } from '@/contexts/AuthContext';
import {
  Home,
  Dumbbell,
  Calendar,
  Activity,
  Flag,
  TrendingUp,
  Music,
  MapPin,
  User,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Search,
  Command,
  Flame,
  Heart,
  Users,
  ShieldCheck,
  LogOut,
  X,
} from 'lucide-react';

interface NavGroup {
  groupName: string;
  items: {
    label: string;
    href: string;
    icon: React.ElementType;
    badge?: string;
    isHot?: boolean;
  }[];
}

const navGroups: NavGroup[] = [
  {
    groupName: 'HEALTH & METRICS',
    items: [
      { label: 'Dashboard', href: '/dashboard', icon: Home },
      { label: 'Health Metrics', href: '/metrics', icon: Activity, badge: '82 BPM' },
      { label: 'Fitness Goals', href: '/goals', icon: Flag },
      { label: 'Meals & Nutrition', href: '/meals', icon: Calendar },
    ],
  },
  {
    groupName: 'WORKOUT & AI OS',
    items: [
      { label: 'Workouts', href: '/workouts', icon: Dumbbell, isHot: true },
      { label: 'AI Coach & Analytics', href: '/progress', icon: Sparkles, badge: 'PRO' },
      { label: 'Audio & Beats', href: '/music', icon: Music, badge: '165 BPM' },
    ],
  },
  {
    groupName: 'EXPLORE & DISCOVERY',
    items: [
      { label: 'Global Community', href: '/community', icon: Users, badge: '50k+', isHot: true },
      { label: 'Nearby Gyms OS', href: '/nearby-gyms', icon: MapPin, badge: 'NEW' },
    ],
  },
  {
    groupName: 'ACCOUNT & SYSTEM',
    items: [
      { label: 'My Profile', href: '/profile', icon: User },
      { label: 'Settings', href: '/settings', icon: Settings },
    ],
  },
];

interface SidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function Sidebar({ mobileOpen = false, onCloseMobile }: SidebarProps) {
  const [expanded, setExpanded] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeTelemetryIndex, setActiveTelemetryIndex] = useState(0);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const userDisplayName = currentUser?.firstName
    ? `${currentUser.firstName} ${currentUser.lastName || ''}`.trim()
    : currentUser?.email?.split('@')[0] || 'Athlete';

  const userInitials = currentUser?.firstName
    ? `${currentUser.firstName[0]}${currentUser.lastName ? currentUser.lastName[0] : ''}`.toUpperCase()
    : (currentUser?.email?.[0] || 'U').toUpperCase();

  // Telemetry widgets ticker
  const telemetryData = [
    { label: 'Heart Rate Sync', value: '82 BPM', icon: Heart, color: 'text-rose-400' },
    { label: "Today's Burn", value: '742 kcal', icon: Flame, color: 'text-amber-400' },
    { label: 'Recovery Score', value: '94% Optimal', icon: Sparkles, color: 'text-teal-400' },
    { label: 'AI Cloud Sync', value: '100% Synced', icon: ShieldCheck, color: 'text-emerald-400' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTelemetryIndex((prev) => (prev + 1) % telemetryData.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Auto-close mobile drawer on route change
  useEffect(() => {
    if (onCloseMobile) {
      onCloseMobile();
    }
  }, [location.pathname]);

  const currentTelemetry = telemetryData[activeTelemetryIndex];
  const TelemetryIcon = currentTelemetry.icon;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const renderNavContent = (isMobileView: boolean = false) => {
    const isExpanded = isMobileView || expanded;

    return (
      <div className="flex flex-col h-full select-none">
        {/* Header Logo Bar */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 h-16 shrink-0 relative z-10">
          {isExpanded ? (
            <NavLink
              to="/dashboard"
              onClick={() => isMobileView && onCloseMobile?.()}
              className="flex items-center gap-2.5 group"
            >
              <div className="relative">
                <motion.div
                  animate={{ scale: [1, 1.25, 1], opacity: [0.4, 0.8, 0.4] }}
                  transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
                  className="absolute -inset-1 rounded-xl bg-teal-400 blur-sm opacity-60"
                />
                <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-400 via-emerald-400 to-cyan-300 p-0.5 shadow-lg group-hover:scale-105 transition-transform">
                  <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                    <Activity className="w-4 h-4 text-teal-300 animate-pulse" />
                  </div>
                </div>
              </div>

              <div className="flex flex-col">
                <div className="font-black text-sm tracking-tight text-white flex items-center gap-1.5">
                  FitTracker
                </div>
                <div className="text-[9px] font-mono text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
                  <span>Connected • Live Sync</span>
                </div>
              </div>
            </NavLink>
          ) : (
            <div className="mx-auto">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-400 via-emerald-400 to-cyan-300 p-0.5 shadow-lg">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Activity className="w-4 h-4 text-teal-300" />
                </div>
              </div>
            </div>
          )}

          {isMobileView ? (
            <button
              onClick={onCloseMobile}
              className="p-2 rounded-xl bg-slate-900 border border-white/10 hover:border-teal-500/40 text-slate-400 hover:text-white transition shrink-0"
              aria-label="Close Navigation Drawer"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-1.5 rounded-xl bg-slate-900 border border-white/10 hover:border-teal-500/40 text-slate-400 hover:text-white transition shrink-0"
              aria-label={expanded ? "Collapse Sidebar" : "Expand Sidebar"}
            >
              {expanded ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          )}
        </div>

        {/* Raycast Spotlight Search Trigger Bar */}
        {isExpanded && (
          <div className="p-3 border-b border-white/5 relative z-10">
            <button
              onClick={() => {
                setIsSearchOpen(true);
                if (isMobileView) onCloseMobile?.();
              }}
              className="w-full px-3 py-2 rounded-2xl bg-slate-900/80 hover:bg-teal-950/40 border border-white/10 hover:border-teal-500/40 text-xs text-slate-400 hover:text-teal-300 flex items-center justify-between transition group backdrop-blur-md"
            >
              <div className="flex items-center gap-2">
                <Search className="w-3.5 h-3.5 text-teal-400" />
                <span>Search AI OS...</span>
              </div>
              <div className="flex items-center gap-1 text-[10px] font-mono text-slate-500 px-1.5 py-0.5 rounded bg-slate-950 border border-white/10">
                <Command className="w-2.5 h-2.5" />
                <span>K</span>
              </div>
            </button>
          </div>
        )}

        {/* Grouped Navigation */}
        <div className="flex-1 py-3 overflow-y-auto custom-scrollbar px-3 space-y-5 relative z-10">
          {navGroups.map((group, idx) => (
            <div key={idx} className="space-y-1">
              {isExpanded && (
                <div className="px-3 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1">
                  {group.groupName}
                </div>
              )}

              {group.items.map((item) => {
                const isActive = location.pathname === item.href;
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    onClick={() => isMobileView && onCloseMobile?.()}
                    className={({ isActive }) =>
                      cn(
                        'relative flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-xs font-bold transition-all duration-300 group',
                        isActive
                          ? 'text-teal-300'
                          : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent',
                        !isExpanded && 'justify-center px-0'
                      )
                    }
                  >
                    {/* Active Glass Highlight Background */}
                    {isActive && (
                      <motion.div
                        layoutId={isMobileView ? "mobileSidebarActivePill" : "sidebarActivePill"}
                        className="absolute inset-0 rounded-2xl bg-gradient-to-r from-teal-500/20 via-cyan-500/10 to-emerald-500/5 border border-teal-400/40 shadow-[0_0_20px_rgba(45,212,191,0.2)] z-0"
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      />
                    )}

                    {/* Left Neon Pulse Beam Indicator */}
                    {isActive && (
                      <motion.div
                        layoutId={isMobileView ? "mobileSidebarActiveBeam" : "sidebarActiveBeam"}
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-teal-400 rounded-r-full shadow-[0_0_12px_#2dd4bf] z-10"
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      />
                    )}

                    <div className="relative z-10 flex items-center gap-3 w-full">
                      <Icon
                        className={cn(
                          'shrink-0 transition-transform duration-300 group-hover:scale-110',
                          isActive ? 'text-teal-400 drop-shadow-[0_0_8px_rgba(45,212,191,0.8)]' : 'text-slate-400 group-hover:text-white',
                          isExpanded ? 'w-4 h-4' : 'w-5 h-5'
                        )}
                      />

                      {isExpanded && <span className="truncate flex-1">{item.label}</span>}

                      {isExpanded && item.badge && (
                        <span className="text-[9px] font-mono font-extrabold px-2 py-0.5 rounded-full bg-teal-400/20 text-teal-300 border border-teal-400/30">
                          {item.badge}
                        </span>
                      )}

                      {isExpanded && item.isHot && (
                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                      )}
                    </div>
                  </NavLink>
                );
              })}
            </div>
          ))}
        </div>

        {/* Live AI Telemetry Widget (Sidebar Bottom Center) */}
        {isExpanded && (
          <div className="mx-3 mb-3 p-3 rounded-2xl bg-slate-900/80 border border-teal-500/30 backdrop-blur-xl relative z-10 shadow-lg">
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
              <span>LIVE TELEMETRY</span>
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentTelemetry.label}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-between pt-0.5"
              >
                <div className="flex items-center gap-2">
                  <TelemetryIcon className={cn('w-4 h-4', currentTelemetry.color)} />
                  <span className="text-xs font-bold text-slate-200">{currentTelemetry.label}</span>
                </div>
                <span className={cn('text-xs font-extrabold font-mono', currentTelemetry.color)}>
                  {currentTelemetry.value}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        {/* User Profile Footer */}
        <div className="p-3 border-t border-white/10 shrink-0 relative z-10">
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className={cn(
                'w-full flex items-center gap-3 rounded-2xl p-2 bg-slate-900/60 hover:bg-slate-900 border border-white/10 hover:border-teal-500/40 transition text-left group',
                !isExpanded && 'justify-center p-0 bg-transparent border-0'
              )}
            >
              <div className="relative shrink-0">
                {currentUser?.profileImageUrl ? (
                  <img
                    src={currentUser.profileImageUrl}
                    alt={userDisplayName}
                    className="w-9 h-9 rounded-full object-cover border border-teal-400/50"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-teal-500 to-emerald-500 flex items-center justify-center font-bold text-xs text-slate-950 border border-teal-400/50 shadow-md">
                    {userInitials}
                  </div>
                )}
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-950" />
              </div>

              {isExpanded && (
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-black text-white truncate group-hover:text-teal-300">
                    {userDisplayName}
                  </div>
                  <div className="text-[10px] font-mono text-teal-400 font-bold flex items-center gap-1">
                    <span>MEMBER</span>
                    <span>• {currentUser?.email ? 'ACTIVE' : 'GUEST'}</span>
                  </div>
                </div>
              )}
            </button>

            {/* Profile Popover Menu */}
            <AnimatePresence>
              {showProfileMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="absolute bottom-full mb-2 left-0 w-56 p-2 rounded-2xl bg-slate-950/95 border border-white/15 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.9)] z-50 space-y-1"
                >
                  <button
                    onClick={() => {
                      navigate('/profile');
                      setShowProfileMenu(false);
                      if (isMobileView) onCloseMobile?.();
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-200 hover:bg-white/5 flex items-center gap-2"
                  >
                    <User className="w-4 h-4 text-teal-400" />
                    <span>View Profile</span>
                  </button>

                  <button
                    onClick={() => {
                      navigate('/settings');
                      setShowProfileMenu(false);
                      if (isMobileView) onCloseMobile?.();
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-200 hover:bg-white/5 flex items-center gap-2"
                  >
                    <Settings className="w-4 h-4 text-cyan-400" />
                    <span>Settings</span>
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 font-bold"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* 1. DESKTOP SIDEBAR (Visible >= 1024px) */}
      <aside
        className={cn(
          'hidden lg:flex relative bg-slate-950/90 text-slate-100 border-r border-white/10 backdrop-blur-3xl h-screen sticky top-0 flex-col z-30 select-none shadow-[10px_0_40px_rgba(0,0,0,0.8)] font-sans transition-all duration-300',
          expanded ? 'w-68' : 'w-20'
        )}
      >
        {/* Subtle Ambient Aurora Glow */}
        <div className="absolute top-0 left-0 w-full h-40 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        {renderNavContent(false)}
      </aside>

      {/* 2. MOBILE / TABLET SLIDE-OVER DRAWER (Visible < 1024px) */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onCloseMobile}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
            />

            {/* Slide-over Drawer */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              className="relative w-72 max-w-[85vw] h-full bg-slate-950 text-slate-100 border-r border-white/10 shadow-2xl z-50 flex flex-col font-sans"
            >
              <div className="absolute top-0 left-0 w-full h-40 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
              {renderNavContent(true)}
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* Spotlight Command Modal */}
      <AiCommandSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}

export default Sidebar;