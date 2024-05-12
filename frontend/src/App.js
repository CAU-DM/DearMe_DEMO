import React, { useEffect, useState } from 'react';
import FeedPage from './feed/FeedPage';
import ChatWindow from './chat/ChatWindow';
import Login from './login/Login';
import Header from './Header';
import PhotoDrop from './chat/PhotoDrop';
import './App.css';
import CalendarPage from './calendar/CalendarPage';

function App() {
    const [userData, setUserData] = useState(null);
    const [messages, setMessages] = useState([]);
    const [feeds, setFeeds] = useState([]);
    const [isGenerated, setIsGenerated] = useState(false);
    const [isCalendar, setIsCalendar] = useState(false);

    useEffect(() => {
        console.log(isCalendar);
    });

    return (
        <div className="App">
            <Header
                userData={userData}
                isCalendar={isCalendar}
                setIsCalendar={setIsCalendar}
            />
            {userData ? (
                <div className="main_container">
                    {isCalendar ? (
                        <CalendarPage
                            userData={userData}
                            feeds={feeds}
                            setFeeds={setFeeds}
                            isGenerated={isGenerated}
                        />
                    ) : (
                        <FeedPage
                            userData={userData}
                            feeds={feeds}
                            setFeeds={setFeeds}
                            isGenerated={isGenerated}
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
