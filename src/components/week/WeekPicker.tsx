import { useCallback, useMemo, useState } from 'react';
import { useSettingsStore } from '../../store/settingsStore';
import type { BasicDate } from '../../types/BasicDate';
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
    setWeekOffset(oldOffset => {
      const newOffset = oldOffset - 1;
      const newWeekStart = addDaysToDate(
        getCurrentWeek(startOfWeek),
        newOffset * 7,
      );
      setSelectedDate(newWeekStart);
      return newOffset;
    });
  }, [startOfWeek, setSelectedDate]);
  const goToNextWeek = useCallback(() => {
    setWeekOffset(oldOffset => {
      const newOffset = oldOffset + 1;
      const newWeekStart = addDaysToDate(
        getCurrentWeek(startOfWeek),
        newOffset * 7,
      );
      setSelectedDate(newWeekStart);
      return newOffset;
    });
  }, [startOfWeek, setSelectedDate]);
  const goToCurrentWeek = useCallback(() => {
    setWeekOffset(0);
    setSelectedDate(getToday());
  }, [setSelectedDate]);
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
      <div className="week-row">
        {dates.map((date, index) => (
          <WeekPickerRowItem
            date={date}
            key={index}
            onSelect={() => setSelectedDate(date)}
            selected={isEqual(date, selectedDate)}
          />
        ))}
      </div>
      <div className="button-row">
        <button
          className="week-button secondary"
          onClick={goToPrevWeek}
          type="button"
        >
          Previous week
        </button>
        <button
          className="week-button primary"
          disabled={isCurrentWeek}
          onClick={goToNextWeek}
          type="button"
        >
          Next week
        </button>
      </div>
      {!isCurrentWeek && (
        <div className="button-row">
          <button
            className="week-button ghost"
            onClick={goToCurrentWeek}
            type="button"
          >
            Go to current week
          </button>
        </div>
      )}
    </Widget>
  );
};
