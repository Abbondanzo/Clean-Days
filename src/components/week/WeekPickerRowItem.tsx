import { useMemo } from 'react';
import { useCountByDate, useTargetByDate } from '../../store/trackedDaysStore';
import type { BasicDate } from '../../types/BasicDate';
import {
  getDateStringFromBasicDate,
  isAfterToday,
} from '../../utils/basicDateUtils';
import { getStatusFromCount } from '../../utils/countUtils';
import { DrinkCount } from '../count/DrinkCount';

interface Props {
  date: BasicDate;
  selected: boolean;
  onSelect: () => void;
}

export const WeekPickerRowItem = ({ date, selected, onSelect }: Props) => {
  const count = useCountByDate(date);
  const target = useTargetByDate(date);
  const status = useMemo(
    () => getStatusFromCount(count, target),
    [count, target],
  );

  const disabled = useMemo(() => isAfterToday(date), [date]);

  const classNames = [
    'week-picker-item',
    selected ? 'selected' : '',
    status,
    disabled ? 'disabled' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classNames}>
      <div className="date-text">
        {getDateStringFromBasicDate(date, 'short')}
      </div>
      <button
        className="count-container"
        disabled={disabled}
        onClick={onSelect}
        type="button"
      >
        <DrinkCount date={date} className="count-text" />
      </button>
    </div>
  );
};
