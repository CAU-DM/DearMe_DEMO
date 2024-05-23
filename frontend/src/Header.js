import React, { useState, useEffect } from 'react';
import { LogoutButton, UserInfo } from './login/Login';
import CalendarPage from './calendar/CalendarPage';
import CalendarButton from './calendar/CalendarButton';
import FeedButton from './calendar/FeedButton';
import { format } from 'date-fns';
import { GiStrawberry } from 'react-icons/gi';
import { FaRegCalendarAlt } from 'react-icons/fa';

function Header({
    userData,
    isCalendar,
    setIsCalendar,
    setFeedDate,
    setModalIsOpen,
}) {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const imageUrl = windowWidth > 1080 ? 'logo_text_c.png' : 'logo512_nb.png';

    const gotoHome = () => {
        setFeedDate(format(new Date(), 'yyyy-MM-dd'));
        setIsCalendar(false);
    };

    return (
        <div className="header">
            <img
                src={imageUrl}
                alt="Logo"
                onClick={() => setFeedDate(format(new Date(), 'yyyy-MM-dd'))}
            />
            {userData ? (
                <div className="buttons">
                    <div>
                        {isCalendar === true ? (
                            <button onClick={gotoHome}>
                                <FeedButton />
                            </button>
                        ) : (
                            <div className="header_btn">
                                <button onClick={() => setIsCalendar(true)}>
                                    <FaRegCalendarAlt size={18} />
                                    <p>{windowWidth > 1080 ? 'Calendar' : ''}</p>
                                </button>
                            </div>
                        )}
                    </div>
                    <div>
                        <UserInfo
                            userData={userData}
                            windowWidth={windowWidth}
                        />
                        <div className="header_btn">
                            <button onClick={() => setModalIsOpen(true)}>
                                <GiStrawberry size={20} />
                                <p>{windowWidth > 1080 ? 'About Us' : ''}</p>
                            </button>
                        </div>
                        <LogoutButton
                            userData={userData}
                            windowWidth={windowWidth}
                        />
                    </div>
                </div>
            ) : (
                <div>
                    <div className="header_btn">
                        <button onClick={() => setModalIsOpen(true)}>
                            <GiStrawberry size={20} />
                            <p>{windowWidth > 1080 ? 'About Us' : ''}</p>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Header;
