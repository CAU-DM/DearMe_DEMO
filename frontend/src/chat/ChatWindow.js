import React, { useRef, useEffect, useState } from "react";
import PhotoDrop from "./PhotoDrop";
import { IoIosSend } from "react-icons/io";
import { CiCirclePlus, CiCircleCheck } from "react-icons/ci";
import styles from "./Chat.module.css";

function ChatWindow({ messages, setMessages, isGenerated, setIsGenerated }) {
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current.scrollIntoView({ behavior: "smooth" });
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
    if (!isLoading && !isGenerated) {
      let content = inputText.trim();

      if (content) {
        const newMessage = { content: content, role: "user" };
        setMessages((messages) => [...messages, newMessage]);
        setInputText("");
        setIsLoading(true);
        fetch("/submit_form", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: `user=testUser&message=${encodeURIComponent(content)}`,
        })
          .then((response) => response.json())
          .then((data) => {
            // console.log("Received response:", data);
            setMessages((messages) => [
              ...messages,
              { content: data.message, role: "assistant" },
            ]);
            setIsLoading(false);
          })
          .catch((error) => console.error("Error:", error));
      }
    }
  };

  const handleGenClick = () => {
    if (!isLoading && !isGenerated) {
      let content = "Generate.";

      if (content) {
        const newMessage = { content: content, role: "user" };
        setMessages((messages) => [...messages, newMessage]);
        setInputText("");
        setIsLoading(true);
        setMessages((messages) => [
          ...messages,
          { content: "일기를 작성하고 있어!", role: "assistant" },
        ]);
        fetch("/generate_form", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: `user=testUser&message=${encodeURIComponent(content)}`,
        })
          .then((response) => response.json())
          .then((data) => {
            // console.log("Received response:", data);
            setMessages((messages) => [
              ...messages,
              { content: data.message, role: "assistant" },
              {
                content: "일기 생성이 완료되었어! 피드를 확인해봐!",
                role: "assistant",
              },
            ]);
            setIsLoading(false);
            setIsGenerated(true);
          })
          .catch((error) => console.error("Error:", error));
      }
    }
  };

  return (
    <div className={styles.chat_window}>
      <div className={styles.chat_header}>
        <img
          src="logo512.png"
          alt="Profile"
          className={styles.profile_picture}
        />
        <span className={styles.profile_name}>DearMe</span>
      </div>
      <div className={styles.messages}>
        {messages.map((message, index) => {
          if (message.sender === "photo") {
            return <PhotoDrop key={index} />;
          } else {
            let messageClass =
              message.role === "user"
                ? styles.message_user
                : styles.message_assistant;
            if (message.role === "user" || message.role === "assistant") {
              return (
                <div key={index} className={messageClass}>
                  {message.content}
                </div>
              );
            }
          }
        })}
        <div ref={chatEndRef}></div>
      </div>
      <div className={styles.input_area}>
        {!isGenerated ? (
          <>
            {messages.length > 10 && !isLoading ? (
              <i onClick={handleGenClick}>
                <CiCirclePlus size={32} />
              </i>
            ) : (
              <i onClick={handleSendClick}></i>
            )}
            <input
              value={inputText}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
            />
            <i onClick={handleSendClick}>
              <IoIosSend size={32} />
            </i>
          </>
        ) : (
          <i onClick={() => window.location.reload()}>
            <CiCircleCheck size={32} />
          </i>
        )}
      </div>
    </div>
  );
}

export default ChatWindow;
