import { useMemo } from 'react';
import {
  VictoryArea,
  VictoryAxis,
  VictoryChart,
  VictoryLine,
  VictoryTheme,
} from 'victory';
import { useSettingsStore } from '../../store/settingsStore';
import { useTrackedDaysStore } from '../../store/trackedDaysStore';
import type { BasicDate } from '../../types/BasicDate';
import { getDayFromDate } from '../../utils/basicDateUtils';
import type { ChartDataPoint } from '../../utils/chartUtils';
import {
  calculateMovingAverage,
  calculateTrendLine,
  generateLast30DaysData,
} from '../../utils/chartUtils';
import { Widget } from '../theme/Widget';

export const Last30DaysTrendChart = () => {
  const trackedDays = useTrackedDaysStore(state => state.trackedDays);
  const { targetDrinks } = useSettingsStore();

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

    // Only include days that have been set (count >= 0)
    const setDaysData = dailyData.filter(day => day.count >= 0);

    const countData: ChartDataPoint[] = setDaysData.map((day, index) => ({
      x: index + 1,
      y: day.count,
      date: day.date,
    }));

    const targetData: ChartDataPoint[] = setDaysData.map((day, index) => ({
      x: index + 1,
      y: day.target,
      date: day.date,
    }));

    const movingAvg = calculateMovingAverage(countData, 7);
    const trendLine = calculateTrendLine(countData);

    return {
      actual: countData,
      target: targetData,
      movingAverage: movingAvg,
      trendLine,
    };
  }, [trackedDays, targetDrinks]);

  return (
    <Widget title="Last 30 Days Trend">
      <div style={{ width: '100%' }}>
        <VictoryChart
          theme={VictoryTheme.material}
          width={350}
          height={220}
          padding={{ left: 50, right: 20, top: 20, bottom: 30 }}
          domainPadding={{ x: 5 }}
        >
          <VictoryAxis
            dependentAxis
            tickFormat={t => `${t}`}
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
            tickFormat={() => ''}
            style={{
              axis: { stroke: 'var(--border-color)' },
              tickLabels: {
                fontSize: 10,
                fill: 'var(--text-secondary)',
                fontFamily: "'Space Mono', 'Courier New', monospace",
              },
            }}
          />

          {/* Target line (dashed) */}
          <VictoryLine
            data={chartData.target}
            style={{
              data: {
                stroke: 'var(--text-accent)',
                strokeWidth: 2,
                strokeDasharray: '5,5',
                strokeOpacity: 0.8,
              },
            }}
          />

          {/* Actual area chart */}
          <VictoryArea
            data={chartData.actual}
            style={{
              data: {
                fill: 'var(--text-accent)',
                fillOpacity: 0.3,
                stroke: 'var(--text-accent)',
                strokeWidth: 2,
              },
            }}
          />

          {/* 7-day moving average */}
          <VictoryLine
            data={chartData.movingAverage}
            style={{
              data: {
                stroke: '#ff6b6b',
                strokeWidth: 2,
              },
            }}
          />

          {/* Trend line */}
          <VictoryLine
            data={chartData.trendLine}
            style={{
              data: {
                stroke: '#51cf66',
                strokeWidth: 2,
                strokeDasharray: '3,3',
              },
            }}
          />
        </VictoryChart>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            marginTop: '4px',
            fontSize: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div
              style={{
                width: '16px',
                height: '3px',
                backgroundColor: 'var(--text-accent)',
              }}
            />
            <span>Actual</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div
              style={{
                width: '16px',
                height: '2px',
                backgroundColor: 'var(--text-accent)',
                backgroundImage:
                  'repeating-linear-gradient(90deg, transparent, transparent 3px, var(--text-accent) 3px, var(--text-accent) 6px)',
              }}
            />
            <span>Target</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div
              style={{
                width: '16px',
                height: '2px',
                backgroundColor: '#ff6b6b',
              }}
            />
            <span>7-day Avg</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div
              style={{
                width: '16px',
                height: '2px',
                backgroundColor: '#51cf66',
                backgroundImage:
                  'repeating-linear-gradient(90deg, transparent, transparent 2px, #51cf66 2px, #51cf66 4px)',
              }}
            />
            <span>Trend</span>
          </div>
        </div>
      </div>
    </Widget>
  );
};
