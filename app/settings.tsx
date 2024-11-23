import { Layout, Text } from '@ui-kitten/components';
import { StyleSheet, View } from 'react-native';

export default function WeekScreen() {
  return (
    <Layout style={styles.container}>
      <View style={styles.titleContainer}>
        <Text category="h1">Settings!</Text>
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
