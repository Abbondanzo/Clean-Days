import { useMemo } from 'react';
import { useSettingsStore } from '../../store/settingsStore';
import { Widget } from '../theme/Widget';

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const DailyTargetCountWidget = () => {
  const { startOfWeek, targetDrinks, setTargetDrinks } = useSettingsStore();
  const daysOfWeek = useMemo(() => {
    let start = startOfWeek;
    const days: { label: string; dayIndex: number }[] = [];
    while (days.length < DAYS_OF_WEEK.length) {
      days.push({ label: DAYS_OF_WEEK[start], dayIndex: start });
      start = (start + 1) % DAYS_OF_WEEK.length;
    }
    return days;
  }, [startOfWeek]);

  const onChangeTarget =
    (dayIndex: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = parseInt(event.target.value);
      if (!isNaN(newValue) && newValue >= 0) {
        const newTargetDrinks = [...targetDrinks];
        newTargetDrinks[dayIndex] = newValue;
        setTargetDrinks(newTargetDrinks);
      }
    };

  const incrementTarget = (dayIndex: number) => () => {
    const newTargetDrinks = [...targetDrinks];
    newTargetDrinks[dayIndex] = targetDrinks[dayIndex] + 1;
    setTargetDrinks(newTargetDrinks);
  };

  const decrementTarget = (dayIndex: number) => () => {
    const newTargetDrinks = [...targetDrinks];
    newTargetDrinks[dayIndex] = Math.max(0, targetDrinks[dayIndex] - 1);
    setTargetDrinks(newTargetDrinks);
  };

  return (
    <Widget title="Target drinks per day">
      <div className="target-drinks-grid">
        {daysOfWeek.map((day, index) => (
          <div key={index} className="target-drinks-row">
            <label className="settings-label">{day.label}</label>
            <div className="target-input-container">
              <button
                type="button"
                className="target-button target-button-minus"
                onClick={decrementTarget(day.dayIndex)}
                disabled={targetDrinks[day.dayIndex] <= 0}
              >
                −
              </button>
              <input
                type="number"
                min="0"
                className="settings-input target-input"
                onChange={onChangeTarget(day.dayIndex)}
                value={targetDrinks[day.dayIndex].toString()}
              />
              <button
                type="button"
                className="target-button target-button-plus"
                onClick={incrementTarget(day.dayIndex)}
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>
    </Widget>
  );
};
