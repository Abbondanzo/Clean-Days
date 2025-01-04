import { Layout, Text } from '@ui-kitten/components';
import { ScrollView, StyleSheet, View } from 'react-native';

export const Statistics = () => {
  return (
    <Layout level="2" style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        style={styles.container}
      >
        <View style={styles.scrollViewChild}>
          <View style={styles.titleContainer}>
            <Text category="h1">Stats!</Text>
          </View>
        </View>
      </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    padding: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  row: {
    alignItems: 'center',
    columnGap: 16,
    flexDirection: 'row',
  },
  scrollViewChild: {
    rowGap: 16,
  },
});
