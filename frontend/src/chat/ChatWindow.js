import React, { useRef, useEffect, useState } from "react";
import PhotoDrop from "./PhotoDrop";
import { IoIosSend } from "react-icons/io";
import { FaCircleCheck } from "react-icons/fa6";
import styles from "./Chat.module.css";

function getTimeString() {
  const now = new Date();

  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  return `${hours}:${minutes}:${seconds}`;
}

function ChatWindow({ messages, setMessages, isGenerated, setIsGenerated }) {
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [genButtonKey, setGenButtonKey] = useState(0);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);
  const today = new Date();

  useEffect(() => {
    fetch('/get_messages', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (!response.ok)
          throw new Error('Network response was not ok');
        return response.json();
      })
      .then((data) => {
        setMessages(data.messages);
      })
  }, []);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
    console.log(messages);
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
        const newMessage = { content: content, role: "user", time: getTimeString() };
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
        fetch("/submit_message", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: content }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.status === "success") {
              setMessages((messages) => [
                ...messages,
                { content: data.message.content, role: data.message.role, time: getTimeString() },
              ]);
            }
            setIsLoading(false);
          })
          .catch((error) => console.error("Error:", error));
      }
    }
  };

  const handleGenClick = () => {
    if (!isLoading && !isGenerated) {
      let content = ["Generate.", "일기를 작성하고 있어!", "일기 생성이 완료되었어! 피드를 확인해봐!"];

      if (content) {
        const newMessage = { content: content[0], role: "user", time: getTimeString() };
        setMessages((messages) => [...messages, newMessage]);
        setInputText("");
        setIsLoading(true);
        setMessages((messages) => [
          ...messages,
          {
            content: content[1],
            role: "assistant",
            time: getTimeString()
          },
        ]);
        fetch("/generate_message", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: content }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.status === "success") {
              setMessages((messages) => [
                ...messages,
                { content: data.message.content, role: data.message.role, time: getTimeString() },
                {
                  content: content[2],
                  role: "assistant",
                  time: getTimeString()
                },
              ]);
            }
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
          messages.length > 0 && !isGenerated ? (
            <div className={styles.date_container}>
              <p> {formattedDate}</p>
            </div>
          ) : (
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
                  {message.time}
                </div>
              );
            }
          }
        })}
        <div ref={chatEndRef}></div>
      </div>
      {messages.length > 4 && !isLoading && !isGenerated ? (
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
      ) : (
        <></>
      )

      }
      <div className={styles.input_area}>
        {!isGenerated ? (
          <>
            <input
              ref={inputRef}
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
            <FaCircleCheck size={32} color="green" />
          </i>
        )}
      </div>
    </div>
  );
}

export default ChatWindow;
