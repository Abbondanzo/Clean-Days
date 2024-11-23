import { Text } from '@ui-kitten/components';
import { View, StyleSheet, ViewStyle, Pressable } from 'react-native';
import { useCountByDate } from '../../store/trackedDaysStore';
import { BasicDate } from '../../types/BasicDate';
import { getDateStringFromBasicDate } from '../../utils/basicDateUtils';
import { DrinkCount } from '../count/DrinkCount';
import { useMemo } from 'react';
import { getStatusFromCount } from '../../utils/countUtils';

interface Props {
  date: BasicDate;
  selected: boolean;
  onSelect: () => void;
}

const DANGER_COLOR = 'red';
const WARNING_COLOR = '#ebb946';
const GOOD_COLOR = '#60d013';
const DEFAULT_COLOR = '#eee';
const DEFAULT_COLOR_SELECTED = '#8d95a1';

export const WeekPickerRowItem = ({ date, selected, onSelect }: Props) => {
  const count = useCountByDate(date);
  // TODO: Store max in a weekly constant
  const status = useMemo(() => getStatusFromCount(count, 8), [count]);
  const outerStyle = useMemo((): ViewStyle => {
    if (!selected) {
      return {};
    }
    switch (status) {
      case 'danger':
        return { backgroundColor: DANGER_COLOR, borderColor: DANGER_COLOR };
      case 'warning':
        return { backgroundColor: WARNING_COLOR, borderColor: WARNING_COLOR };
      case 'good':
        return { backgroundColor: GOOD_COLOR, borderColor: GOOD_COLOR };
      default:
        return {
          backgroundColor: DEFAULT_COLOR_SELECTED,
          borderColor: DEFAULT_COLOR_SELECTED,
        };
    }
  }, [selected, status]);
  const statusStyle = useMemo((): ViewStyle => {
    switch (status) {
      case 'danger':
        return { backgroundColor: DANGER_COLOR };
      case 'warning':
        return { backgroundColor: WARNING_COLOR };
      case 'good':
        return { backgroundColor: GOOD_COLOR };
      default:
        return { backgroundColor: DEFAULT_COLOR };
    }
  }, [status]);
  return (
    <View style={styles.container}>
      <Text appearance={selected ? 'default' : 'hint'} style={styles.dateText}>
        {getDateStringFromBasicDate(date, 'short')}
      </Text>
      <Pressable
        accessibilityState={{ selected }}
        onPress={onSelect}
        style={[styles.outerCountContainer, outerStyle]}
      >
        <View
          style={[styles.countContainer, !selected ? statusStyle : undefined]}
        >
          <DrinkCount
            appearance="alternative"
            date={date}
            style={styles.countText}
          />
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countContainer: {
    height: 60,
    borderColor: 'transparent',
    borderWidth: 2,
    borderRadius: 8,
    width: '100%',
    minWidth: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countText: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  dateText: {
    fontSize: 14,
  },
  outerCountContainer: {
    borderColor: DEFAULT_COLOR,
    borderWidth: 2,
    borderRadius: 12,
    padding: 2,
  },
});
