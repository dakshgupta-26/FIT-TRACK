
import React, { useState, useEffect } from 'react';
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { ChatBot } from "@/components/ai/ChatBot";
import Dashboard from "./Dashboard";

const Index = () => {
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
    <div className="min-h-screen flex bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header theme={theme} setTheme={handleThemeChange} />
        <main className="flex-1 overflow-auto">
          <Dashboard />
        </main>
      </div>
      <ChatBot />
    </div>
  );
};

export default Index;
