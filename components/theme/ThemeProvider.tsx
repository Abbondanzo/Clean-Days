import * as eva from '@eva-design/eva';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from '@react-navigation/native';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { ReactNode, useState } from 'react';
import { useColorScheme } from 'react-native';
import { ThemeContext } from '../../context/ThemeContext';

interface Props {
  children: ReactNode;
}

type ColorScheme = 'light' | 'dark';

export const ThemeProvider = ({ children }: Props) => {
  const defaultColorScheme = useColorScheme();
  const [override, setOverride] = useState<ColorScheme | null>(null);
  const theme = override ?? defaultColorScheme ?? 'light';

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme: () => {
          setOverride((prev) => (prev !== 'dark' ? 'dark' : 'light'));
        },
      }}
    >
      <ApplicationProvider
        {...eva}
        theme={theme === 'dark' ? eva.dark : eva.light}
      >
        <IconRegistry icons={EvaIconsPack} />
        <NavigationThemeProvider
          value={theme === 'dark' ? DarkTheme : DefaultTheme}
        >
          {children}
        </NavigationThemeProvider>
      </ApplicationProvider>
    </ThemeContext.Provider>
  );
};
