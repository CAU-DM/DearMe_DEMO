import React, { useState } from 'react';
import { format } from 'date-fns';

function Months({ currentMonth, prevMonth, nextMonth }) {
    return (
        <div className="flex w-full h-1/4 flex-row p-10 justify-between items-center">
            <div onClick={prevMonth}>지난달</div>
            <span>{format(currentMonth, 'yyyy')}</span>
            <span>{format(currentMonth, 'M')}월</span>
            <div onClick={nextMonth}>다음달</div>
        </div>
    );
}

export default Months;
