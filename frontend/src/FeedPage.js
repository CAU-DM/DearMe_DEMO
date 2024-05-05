import React from 'react';
import FeedItem from './FeedItem';

function FeedPage({ feeds }) {
  return (
    <div className="feed-page">
      {feeds.map((feed, index) => (
        <FeedItem key={index} image={feed.image} text={feed.text} />
      ))}
    </div>
  );
}

export default FeedPage;
