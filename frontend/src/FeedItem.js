import React from 'react';

function FeedItem({ image, text }) {
  return (
    <div className="feed-item">
      <img src={image} alt="Feed" />
      <p>{text}</p>
    </div>
  );
}

export default FeedItem;
