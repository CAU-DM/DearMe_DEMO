import React, { useState } from "react";
import { IoIosSend } from "react-icons/io";

function ChatWindow({ messages, setMessages }) {
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
        const newMessage = { role: "user", content: text };
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
              { role: "assistant", content: data.message },
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
          (message.role === "user" || message.role === "assistant") ? (
            <div key={index} className={`message ${message.role}`}>
              {message.content}
            </div>
          ) : null
        ))}
      </div>
      <div className="input-area">
        <input
          value={inputText}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
        />
        <i onClick={handleSendClick}><IoIosSend size={32} /></i>
      </div>
    </div>
  );
}

export default ChatWindow;
