import React from 'react';
import FeedItem from './FeedItem';
import styles from './Feed.module.css';

function FeedPage({ feeds }) {
  return (
    <div className={ styles.feed_page }>
      {feeds.map((feed, index) => (
        <FeedItem key={index} date = {feed.date} image={feed.image} content={feed.content} />
      ))}
    </div>
  );
}

export default FeedPage;
