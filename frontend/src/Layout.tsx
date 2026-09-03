
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
  const [mobileSidebarOpen, setMobileSidebarOpen] = React.useState(false);

  return (
    <div className="min-h-screen min-h-[100dvh] flex w-full bg-background overflow-x-hidden">
      <Sidebar
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />
      <div className="flex-1 min-w-0 flex flex-col overflow-x-hidden">
        <Header
          theme={theme}
          setTheme={setTheme}
          onToggleMobileMenu={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        />
        <main className="flex-1 min-w-0 overflow-x-hidden">
          {children}
        </main>
      </div>
      <ChatBot />
    </div>
  );
};

export default Layout;
