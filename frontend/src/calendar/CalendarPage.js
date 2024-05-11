import React, { useState } from 'react';
import { addMonths, subMonths } from 'date-fns';
import '../tailwind.css';
import Months from './Months';
import Days from './Days';
import Cells from './Cells';

function CalendarPage(userData, feed, setFeeds, isGenerated) {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());

    const prevMonth = () => {
        setCurrentMonth(subMonths(currentMonth, 1));
    };

    const nextMonth = () => {
        setCurrentMonth(addMonths(currentMonth, 1));
    };

    const onDateClick = (day) => {
        setSelectedDate(day);
    };

    return (
        <div className="flex w-full h-full max-w-[630px] flex-col p-16 justify-between items-center gap-4">
            <Months
                currentMonth={currentMonth}
                prevMonth={prevMonth}
                nextMonth={nextMonth}
            />
            <div className="flex w-full h-full flex-col justify-between items-center gap-4 pb-5">
                <Days />
                <Cells
                    currentMonth={currentMonth}
                    selectedDate={selectedDate}
                    onDateClick={onDateClick}
                />
            </div>
        </div>
    );
}

export default CalendarPage;
