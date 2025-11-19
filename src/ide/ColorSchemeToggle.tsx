import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

export const ColorSchemeToggle = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button onClick={toggleTheme} className="theme-toggle-button">
      Toggle theme: {theme}
    </button>
  );
};
