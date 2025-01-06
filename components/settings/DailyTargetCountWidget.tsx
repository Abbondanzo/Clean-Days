import { Input, Text } from '@ui-kitten/components';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSettingsStore } from '../../store/settingsStore';
import { Widget } from '../theme/Widget';

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const DailyTargetCountWidget = () => {
  const { startOfWeek, targetDrinks, setTargetDrinks } = useSettingsStore();
  const daysOfWeek = useMemo(() => {
    let start = startOfWeek;
    const days: { label: string; dayIndex: number }[] = [];
    while (days.length < DAYS_OF_WEEK.length) {
      days.push({
        label: DAYS_OF_WEEK[start],
        dayIndex: start,
      });
      start = (start + 1) % DAYS_OF_WEEK.length;
    }
    return days;
  }, [startOfWeek]);

  const onChangeTarget = (dayIndex: number) => (value: string) => {
    const newValue = parseInt(value);
    if (!isNaN(newValue)) {
      const newTargetDrinks = [...targetDrinks];
      newTargetDrinks[dayIndex] = newValue;
      setTargetDrinks(newTargetDrinks);
    }
  };

  // TODO: Replace with +/- buttons
  return (
    <Widget title="Target drinks per day">
      <View style={styles.formGroup}>
        {daysOfWeek.map((day, index) => (
          <View key={index}>
            <Input
              keyboardType="numeric"
              label={(evaProps) => <Text {...evaProps}>{day.label}</Text>}
              onChangeText={onChangeTarget(day.dayIndex)}
              value={targetDrinks[day.dayIndex].toString()}
            />
          </View>
        ))}
      </View>
    </Widget>
  );
};

const styles = StyleSheet.create({
  formGroup: {
    rowGap: 8,
  },
});
