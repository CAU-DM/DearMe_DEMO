import { useState, useEffect, forwardRef, useRef } from 'react';
import styles from './Feed.module.css';
import { BiCheck, BiEditAlt } from 'react-icons/bi';
import { FiDownload } from 'react-icons/fi';

const FeedItem = forwardRef(({ date, image, content, handleDownload }, ref) => {
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
        console.log('Image URL:', imageUrl);
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
  };

  const handleInputChange = (e) => {
    setEditedContent(e.target.value);
    content = editedContent;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getUTCFullYear();
    const month = date.toLocaleString('default', {
      month: 'long',
      timeZone: 'UTC',
    });
    const day = date.getUTCDate();
    return `${year}년 ${month} ${day}일`;
  };

  const formattedDate = formatDate(date);

  return (
    <div className={styles.feed_item} ref={ref} id="downloadImg">
      <div className={styles.feed_item_header}>
        <div className={styles.date_text}>{formattedDate}의 일기</div>
        <div>
          {isDownload ? (
            <> </>
          ) : isEditing ? (
            <button onClick={handleSave} className={styles.save_button}>
              <BiCheck size={26} />
            </button>
          ) : (
            <button onClick={handleEdit} className={styles.edit_button}>
              <BiEditAlt size={22} />
            </button>
          )}
          {isDownload ? (
            <> </>
          ) : (
            <button
              onClick={() => {
                onDownloadBtn();
              }}
              className={styles.saveImage_button}
            >
              <FiDownload size={22} />
            </button>
          )}
        </div>
      </div>
      <img src={img} alt="Feed" />
      {isEditing ? (
        <textarea
          value={editedContent}
          onChange={handleInputChange}
          className={styles.textarea}
        />
      ) : (
        <p className={styles.content}>{content}</p>
      )}
    </div>
  );
});

export default FeedItem;
