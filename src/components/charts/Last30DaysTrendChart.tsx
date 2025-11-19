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
import './charts.css';

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

    // Include all 30 days, but use null for unset days to show gaps in chart
    const countData: ChartDataPoint[] = dailyData.map((day, index) => ({
      x: index + 1,
      y: day.count >= 0 ? day.count : null, // null creates gaps in Victory charts
      date: day.date,
    }));

    const targetData: ChartDataPoint[] = dailyData.map((day, index) => ({
      x: index + 1,
      y: day.target,
      date: day.date,
    }));

    // For moving average and trend, only use days with actual values
    const setDaysData = dailyData.filter(day => day.count >= 0);
    const setDaysCountData: ChartDataPoint[] = setDaysData.map(day => ({
      x: dailyData.findIndex(d => d.date === day.date) + 1, // Use original x position
      y: day.count,
      date: day.date,
    }));

    const movingAvg = calculateMovingAverage(setDaysCountData, 7);
    const trendLine = calculateTrendLine(setDaysCountData);

    return {
      actual: countData,
      target: targetData,
      movingAverage: movingAvg,
      trendLine,
    };
  }, [trackedDays, targetDrinks]);

  return (
    <Widget title="Last 30 Days Trend">
      <div className="trend-chart-container">
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
                fontFamily: 'var(--font-family)',
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
                fontFamily: 'var(--font-family)',
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
                stroke: 'var(--color-error)',
                strokeWidth: 2,
              },
            }}
          />

          {/* Trend line */}
          <VictoryLine
            data={chartData.trendLine}
            style={{
              data: {
                stroke: 'var(--color-success)',
                strokeWidth: 2,
                strokeDasharray: '3,3',
              },
            }}
          />
        </VictoryChart>

        <div className="trend-chart-legend">
          <div className="trend-chart-legend-item">
            <div className="trend-chart-legend-line trend-chart-legend-line--actual" />
            <span>Actual</span>
          </div>
          <div className="trend-chart-legend-item">
            <div className="trend-chart-legend-line trend-chart-legend-line--target" />
            <span>Target</span>
          </div>
          <div className="trend-chart-legend-item">
            <div className="trend-chart-legend-line trend-chart-legend-line--average" />
            <span>7-day Avg</span>
          </div>
          <div className="trend-chart-legend-item">
            <div className="trend-chart-legend-line trend-chart-legend-line--trend" />
            <span>Trend</span>
          </div>
        </div>
      </div>
    </Widget>
  );
};
