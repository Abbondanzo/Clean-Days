import { DEFAULT_NO_DAY_VALUE } from '../constants/Days';
import type { CountStatus } from '../types/CountStatus';

const WARNING_THRESHOLD = 2;

export const getStatusFromCount = (count: number, max: number): CountStatus => {
  if (count === DEFAULT_NO_DAY_VALUE) {
    return 'none';
  }
  if (count <= max) {
    return 'good';
  }
  if (count <= max + WARNING_THRESHOLD) {
    return 'warning';
  }
  return 'danger';
};
