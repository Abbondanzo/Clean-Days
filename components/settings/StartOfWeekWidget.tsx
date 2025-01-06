import { IndexPath, Select, SelectItem, Text } from '@ui-kitten/components';
import { useMemo } from 'react';
import { useSettingsStore } from '../../store/settingsStore';
import { Widget } from '../theme/Widget';

interface Option {
  title: string;
  value: number;
}

const OPTIONS: Option[] = [
  {
    title: 'Sunday',
    value: 0,
  },
  {
    title: 'Monday',
    value: 1,
  },
];

export const StartOfWeekWidget = () => {
  const { startOfWeek, setStartOfWeek } = useSettingsStore();
  const selectedIndex = useMemo(() => {
    const selectedIndex = OPTIONS.findIndex(
      (option) => option.value === startOfWeek,
    );
    return new IndexPath(selectedIndex);
  }, [startOfWeek]);
  const onSelect = (index: IndexPath | IndexPath[]) => {
    if (Array.isArray(index)) {
      return;
    }
    setStartOfWeek(OPTIONS[index.row].value);
  };

  return (
    <Widget title="Start of Week">
      <Select
        label={(props) => (
          <Text {...props}>Choose the first day of the week</Text>
        )}
        onSelect={onSelect}
        selectedIndex={selectedIndex}
        value={OPTIONS[selectedIndex.row].title}
      >
        {OPTIONS.map((option) => (
          <SelectItem key={option.value} title={option.title} />
        ))}
      </Select>
    </Widget>
  );
};
