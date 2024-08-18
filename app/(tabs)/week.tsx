import {
  Image,
  StyleSheet,
  Platform,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  ThemeProvider,
  DarkTheme,
  DefaultTheme,
  useTheme,
} from '@react-navigation/native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedPressable } from '@/components/ThemedPressable';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ThemedScrollView } from '@/components/ThemedScrollView';
import { useCallback, useMemo, useState } from 'react';
import {
  selectByDate,
  useTrackedDaysStore,
} from '../../store/trackedDaysStore';

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
      <TouchableOpacity onPress={() => setCountForDay(date, currentCount - 1)}>
        <ThemedText>-</ThemedText>
      </TouchableOpacity>
      <ThemedText>
        {dayOfWeek} {date.getFullYear()}-{date.getMonth() + 1}-{date.getDate()}
      </ThemedText>
      <ThemedText>{currentCount}</ThemedText>
      <TouchableOpacity onPress={() => setCountForDay(date, currentCount + 1)}>
        <ThemedText>+</ThemedText>
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

  const setCountForDay = useTrackedDaysStore((state) => state.setCountForDay);

  return (
    <ThemedScrollView>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">
          {currentWeekStart.getMonth() + 1}/{currentWeekStart.getDate()}
        </ThemedText>
        <ThemedText>
          Edit{' '}
          <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText>{' '}
          to see changes. Press{' '}
          <ThemedText type="defaultSemiBold">
            {Platform.select({ ios: 'cmd + d', android: 'cmd + m' })}
          </ThemedText>{' '}
          to open developer tools.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 2: Explore</ThemedText>
        {SEVEN_DAYS.map((_, index) => {
          const day = new Date(currentWeekStart.getTime() + ONE_DAY * index);
          return <WeekRow key={index} date={day} />;
        })}
        <ThemedText>
          Tap the Explore tab to learn more about what's included in this
          starter app.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
        <ThemedText>
          When you're ready, run{' '}
          <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText>{' '}
          to get a fresh <ThemedText type="defaultSemiBold">app</ThemedText>{' '}
          directory. This will move the current{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> to{' '}
          <ThemedText type="defaultSemiBold">app-example</ThemedText>.
        </ThemedText>
      </ThemedView>
      <ThemedPressable onPress={goToPrevWeek}>
        <ThemedText>Press me</ThemedText>
      </ThemedPressable>
      <TouchableOpacity onPress={goToNextWeek}>
        <ThemedText>Press me</ThemedText>
      </TouchableOpacity>
    </ThemedScrollView>
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
