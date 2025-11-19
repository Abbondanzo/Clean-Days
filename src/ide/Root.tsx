import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { Home } from '../screens/Home';
import { Settings } from '../screens/Settings';
import { Statistics } from '../screens/Statistics';
import { ColorSchemeToggle } from './ColorSchemeToggle';
import { StackContainer } from './StackContainer';

export const Root = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <div className={`root-container theme-${theme}`}>
      <div className="options-container">
        <div className="options-container-contents">
          <ColorSchemeToggle />
        </div>
      </div>
      <div className="content-container">
        <StackContainer component={<Home />} label="Home" />
        <StackContainer component={<Statistics />} label="Stats" />
        <StackContainer component={<Settings />} label="Settings" />
      </div>
    </div>
  );
};
