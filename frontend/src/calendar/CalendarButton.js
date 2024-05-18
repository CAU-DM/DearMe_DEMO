import '../tailwind.css';
import { FaRegCalendarAlt } from 'react-icons/fa';

function CalendarButton(isCalendar, setIsCalendar) {
    return (
        <div className="group w-full h-[50px] mb-[10px] ml-[15px] items-center flex flex-row justify-start">
            <FaRegCalendarAlt
                size={20}
                className="fill-white group-hover:fill-gray-400"
            />
            <span className="ml-[15px] text-white group-hover:text-gray-400">
                {' '}
                Calendar{' '}
            </span>
        </div>
    );
}

export default CalendarButton;
