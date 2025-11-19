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

export const getWeeklySummary = (
  dailyData: DailyStats[],
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

  // Group by weeks (7-day chunks)
  for (let i = 0; i < dailyData.length; i += 7) {
    const weekData = dailyData.slice(i, i + 7);
    if (weekData.length === 0) continue;

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

    const weekStart = weekData[0].date;
    const weekEnd = weekData[weekData.length - 1].date;
    const weekLabel = `${weekStart.month}/${weekStart.day} - ${weekEnd.month}/${weekEnd.day}`;

    weeks.push({
      week: weekLabel,
      averageCount: Math.round(avgCount * 10) / 10,
      averageTarget: Math.round(avgTarget * 10) / 10,
      averagePercentage: Math.round(successRate),
    });
  }

  return weeks.reverse(); // Most recent first
};
