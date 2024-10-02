import AsyncStorage from '@react-native-async-storage/async-storage'
import { produce } from 'immer'
import { create } from 'zustand'
import {
  createJSONStorage,
  devtools,
  persist,
  StateStorage,
} from 'zustand/middleware'
import { DEFAULT_NO_DAY_VALUE } from '../constants/Days'

type TrackedDays = {
  [year: string]: { [month: string]: number[] }
}

// Custom storage object
const storage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    return AsyncStorage.getItem(name)
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await AsyncStorage.setItem(name, value)
  },
  removeItem: async (name: string): Promise<void> => {
    await AsyncStorage.removeItem(name)
  },
}

interface Store {
  trackedDays: TrackedDays
  setCountForDay: (date: Date, count: number) => void
}

const getEmptyMonthArray = (date: Date): number[] => {
  const daysInMonth = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0,
  ).getDate()
  return new Array(daysInMonth).fill(DEFAULT_NO_DAY_VALUE)
}

export const useTrackedDaysStore = create<Store>()(
  devtools(
    persist(
      (set) => ({
        trackedDays: {},
        setCountForDay: (date, count) => {
          set(
            produce((state: Store) => {
              const curYear = state.trackedDays[date.getFullYear()] || {}
              state.trackedDays[date.getFullYear()] = curYear
              const curMonth =
                curYear[date.getMonth()] || getEmptyMonthArray(date)
              curYear[date.getMonth()] = curMonth
              curMonth[date.getDate()] = count
              state.trackedDays[date.getFullYear()] = curYear
            }),
          )
        },
      }),
      {
        name: 'tracked-days-storage',
        version: 0,
        migrate: (persistedState, version) => {
          console.log('On version 0, no migration necessary')
          return persistedState
        },
        storage: createJSONStorage(() => storage),
      },
    ),
  ),
)

export const selectByDate = (date: Date) => (state: Store) => {
  const curYear = state.trackedDays[date.getFullYear()]
  if (!curYear) return DEFAULT_NO_DAY_VALUE
  const curMonth = curYear[date.getMonth()]
  if (!curMonth) return DEFAULT_NO_DAY_VALUE
  const currentDayValue = curMonth[date.getDate()]
  return typeof currentDayValue === 'number'
    ? currentDayValue
    : DEFAULT_NO_DAY_VALUE
}
