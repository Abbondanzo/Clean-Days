import { Button, Text } from '@ui-kitten/components';
import { useCallback, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { BasicDate } from '../../types/BasicDate';
import {
  addDaysToDate,
  getStartOfWeek,
  isEqual,
} from '../../utils/basicDateUtils';
import { WeekPickerRowItem } from './WeekPickerRowItem';

const buildCurrentWeekFromStart = (start: BasicDate): BasicDate[] => {
  return Array(7)
    .fill(0)
    .map((_, i) => {
      return addDaysToDate(start, i);
    });
};

interface Props {
  selectedDate: BasicDate;
  setSelectedDate: (day: BasicDate) => void;
}

export const WeekPicker = ({ selectedDate, setSelectedDate }: Props) => {
  const [currentWeek, setCurrentWeek] = useState(() =>
    getStartOfWeek(selectedDate),
  );
  const goToPrevWeek = useCallback(() => {
    return setCurrentWeek((oldStart) => addDaysToDate(oldStart, -7));
  }, []);
  const goToNextWeek = useCallback(() => {
    return setCurrentWeek((oldStart) => addDaysToDate(oldStart, 7));
  }, []);
  const dates = useMemo(
    () => buildCurrentWeekFromStart(currentWeek),
    [currentWeek],
  );
  return (
    <View>
      <Text style={styles.titleText}>
        Week of {currentWeek.month}/{currentWeek.day}
      </Text>
      <View style={styles.weekRow}>
        {dates.map((date, index) => (
          <WeekPickerRowItem
            date={date}
            key={index}
            onSelect={() => setSelectedDate(date)}
            selected={isEqual(date, selectedDate)}
          />
        ))}
      </View>
      <View style={styles.buttonRow}>
        <Button
          appearance="outline"
          onPress={goToPrevWeek}
          style={styles.weekButton}
        >
          Previous week
        </Button>
        <Button
          appearance="filled"
          onPress={goToNextWeek}
          style={styles.weekButton}
        >
          Next week
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonRow: {
    paddingTop: 12,
    columnGap: 8,
    flexDirection: 'row',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  titleText: {
    paddingBottom: 16,
    fontSize: 14,
  },
  weekButton: {
    flex: 1,
  },
  weekRow: {
    alignItems: 'center',
    columnGap: 4,
    flexDirection: 'row',
    flex: 1,
  },
});
