import React from 'react';
import { Bell, Search, Sun, Moon, LogOut, Check } from 'lucide-react'; // Added Check icon
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useProfileImageMongo } from '@/hooks/useProfileImageMongo';
import { useTranslation } from 'react-i18next'; // 1. Import the hook

interface HeaderProps {
  theme: string;
  setTheme: (theme: string) => void;
}

export function Header({ theme, setTheme }: HeaderProps) {
  const { toast } = useToast();
  const { currentUser, logout } = useAuth();
  const { profileImageUrl, loadUserProfileImage } = useProfileImageMongo();
  const navigate = useNavigate();
  const { i18n } = useTranslation(); // 2. Get the i18n instance

  // Load user profile image on component mount
  React.useEffect(() => {
    if (currentUser) {
      loadUserProfileImage();
    }
  }, [currentUser, loadUserProfileImage]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    toast({
      title: `${newTheme.charAt(0).toUpperCase() + newTheme.slice(1)} mode activated`,
      duration: 1500,
    });
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      // Error is handled in AuthContext
    }
  };

  const getUserInitials = () => {
    if (currentUser?.displayName) {
      return currentUser.displayName.split(' ').map(name => name.charAt(0)).join('').toUpperCase().slice(0, 2);
    }
    return currentUser?.email?.charAt(0).toUpperCase() || 'U';
  };
  
  // 3. Create the language change handler
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    toast({
      title: "Language Changed",
      description: `The app language has been set to ${lng === 'en' ? 'English' : 'Hindi'}.`,
      duration: 2000,
    });
  };

  return (
    <header className="bg-background border-b border-border py-3 px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center md:w-72 lg:w-80">
          <div className="relative w-full">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="pl-8 bg-background border border-input focus-visible:ring-2 w-full"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-medium text-accent-foreground">3</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              {/* ... (notification items remain the same) ... */}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar>
                  <AvatarImage src={profileImageUrl || currentUser?.photoURL || ""} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  {currentUser?.displayName && <p className="font-medium">{currentUser.displayName}</p>}
                  {currentUser?.email && <p className="w-[200px] truncate text-sm text-muted-foreground">{currentUser.email}</p>}
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/profile')}>Profile</DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/settings')}>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              
              {/* --- NEW: Language Switcher --- */}
              <DropdownMenuItem onClick={() => changeLanguage('en')}>
                <div className="flex items-center justify-between w-full">
                  <span>English</span>
                  {i18n.language === 'en' && <Check className="h-4 w-4 ml-2" />}
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeLanguage('hi')}>
                <div className="flex items-center justify-between w-full">
                  <span>हिन्दी</span>
                  {i18n.language === 'hi' && <Check className="h-4 w-4 ml-2" />}
                </div>
              </DropdownMenuItem>
              {/* --- End Language Switcher --- */}
              
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:bg-red-500/10 focus:text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

export default Header;