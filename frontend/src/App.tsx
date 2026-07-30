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
import Progress from './pages/Progress'; // Already imported, which is great

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
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/app" element={<Index />} />
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
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;