import React, { useState } from 'react';
import {
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    isSameMonth,
    isSameDay,
    addDays,
    parse,
    format,
} from 'date-fns';

function Cells({ currentMonth, selectedDate, onDateClick }) {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = '';

    while (day <= endDate) {
        for (let i = 0; i < 7; i++) {
            formattedDate = format(day, 'd');
            const cloneDay = day;
            days.push(
                <div
                    className={`flex flex-col w-16 h-16 rounded-full ${
                        !isSameMonth(day, monthStart)
                            ? ''
                            : isSameDay(day, selectedDate)
                            ? 'bg-rose-300 hover:bg-slate-300'
                            : format(currentMonth, 'M') !== format(day, 'M')
                            ? ''
                            : 'hover:border-1 hover:bg-slate-300'
                    }`}
                    key={day}
                    onClick={() => onDateClick(format(cloneDay, 'yyyy-MM-dd'))}
                    // onClick={() => console.log(parse(cloneDay))}
                >
                    <span
                        className={
                            format(currentMonth, 'M') !== format(day, 'M')
                                ? 'flex w-full h-full justify-center items-center text-slate-400'
                                : 'flex w-full h-full justify-center items-center'
                        }
                    >
                        {formattedDate}
                    </span>
                </div>
            );
            day = addDays(day, 1);
        }
        rows.push(
            <div
                className="flex flex-row w-full h-full items-start justify-between gap-1"
                key={day}
            >
                {days}
            </div>
        );
        days = [];
    }
    return (
        <div className="flex flex-col w-full h-full items-center justify-between gap-1">
            {rows}
        </div>
    );
}

export default Cells;
