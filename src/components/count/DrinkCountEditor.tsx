import { useCallback, useMemo } from 'react';
import {
  useCountByDate,
  useTargetByDate,
  useTrackedDaysStore,
} from '../../store/trackedDaysStore';
import type { BasicDate } from '../../types/BasicDate';
import { getDateStringFromBasicDate } from '../../utils/basicDateUtils';
import { Widget } from '../theme/Widget';
import { DrinkCount } from './DrinkCount';

interface Props {
  date: BasicDate;
}

export const DrinkCountEditor = ({ date }: Props) => {
  const count = useCountByDate(date);
  const target = useTargetByDate(date);

  const { setCountForDay } = useTrackedDaysStore();
  const decrementCount = useCallback(
    () => setCountForDay(date, count - 1),
    [date, count, setCountForDay],
  );
  const incrementCount = useCallback(
    () => setCountForDay(date, count + 1),
    [date, count, setCountForDay],
  );
  const title = useMemo(
    () => `Drinks on ${getDateStringFromBasicDate(date, 'month')}`,
    [date],
  );

  return (
    <Widget title={title}>
      <div className="drink-count-editor-container">
        <button
          className="count-button-large minus"
          disabled={count <= 0}
          onClick={decrementCount}
          type="button"
        >
          −
        </button>
        <div className="drink-count-display">
          <DrinkCount date={date} className="drink-count-text" />
          <span className="target-text">/{target}</span>
        </div>
        <button
          className="count-button-large plus"
          onClick={incrementCount}
          type="button"
        >
          +
        </button>
      </div>
    </Widget>
  );
};
