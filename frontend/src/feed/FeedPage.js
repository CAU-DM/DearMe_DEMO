import React, { useEffect } from "react";
import FeedItem from "./FeedItem";
import styles from "./Feed.module.css";

function FeedPage({ userData, feeds, setFeeds, isGenerated }) {
  const randomIndex = Math.floor(Math.random() * 4);
  const imgUrl = "/img/empty_" + randomIndex + ".png";

  useEffect(() => {
    const fetchFeeds = async () => {
      try {
        const response = await fetch("/get_feeds", {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();
        // console.log("Feed List:", data.feedList);
        setFeeds(data.feedList);
      } catch (error) {
        console.error("Error fetching feeds:", error);
      }
    };
    if (userData !== null || isGenerated == true) fetchFeeds();
  }, [userData, isGenerated]);

  return (
    <div className={styles.feed_page}>
      {feeds.length === 0 ? <img src={imgUrl} alt="아직 일기가 없어요!" width={300} style={{ marginTop: '200px' }}/> : null}
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
