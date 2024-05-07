import React, { useState, useEffect } from 'react';
import { LogoutButton } from './login/Login';

function Header({ onLogin }) {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const imageUrl = windowWidth > 1080 ? 'logo_text_c.png' : 'logo512_nb.png';

  return (
    <div className="header">
      <img src={imageUrl} alt="Logo" />
      <div>
        <LogoutButton onLogin={onLogin} windowWidth={windowWidth}/>
      </div>
    </div>
  );
}

export default Header;