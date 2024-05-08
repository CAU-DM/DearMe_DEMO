import React, { useState } from "react";
import FeedPage from "./feed/FeedPage";
import ChatWindow from "./chat/ChatWindow";
import Login from "./login/Login";
import Header from "./Header";
import PhotoDrop from "./chat/PhotoDrop";
import "./App.css";

function App() {
  const [userData, setUserData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [feeds, setFeeds] = useState([]);
  const [isGenerated, setIsGenerated] = useState(false);

  return (
    <div className="App">
      <Header userData={userData} />
      {userData ? (
        <div className="main_container">
          <FeedPage
            userData={userData}
            feeds={feeds}
            setFeeds={setFeeds}
            isGenerated={isGenerated}
          />
          <ChatWindow
            messages={messages}
            setMessages={setMessages}
            isGenerated={isGenerated}
            setIsGenerated={setIsGenerated}
          />
        </div>
      ) : (
        <Login setUserData={setUserData} setMessages={setMessages} />
      )}
    </div>
  );
}

export default App;
