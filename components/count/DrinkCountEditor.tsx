import { Button, Icon, IconProps, Text } from '@ui-kitten/components';
import { View, StyleSheet } from 'react-native';
import { BasicDate } from '../../types/BasicDate';
import {
  useCountByDate,
  useTrackedDaysStore,
} from '../../store/trackedDaysStore';
import { DrinkCount } from './DrinkCount';
import { useCallback } from 'react';

interface Props {
  date: BasicDate;
}

const MinusIcon = (props: IconProps) => (
  <Icon {...props} name="minus-outline" />
);
const PlusIcon = (props: IconProps) => <Icon {...props} name="plus-outline" />;

export const DrinkCountEditor = ({ date }: Props) => {
  const count = useCountByDate(date);
  const { setCountForDay } = useTrackedDaysStore();
  const decrementCount = useCallback(
    () => setCountForDay(date, count - 1),
    [date, count, setCountForDay],
  );
  const incrementCount = useCallback(
    () => setCountForDay(date, count + 1),
    [date, count, setCountForDay],
  );

  return (
    <View style={styles.container}>
      <Button
        accessoryLeft={MinusIcon}
        appearance="outline"
        disabled={count <= 0}
        onPress={decrementCount}
        style={styles.button}
      />
      <View style={styles.drinkCountContainer}>
        <DrinkCount category="h1" date={date} style={styles.drinkCountText} />
        <Text appearance="hint">/8</Text>
      </View>
      <Button
        accessoryLeft={PlusIcon}
        appearance="filled"
        onPress={incrementCount}
        style={styles.button}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 48,
    height: 48,
    borderRadius: 48,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    flex: 1,
  },
  drinkCountContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    minHeight: 120,
  },
  drinkCountText: {
    fontSize: 48,
  },
});
