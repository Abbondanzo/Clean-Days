import { DEFAULT_NO_DAY_VALUE } from '../../constants/Days';
import { useCountByDate } from '../../store/trackedDaysStore';
import type { BasicDate } from '../../types/BasicDate';

interface Props extends React.HTMLAttributes<HTMLSpanElement> {
  date: BasicDate;
  truncate?: boolean;
}

export const DrinkCount = ({
  date,
  truncate = false,
  className,
  ...rest
}: Props) => {
  const count = useCountByDate(date);
  return (
    <span className={className} {...rest}>
      {count === DEFAULT_NO_DAY_VALUE
        ? '-'
        : count >= 99 && truncate
          ? '99+'
          : count}
    </span>
  );
};
