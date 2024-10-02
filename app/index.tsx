import { Button, Layout, Text } from '@ui-kitten/components';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { DEFAULT_NO_DAY_VALUE } from '../constants/Days';
import { selectByDate, useTrackedDaysStore } from '../store/trackedDaysStore';

const ONE_DAY = 1000 * 60 * 60 * 24;
const SEVEN_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];

const generateWeek = (): Date => {
  // Start of week is Monday
  const today = new Date();
  const daysUntilStart = (today.getDay() + 6) % 7;
  return new Date(today.getTime() - daysUntilStart * ONE_DAY);
};

interface WeekRowProps {
  date: Date;
}

function WeekRow({ date }: WeekRowProps) {
  const setCountForDay = useTrackedDaysStore((state) => state.setCountForDay);

  const dayOfWeek = SEVEN_DAYS[date.getDay()];
  const currentCount = useTrackedDaysStore(selectByDate(date));

  return (
    <View style={[styles.row, styles.dayRow]}>
      <Text>
        {dayOfWeek}, {date.getFullYear()}-{date.getMonth() + 1}-{date.getDate()}
      </Text>
      <View style={styles.row}>
        <Button
          disabled={currentCount < 1}
          onPress={() => {
            setCountForDay(
              date,
              currentCount === DEFAULT_NO_DAY_VALUE ? 0 : currentCount - 1,
            );
          }}
        >
          -
        </Button>
        <Text>
          {currentCount === DEFAULT_NO_DAY_VALUE ? '-' : currentCount}
        </Text>
        <Button
          onPress={() =>
            setCountForDay(
              date,
              currentCount === DEFAULT_NO_DAY_VALUE ? 0 : currentCount + 1,
            )
          }
        >
          +
        </Button>
      </View>
    </View>
  );
}

export default function WeekScreen() {
  const [currentWeekStart, setCurrentWeekStart] = useState(() =>
    generateWeek(),
  );
  const goToPrevWeek = useCallback(() => {
    return setCurrentWeekStart(
      (oldStart) => new Date(oldStart.getTime() - 7 * ONE_DAY),
    );
  }, []);
  const goToNextWeek = useCallback(() => {
    return setCurrentWeekStart(
      (oldStart) => new Date(oldStart.getTime() + 7 * ONE_DAY),
    );
  }, []);

  return (
    <Layout style={styles.container}>
      <ScrollView>
        <View style={styles.titleContainer}>
          <Text category="h1">Welcome!</Text>
        </View>

        <View>
          <View style={styles.stepContainer}>
            <Text>
              Week of {currentWeekStart.getMonth() + 1}/
              {currentWeekStart.getDate()}
            </Text>
          </View>
          <View style={styles.stepContainer}>
            {SEVEN_DAYS.map((_, index) => {
              const day = new Date(
                currentWeekStart.getTime() + ONE_DAY * index,
              );
              return <WeekRow date={day} key={index} />;
            })}
          </View>
        </View>

        <View style={styles.row}>
          <Button appearance="outline" onPress={goToPrevWeek}>
            Previous Week
          </Button>
          <Button appearance="filled" onPress={goToNextWeek}>
            Next Week
          </Button>
        </View>
      </ScrollView>
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
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  row: {
    alignItems: 'center',
    columnGap: 16,
    flexDirection: 'row',
  },
  dayRow: {
    justifyContent: 'space-between',
  },
});
