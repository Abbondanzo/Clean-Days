import { Text } from '@ui-kitten/components';
import { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';

export const ColorSchemeToggle = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <Text appearance="hint" onPress={toggleTheme} style={styles.text}>
      Toggle theme: {theme}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 12,
    userSelect: 'none',
  },
});
