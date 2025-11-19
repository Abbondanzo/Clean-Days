import type { BasicDate } from '../types/BasicDate';
import { addDaysToDate, getToday } from './basicDateUtils';

export interface ChartDataPoint {
  x: number;
  y: number;
  date: BasicDate;
}

export interface DailyStats {
  date: BasicDate;
  count: number;
  target: number;
  percentage: number;
}

export const generateLast30DaysData = (
  getCountByDate: (date: BasicDate) => number,
  getTargetByDate: (date: BasicDate) => number,
): DailyStats[] => {
  const today = getToday();
  const data: DailyStats[] = [];

  for (let i = 29; i >= 0; i--) {
    const date = addDaysToDate(today, -i);
    const count = getCountByDate(date);
    const target = getTargetByDate(date);
    const percentage = count <= target ? 100 : 0;

    data.push({
      date,
      count,
      target,
      percentage,
    });
  }

  return data;
};

export const calculateTrendLine = (
  data: ChartDataPoint[],
): ChartDataPoint[] => {
  const n = data.length;
  if (n < 2) return data;

  // Simple linear regression
  const sumX = data.reduce((sum, point) => sum + point.x, 0);
  const sumY = data.reduce((sum, point) => sum + point.y, 0);
  const sumXY = data.reduce((sum, point) => sum + point.x * point.y, 0);
  const sumXX = data.reduce((sum, point) => sum + point.x * point.x, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  return data.map(point => ({
    x: point.x,
    y: slope * point.x + intercept,
    date: point.date,
  }));
};

export const calculateMovingAverage = (
  data: ChartDataPoint[],
  window: number = 7,
): ChartDataPoint[] => {
  const result: ChartDataPoint[] = [];

  for (let i = 0; i < data.length; i++) {
    const start = Math.max(0, i - window + 1);
    const end = i + 1;
    const windowData = data.slice(start, end);
    const average =
      windowData.reduce((sum, point) => sum + point.y, 0) / windowData.length;

    result.push({
      x: data[i].x,
      y: average,
      date: data[i].date,
    });
  }

  return result;
};

const getWeekStart = (date: BasicDate, startOfWeek: number): BasicDate => {
  // Convert date to JavaScript Date to calculate day of week
  const jsDate = new Date(date.year, date.month - 1, date.day);
  const dayOfWeek = jsDate.getDay(); // 0 = Sunday, 1 = Monday, etc.

  // Calculate days to subtract to get to start of week
  const daysToSubtract = (dayOfWeek - startOfWeek + 7) % 7;

  // Subtract days to get week start
  const weekStartDate = new Date(jsDate);
  weekStartDate.setDate(jsDate.getDate() - daysToSubtract);

  return {
    year: weekStartDate.getFullYear(),
    month: weekStartDate.getMonth() + 1,
    day: weekStartDate.getDate(),
  };
};

export const getWeeklySummary = (
  dailyData: DailyStats[],
  startOfWeek: number,
): Array<{
  week: string;
  averageCount: number;
  averageTarget: number;
  averagePercentage: number;
}> => {
  const weeks: Array<{
    week: string;
    averageCount: number;
    averageTarget: number;
    averagePercentage: number;
  }> = [];

  // Group by actual calendar weeks
  const weekGroups = new Map<string, DailyStats[]>();

  dailyData.forEach(day => {
    const weekStart = getWeekStart(day.date, startOfWeek);
    const weekKey = `${weekStart.year}-${weekStart.month}-${weekStart.day}`;

    if (!weekGroups.has(weekKey)) {
      weekGroups.set(weekKey, []);
    }
    weekGroups.get(weekKey)!.push(day);
  });

  // Process each week group
  for (const [, weekData] of weekGroups) {
    // Only include days that have been set (count >= 0)
    const setDaysInWeek = weekData.filter(day => day.count >= 0);

    let avgCount = 0;
    let avgTarget = 0;
    let successRate = 0;

    if (setDaysInWeek.length > 0) {
      avgCount =
        setDaysInWeek.reduce((sum, day) => sum + day.count, 0) /
        setDaysInWeek.length;
      avgTarget =
        setDaysInWeek.reduce((sum, day) => sum + day.target, 0) /
        setDaysInWeek.length;

      // Calculate success rate: percentage of set days that stayed within target
      const successfulDays = setDaysInWeek.filter(
        day => day.count <= day.target,
      ).length;
      successRate = (successfulDays / setDaysInWeek.length) * 100;
    }

    // Use the actual week start date
    const weekStart = getWeekStart(weekData[0].date, startOfWeek);
    const weekLabel = `${weekStart.month}/${weekStart.day}`;

    weeks.push({
      week: weekLabel,
      averageCount: Math.round(avgCount * 10) / 10,
      averageTarget: Math.round(avgTarget * 10) / 10,
      averagePercentage: Math.round(successRate),
    });
  }

  // Sort weeks by parsing the date from the week label (most recent first)
  weeks.sort((a, b) => {
    const [monthA, dayA] = a.week.split('/').map(Number);
    const [monthB, dayB] = b.week.split('/').map(Number);

    // Assume current year for comparison
    const currentYear = new Date().getFullYear();
    const dateA = new Date(currentYear, monthA - 1, dayA);
    const dateB = new Date(currentYear, monthB - 1, dayB);

    return dateB.getTime() - dateA.getTime();
  });

  return weeks;
};
