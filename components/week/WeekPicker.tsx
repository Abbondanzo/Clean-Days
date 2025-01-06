import { Button } from '@ui-kitten/components';
import { useCallback, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSettingsStore } from '../../store/settingsStore';
import { BasicDate } from '../../types/BasicDate';
import {
  addDaysToDate,
  getStartOfWeek,
  getToday,
  isEqual,
} from '../../utils/basicDateUtils';
import { Widget } from '../theme/Widget';
import { WeekPickerRowItem } from './WeekPickerRowItem';

const buildCurrentWeekFromStart = (start: BasicDate): BasicDate[] => {
  return Array(7)
    .fill(0)
    .map((_, i) => {
      return addDaysToDate(start, i);
    });
};

const getCurrentWeek = (startOfWeek: number): BasicDate => {
  return getStartOfWeek(getToday(), startOfWeek);
};

interface Props {
  selectedDate: BasicDate;
  setSelectedDate: (day: BasicDate) => void;
}

export const WeekPicker = ({ selectedDate, setSelectedDate }: Props) => {
  const { startOfWeek } = useSettingsStore();
  const [weekOffset, setWeekOffset] = useState(0);
  const selectedWeekWithOffset = useMemo(() => {
    const curWeek = getCurrentWeek(startOfWeek);
    return addDaysToDate(curWeek, weekOffset * 7);
  }, [startOfWeek, weekOffset]);

  const dates = useMemo(
    () => buildCurrentWeekFromStart(selectedWeekWithOffset),
    [selectedWeekWithOffset],
  );

  const goToPrevWeek = useCallback(() => {
    setWeekOffset((oldOffset) => oldOffset - 1);
  }, []);
  const goToNextWeek = useCallback(() => {
    setWeekOffset((oldOffset) => oldOffset + 1);
  }, []);
  const goToCurrentWeek = useCallback(() => {
    setWeekOffset(0);
  }, []);
  const isCurrentWeek = useMemo(() => weekOffset === 0, [weekOffset]);

  const title = useMemo(() => {
    let str = `Week of ${selectedWeekWithOffset.month}/${selectedWeekWithOffset.day}`;
    if (new Date().getFullYear() !== selectedWeekWithOffset.year) {
      str += `/${selectedWeekWithOffset.year}`;
    }
    return str;
  }, [selectedWeekWithOffset]);

  return (
    <Widget title={title}>
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
          disabled={isCurrentWeek}
          onPress={goToNextWeek}
          style={styles.weekButton}
        >
          Next week
        </Button>
      </View>
      <View style={styles.buttonRow}>
        {!isCurrentWeek && (
          <Button
            appearance="ghost"
            onPress={goToCurrentWeek}
            style={styles.weekButton}
          >
            Go to current week
          </Button>
        )}
      </View>
    </Widget>
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
    gap: 4,
    flexDirection: 'row',
    flex: 1,
  },
});
