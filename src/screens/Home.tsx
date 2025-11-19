import { useState } from 'react';
import { DrinkCountEditor } from '../components/count/DrinkCountEditor';
import { WeekPicker } from '../components/week/WeekPicker';
import { getToday } from '../utils/basicDateUtils';

export const Home = () => {
  const [selectedDate, setSelectedDate] = useState(() => getToday());

  return (
    <div className="container">
      <div className="content-container">
        <div className="scroll-view-child">
          <div className="title-container">
            <h1>Welcome!</h1>
          </div>

          <WeekPicker
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />

          <DrinkCountEditor date={selectedDate} />
        </div>
      </div>
    </div>
  );
};
