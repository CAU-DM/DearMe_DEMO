import React, { useState, useEffect } from "react";
import { LogoutButton, UserInfo } from "./login/Login";
import { GiStrawberry } from "react-icons/gi";

function Header({ userData, setModalIsOpen}) {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const imageUrl = windowWidth > 1080 ? "logo_text_c.png" : "logo512_nb.png";

  return (
    <div className="header">
      <img src={imageUrl} alt="Logo" />
      {userData ? (
        <div>
          <UserInfo userData={userData} windowWidth={windowWidth} />
          <div className="about_btn">
            <button onClick={() => setModalIsOpen(true)}>
              <GiStrawberry size={20} />
              <p>{windowWidth > 1080 ? "About Us" : ""}</p>
            </button>
          </div>
          <LogoutButton userData={userData} windowWidth={windowWidth} />
        </div>
      ) : (
        <div>
          <div className="about_btn">
            <button onClick={() => setModalIsOpen(true)}>
              <GiStrawberry size={20} />
              <p>{windowWidth > 1080 ? "About Us" : ""}</p>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Header;
