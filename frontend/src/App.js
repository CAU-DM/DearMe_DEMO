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

  // const dt_0 =
  //   "이제 슬슬 꽃도 피고 점점 따뜻해지고 있다. 이게 정말 봄이 오고 있는 느낌이다. 수업 쉬는시간에 팀원이 천혜향을 가져와서 나눠먹고, 밤에는 친한 동기랑 술도 마셨다. 좋은 사람들과 함께해서인지 날씨가 좋아서인지 오늘은 정말 기분이 좋은 날이었다 !";
  // const dt_1 = "오늘은 참 재미있는 하루였다!";
  // const feeds = [
  //   { date: "2023/01/23", image: "/img/cheon.png", content: dt_0 },
  //   { date: "2023/01/25", image: "/img/cheon.png", content: dt_1 },
  // ];

  return (
    <div className="App">
      <Header />
      {userData ? (
        <div className="main_container">
          <FeedPage userData={userData} />
          <ChatWindow messages={messages} setMessages={setMessages} />
        </div>
      ) : (
        <Login onLogin={setUserData} setMessages={setMessages} />
      )}
    </div>
  );
}

export default App;
