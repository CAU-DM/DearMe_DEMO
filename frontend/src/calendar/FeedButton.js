import '../tailwind.css';
import { FaHome } from 'react-icons/fa';

function CalendarButton(isCalendar, setIsCalendar) {
    return (
        <div className="group w-full h-[50px] mb-[10px] ml-[15px] items-center flex flex-row justify-start">
            <FaHome
                size={20}
                className="fill-white group-hover:fill-gray-400"
            />
            <span className="ml-[15px] text-white group-hover:text-gray-400">
                {' '}
                Feed{' '}
            </span>
        </div>
    );
}

export default CalendarButton;
