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
                    className={`flex flex-col w-full h-full ${
                        !isSameMonth(day, monthStart)
                            ? ''
                            : isSameDay(day, selectedDate)
                            ? 'bg-red-300'
                            : format(currentMonth, 'M') !== format(day, 'M')
                            ? 'text-slate-500'
                            : 'hover:bg-slate-500'
                    }`}
                    key={day}
                    onClick={() => onDateClick(parse(cloneDay))}
                >
                    <span
                        className={
                            format(currentMonth, 'M') !== format(day, 'M')
                                ? 'flex w-full h-full justify-center items-center text-slate-500'
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
                className="flex flex-row w-full h-full items-start justify-between"
                key={day}
            >
                {days}
            </div>
        );
        days = [];
    }
    return (
        <div className="flex flex-col w-full h-full items-center justify-between">
            {rows}
        </div>
    );
}

export default Cells;
