import React, { useState, useEffect } from "react";
import FeedItem from "./FeedItem";
import styles from "./Feed.module.css";

function FeedPage({ userData, feeds, setFeeds }) {
  useEffect(() => {
    const fetchFeeds = async () => {
      try {
        const response = await fetch("/get_feeds", {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();
        console.log("Feed List:", data.feedList);
        setFeeds(data.feedList);
      } catch (error) {
        console.error("Error fetching feeds:", error);
      }
    };
    if (userData !== null) fetchFeeds();
  }, [userData]);

  return (
    <div className={styles.feed_page}>
      {feeds.map((feed, index) => (
        <FeedItem
          key={index}
          date={feed.feedTime}
          // image={feed.image_url}
          image={"/img/cheon.png"}
          content={feed.feed}
        />
      ))}
    </div>
  );
}

export default FeedPage;
