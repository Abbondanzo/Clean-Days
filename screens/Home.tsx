import { Layout, Text } from '@ui-kitten/components';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { WeekPicker } from '../components/week/WeekPicker';
import { getToday } from '../utils/basicDateUtils';
import { DrinkCountEditor } from '../components/count/DrinkCountEditor';

const ONE_DAY = 1000 * 60 * 60 * 24;
const SEVEN_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];

const generateWeek = (): Date => {
  // Start of week is Monday
  const today = new Date();
  const daysUntilStart = (today.getDay() + 6) % 7;
  return new Date(today.getTime() - daysUntilStart * ONE_DAY);
};

export const Home = () => {
  const [selectedDate, setSelectedDate] = useState(() => getToday());

  return (
    <Layout style={styles.container}>
      <ScrollView>
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
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
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
