import { useMemo, useState } from 'react';
import { useSettingsStore } from '../../store/settingsStore';
import { useTrackedDaysStore } from '../../store/trackedDaysStore';
import type { BasicDate } from '../../types/BasicDate';
import { getDayFromDate } from '../../utils/basicDateUtils';
import {
  generateCurrentYearData,
  generateLast30DaysData,
  generateLifetimeData,
  type EnhancedDailyStats,
} from '../../utils/chartUtils';
import { Widget } from '../theme/Widget';
import './charts.css';

type StatsPeriod = '30-day' | 'year' | 'lifetime';

export const StatsOverview = () => {
  const trackedDays = useTrackedDaysStore(state => state.trackedDays);
  const { targetDrinks } = useSettingsStore();
  const [selectedPeriod, setSelectedPeriod] = useState<StatsPeriod>('30-day');

  const result = useMemo(() => {
    const getCountByDate = (date: BasicDate) => {
      const curYear = trackedDays[date.year];
      if (!curYear) return -1; // Unset
      const curMonth = curYear[date.month];
      if (!curMonth) return -1; // Unset
      const currentDayValue = curMonth[date.day - 1];
      return typeof currentDayValue === 'number' ? currentDayValue : -1; // Preserve original value including -1
    };

    const getTargetByDate = (date: BasicDate) => {
      const dayIndex = getDayFromDate(date);
      return targetDrinks[dayIndex];
    };

    let dailyData: EnhancedDailyStats[];

    switch (selectedPeriod) {
      case 'year':
        dailyData = generateCurrentYearData(getCountByDate, getTargetByDate);
        break;
      case 'lifetime':
        dailyData = generateLifetimeData(trackedDays, getTargetByDate);
        break;
      default: {
        // Convert the basic stats to enhanced stats for consistency
        const basicData = generateLast30DaysData(
          getCountByDate,
          getTargetByDate,
        );
        dailyData = basicData.map(day => ({
          ...day,
          success: day.count >= 0 && day.count <= day.target,
        }));
        break;
      }
    }

    // Only include days that have been set by the user (count >= 0)
    const setDays = dailyData.filter(day => day.count >= 0);

    const totalCount = Math.max(
      0,
      setDays.reduce((sum, day) => sum + day.count, 0),
    );
    const daysWithData = setDays.length;
    const successfulDays = setDays.filter(
      day => day.count <= day.target,
    ).length;
    const averageDaily =
      daysWithData > 0 ? Math.max(0, totalCount / daysWithData) : 0;
    const successRate =
      daysWithData > 0 ? (successfulDays / daysWithData) * 100 : 0;

    // Calculate dry streak (consecutive days with 0 drinks)
    let currentStreak = 0;
    for (let i = dailyData.length - 1; i >= 0; i--) {
      const day = dailyData[i];
      if (day.count === 0) {
        currentStreak++;
      } else {
        break;
      }
    }

    return {
      totalCount: Math.max(0, Math.round(totalCount)),
      averageDaily: Math.max(0, Math.round(averageDaily * 10) / 10),
      successRate: Math.max(0, Math.round(successRate)),
      successfulDays: Math.max(0, successfulDays),
      daysWithData: Math.max(0, daysWithData),
      currentStreak: Math.max(0, currentStreak),
    };
  }, [trackedDays, targetDrinks, selectedPeriod]);

  const stats = result;

  const getPercentageColor = (percentage: number) => {
    if (percentage >= 100) return 'var(--color-success)';
    if (percentage >= 80) return 'var(--color-warning)';
    return 'var(--color-error)';
  };

  return (
    <Widget
      title={
        <div className="stats-header">
          <span>Summary</span>
          <div className="period-selector">
            <select
              className="settings-select"
              value={selectedPeriod}
              onChange={e => setSelectedPeriod(e.target.value as StatsPeriod)}
            >
              <option value="30-day">30 Days</option>
              <option value="year">Current Year</option>
              <option value="lifetime">Lifetime</option>
            </select>
          </div>
        </div>
      }
    >
      <div className="stats-grid">
        <div className="stats-item">
          <div className="stats-value">{stats.totalCount}</div>
          <div className="stats-label">Total Drinks</div>
        </div>

        <div className="stats-item">
          <div className="stats-value">{stats.averageDaily}</div>
          <div className="stats-label">Daily Average</div>
        </div>

        <div className="stats-item">
          <div
            className="stats-value"
            style={{ color: getPercentageColor(stats.successRate) }}
          >
            {stats.successRate}%
          </div>
          <div className="stats-label">Success Rate</div>
        </div>

        <div className="stats-item">
          <div
            className="stats-value"
            style={{
              color:
                stats.currentStreak > 0
                  ? 'var(--color-success)'
                  : 'var(--text-primary)',
            }}
          >
            {stats.currentStreak}
          </div>
          <div className="stats-label">Dry Streak</div>
        </div>
      </div>

      <div className="stats-summary">
        <div className="stats-summary-row">
          <span>Successful Days:</span>
          <span className="stats-summary-value">
            {stats.successfulDays}/{stats.daysWithData}
          </span>
        </div>
        <div className="stats-progress-bar">
          <div
            className="stats-progress-fill"
            style={{
              width: `${stats.daysWithData > 0 ? (stats.successfulDays / stats.daysWithData) * 100 : 0}%`,
            }}
          />
        </div>
      </div>
    </Widget>
  );
};
