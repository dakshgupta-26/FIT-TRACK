import React from 'react';
import { ThemeProvider as NextThemesProvider, useTheme as useNextTheme } from 'next-themes';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      storageKey="fit_tracker_theme"
    >
      {children}
    </NextThemesProvider>
  );
};

export const useTheme = () => {
  const { theme, setTheme, resolvedTheme, systemTheme } = useNextTheme();

  const toggleTheme = () => {
    if (theme === 'dark' || resolvedTheme === 'dark') {
      setTheme('light');
    } else {
      setTheme('dark');
    }
  };

  return {
    theme: theme || 'system',
    resolvedTheme: resolvedTheme || 'dark',
    setTheme,
    toggleTheme,
    systemTheme,
  };
};
