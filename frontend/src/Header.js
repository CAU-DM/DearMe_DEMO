import React, { useState, useEffect } from 'react';
import { LogoutButton, UserInfo } from './login/Login';
import CalendarPage from './calendar/CalendarPage';
import CalendarButton from './calendar/CalendarButton';
import FeedButton from './calendar/FeedButton';

function Header({ userData, isCalendar, setIsCalendar }) {
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

    return (
        <div className="header">
            <img src={imageUrl} alt="Logo" />
            {userData ? (
                <div className="buttons">
                    <div>
                        {isCalendar === true ? (
                            <button onClick={() => setIsCalendar(false)}>
                                <FeedButton />
                            </button>
                        ) : (
                            <button onClick={() => setIsCalendar(true)}>
                                <CalendarButton />
                            </button>
                        )}
                    </div>
                    <div>
                        <UserInfo
                            userData={userData}
                            windowWidth={windowWidth}
                        />
                        <LogoutButton
                            userData={userData}
                            windowWidth={windowWidth}
                        />
                    </div>
                </div>
            ) : null}
        </div>
    );
}

export default Header;
