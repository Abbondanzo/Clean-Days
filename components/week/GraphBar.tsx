import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { DEFAULT_NO_DAY_VALUE } from '../../constants/Days';
import { Day } from '../../types/Day';

const MIN_HEIGHT_PCT = 0.1;

interface Props {
  max: number;
  day: Day;
}

export const GraphBar = ({ day, max }: Props) => {
  const height = useMemo(() => {
    const pct =
      day.value === DEFAULT_NO_DAY_VALUE
        ? 0
        : MIN_HEIGHT_PCT + (1 - MIN_HEIGHT_PCT) * (day.value / max);
    return pct * 100;
  }, [day.value, max]);
  console.log(day.value, max);
  return (
    <View
      style={[
        styles.bar,
        {
          height: `${height}%`,
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  bar: {
    backgroundColor: 'red',
    borderRadius: 8,
    cursor: 'pointer',
    width: '100%',
  },
});
