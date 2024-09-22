import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { Box } from '@/components/ui/box';
import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { DEFAULT_NO_DAY_VALUE } from '@/constants/Days';
import { selectByDate, useTrackedDaysStore } from '@/store/trackedDaysStore';
import { useCallback, useState } from 'react';

type YearMonthDay = [number, number, number];

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
      <TouchableOpacity
        disabled={currentCount < 1}
        onPress={() => setCountForDay(date, currentCount - 1)}
      >
        <Text>-</Text>
      </TouchableOpacity>
      <Text>{currentCount === DEFAULT_NO_DAY_VALUE ? '-' : currentCount}</Text>
      <TouchableOpacity
        onPress={() =>
          setCountForDay(
            date,
            currentCount === DEFAULT_NO_DAY_VALUE ? 1 : currentCount + 1
          )
        }
      >
        <Text>+</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function WeekScreen() {
  const [currentWeekStart, setCurrentWeekStart] = useState(() =>
    generateWeek()
  );
  const goToPrevWeek = useCallback(() => {
    return setCurrentWeekStart(
      (oldStart) => new Date(oldStart.getTime() - 7 * ONE_DAY)
    );
  }, []);
  const goToNextWeek = useCallback(() => {
    return setCurrentWeekStart(
      (oldStart) => new Date(oldStart.getTime() + 7 * ONE_DAY)
    );
  }, []);

  return (
    <ScrollView className="bg-primary-500 p-5">
      <Box style={styles.titleContainer}>
        <Heading size="lg">Welcome!</Heading>
      </Box>

      <Box style={styles.stepContainer}>
        <Text>
          {currentWeekStart.getMonth() + 1}/{currentWeekStart.getDate()}
        </Text>
      </Box>
      <Box style={styles.stepContainer}>
        {SEVEN_DAYS.map((_, index) => {
          const day = new Date(currentWeekStart.getTime() + ONE_DAY * index);
          return <WeekRow key={index} date={day} />;
        })}
      </Box>
      <Button onPress={goToPrevWeek}>
        <Text>Previous Week</Text>
      </Button>
      <TouchableOpacity onPress={goToNextWeek}>
        <Text>Next Week</Text>
      </TouchableOpacity>
    </ScrollView>
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
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  row: {
    columnGap: 16,
    flexDirection: 'row',
  },
});
