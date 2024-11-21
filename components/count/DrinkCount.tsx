import { Text, TextProps } from '@ui-kitten/components';
import { TextStyle } from 'react-native';
import { DEFAULT_NO_DAY_VALUE } from '../../constants/Days';
import { useCountByDate } from '../../store/trackedDaysStore';
import { BasicDate } from '../../types/BasicDate';

interface Props extends TextProps {
  date: BasicDate;
  truncate?: boolean;
}

export const DrinkCount = ({ date, truncate = false, ...rest }: Props) => {
  const count = useCountByDate(date);
  return (
    <Text {...rest}>
      {count === DEFAULT_NO_DAY_VALUE
        ? '-'
        : count >= 99 && truncate
          ? '99+'
          : count}
    </Text>
  );
};
