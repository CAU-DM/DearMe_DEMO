import React, { useEffect } from "react";
import FeedItem from "./FeedItem";
import styles from "./Feed.module.css";

function FeedPage({ userData, feeds, setFeeds, isGenerated }) {
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
    if (userData !== null || isGenerated == true) fetchFeeds();
  }, [userData, isGenerated]);

  return (
    <div className={styles.feed_page}>
      {feeds.length === 0 ? <h2>아직 일기가 없어!</h2> : null}
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
