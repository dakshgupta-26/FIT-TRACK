import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Droplets, Plus, Play, Target } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from 'react-router-dom';

// Water Logging Modal Component
const WaterLoggingModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [waterAmount, setWaterAmount] = useState(250);
  const { toast } = useToast();

  const handleLogWater = () => {
    // Here you would typically save to a database or state management
    toast({
      title: "Water Logged! 💧",
      description: `Added ${waterAmount}ml to your daily intake`,
      duration: 3000,
    });
    onClose();
  };

  const quickAmounts = [250, 500, 750, 1000];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Droplets className="h-5 w-5 text-blue-500" />
            Log Water Intake
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="water-amount">Amount (ml)</Label>
            <Input
              id="water-amount"
              type="number"
              value={waterAmount}
              onChange={(e) => setWaterAmount(Number(e.target.value))}
              placeholder="Enter amount in ml"
            />
          </div>
          
          <div>
            <Label className="text-sm text-muted-foreground">Quick Add</Label>
            <div className="grid grid-cols-4 gap-2 mt-2">
              {quickAmounts.map((amount) => (
                <Button
                  key={amount}
                  variant="outline"
                  size="sm"
                  onClick={() => setWaterAmount(amount)}
                  className={waterAmount === amount ? "bg-blue-500 text-white" : ""}
                >
                  {amount}ml
                </Button>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleLogWater} className="flex-1">
              Log Water
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export function QuickActions() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isWaterModalOpen, setIsWaterModalOpen] = useState(false);

  const actions = [
    {
      icon: Droplets,
      label: "Log Water",
      color: "from-blue-500/20 to-cyan-500/20",
      hoverColor: "hover:from-blue-500/30 hover:to-cyan-500/30",
      action: () => setIsWaterModalOpen(true)
    },
    {
      icon: Plus,
      label: "Add Meal",
      color: "from-green-500/20 to-emerald-500/20",
      hoverColor: "hover:from-green-500/30 hover:to-emerald-500/30",
      action: () => {
        navigate('/meals');
        toast({
          title: "Meal Tracker",
          description: "Navigate to meals page to add your meal",
          duration: 2000,
        });
      }
    },
    {
      icon: Play,
      label: "Start Workout",
      color: "from-orange-500/20 to-red-500/20",
      hoverColor: "hover:from-orange-500/30 hover:to-red-500/30",
      action: () => {
        navigate('/workouts');
        toast({
          title: "Workout Time! 💪",
          description: "Choose a workout to get started",
          duration: 2000,
        });
      }
    },
    {
      icon: Target,
      label: "Set Goal",
      color: "from-purple-500/20 to-pink-500/20",
      hoverColor: "hover:from-purple-500/30 hover:to-pink-500/30",
      action: () => {
        navigate('/goals');
        toast({
          title: "Goal Setting",
          description: "Create and track your fitness goals",
          duration: 2000,
        });
      }
    }
  ];

  return (
    <>
      <Card className="p-4">
        <h3 className="font-semibold mb-4 text-sm text-muted-foreground uppercase tracking-wide">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Button
                key={index}
                variant="ghost"
                onClick={action.action}
                className={`
                  h-auto p-4 flex flex-col gap-2 bg-gradient-to-br ${action.color} 
                  border border-border/50 transition-all duration-300 
                  hover:shadow-lg hover:scale-105 ${action.hoverColor}
                  hover:shadow-primary/20 group
                `}
              >
                <Icon className="h-5 w-5 text-primary group-hover:scale-110 transition-transform duration-200" />
                <span className="text-xs font-medium">{action.label}</span>
              </Button>
            );
          })}
        </div>
      </Card>

      {/* Water Logging Modal */}
      <WaterLoggingModal 
        isOpen={isWaterModalOpen} 
        onClose={() => setIsWaterModalOpen(false)} 
      />
    </>
  );
}