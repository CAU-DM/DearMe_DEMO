import React, { useState, useEffect } from 'react';

function Header() {
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
    </div>
  );
}

export default Header;