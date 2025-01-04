import { Text, useTheme } from '@ui-kitten/components';
import { useMemo } from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import { useCountByDate } from '../../store/trackedDaysStore';
import { BasicDate } from '../../types/BasicDate';
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

const DANGER_COLOR = 'red';
const WARNING_COLOR = '#ebb946';
const GOOD_COLOR = '#60d013';

export const WeekPickerRowItem = ({ date, selected, onSelect }: Props) => {
  const count = useCountByDate(date);
  // TODO: Store max in a weekly constant
  const theme = useTheme();
  const status = useMemo(() => getStatusFromCount(count, 8), [count]);
  const outerStyle = useMemo((): ViewStyle => {
    if (!selected) {
      return {
        borderColor: theme['color-primary-disabled'],
      };
    }
    switch (status) {
      case 'danger':
        return {
          backgroundColor: DANGER_COLOR,
          borderColor: theme['color-primary-default'],
        };
      case 'warning':
        return {
          backgroundColor: WARNING_COLOR,
          borderColor: theme['color-primary-default'],
        };
      case 'good':
        return {
          backgroundColor: GOOD_COLOR,
          borderColor: theme['color-primary-default'],
        };
      default:
        return {
          borderColor: theme['color-primary-default'],
        };
    }
  }, [selected, status, theme]);
  const statusStyle = useMemo((): ViewStyle => {
    switch (status) {
      case 'danger':
        return { backgroundColor: DANGER_COLOR };
      case 'warning':
        return { backgroundColor: WARNING_COLOR };
      case 'good':
        return { backgroundColor: GOOD_COLOR };
      default:
        return {
          backgroundColor: theme['color-primary-disabled'],
        };
    }
  }, [status, theme]);
  const disabled = useMemo(() => isAfterToday(date), [date]);
  return (
    <View
      style={[
        styles.container,
        disabled ? styles.disabledPressable : undefined,
      ]}
    >
      <Text appearance={selected ? 'default' : 'hint'} style={styles.dateText}>
        {getDateStringFromBasicDate(date, 'short')}
      </Text>
      <Pressable
        accessibilityState={{ selected }}
        disabled={disabled}
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
    userSelect: 'none',
  },
  dateText: {
    fontSize: 14,
  },
  disabledPressable: {
    opacity: 0.3,
  },
  outerCountContainer: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 2,
  },
});
