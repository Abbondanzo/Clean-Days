import { useMemo } from 'react';
import { VictoryAxis, VictoryBar, VictoryChart, VictoryTheme } from 'victory';
import { useSettingsStore } from '../../store/settingsStore';
import { useTrackedDaysStore } from '../../store/trackedDaysStore';
import type { BasicDate } from '../../types/BasicDate';
import { getDayFromDate } from '../../utils/basicDateUtils';
import {
  generateLast30DaysData,
  getWeeklySummary,
} from '../../utils/chartUtils';
import { Widget } from '../theme/Widget';

export const WeeklyPerformanceChart = () => {
  const trackedDays = useTrackedDaysStore(state => state.trackedDays);
  const { targetDrinks, startOfWeek } = useSettingsStore();

  const chartData = useMemo(() => {
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
    const weeklyData = getWeeklySummary(dailyData, startOfWeek);

    // Filter out weeks with no tracked data (averageCount and averagePercentage both 0 means no days were set)
    const weeksWithData = weeklyData.filter(
      week => !(week.averageCount === 0 && week.averagePercentage === 0),
    );

    // Take up to 4 weeks and display them chronologically (oldest to newest)
    const last4Weeks = weeksWithData.slice(0, 4).reverse(); // Reverse to show oldest first

    return last4Weeks.map((week, index) => ({
      week: `${week.week}`, // Use the actual date range from the week
      x: index + 1,
      y: week.averagePercentage,
      label: `${week.averagePercentage}%`,
      actualCount: week.averageCount,
      target: week.averageTarget,
    }));
  }, [trackedDays, targetDrinks, startOfWeek]);

  const getBarColor = (percentage: number) => {
    if (percentage >= 100) return '#51cf66'; // Green for meeting/exceeding target
    if (percentage >= 80) return '#ffd43b'; // Yellow for close to target
    return '#ff6b6b'; // Red for below target
  };

  return (
    <Widget title="Weekly Performance">
      <div style={{ width: '100%' }}>
        <VictoryChart
          theme={VictoryTheme.material}
          width={350}
          height={200}
          padding={{ left: 50, right: 20, top: 20, bottom: 40 }}
          domainPadding={{ x: 50 }}
        >
          <VictoryAxis
            dependentAxis
            tickFormat={t => `${t}%`}
            style={{
              tickLabels: {
                fontSize: 12,
                fill: 'var(--text-secondary)',
                fontFamily: "'Space Mono', 'Courier New', monospace",
              },
              axis: { stroke: 'var(--border-color)' },
              grid: { stroke: 'var(--border-color)', strokeOpacity: 0.3 },
            }}
          />
          <VictoryAxis
            tickFormat={x => chartData[x - 1]?.week || ''}
            style={{
              axis: { stroke: 'var(--border-color)' },
              tickLabels: {
                fontSize: 12,
                fill: 'var(--text-secondary)',
                fontFamily: "'Space Mono', 'Courier New', monospace",
              },
            }}
          />

          <VictoryBar
            data={chartData}
            x="x"
            y="y"
            style={{
              data: {
                fill: ({ datum }) => getBarColor(datum.y),
                stroke: 'var(--border-color)',
                strokeWidth: 1,
              },
            }}
            labelComponent={<></>}
          />
        </VictoryChart>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(28px, 1fr))',
            gap: '8px',
            marginTop: '4px',
            fontSize: '11px',
            textAlign: 'center',
            fontFamily: "'Space Mono', 'Courier New', monospace",
          }}
        >
          {chartData.map((week, index) => (
            <div key={index} style={{ color: 'var(--text-secondary)' }}>
              <div style={{ fontWeight: 'bold', color: getBarColor(week.y) }}>
                {week.y}%
              </div>
              <div>{week.actualCount.toFixed(1)} avg</div>
            </div>
          ))}
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '16px',
            marginTop: '6px',
            fontSize: '12px',
            fontFamily: "'Space Mono', 'Courier New', monospace",
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div
              style={{
                width: '12px',
                height: '12px',
                backgroundColor: '#51cf66',
              }}
            />
            <span>≥100%</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div
              style={{
                width: '12px',
                height: '12px',
                backgroundColor: '#ffd43b',
              }}
            />
            <span>80-99%</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div
              style={{
                width: '12px',
                height: '12px',
                backgroundColor: '#ff6b6b',
              }}
            />
            <span>&lt;80%</span>
          </div>
        </div>
      </div>
    </Widget>
  );
};
