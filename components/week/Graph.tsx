import { StyleSheet, View } from 'react-native';
import { Day } from '../../types/Day';
import { GraphBar } from './GraphBar';
import { useMemo } from 'react';

interface Props {
  days: Day[];
}

/**
 * The amount of "room" to show above the target line
 */
const STEPS_ABOVE_MAX = 1;

export const Graph = ({ days }: Props) => {
  const max = useMemo(() => {
    return Math.max(
      ...days.map((day) => Math.max(day.value, day.target + STEPS_ABOVE_MAX)),
    );
  }, [days]);
  return (
    <View style={styles.graph}>
      {days.map((day, index) => (
        <View key={index} style={styles.graphBarWrapper}>
          <GraphBar day={day} max={max} />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  graph: {
    alignItems: 'flex-end',
    backgroundColor: '#ddd',
    display: 'flex',
    flexDirection: 'row',
    height: 300,
    paddingHorizontal: 2,
  },
  graphBarWrapper: {
    flex: 1,
    height: '100%',
    justifyContent: 'flex-end',
    paddingHorizontal: 2,
  },
});
