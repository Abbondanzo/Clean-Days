import { StyleSheet, View } from 'react-native';
import { Home } from '../screens/Home';
import { StackContainer } from './StackContainer';

export const Root = () => {
  return (
    <View style={styles.container}>
      <StackContainer component={<Home />} label="Home" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
