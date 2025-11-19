import { DailyTargetCountWidget } from '../components/settings/DailyTargetCountWidget';
import { StartOfWeekWidget } from '../components/settings/StartOfWeekWidget';

export const Settings = () => {
  return (
    <div className="container">
      <div className="content-container">
        <div className="scroll-view-child">
          <div className="title-container">
            <h1>Settings</h1>
          </div>

          <StartOfWeekWidget />

          <DailyTargetCountWidget />

          <div className="widget">
            <h3>Notifications</h3>
            <p>Configure when you want to be reminded.</p>
            <label className="settings-checkbox">
              <input type="checkbox" defaultChecked />
              Daily reminders
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
