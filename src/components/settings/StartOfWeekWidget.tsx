import { useSettingsStore } from '../../store/settingsStore';
import { Widget } from '../theme/Widget';

interface Option {
  title: string;
  value: number;
}

const OPTIONS: Option[] = [
  { title: 'Sunday', value: 0 },
  { title: 'Monday', value: 1 },
];

export const StartOfWeekWidget = () => {
  const { startOfWeek, setStartOfWeek } = useSettingsStore();

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setStartOfWeek(parseInt(event.target.value));
  };

  return (
    <Widget title="Start of Week">
      <div className="settings-field">
        <label className="settings-label">
          Choose the first day of the week
        </label>
        <select
          className="settings-select"
          value={startOfWeek}
          onChange={handleChange}
        >
          {OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.title}
            </option>
          ))}
        </select>
      </div>
    </Widget>
  );
};
