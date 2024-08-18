import AsyncStorage from '@react-native-async-storage/async-storage';
import { produce } from 'immer';
import { create } from 'zustand';
import {
  createJSONStorage,
  devtools,
  persist,
  StateStorage,
} from 'zustand/middleware';

type TrackedDays = {
  [year: string]: { [month: string]: { [day: string]: number } };
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
  setCountForDay: (date: Date, count: number) => void;
}

export const useTrackedDaysStore = create<Store>()(
  devtools(
    persist(
      (set, get) => ({
        trackedDays: {},
        setCountForDay: (date, count) => {
          set(
            produce((state: Store) => {
              const curYear = state.trackedDays[date.getFullYear()] || {};
              state.trackedDays[date.getFullYear()] = curYear;
              const curMonth = curYear[date.getMonth()] || {};
              curYear[date.getMonth()] = curMonth;
              curMonth[date.getDate()] = count;
              state.trackedDays[date.getFullYear()] = curYear;
            })
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
      }
    )
  )
);

export const selectByDate = (date: Date) => (state: Store) => {
  const curYear = state.trackedDays[date.getFullYear()];
  if (!curYear) return 0;
  const curMonth = curYear[date.getMonth()];
  if (!curMonth) return 0;
  return curMonth[date.getDate()] || 0;
};
