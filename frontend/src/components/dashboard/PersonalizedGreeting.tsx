import React, { useState, useEffect } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Sparkles, Sun, Moon, Sunset } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useProfileImageMongo } from '@/hooks/useProfileImageMongo';

const motivationalQuotes = [
  "Every workout brings you closer to your goals! 💪",
  "Your only competition is who you were yesterday. 🌟",
  "Progress, not perfection. Keep going! 🚀",
  "Strong is the new beautiful. You've got this! ✨",
  "Today's effort is tomorrow's strength. 💯"
];

const getTimeBasedGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return { text: "Good Morning", icon: Sun };
  if (hour < 17) return { text: "Good Afternoon", icon: Sun };
  if (hour < 20) return { text: "Good Evening", icon: Sunset };
  return { text: "Good Night", icon: Moon };
};

export function PersonalizedGreeting() {
  const [quote, setQuote] = useState('');
  const { currentUser } = useAuth();
  const { profileImageUrl } = useProfileImageMongo();
  const greeting = getTimeBasedGreeting();
  const GreetingIcon = greeting.icon;

  // Get user's display name or fallback to email or default
  const getUserName = () => {
    if (currentUser?.displayName) {
      return currentUser.displayName.split(' ')[0]; // Get first name only
    }
    if (currentUser?.email) {
      return currentUser.email.split('@')[0]; // Get username from email
    }
    return 'User';
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (currentUser?.displayName) {
      return currentUser.displayName
        .split(' ')
        .map(name => name.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    if (currentUser?.email) {
      return currentUser.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  useEffect(() => {
    const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
    setQuote(randomQuote);
  }, []);

  return (
    <Card className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 border-0 shadow-lg">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 animate-pulse-gentle" />
      <div className="relative p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
          <Avatar className="h-12 w-12 sm:h-16 sm:w-16 ring-2 ring-primary/20 ring-offset-2 ring-offset-background shrink-0">
            <AvatarImage 
              src={profileImageUrl || currentUser?.photoURL || ""} 
              alt="Profile" 
            />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold text-base sm:text-lg">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <GreetingIcon className="h-4 w-4 sm:h-5 sm:w-5 text-primary shrink-0" />
              <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent truncate">
                {greeting.text}, {getUserName()}!
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mb-1.5">Here's your health summary for today</p>
            
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary animate-pulse shrink-0" />
              <span className="text-primary font-medium italic truncate">{quote}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default PersonalizedGreeting;