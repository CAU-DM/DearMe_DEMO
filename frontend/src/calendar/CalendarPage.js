import React, { useState } from 'react';
import Calendar from 'react-calendar';
import moment from 'moment';
import './Calendar.css';

function CalendarPage() {
    const [value, onChange] = useState(new Date()); // 초기값은 현재 날짜

    return (
        <Calendar
            onChange={onChange}
            value={value}
            formatDay={(locale, date) => moment(date).format('D')} // 일 제거 숫자만 보이게
            formatYear={(locale, date) => moment(date).format('YYYY')}
            formatMonthYear={(locale, date) => moment(date).format('YYYY. MM')}
            next2Label={null}
            prev2Label={null}
            minDetail="year"
            calendarType="gregory"
        />
    );
}

export default CalendarPage;
