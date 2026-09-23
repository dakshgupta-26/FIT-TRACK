import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, RotateCcw, Loader2, Sparkles } from 'lucide-react';

interface SettingsSaveBarProps {
  isDirty: boolean;
  isSaving: boolean;
  onSave: () => void;
  onDiscard: () => void;
}

export const SettingsSaveBar: React.FC<SettingsSaveBarProps> = ({
  isDirty,
  isSaving,
  onSave,
  onDiscard,
}) => {
  return (
    <AnimatePresence>
      {isDirty && (
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 sm:px-6 py-3 rounded-2xl bg-slate-900/95 border border-teal-500/40 backdrop-blur-2xl shadow-[0_15px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(45,212,191,0.2)] flex items-center gap-4 sm:gap-6 max-w-[92vw]"
        >
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400" />
            </span>
            <div className="text-xs font-bold text-white whitespace-nowrap">
              Careful — you have unsaved changes
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={onDiscard}
              disabled={isSaving}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition active:scale-95 disabled:opacity-50"
            >
              <span className="flex items-center gap-1.5">
                <RotateCcw className="w-3 h-3" />
                <span>Discard</span>
              </span>
            </button>

            <button
              onClick={onSave}
              disabled={isSaving}
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-teal-500/25 hover:brightness-110 active:scale-95 transition disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Save changes</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
