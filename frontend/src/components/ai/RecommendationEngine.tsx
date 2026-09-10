import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, TrendingUp, AlertTriangle, Lightbulb, Dumbbell, Droplet, Target, Utensils } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Recommendation {
  id: string;
  type: 'improvement' | 'suggestion' | 'warning';
  title: string;
  description: string;
  action?: string;
  route?: string;
  icon?: React.ElementType;
}

export function RecommendationEngine() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const recommendations: Recommendation[] = [
    {
      id: 'rec-hydration',
      type: 'warning',
      title: 'Hydration Target',
      description: 'Keep your hydration levels high! Aim for at least 8 glasses of water today.',
      action: 'Log Water',
      route: '/meals',
      icon: Droplet,
    },
    {
      id: 'rec-workouts',
      type: 'suggestion',
      title: 'Move Your Body',
      description: 'Explore recommended exercises and customized routines tailored for your fitness level.',
      action: 'Find Workouts',
      route: '/workouts',
      icon: Dumbbell,
    },
    {
      id: 'rec-meals',
      type: 'suggestion',
      title: 'Macro Tracking',
      description: 'Log your breakfast, lunch, or dinner to calculate your daily calories and protein.',
      action: 'Track Meals',
      route: '/meals',
      icon: Utensils,
    },
    {
      id: 'rec-goals',
      type: 'improvement',
      title: 'Active Fitness Goals',
      description: 'Set concrete milestones for weight, daily steps, and workout streaks to stay disciplined.',
      action: 'Manage Goals',
      route: '/goals',
      icon: Target,
    },
  ];

  const getVariantStyles = (type: string) => {
    switch (type) {
      case 'warning':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'improvement':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      default:
        return 'text-teal-400 bg-teal-500/10 border-teal-500/20';
    }
  };

  const handleAction = (route?: string) => {
    if (route) {
      navigate(route);
    }
  };

  return (
    <Card className="animate-slide-up border border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base font-bold">
          <Brain className="h-5 w-5 text-teal-400 animate-pulse" />
          AI Health Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {recommendations.map((rec, index) => {
          const IconComponent = rec.icon || Lightbulb;
          return (
            <div 
              key={rec.id} 
              className="p-3.5 rounded-xl border border-white/5 transition-all duration-300 hover:shadow-md group bg-slate-900/40 hover:bg-slate-900/70"
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-xl border shrink-0 ${getVariantStyles(rec.type)}`}>
                  <IconComponent className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-xs text-foreground group-hover:text-teal-300 transition-colors">
                    {rec.title}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                    {rec.description}
                  </p>
                  {rec.action && (
                    <button
                      onClick={() => handleAction(rec.route)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-teal-400 hover:text-teal-300 mt-2 transition-colors"
                    >
                      {rec.action}
                      <span className="text-xs">→</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}