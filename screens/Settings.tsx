import { Layout, Text } from '@ui-kitten/components';
import { ScrollView, StyleSheet, View } from 'react-native';
import { DailyTargetCountWidget } from '../components/settings/DailyTargetCountWidget';
import { StartOfWeekWidget } from '../components/settings/StartOfWeekWidget';

export const Settings = () => {
  return (
    <Layout level="2" style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        style={styles.container}
      >
        <View style={styles.scrollViewChild}>
          <View style={styles.titleContainer}>
            <Text category="h1">Settings</Text>
          </View>

          <StartOfWeekWidget />

          <DailyTargetCountWidget />
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
