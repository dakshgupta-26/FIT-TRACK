import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check, Sparkles } from 'lucide-react';
import { SETTINGS_TABS } from './settingsData';
import { SettingsTabId } from './types';
import { cn } from '@/lib/utils';

interface SettingsNavigationProps {
  activeTab: SettingsTabId;
  onSelectTab: (tabId: SettingsTabId) => void;
}

export const SettingsNavigation: React.FC<SettingsNavigationProps> = ({
  activeTab,
  onSelectTab,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const tabListRef = useRef<HTMLDivElement>(null);

  // Close mobile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target as Node)) {
        setMobileMenuOpen(false);
      }
    };
    if (mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mobileMenuOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  // Keyboard navigation for desktop tablist
  const handleKeyDownTab = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'ArrowRight') {
      const nextIndex = (index + 1) % SETTINGS_TABS.length;
      onSelectTab(SETTINGS_TABS[nextIndex].id);
    } else if (e.key === 'ArrowLeft') {
      const prevIndex = (index - 1 + SETTINGS_TABS.length) % SETTINGS_TABS.length;
      onSelectTab(SETTINGS_TABS[prevIndex].id);
    }
  };

  const currentActiveMeta = SETTINGS_TABS.find((t) => t.id === activeTab) || SETTINGS_TABS[0];
  const CurrentIcon = currentActiveMeta.icon;

  return (
    <div className="w-full select-none">
      {/* 1. MOBILE CONTEXTUAL SELECTOR (< 768px) */}
      <div className="md:hidden relative" ref={mobileMenuRef}>
        <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1.5 px-0.5">
          Configuration Area
        </div>
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-haspopup="listbox"
          aria-expanded={mobileMenuOpen}
          className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-slate-900 border border-white/10 hover:border-teal-500/40 text-left text-xs font-bold text-white shadow-lg transition active:scale-[0.99]"
        >
          <div className="flex items-center gap-3 truncate">
            <div className="w-7 h-7 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 shrink-0">
              <CurrentIcon className="w-4 h-4" />
            </div>
            <div className="truncate">
              <div className="font-bold text-white text-xs">{currentActiveMeta.label}</div>
              <div className="text-[10px] text-slate-400 font-normal truncate max-w-[200px]">
                {currentActiveMeta.description}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {currentActiveMeta.badge && (
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-teal-400/20 text-teal-300 border border-teal-400/30">
                {currentActiveMeta.badge}
              </span>
            )}
            <ChevronDown
              className={cn(
                'w-4 h-4 text-slate-400 transition-transform duration-200',
                mobileMenuOpen && 'rotate-180 text-teal-400'
              )}
            />
          </div>
        </button>

        {/* Mobile Dropdown Menu Popover */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="absolute left-0 right-0 top-full mt-2 p-2 rounded-2xl bg-slate-950/95 border border-white/15 backdrop-blur-2xl shadow-2xl z-40 max-h-80 overflow-y-auto custom-scrollbar space-y-1"
              role="listbox"
            >
              {SETTINGS_TABS.map((tab) => {
                const Icon = tab.icon;
                const isSelected = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      onSelectTab(tab.id);
                      setMobileMenuOpen(false);
                    }}
                    className={cn(
                      'w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs text-left transition',
                      isSelected
                        ? 'bg-teal-500/15 border border-teal-500/30 text-teal-300 font-bold'
                        : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={cn('w-4 h-4 shrink-0', isSelected ? 'text-teal-400' : 'text-slate-400')} />
                      <span>{tab.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {tab.badge && (
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                          {tab.badge}
                        </span>
                      )}
                      {isSelected && <Check className="w-3.5 h-3.5 text-teal-400" />}
                    </div>
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 2. DESKTOP & TABLET HORIZONTAL TAB NAVIGATION (>= 768px) */}
      <div className="hidden md:block relative">
        <div
          ref={tabListRef}
          role="tablist"
          aria-label="Settings configuration sections"
          className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1 border-b border-white/10"
        >
          {SETTINGS_TABS.map((tab, idx) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                role="tab"
                id={`tab-${tab.id}`}
                aria-selected={isActive}
                aria-controls={`panel-${tab.id}`}
                tabIndex={isActive ? 0 : -1}
                onKeyDown={(e) => handleKeyDownTab(e, idx)}
                onClick={() => onSelectTab(tab.id)}
                className={cn(
                  'relative shrink-0 flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors duration-200 group focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400',
                  isActive
                    ? 'text-teal-300'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                )}
              >
                {/* Active Slider Pill Indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeSettingsTabPill"
                    className="absolute inset-0 rounded-xl bg-slate-900 border border-teal-500/30 shadow-sm"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  />
                )}

                {/* Bottom Active Glow Accent Bar */}
                {isActive && (
                  <motion.div
                    layoutId="activeSettingsTabBottomBar"
                    className="absolute bottom-0 left-3 right-3 h-[2px] bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400 rounded-full shadow-[0_0_8px_#2dd4bf]"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  />
                )}

                <span className="relative z-10 flex items-center gap-2">
                  <Icon
                    className={cn(
                      'w-3.5 h-3.5 transition-transform duration-200 group-hover:scale-110',
                      isActive ? 'text-teal-400' : 'text-slate-400 group-hover:text-slate-200'
                    )}
                  />
                  <span>{tab.shortLabel}</span>

                  {tab.badge && (
                    <span
                      className={cn(
                        'text-[9px] font-mono px-1.5 py-0.5 rounded-full transition',
                        isActive
                          ? 'bg-teal-400/20 text-teal-300 border border-teal-400/30'
                          : 'bg-slate-800 text-slate-400 group-hover:text-slate-300'
                      )}
                    >
                      {tab.badge}
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
