import { DEFAULT_NO_DAY_VALUE } from '@/constants/Days';
import { selectByDate, useTrackedDaysStore } from '@/store/trackedDaysStore';
import { Button, Card, Layout, Text } from '@ui-kitten/components';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

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
    <View style={styles.row}>
      <Text>
        {dayOfWeek} {date.getFullYear()}-{date.getMonth() + 1}-{date.getDate()}
      </Text>
      <Button
        disabled={currentCount < 1}
        onPress={() => setCountForDay(date, currentCount - 1)}
      >
        -
      </Button>
      <Text>{currentCount === DEFAULT_NO_DAY_VALUE ? '-' : currentCount}</Text>
      <Button
        onPress={() =>
          setCountForDay(
            date,
            currentCount === DEFAULT_NO_DAY_VALUE ? 1 : currentCount + 1,
          )
        }
      >
        +
      </Button>
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
    <Layout>
      <ScrollView>
        <View style={styles.titleContainer}>
          <Text category="h1">Welcome!</Text>
        </View>

        <Card>
          <View style={styles.stepContainer}>
            <Text>
              {currentWeekStart.getMonth() + 1}/{currentWeekStart.getDate()}
            </Text>
          </View>
          <View style={styles.stepContainer}>
            {SEVEN_DAYS.map((_, index) => {
              const day = new Date(
                currentWeekStart.getTime() + ONE_DAY * index,
              );
              return <WeekRow key={index} date={day} />;
            })}
          </View>
        </Card>

        <View>
          <Button onPress={goToPrevWeek} size="md" appearance="filled">
            Previous Week
          </Button>
          <Button onPress={goToNextWeek} size="md" appearance="solid">
            Next Week
          </Button>
        </View>
      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
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
    columnGap: 16,
    flexDirection: 'row',
  },
});
