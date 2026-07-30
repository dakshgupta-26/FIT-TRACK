
import React from 'react';
import { Sidebar } from "./components/layout/Sidebar";
import { Header } from "./components/layout/Header";
import { ChatBot } from "./components/ai/ChatBot";

interface LayoutProps {
  children: React.ReactNode;
  theme: string;
  setTheme: (theme: string) => void;
}

const Layout = ({ children, theme, setTheme }: LayoutProps) => {
  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header theme={theme} setTheme={setTheme} />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
      <ChatBot />
    </div>
  );
};

export default Layout;
