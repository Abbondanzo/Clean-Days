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
        </div>
      </div>
    </div>
  );
};
