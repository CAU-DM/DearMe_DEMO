import React, { useState } from 'react';

function ChatWindow({ messages, setMessages }) {
  const [inputText, setInputText] = useState("");
  const [sender, setSender] = useState("me");

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSendClick();
    }
  };

  const handleSendClick = () => {
    if (inputText.trim()) {
      const newMessage = { text: inputText, sender: sender };
      setMessages(messages => [...messages, newMessage]);
      setInputText('');
    }
  };

  const toggleSender = () => {
    setSender(sender => sender === "me" ? "gpt" : "me");
  };

  return (
    <div className="chat-window">
      <div className="messages">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            {message.text}
          </div>
        ))}
      </div>
      <div className="input-area">
        <input
          value={inputText}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
        />
        <button onClick={handleSendClick}>Send</button>
        <button onClick={toggleSender}> {sender.toUpperCase()}</button>
      </div>
    </div>
  );
}

export default ChatWindow;
