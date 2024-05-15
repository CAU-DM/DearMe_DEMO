import React, { useRef, useEffect, useState } from "react";
import PhotoDrop from "./PhotoDrop";
import { IoIosSend } from "react-icons/io";
import { FaCircleCheck } from "react-icons/fa6";
import styles from "./Chat.module.css";

function ChatWindow({ messages, setMessages, isGenerated, setIsGenerated }) {
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [genButtonKey, setGenButtonKey] = useState(0);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);
  const today = new Date();

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.scrollLeft = inputRef.current.scrollWidth;
    }
  }, [inputText]);

  const formattedDate = today.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.nativeEvent.isComposing) {
      handleSendClick();
    }
  };

  const handleSendClick = () => {
    if (!isLoading && !isGenerated) {
      let content = inputText.trim();

      if (content) {
        const newMessage = { content: content, role: "user" };
        setMessages((messages) => {
          const updatedMessages = [...messages, newMessage];
          setTimeout(() => {
            if (chatEndRef.current) {
              chatEndRef.current.scrollIntoView({ behavior: "smooth" });
            }
          }, 0);
          return updatedMessages;
        });
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
        <span className={styles.profile_name}>Dear Me</span>
      </div>
      <div className={styles.messages}>
      {
        messages.length > -1 && !isGenerated ? (
          <div className={styles.date_container}>
            <p> { formattedDate }</p>
          </div>
        ):(
          <></>
        )
      }
        {messages.map((message, index) => {
          if (message.role === "photo") {
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
      { messages.length > 10 && !isLoading && !isGenerated ? (
          <div className={styles.gen_button_container}>
            <div 
              onClick={() => {
                handleGenClick();
                setGenButtonKey((prevKey) => prevKey + 1);
              }}
              key={genButtonKey} 
              className={styles.gen_button}>
            </div>
          </div>
        ):(
          <></>
        )
         
      }
      <div className={styles.input_area}>
        {!isGenerated ? (
          <>
            <input
              ref = {inputRef}
              value={inputText}
              onInput={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              maxLength={300}
            />
            <i onClick={handleSendClick}>
              <IoIosSend size={32} />
            </i>
          </>
        ) : (
          <i onClick={() => window.location.reload()}>
            <FaCircleCheck size={32} color="green"/>
          </i>
        )}
      </div>
    </div>
  );
}

export default ChatWindow;
