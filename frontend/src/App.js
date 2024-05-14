import React, { useEffect, useState } from 'react';
import FeedPage from './feed/FeedPage';
import ChatWindow from './chat/ChatWindow';
import Login from './login/Login';
import Header from './Header';
import PhotoDrop from './chat/PhotoDrop';
import './App.css';
import CalendarPage from './calendar/CalendarPage';
import { format } from 'date-fns';

function App() {
    const [userData, setUserData] = useState(null);
    const [messages, setMessages] = useState([]);
    const [feeds, setFeeds] = useState([]);
    const [isGenerated, setIsGenerated] = useState(false);
    const [isCalendar, setIsCalendar] = useState(false);
    const [feedDate, setFeedDate] = useState(format(new Date(), 'yyyy-MM-dd'));

    return (
        <div className="App">
            <Header
                userData={userData}
                isCalendar={isCalendar}
                setIsCalendar={setIsCalendar}
                setFeedDate={setFeedDate}
            />
            {userData ? (
                <div className="main_container">
                    {isCalendar ? (
                        <CalendarPage
                            userData={userData}
                            setIsCalendar={setIsCalendar}
                            setFeedDate={setFeedDate}
                        />
                    ) : (
                        <FeedPage
                            userData={userData}
                            feeds={feeds}
                            setFeeds={setFeeds}
                            isGenerated={isGenerated}
                            feedDate={feedDate}
                        />
                    )}
                    <ChatWindow
                        messages={messages}
                        setMessages={setMessages}
                        isGenerated={isGenerated}
                        setIsGenerated={setIsGenerated}
                    />
                </div>
            ) : (
                // <Login setUserData={setUserData} setMessages={setMessages} />
                <button onClick={setUserData(1)}>강제 로그인</button>
            )}
        </div>
    );
}

export default App;
