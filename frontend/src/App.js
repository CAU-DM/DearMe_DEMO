import React, { useState } from "react";
import FeedPage from "./feed/FeedPage";
import ChatWindow from "./chat/ChatWindow";
import Login from "./login/Login";
import Header from "./Header";
import Modal from "react-modal";
import { AiOutlineClose } from "react-icons/ai"; 
import "./App.css";

function App() {
  const [userData, setUserData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [feeds, setFeeds] = useState([]);
  const [isGenerated, setIsGenerated] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  return (
    <div className="App">
      <Header userData={userData} setModalIsOpen={setModalIsOpen}/>
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
          // <button onClick={setUserData(1)}>강제 로그인</button>
      )}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="About Us"
        className="ReactModal__Content"
        overlayClassName="ReactModal__Overlay"
      >
        <div className="modal-content">
          <button className="close-button" onClick={() => setModalIsOpen(false)}>
            <AiOutlineClose size={20} />
          </button>
          <img src="/img/team_illust.png" alt="Team Introduction" />
        </div>
      </Modal>
    </div>
  );
}

export default App;
