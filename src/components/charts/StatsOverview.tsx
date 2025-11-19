import { useMemo } from 'react';
import { useSettingsStore } from '../../store/settingsStore';
import { useTrackedDaysStore } from '../../store/trackedDaysStore';
import type { BasicDate } from '../../types/BasicDate';
import { getDayFromDate } from '../../utils/basicDateUtils';
import { generateLast30DaysData } from '../../utils/chartUtils';
import { Widget } from '../theme/Widget';

export const StatsOverview = () => {
  const trackedDays = useTrackedDaysStore(state => state.trackedDays);
  const { targetDrinks } = useSettingsStore();

  const stats = useMemo(() => {
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

    const dailyData = generateLast30DaysData(getCountByDate, getTargetByDate);

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
  }, [trackedDays, targetDrinks]);

  const getPercentageColor = (percentage: number) => {
    if (percentage >= 100) return '#51cf66';
    if (percentage >= 80) return '#ffd43b';
    return '#ff6b6b';
  };

  return (
    <Widget title="30-Day Summary">
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '16px',
          fontFamily: "'Space Mono', 'Courier New', monospace",
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: 'var(--text-primary)',
            }}
          >
            {stats.totalCount}
          </div>
          <div
            style={{
              fontSize: '12px',
              color: 'var(--text-secondary)',
            }}
          >
            Total Drinks
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: 'var(--text-primary)',
            }}
          >
            {stats.averageDaily}
          </div>
          <div
            style={{
              fontSize: '12px',
              color: 'var(--text-secondary)',
            }}
          >
            Daily Average
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: getPercentageColor(stats.successRate),
            }}
          >
            {stats.successRate}%
          </div>
          <div
            style={{
              fontSize: '12px',
              color: 'var(--text-secondary)',
            }}
          >
            Success Rate
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color:
                stats.currentStreak > 0 ? '#51cf66' : 'var(--text-primary)',
            }}
          >
            {stats.currentStreak}
          </div>
          <div
            style={{
              fontSize: '12px',
              color: 'var(--text-secondary)',
            }}
          >
            Dry Streak
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: '16px',
          padding: '12px',
          backgroundColor: 'var(--bg-tertiary)',
          borderRadius: '8px',
          fontSize: '14px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Successful Days:</span>
          <span style={{ fontWeight: 'bold' }}>
            {stats.successfulDays}/{stats.daysWithData}
          </span>
        </div>
        <div
          style={{
            marginTop: '4px',
            height: '4px',
            backgroundColor: 'var(--border-color)',
            borderRadius: '2px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${stats.daysWithData > 0 ? (stats.successfulDays / stats.daysWithData) * 100 : 0}%`,
              backgroundColor: '#51cf66',
              borderRadius: '2px',
            }}
          />
        </div>
      </div>
    </Widget>
  );
};
