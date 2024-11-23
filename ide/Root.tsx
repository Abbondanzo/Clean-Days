import { ScrollView, StyleSheet, View } from 'react-native';
import { Home } from '../screens/Home';
import { Statistics } from '../screens/Statistics';
import { StackContainer } from './StackContainer';

export const Root = () => {
  return (
    <ScrollView
      contentContainerStyle={styles.contentContainer}
      horizontal
      style={styles.container}
    >
      <StackContainer component={<Home />} label="Home" />
      <StackContainer component={<Statistics />} label="Stats" />
    </ScrollView>
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
});
