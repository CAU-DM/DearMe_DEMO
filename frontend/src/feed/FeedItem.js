import React from 'react';
import styles from "./Feed.module.css";

function FeedItem({ image, text }) {
  return (
    <div className={ styles.feed_item }>
      <img src={image} alt="Feed" />
      <p>{text}</p>
    </div>
  );
}

export default FeedItem;
