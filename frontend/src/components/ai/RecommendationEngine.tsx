import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Brain, TrendingUp, AlertTriangle, Lightbulb } from 'lucide-react';

interface Recommendation {
  id: string;
  type: 'improvement' | 'suggestion' | 'warning';
  title: string;
  description: string;
  action?: string;
}

const mockRecommendations: Recommendation[] = [
  {
    id: '1',
    type: 'warning',
    title: 'Low Water Intake',
    description: 'You\'ve only had 2 glasses of water today. Aim for 8 glasses.',
    action: 'Log Water'
  },
  {
    id: '2',
    type: 'suggestion',
    title: 'Perfect Workout Day',
    description: 'Based on your energy levels, try a HIIT workout today.',
    action: 'View Workouts'
  },
  {
    id: '3',
    type: 'improvement',
    title: 'Sleep Pattern',
    description: 'Your sleep quality improved by 15% this week. Keep it up!',
  },
  {
    id: '4',
    type: 'suggestion',
    title: 'Meal Recommendation',
    description: 'You need more protein today. Try a lean chicken salad.',
    action: 'Browse Meals'
  }
];

export function RecommendationEngine() {
  const { toast } = useToast();

  const getIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      case 'improvement': return <TrendingUp className="h-4 w-4" />;
      default: return <Lightbulb className="h-4 w-4" />;
    }
  };

  const getVariant = (type: string) => {
    switch (type) {
      case 'warning': return 'destructive';
      case 'improvement': return 'default';
      default: return 'secondary';
    }
  };

  const handleAction = (action: string) => {
    toast({
      title: "AI Recommendations",
      description: `${action} feature requires Supabase integration for full functionality`,
      duration: 2000,
    });
  };

  return (
    <Card className="animate-slide-up">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary animate-pulse" />
          AI Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {mockRecommendations.map((rec, index) => (
          <div 
            key={rec.id} 
            className="p-4 rounded-lg border transition-all duration-300 hover:shadow-lg group bg-gradient-to-r from-card to-card/50 backdrop-blur-sm hover:scale-[1.02]"
            style={{
              animationDelay: `${index * 150}ms`
            }}
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-gradient-to-br from-primary/10 to-primary/20 group-hover:scale-110 transition-transform duration-200">
                {getIcon(rec.type)}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm group-hover:text-primary transition-colors">
                  {rec.title}
                </h4>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  {rec.description}
                </p>
                {rec.action && (
                  <button
                    onClick={() => handleAction(rec.action)}
                    className="inline-flex items-center gap-1 text-xs bg-primary/10 hover:bg-primary/20 text-primary px-2 py-1 rounded-md mt-3 transition-all duration-200 hover:scale-105"
                  >
                    {rec.action}
                    <span className="text-xs">→</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        
        <div className="pt-2 border-t">
          <p className="text-xs text-muted-foreground text-center">
            Connect to Supabase to enable personalized AI recommendations
          </p>
        </div>
      </CardContent>
    </Card>
  );
}