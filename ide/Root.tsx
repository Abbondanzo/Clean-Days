import { Layout } from '@ui-kitten/components';
import { useContext } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';
import { Home } from '../screens/Home';
import { Settings } from '../screens/Settings';
import { Statistics } from '../screens/Statistics';
import { ColorSchemeToggle } from './ColorSchemeToggle';
import { StackContainer } from './StackContainer';

export const Root = () => {
  const { theme } = useContext(ThemeContext);
  const backgroundTheme =
    theme === 'light'
      ? { backgroundColor: '#c5c8ce' }
      : { backgroundColor: '#0b0e17' };
  return (
    <View style={[styles.container, backgroundTheme]}>
      <Layout level="4" style={styles.optionsContainer}>
        <View style={styles.optionsContainerContents}>
          <ColorSchemeToggle />
        </View>
      </Layout>
      <ScrollView contentContainerStyle={styles.contentContainer} horizontal>
        <StackContainer component={<Home />} label="Home" />
        <StackContainer component={<Statistics />} label="Stats" />
        <StackContainer component={<Settings />} label="Settings" />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b0e17',
  },
  contentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    columnGap: 64,
    padding: 64,
  },
  optionsContainer: {
    padding: 16,
  },
  optionsContainerContents: {
    maxWidth: 1320,
    margin: 'auto',
    width: '100%',
  },
});
