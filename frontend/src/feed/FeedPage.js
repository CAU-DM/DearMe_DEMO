import React, { useEffect, useRef } from 'react';
import FeedItem from './FeedItem';
import styles from './Feed.module.css';
import domtoimage from 'dom-to-image-more';
import { saveAs } from 'file-saver';
import { parse, differenceInDays, isEqual } from 'date-fns';

function FeedPage({ userData, feeds, setFeeds, isGenerated, feedDate }) {
  const randomIndex = Math.floor(Math.random() * 4);
  const imgUrl = '/img/empty_' + randomIndex + '.png';
  const feedRefs = useRef([]);

  const handleDownload = async (index) => {
    const feedRef = feedRefs.current[index];
    if (feedRef) {
      try {
        const blob = await domtoimage.toBlob(feedRef);
        saveAs(blob, 'today_diary.png');
      } catch (error) {
        console.error('Error capturing image:', error);
      }
    } else {
      console.error('Reference to the DOM element is not available.');
    }
  };

  useEffect(() => {
    const fetchFeeds = async () => {
      try {
        const response = await fetch('/get_feeds', {
          method: 'GET',
          credentials: 'include',
        });
        const data = await response.json();
        // console.log("Feed List:", data.feedList);
        setFeeds(data.feedList);
      } catch (error) {
        console.error('Error fetching feeds:', error);
      }
    };
    if (userData !== null || isGenerated === true) fetchFeeds();
  }, [userData, isGenerated]);

  useEffect(() => {
    if (feeds.length > 0 && feedDate) {
      const parsedFeedDate = parse(feedDate, 'yyyy-MM-dd', new Date());
      let closestFeedIndex = 0;
      let closestDiff = Infinity;

      feeds.forEach((feed, index) => {
        const feedDate = parse(
          feed.created_at,
          "EEE, dd MMM yyyy HH:mm:ss 'GMT'",
          new Date()
        );
        const diff = differenceInDays(parsedFeedDate, feedDate);
        if (
          isEqual(feedDate, parsedFeedDate) ||
          (diff >= 0 && diff < closestDiff)
        ) {
          closestFeedIndex = index;
          closestDiff = diff;
        }
      });

      setTimeout(() => {
        if (feedRefs.current[closestFeedIndex])
          feedRefs.current[closestFeedIndex].scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
      }, 0);
    }
  }, [feedDate]);

  return (
    <div className={styles.feed_page}>
      {feeds.length === 0 ? (
        <img
          src={imgUrl}
          alt="아직 일기가 없어요!"
          width={300}
          style={{ marginTop: '200px' }}
        />
      ) : null}
      {feeds.map((feed, index) => (
        <FeedItem
          key={feed.id}
          feedId={feed.id}
          content={feed.content}
          date={feed.created_at}
          image={feed.img_url}
          ref={(el) => (feedRefs.current[index] = el)}
          setFeeds={setFeeds}
          feeds={feeds}
          handleDownload={() => handleDownload(index)}
        />
      ))}
    </div>
  );
}

export default FeedPage;
