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
import './charts.css';

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
    if (percentage >= 100) return 'var(--color-success)'; // Green for meeting/exceeding target
    if (percentage >= 80) return 'var(--color-warning)'; // Yellow for close to target
    return 'var(--color-error)'; // Red for below target
  };

  return (
    <Widget title="Weekly Performance">
      <div className="weekly-chart-container">
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
                fontFamily: 'var(--font-family)',
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
                fontFamily: 'var(--font-family)',
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

        <div className="weekly-chart-weeks-list">
          {chartData.map((week, index) => (
            <div key={index} className="weekly-chart-week-item">
              <div
                className="weekly-chart-week-percentage"
                style={{ color: getBarColor(week.y) }}
              >
                {week.y}%
              </div>
              <div>{week.actualCount.toFixed(1)} avg</div>
            </div>
          ))}
        </div>

        <div className="weekly-chart-legend">
          <div className="weekly-chart-legend-item">
            <div className="weekly-chart-legend-color weekly-chart-legend-color--excellent" />
            <span>≥100%</span>
          </div>
          <div className="weekly-chart-legend-item">
            <div className="weekly-chart-legend-color weekly-chart-legend-color--good" />
            <span>80-99%</span>
          </div>
          <div className="weekly-chart-legend-item">
            <div className="weekly-chart-legend-color weekly-chart-legend-color--needs-improvement" />
            <span>&lt;80%</span>
          </div>
        </div>
      </div>
    </Widget>
  );
};
