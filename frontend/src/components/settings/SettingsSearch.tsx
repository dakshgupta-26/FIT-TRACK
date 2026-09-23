import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowRight, CornerDownLeft, Sparkles } from 'lucide-react';
import { SEARCHABLE_SETTINGS } from './settingsData';
import { SearchableSettingItem, SettingsTabId } from './types';
import { cn } from '@/lib/utils';

interface SettingsSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectResult: (tabId: SettingsTabId, settingId?: string) => void;
  initialQuery?: string;
}

export const SettingsSearch: React.FC<SettingsSearchProps> = ({
  isOpen,
  onClose,
  onSelectResult,
  initialQuery = '',
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setQuery(initialQuery);
      setSelectedIndex(0);
    }
  }, [isOpen, initialQuery]);

  const filteredResults: SearchableSettingItem[] = query.trim()
    ? SEARCHABLE_SETTINGS.filter((item) => {
        const q = query.toLowerCase();
        return (
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.tabLabel.toLowerCase().includes(q) ||
          item.keywords.some((k) => k.toLowerCase().includes(q))
        );
      })
    : SEARCHABLE_SETTINGS.slice(0, 8); // show popular items by default

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredResults.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredResults.length) % Math.max(1, filteredResults.length));
      } else if (e.key === 'Enter' && filteredResults.length > 0) {
        e.preventDefault();
        const selected = filteredResults[selectedIndex];
        if (selected) {
          onSelectResult(selected.tabId, selected.id);
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredResults, selectedIndex, onClose, onSelectResult]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-40"
          />

          {/* Command Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="relative w-full max-w-xl bg-slate-950 border border-white/15 rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Input Bar */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/10 bg-slate-900/60">
              <Search className="w-4 h-4 text-teal-400 shrink-0" />
              <input
                type="text"
                autoFocus
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                placeholder="Search settings (e.g., 2FA, language, units, whoop, calories)..."
                className="w-full bg-transparent border-0 text-sm text-white placeholder:text-slate-500 focus:outline-none"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Results List */}
            <div className="max-h-80 overflow-y-auto custom-scrollbar p-2 space-y-1">
              {filteredResults.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  No settings found matching &ldquo;<span className="text-white font-semibold">{query}</span>&rdquo;
                </div>
              ) : (
                filteredResults.map((item, idx) => {
                  const isSelected = idx === selectedIndex;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onSelectResult(item.tabId, item.id);
                        onClose();
                      }}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={cn(
                        'w-full flex items-center justify-between p-3 rounded-xl text-left transition',
                        isSelected
                          ? 'bg-teal-500/15 border border-teal-500/30 text-white'
                          : 'hover:bg-white/5 border border-transparent text-slate-300'
                      )}
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">{item.title}</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-teal-300 border border-white/5">
                            {item.tabLabel}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-1">{item.description}</p>
                      </div>

                      <div className="flex items-center gap-1.5 text-slate-500 shrink-0">
                        {isSelected ? (
                          <CornerDownLeft className="w-3.5 h-3.5 text-teal-400" />
                        ) : (
                          <ArrowRight className="w-3.5 h-3.5" />
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-4 py-2 border-t border-white/5 bg-slate-900/40 flex items-center justify-between text-[10px] font-mono text-slate-400">
              <div className="flex items-center gap-3">
                <span>↑↓ Navigate</span>
                <span>↵ Select</span>
                <span>ESC to close</span>
              </div>
              <span className="text-teal-400">Settings OS</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
