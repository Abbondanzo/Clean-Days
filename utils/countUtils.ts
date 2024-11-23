import { DEFAULT_NO_DAY_VALUE } from '../constants/Days';
import { CountStatus } from '../types/CountStatus';

const WARNING_THRESHOLD = 1.2;
const ERROR_THRESHOLD = 2;

export const getStatusFromCount = (count: number, max: number): CountStatus => {
  if (count === DEFAULT_NO_DAY_VALUE) {
    return 'none';
  }
  const ratio = max === 0 ? count : count / max;
  if (ratio < WARNING_THRESHOLD) {
    return 'good';
  }
  if (ratio < ERROR_THRESHOLD) {
    return 'warning';
  }
  return 'danger';
};
