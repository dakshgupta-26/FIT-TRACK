import React from 'react';
import { Sparkles, BrainCircuit, Mic, Utensils, Dumbbell, ShieldAlert, Cpu } from 'lucide-react';
import { AiCoachSettings } from '../types';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

interface AiCoachPanelProps {
  settings: AiCoachSettings;
  onChange: (updated: Partial<AiCoachSettings>) => void;
}

export const AiCoachPanel: React.FC<AiCoachPanelProps> = ({ settings, onChange }) => {
  const personas = [
    {
      id: 'athlete',
      name: 'Elite Athletic Specialist',
      desc: 'Periodization-focused, high performance, tactical metrics.',
      badge: 'Popular',
    },
    {
      id: 'friendly',
      name: 'Friendly Motivator',
      desc: 'Warm, empathetic, habit reinforcement and positive cues.',
      badge: 'Balanced',
    },
    {
      id: 'strict',
      name: 'Strict Disciplinarian',
      desc: 'Zero excuses, accountability-driven, rigid pacing.',
      badge: 'Intense',
    },
    {
      id: 'doctor',
      name: 'Clinical Physician',
      desc: 'Biomarker analysis, medical precautions, physiological data.',
      badge: 'Clinical',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Panel Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            AI Neural Engine Configuration
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Fine-tune synthetic coaching heuristics, conversation depth, and autonomous workout generation.
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-teal-500/20 text-teal-300 text-xs shrink-0 self-start sm:self-auto font-mono">
          <Cpu className="w-3.5 h-3.5 text-teal-400" />
          <span>Model: FitNeural-v3.4-Pro</span>
        </div>
      </div>

      {/* Group 1: Persona Selection */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/60 border border-white/10 space-y-4">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
          Coach Persona Archetype
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {personas.map((p) => {
            const isSelected = settings.personality === p.id;
            return (
              <div
                key={p.id}
                onClick={() => onChange({ personality: p.id as any })}
                className={cn(
                  'p-4 rounded-xl border cursor-pointer transition text-left space-y-1.5 relative',
                  isSelected
                    ? 'bg-teal-500/10 border-teal-500/50 shadow-[0_0_15px_rgba(45,212,191,0.15)]'
                    : 'bg-slate-950/60 border-white/5 hover:border-white/15'
                )}
              >
                <div className="flex items-center justify-between">
                  <span className={cn('text-xs font-bold', isSelected ? 'text-teal-300' : 'text-white')}>
                    {p.name}
                  </span>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                    {p.badge}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">{p.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Group 2: Response Depth & Temperature */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/60 border border-white/10 space-y-5">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
          Reasoning & Communication Depth
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Conversation Style */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-300">Response Conciseness</label>
            <select
              value={settings.conversationStyle}
              onChange={(e) => onChange({ conversationStyle: e.target.value as any })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 hover:border-teal-500/30 focus:border-teal-400 text-xs text-white transition focus:outline-none focus:ring-1 focus:ring-teal-400"
            >
              <option value="concise">Concise & Actionable (Bullet points, quick sets)</option>
              <option value="analytical">Deep Analytical Breakdown (Biomechanical cues)</option>
              <option value="verbose">Comprehensive Advice (Explanations & science)</option>
            </select>
            <p className="text-[11px] text-slate-500">Controls verbosity of AI chat responses during active workouts.</p>
          </div>

          {/* Creativity / Temperature Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-slate-300">Creativity & Variety Index</label>
              <span className="text-xs font-mono font-bold text-teal-400">
                {settings.aiCreativity.toFixed(1)} / 1.0
              </span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.1"
              value={settings.aiCreativity}
              onChange={(e) => onChange({ aiCreativity: parseFloat(e.target.value) })}
              className="w-full accent-teal-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>Strictly Formulaic (0.1)</span>
              <span>Dynamic Variation (1.0)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Group 3: Autonomous Modules */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/60 border border-white/10 space-y-4">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
          Autonomous Neural Subsystems
        </h3>

        <div className="divide-y divide-white/5 space-y-3">
          <div className="pt-3 first:pt-0 flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <div className="text-xs font-semibold text-white flex items-center gap-2">
                <Utensils className="w-3.5 h-3.5 text-teal-400" />
                <span>Autonomous meal planning & macro balancing</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Generates weekly meal recipes adapted to daily workout volume and caloric deficit targets.
              </p>
            </div>
            <Switch
              checked={settings.mealPlanning}
              onCheckedChange={(checked) => onChange({ mealPlanning: checked })}
            />
          </div>

          <div className="pt-3 flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <div className="text-xs font-semibold text-white flex items-center gap-2">
                <Dumbbell className="w-3.5 h-3.5 text-emerald-400" />
                <span>Real-time progressive overload adaptations</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Auto-recommends weight increments and rep targets based on recent session velocity.
              </p>
            </div>
            <Switch
              checked={settings.workoutSuggestions}
              onCheckedChange={(checked) => onChange({ workoutSuggestions: checked })}
            />
          </div>

          <div className="pt-3 flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <div className="text-xs font-semibold text-white flex items-center gap-2">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                <span>Predictive central nervous system fatigue alerts</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Warns when HRV drops below optimal baseline to prevent overtraining injuries.
              </p>
            </div>
            <Switch
              checked={settings.predictiveAlerts}
              onCheckedChange={(checked) => onChange({ predictiveAlerts: checked })}
            />
          </div>

          <div className="pt-3 flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <div className="text-xs font-semibold text-white flex items-center gap-2">
                <Mic className="w-3.5 h-3.5 text-amber-400" />
                <span>Voice coaching during active workout interval</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Audio cues for rest countdown, set completion, and cadence pacing via connected earbuds.
              </p>
            </div>
            <Switch
              checked={settings.voiceEnabled}
              onCheckedChange={(checked) => onChange({ voiceEnabled: checked })}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
