import AsyncStorage from '@react-native-async-storage/async-storage';
import { produce } from 'immer';
import { create } from 'zustand';
import {
  createJSONStorage,
  devtools,
  persist,
  StateStorage,
} from 'zustand/middleware';
import { DEFAULT_NO_DAY_VALUE } from '../constants/Days';
import { BasicDate } from '../types/BasicDate';

type TrackedDays = {
  [year: string]: { [month: string]: number[] };
};

// Custom storage object
const storage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    return AsyncStorage.getItem(name);
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await AsyncStorage.setItem(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await AsyncStorage.removeItem(name);
  },
};

interface Store {
  trackedDays: TrackedDays;
  setCountForDay: (date: BasicDate, count: number) => void;
}

const getEmptyMonthArray = (date: BasicDate): number[] => {
  const daysInMonth = new Date(date.year, date.month + 2, 0).getDate();
  return new Array(daysInMonth).fill(DEFAULT_NO_DAY_VALUE);
};

export const useTrackedDaysStore = create<Store>()(
  devtools(
    persist(
      (set) => ({
        trackedDays: {},
        setCountForDay: (date, count) => {
          set(
            produce((state: Store) => {
              const curYear = state.trackedDays[date.year] || {};
              state.trackedDays[date.year] = curYear;
              const curMonth = curYear[date.month] || getEmptyMonthArray(date);
              curYear[date.month] = curMonth;
              curMonth[date.day - 1] = count;
              state.trackedDays[date.year] = curYear;
            }),
          );
        },
      }),
      {
        name: 'tracked-days-storage',
        version: 0,
        migrate: (persistedState, version) => {
          console.log('On version 0, no migration necessary');
          return persistedState;
        },
        storage: createJSONStorage(() => storage),
      },
    ),
  ),
);

const selectByDate = (date: BasicDate) => (state: Store) => {
  const curYear = state.trackedDays[date.year];
  if (!curYear) return DEFAULT_NO_DAY_VALUE;
  const curMonth = curYear[date.month];
  if (!curMonth) return DEFAULT_NO_DAY_VALUE;
  const currentDayValue = curMonth[date.day - 1];
  return typeof currentDayValue === 'number'
    ? currentDayValue
    : DEFAULT_NO_DAY_VALUE;
};

export const useCountByDate = (date: BasicDate) => {
  return useTrackedDaysStore(selectByDate(date));
};
