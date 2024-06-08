import { useState, useEffect, forwardRef, useRef } from 'react';
import styles from './Feed.module.css';
import { BiCheck, BiEditAlt } from 'react-icons/bi';
import { FiDownload } from 'react-icons/fi';

const FeedItem = forwardRef(({ feedId, date, image, content, handleDownload, setFeeds, feeds }, ref) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);
  const [img, setImg] = useState(null);
  const [isDownload, setIsDownload] = useState(false);

  const onDownloadBtn = async () => {
    setIsDownload(true);
    await handleDownload();
    setIsDownload(false);
  };

  useEffect(() => {
    const fetchImg = async () => {
      try {
        const imageUrl = `/get_feeds/${image}`;
        // console.log("Image URL:", imageUrl);
        setImg(imageUrl);
      } catch (error) {
        console.error('Error fetching img:', error);
      }
    };

    fetchImg();
  }, [image]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    const fetchDiaryUpdate = async () => {
      try {
        // console.log("Editing diary:", feedId, editedContent);
        if (editedContent.length > 600)
          throw new Error("Content is too long");
        const response = await fetch(`/modify_diary/${feedId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: editedContent,
          }),
        });
        const data = await response.json();
        if (data.status == "success") {
          const updatedFeeds = feeds.map((feed) =>
            feed.id === feedId ? { ...feed, content: editedContent } : feed
          );
          setFeeds(updatedFeeds);
        }
        else
          console.error("Failed to update diary:", data);
      } catch (error) {
        alert("일기가 너무 길어요! 600자 이내로 작성해주세요.");
        console.error("Error updating diary:", error);
      }
    }
    fetchDiaryUpdate();
  };

  const handleInputChange = (e) => {
    setEditedContent(e.target.value);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    return `${year}.${month}.${day} `;
  };

  const formattedDate = formatDate(date);

  return (
    <div className={styles.feed_item} ref={ref} id="downloadImg">
      <img src={img} alt="Feed" />
      {isEditing ? (
        <textarea
          value={editedContent}
          onChange={handleInputChange}
          className={styles.textarea}
        />
      ) : (
        <div>
          <p><strong style={{ fontSize: "20px" }}>{formattedDate}</strong></p>
          <p>{content}</p>
        </div>
      )}
      <div>
          {isDownload ? (
            <> </>
          ) : isEditing ? (
            <button onClick={handleSave} className={styles.save_button}>
              <BiCheck size={20} />
            </button>
          ) : (
            <div className={styles.button_conatiner}>
              <button onClick={handleEdit} className={styles.edit_button}>
                <BiEditAlt size={18} />
              </button>
              <button
                onClick={() => {
                  onDownloadBtn();
                }}
                className={styles.saveImage_button}
              >
                <FiDownload size={18} />
              </button>
            </div>
          )}
        </div>
      {!isDownload && <div className={styles.item_divider}></div>}
    </div>
  );
});

export default FeedItem;
