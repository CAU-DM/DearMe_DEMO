import React, { useRef, useEffect, useState } from "react";
import PhotoDrop from "./PhotoDrop";
import { IoIosSend } from "react-icons/io";
import { CiCirclePlus } from "react-icons/ci";
import styles from "./Chat.module.css";

function ChatWindow({ messages, setMessages }) {
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sendCount, setSendCount] = useState(0);
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
        setSendCount((count) => count + 1);
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
    <div className={ styles.chat_window }>
      <div className={ styles.chat_header }>
        <img src="logo512.png" alt="Profile" className={ styles.profile_picture } />
        <span className={ styles.profile_name }>DearMe</span>
      </div>
      <div className={styles.messages}>
        {messages.map((message, index) => {
          if (message.sender === "photo") {
            return (
              <PhotoDrop key={index} />
            );
          } else {
            let messageClass = message.sender === "me" ? styles.message_me : styles.message_gpt;
            return (
              <div key={index} className={messageClass}>
                {message.text}
              </div>
            );
          }
        })}
        <div ref={chatEndRef}></div>
      </div>
      <div className={ styles.input_area }>
        {
          sendCount > 5 ? (
            <i onClick={handleSendClick}><CiCirclePlus size={32}/></i>
          ) : (
            <i onClick={handleSendClick}></i>
          )
        }
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
