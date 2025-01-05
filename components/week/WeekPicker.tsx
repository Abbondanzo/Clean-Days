import { Button } from '@ui-kitten/components';
import { useCallback, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { BasicDate } from '../../types/BasicDate';
import {
  addDaysToDate,
  getStartOfWeek,
  getToday,
  isAfterToday,
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

const getCurrentWeek = (): BasicDate => {
  return getStartOfWeek(getToday());
};

interface Props {
  selectedDate: BasicDate;
  setSelectedDate: (day: BasicDate) => void;
}

export const WeekPicker = ({ selectedDate, setSelectedDate }: Props) => {
  const [selectedWeek, setSelectedWeek] = useState(() =>
    getStartOfWeek(selectedDate),
  );
  const dates = useMemo(
    () => buildCurrentWeekFromStart(selectedWeek),
    [selectedWeek],
  );

  const goToPrevWeek = useCallback(() => {
    return setSelectedWeek((oldStart) => addDaysToDate(oldStart, -7));
  }, []);
  const goToNextWeek = useCallback(() => {
    return setSelectedWeek((oldStart) => addDaysToDate(oldStart, 7));
  }, []);

  const selectedCurrentWeek = useMemo(() => {
    return isEqual(selectedWeek, getCurrentWeek());
  }, [selectedWeek]);
  const goToCurrentWeek = useCallback(() => {
    setSelectedWeek(getCurrentWeek());
  }, []);

  const title = useMemo(() => {
    let str = `Week of ${selectedWeek.month}/${selectedWeek.day}`;
    if (new Date().getFullYear() !== selectedWeek.year) {
      str += `/${selectedWeek.year}`;
    }
    return str;
  }, [selectedWeek]);

  const disableNextWeek = useMemo(
    () => isAfterToday(addDaysToDate(selectedWeek, 7)),
    [selectedWeek],
  );

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
          disabled={disableNextWeek}
          onPress={goToNextWeek}
          style={styles.weekButton}
        >
          Next week
        </Button>
      </View>
      <View style={styles.buttonRow}>
        {!selectedCurrentWeek && (
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
