import React, { useState } from 'react';
import './App.css';
import FeedPage from './FeedPage';
import ChatWindow from './ChatWindow';

function App() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const dt_0 = '이제 슬슬 꽃도 피고 점점 따뜻해지고 있다. 이게 정말 봄이 오고 있는 느낌이다. 수업 쉬는시간에 팀원이 천혜향을 가져와서 나눠먹고, 밤에는 친한 동기랑 술도 마셨다. 좋은 사람들과 함께해서인지 날씨가 좋아서인지 오늘은 정말 기분이 좋은 날이었다 !';
  const dt_1 = '오늘은 참 재미있는 하루였다!';
  const feeds = [
    { image: '/img/cheon.png', text: dt_0 },
    { image: '/img/cheon.png', text: dt_1 }
  ];


  return (
    <div className="App">
      <FeedPage feeds={feeds} />
      <ChatWindow messages={messages} setMessages={setMessages} />
    </div>
  );
}

export default App;
