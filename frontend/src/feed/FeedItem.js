import { useState } from 'react';
import styles from './Feed.module.css';
import { BiCheck } from 'react-icons/bi';
import { BiEditAlt } from 'react-icons/bi';

function FeedItem({ date, image, content }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(content);

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

  const feedDate = new Date(date);

  const formattedDate = feedDate.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className={styles.feed_item}>
      <div className={ styles.feed_item_header }>
        <div className={styles.date_text}>{formattedDate}의 일기</div>
          {isEditing ? (
            <button onClick={handleSave} className={styles.save_button}>
              <BiCheck size={26}/>
            </button>
          ) : (
            <button onClick={handleEdit} className={styles.edit_button}>
              <BiEditAlt size={22}/>
            </button>
          )}
      </div>
      <img src={image} alt="Feed" />
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

}

export default FeedItem;
