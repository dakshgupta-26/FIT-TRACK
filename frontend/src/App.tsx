import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import LandingPage from "./pages/LandingPage";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Workouts from "./pages/Workouts";
import Meals from "./pages/Meals";
import Metrics from "./pages/Metrics";
import Goals from "./pages/Goals";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Music from "./pages/Music";
import NearbyGyms from "./pages/NearbyGyms";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import PlaylistCreator from "./pages/PlaylistCreator";
import Layout from "./Layout";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import Progress from './pages/Progress';
import About from './pages/About';
import Mission from './pages/Mission';
import Press from './pages/Press';
import Partners from './pages/Partners';
import Security from './pages/Security';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Cookies from './pages/Cookies';
import Accessibility from './pages/Accessibility';
import Contact from './pages/Contact';
import PricingPage from './pages/PricingPage';
import HelpCenter from './pages/HelpCenter';
import DocumentationPage from './pages/DocumentationPage';
import BlogPage from './pages/BlogPage';
import CommunityPage from './pages/CommunityPage';
import ChangelogPage from './pages/ChangelogPage';
import StatusPage from './pages/StatusPage';
import RoadmapPage from './pages/RoadmapPage';
import ScrollToTop from './components/ScrollToTop';

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return currentUser ? <>{children}</> : <Navigate to="/login" />;
};

// Public Route Component (redirect to dashboard if already logged in)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return currentUser ? <Navigate to="/dashboard" /> : <>{children}</>;
};

const AppContent = () => {
  const [theme, setTheme] = useState<string>('light');

  // Check for dark mode preference
  useEffect(() => {
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else if (isDarkMode) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Update theme
  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/features" element={<LandingPage />} />
        <Route path="/app" element={<Index />} />
        <Route path="/about" element={<About />} />
        <Route path="/mission" element={<Mission />} />
        <Route path="/press" element={<Press />} />
        <Route path="/partners" element={<Partners />} />
        <Route path="/security" element={<Security />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/cookies" element={<Cookies />} />
        <Route path="/accessibility" element={<Accessibility />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/help" element={<HelpCenter />} />
        <Route path="/faqs" element={<HelpCenter />} />
        <Route path="/support" element={<HelpCenter />} />
        <Route path="/docs" element={<DocumentationPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/changelog" element={<ChangelogPage />} />
        <Route path="/roadmap" element={<RoadmapPage />} />
        <Route path="/status" element={<StatusPage />} />
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        <Route path="/signup" element={
          <PublicRoute>
            <Signup />
          </PublicRoute>
        } />

        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Layout theme={theme} setTheme={handleThemeChange}>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/workouts" element={
          <ProtectedRoute>
            <Layout theme={theme} setTheme={handleThemeChange}>
              <Workouts />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/meals" element={
          <ProtectedRoute>
            <Layout theme={theme} setTheme={handleThemeChange}>
              <Meals />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/metrics" element={
          <ProtectedRoute>
            <Layout theme={theme} setTheme={handleThemeChange}>
              <Metrics />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/goals" element={
          <ProtectedRoute>
            <Layout theme={theme} setTheme={handleThemeChange}>
              <Goals />
            </Layout>
          </ProtectedRoute>
        } />
        
        {/* === NEWLY ADDED PROGRESS ROUTE === */}
        <Route path="/progress" element={
          <ProtectedRoute>
            <Layout theme={theme} setTheme={handleThemeChange}>
              <Progress />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/profile" element={
          <ProtectedRoute>
            <Layout theme={theme} setTheme={handleThemeChange}>
              <Profile />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute>
            <Layout theme={theme} setTheme={handleThemeChange}>
              <Settings />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/music" element={
          <ProtectedRoute>
            <Layout theme={theme} setTheme={handleThemeChange}>
              <Music />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/nearby-gyms" element={
          <ProtectedRoute>
            <Layout theme={theme} setTheme={handleThemeChange}>
              <NearbyGyms />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/playlist-creator" element={
          <ProtectedRoute>
            <Layout theme={theme} setTheme={handleThemeChange}>
              <PlaylistCreator />
            </Layout>
          </ProtectedRoute>
        } />
        
        {/* 404 Not Found Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;