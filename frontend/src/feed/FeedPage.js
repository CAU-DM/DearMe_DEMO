import React from 'react';
import FeedItem from './FeedItem';
import styles from './Feed.module.css';

function FeedPage({ feeds }) {
  return (
    <div className={ styles.feed_page }>
      {feeds.map((feed, index) => (
        <FeedItem key={index} image={feed.image} text={feed.text} />
      ))}
    </div>
  );
}

export default FeedPage;
