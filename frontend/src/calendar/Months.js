import React, { useState } from 'react';
import { format } from 'date-fns';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';

function Months({ currentMonth, prevMonth, nextMonth }) {
    const months = {
        1: 'January',
        2: 'February',
        3: 'March',
        4: 'April',
        5: 'May',
        6: 'June',
        7: 'July',
        8: 'August',
        9: 'September',
        10: 'October',
        11: 'November',
        12: 'December',
    };

    return (
        <div className="flex w-full h-1/5 flex-row p-10 justify-between items-center">
            <div onClick={prevMonth}>
                <FaAngleLeft />
            </div>
            <span>{format(currentMonth, 'yyyy')}</span>
            <span>{format(currentMonth, 'M')}</span>
            <span>{months[format(currentMonth, 'M')]}</span>
            <div onClick={nextMonth}>
                <FaAngleRight />
            </div>
        </div>
    );
}

export default Months;
