import { ScrollView, StyleSheet, View } from 'react-native';
import { Home } from '../screens/Home';
import { Statistics } from '../screens/Statistics';
import { ColorSchemeToggle } from './ColorSchemeToggle';
import { StackContainer } from './StackContainer';
import { Layout } from '@ui-kitten/components';

export const Root = () => {
  return (
    <View style={styles.container}>
      <Layout level="4" style={styles.optionsContainer}>
        <View style={styles.optionsContainerContents}>
          <ColorSchemeToggle />
        </View>
      </Layout>
      <ScrollView contentContainerStyle={styles.contentContainer} horizontal>
        <StackContainer component={<Home />} label="Home" />
        <StackContainer component={<Statistics />} label="Stats" />
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
