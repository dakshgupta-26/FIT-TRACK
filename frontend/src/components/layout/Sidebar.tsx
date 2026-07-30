import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTranslation } from 'react-i18next';
import { 
  Home, 
  Dumbbell, 
  User, 
  Calendar, 
  Settings,
  Activity, 
  Flag,
  Music,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon // 1. Import a new icon for the Progress link
} from 'lucide-react';

type NavItem = {
  key: string;
  href: string;
  icon: React.ElementType;
};

const navItems: NavItem[] = [
  { key: "dashboard", href: "/dashboard", icon: Home },
  { key: "workouts", href: "/workouts", icon: Dumbbell },
  { key: "meals", href: "/meals", icon: Calendar },
  { key: "health_metrics", href: "/metrics", icon: Activity },
  { key: "goals", href: "/goals", icon: Flag },
  // 2. Add the new "Progress" item to the navigation array
  { key: "progress", href: "/progress", icon: ImageIcon }, 
  { key: "music", href: "/music", icon: Music },
  { key: "nearby_gyms", href: "/nearby-gyms", icon: MapPin },
  { key: "profile", href: "/profile", icon: User },
];

export function Sidebar() {
  const [expanded, setExpanded] = useState(true);
  const { toast } = useToast();
  const { t } = useTranslation();

  const toggleSidebar = () => {
    setExpanded(!expanded);
  };

  return (
    <aside className={cn(
      "bg-sidebar text-sidebar-foreground border-r border-sidebar-border h-screen transition-all duration-300 sticky top-0 flex flex-col",
      expanded ? "w-64" : "w-16"
    )}>
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {expanded && (
          <span className="text-xl font-semibold text-primary animate-fade-in">
            HealthBloom
          </span>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar}
          className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-full w-8 h-8 p-0"
        >
          {expanded ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>
      </div>

      <div className="flex-1 py-4 overflow-y-auto">
        <nav className="space-y-1 px-2">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 transition-colors",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  !expanded && "justify-center px-0"
                )
              }
              onClick={() => {
                if (!expanded) {
                  toast({
                    title: t(`sidebar.${item.key}`),
                    duration: 1500,
                  });
                }
              }}
            >
              <item.icon className={cn("flex-shrink-0", expanded ? "h-5 w-5" : "h-6 w-6")} />
              {expanded && <span>{t(`sidebar.${item.key}`)}</span>}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-sidebar-border">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 rounded-md px-3 py-2 transition-colors",
              isActive
                ? "bg-sidebar-primary text-sidebar-primary-foreground"
                : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              !expanded && "justify-center px-0"
            )
          }
        >
          <Settings className={cn("flex-shrink-0", expanded ? "h-5 w-5" : "h-6 w-6")} />
          {expanded && <span>{t('sidebar.settings')}</span>}
        </NavLink>
      </div>
    </aside>
  );
}

export default Sidebar;