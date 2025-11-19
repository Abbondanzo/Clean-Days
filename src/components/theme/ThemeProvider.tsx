import type { ReactNode } from 'react';
import { useState, useEffect } from 'react';
import { ThemeContext } from '../../context/ThemeContext';

interface Props {
  children: ReactNode;
}

type ColorScheme = 'light' | 'dark';

export const ThemeProvider = ({ children }: Props) => {
  const [override, setOverride] = useState<ColorScheme | null>(null);
  const [systemTheme, setSystemTheme] = useState<ColorScheme>('light');

  useEffect(() => {
    // Check system preference
    if (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      setSystemTheme('dark');
    }

    // Listen for changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) =>
      setSystemTheme(e.matches ? 'dark' : 'light');
    mediaQuery.addEventListener('change', handler);

    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const theme = override ?? systemTheme;

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme: () => {
          setOverride(theme === 'light' ? 'dark' : 'light');
        },
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
