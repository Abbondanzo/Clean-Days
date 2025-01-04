import { BasicDate } from '../types/BasicDate';

const ONE_DAY = 1000 * 60 * 60 * 24;
const LONG_FORMATTER = new Intl.DateTimeFormat('en-US', { weekday: 'long' });
const SHORT_FORMATTER = new Intl.DateTimeFormat('en-US', { weekday: 'short' });
const NARROW_FORMATTER = new Intl.DateTimeFormat('en-US', {
  weekday: 'narrow',
});
const MONTH_FORMATTER = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
});
const MONTH_FORMATTER_WITH_YEAR = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

const basicDateToDate = (date: BasicDate): Date => {
  return new Date(date.year, date.month - 1, date.day);
};

const dateToBasicDate = (date: Date): BasicDate => {
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
  };
};

export const getToday = (): BasicDate => {
  return dateToBasicDate(new Date());
};

export const getStartOfWeek = (date: BasicDate): BasicDate => {
  // Start of week is Monday
  const today = basicDateToDate(date);
  const daysUntilStart = (today.getDay() + 6) % 7;
  const weekStartDate = new Date(today.getTime() - daysUntilStart * ONE_DAY);
  return {
    year: weekStartDate.getFullYear(),
    month: weekStartDate.getMonth() + 1,
    day: weekStartDate.getDate(),
  };
};

export const addDaysToDate = (date: BasicDate, days: number): BasicDate => {
  const rawDate = basicDateToDate(date);
  rawDate.setDate(rawDate.getDate() + days);
  return dateToBasicDate(rawDate);
};

export const getDateStringFromBasicDate = (
  date: BasicDate,
  format: 'long' | 'short' | 'narrow' | 'month',
): string => {
  switch (format) {
    case 'long':
      return LONG_FORMATTER.format(basicDateToDate(date));
    case 'short':
      return SHORT_FORMATTER.format(basicDateToDate(date));
    case 'narrow':
      return NARROW_FORMATTER.format(basicDateToDate(date));
    case 'month':
      if (date.year === new Date().getFullYear()) {
        return MONTH_FORMATTER.format(basicDateToDate(date));
      } else {
        return MONTH_FORMATTER_WITH_YEAR.format(basicDateToDate(date));
      }
  }
};

export const isEqual = (dateA: BasicDate, dateB: BasicDate): boolean => {
  return (
    dateA.year === dateB.year &&
    dateA.month === dateB.month &&
    dateA.day === dateB.day
  );
};
