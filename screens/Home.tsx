import { Layout, Text } from '@ui-kitten/components';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { WeekPicker } from '../components/week/WeekPicker';
import { getToday } from '../utils/basicDateUtils';
import { DrinkCountEditor } from '../components/count/DrinkCountEditor';

export const Home = () => {
  const [selectedDate, setSelectedDate] = useState(() => getToday());

  return (
    <Layout style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        style={styles.container}
      >
        <View style={styles.scrollViewChild}>
          <View style={styles.titleContainer}>
            <Text category="h1">Welcome!</Text>
          </View>

          <WeekPicker
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />

          <DrinkCountEditor date={selectedDate} />
        </View>
      </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    padding: 8,
    backgroundColor: 'red',
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
