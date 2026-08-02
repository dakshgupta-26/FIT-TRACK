import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Command,
  Home,
  Dumbbell,
  Calendar,
  Activity,
  Flag,
  TrendingUp,
  Music,
  MapPin,
  Users,
  User,
  Settings,
  Sparkles,
  ArrowRight,
  X,
} from 'lucide-react';

interface CommandItem {
  id: string;
  title: string;
  category: 'Navigation' | 'AI Action' | 'Health';
  href: string;
  icon: React.ElementType;
  shortcut?: string;
}

const commands: CommandItem[] = [
  { id: 'c1', title: 'Open Dashboard Overview', category: 'Navigation', href: '/dashboard', icon: Home, shortcut: '⌘1' },
  { id: 'c2', title: 'Start Workout Session', category: 'Navigation', href: '/workouts', icon: Dumbbell, shortcut: '⌘2' },
  { id: 'c3', title: 'View Health Metrics & Biometrics', category: 'Health', href: '/metrics', icon: Activity, shortcut: '⌘3' },
  { id: 'c4', title: 'Meals & Calorie Nutrition Tracker', category: 'Health', href: '/meals', icon: Calendar },
  { id: 'c5', title: 'Generate AI Workout Music Playlist', category: 'AI Action', href: '/music', icon: Music, shortcut: '⌘M' },
  { id: 'c6', title: 'Discover Nearby Health Clubs & Gyms', category: 'Navigation', href: '/nearby-gyms', icon: MapPin, shortcut: '⌘G' },
  { id: 'c7', title: 'Join Global Fitness Community Social', category: 'Navigation', href: '/community', icon: Users, shortcut: '⌘C' },
  { id: 'c8', title: 'AI Analytics & Progress Report', category: 'AI Action', href: '/progress', icon: TrendingUp },
  { id: 'c9', title: 'View User Profile & Anatomy', category: 'Navigation', href: '/profile', icon: User },
  { id: 'c10', title: 'Account & System Settings', category: 'Navigation', href: '/settings', icon: Settings },
];

interface AiCommandSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AiCommandSearchModal: React.FC<AiCommandSearchModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredCommands = commands.filter((cmd) =>
    cmd.title.toLowerCase().includes(query.toLowerCase()) ||
    cmd.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (href: string) => {
    navigate(href);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-950/80 backdrop-blur-2xl font-sans select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-xl bg-slate-950/95 border border-teal-500/40 rounded-3xl overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,0.95),0_0_50px_rgba(45,212,191,0.2)] text-white"
        >
          {/* Top Search Input */}
          <div className="relative flex items-center px-4 py-4 border-b border-white/10">
            <Search className="w-5 h-5 text-teal-400 shrink-0 mr-3" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type a command or search (e.g. 'Workouts', 'Gyms', 'Music')..."
              className="w-full bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none font-sans"
            />
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-slate-900 border border-white/10 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Command Results */}
          <div className="max-h-80 overflow-y-auto p-3 space-y-1">
            {filteredCommands.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 space-y-2">
                <Sparkles className="w-6 h-6 text-teal-400 mx-auto animate-pulse" />
                <p>No matching commands found</p>
              </div>
            ) : (
              filteredCommands.map((cmd) => {
                const Icon = cmd.icon;
                return (
                  <button
                    key={cmd.id}
                    onClick={() => handleSelect(cmd.href)}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-900/50 hover:bg-teal-500/20 border border-transparent hover:border-teal-500/30 text-xs flex items-center justify-between text-slate-200 hover:text-teal-300 transition group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-slate-950 border border-white/10 group-hover:border-teal-400/40 text-teal-400">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <div className="font-bold text-white group-hover:text-teal-300">
                          {cmd.title}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {cmd.category}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {cmd.shortcut && (
                        <span className="px-2 py-0.5 rounded-md bg-slate-950 border border-white/15 text-[10px] font-mono text-slate-400">
                          {cmd.shortcut}
                        </span>
                      )}
                      <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-teal-400 transition-transform group-hover:translate-x-1" />
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Footer Shortcuts Info */}
          <div className="px-4 py-2.5 bg-slate-950 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <div className="flex items-center gap-2">
              <Command className="w-3.5 h-3.5 text-teal-400" />
              <span>Raycast Command Palette</span>
            </div>
            <div>Use ↑↓ to navigate • ESC to close</div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
