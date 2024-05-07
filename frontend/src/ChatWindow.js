import React, { useRef, useEffect, useState } from "react";
import { IoIosSend } from "react-icons/io";

function ChatWindow({ messages, setMessages }) {
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSendClick();
    }
  };

  const handleSendClick = () => {
    if (!isLoading) {
      let text = inputText.trim();

      if (text) {
        const newMessage = { text: text, sender: "me" };
        setMessages((messages) => [...messages, newMessage]);
        setInputText("");
        setIsLoading(true);
        fetch("/submit_form", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: `user=testUser&message=${encodeURIComponent(text)}`,
        })
          .then((response) => response.json())
          .then((data) => {
            console.log("Received response:", data);
            setMessages((messages) => [
              ...messages,
              { text: data.message, sender: "gpt" },
            ]);
            setIsLoading(false);
          })
          .catch((error) => console.error("Error:", error));
      }
    }
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <img src="logo512.png" alt="Profile" className="profile-picture" />
        <span className="profile-name">DearMe</span>
      </div>
      <div className="messages">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            {message.text}
          </div>
        ))}
        <div ref={chatEndRef}></div>
      </div>
      <div className="input-area">
        <input
          value={inputText}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
        />
        <i onClick={handleSendClick}><IoIosSend size={32}/></i>
      </div>
    </div>
  );
}

export default ChatWindow;
