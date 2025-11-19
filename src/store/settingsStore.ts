import { produce } from 'immer';
import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { storage } from './storage';

const DEFAULT_DAY_OF_WEEK = 1; // Monday

interface Store {
  startOfWeek: number;
  setStartOfWeek: (startOfWeek: number) => void;
  targetDrinks: number[];
  setTargetDrinks: (targetDrinks: number[]) => void;
}

export const useSettingsStore = create<Store>()(
  devtools(
    persist(
      set => ({
        startOfWeek: DEFAULT_DAY_OF_WEEK,
        setStartOfWeek: (newDayOfWeek: number) => {
          set(
            produce((state: Store) => {
              state.startOfWeek = newDayOfWeek;
            }),
          );
        },
        targetDrinks: [0, 0, 0, 0, 0, 0, 0],
        setTargetDrinks: (newTargetDrinks: number[]) => {
          set(
            produce((state: Store) => {
              state.targetDrinks = newTargetDrinks;
            }),
          );
        },
      }),
      {
        name: 'settings-storage',
        version: 0,
        migrate: persistedState => {
          console.log('On version 0, no migration necessary');
          return persistedState;
        },
        storage: createJSONStorage(() => storage),
      },
    ),
  ),
);
