import { Last30DaysTrendChart } from '../components/charts/Last30DaysTrendChart';
import { StatsOverview } from '../components/charts/StatsOverview';
import { WeeklyPerformanceChart } from '../components/charts/WeeklyPerformanceChart';

export const Statistics = () => {
  return (
    <div className="container">
      <div className="content-container">
        <div className="scroll-view-child">
          <div className="title-container">
            <h1>Statistics</h1>
          </div>

          <StatsOverview />

          <Last30DaysTrendChart />

          <WeeklyPerformanceChart />

          <div className="widget">
            <h3>Insights</h3>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                fontSize: '14px',
                color: 'var(--text-secondary)',
              }}
            >
              <div>📊 Charts show your last 30 days of data</div>
              <div>📈 The trend line helps identify patterns over time</div>
              <div>🎯 Green bars indicate weeks where you met your targets</div>
              <div>⚡ Keep building streaks for better results!</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
