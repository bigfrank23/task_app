import AddReactionIcon from '@mui/icons-material/AddReaction';
import './emojiPopupContent.css'
import { useState } from 'react';

const EmojiPopupContent = () => {
  const [showEmojis, setShowEmojis] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState(null);

  const emojis = ["👍", "❤️", "😂", "😮", "😢", "👏"];

  const [reactCount, setReactCount] = useState(0)

  return (
    <div style={{ position: "relative" }}
      onMouseEnter={() => setShowEmojis(true)}
      >
      {/* Add Reaction */}
      <div
        className="popup-icons"
        >{
            selectedEmoji ? 
            <>
            {selectedEmoji} 
            <p>You reacted</p>
            </>
            :
            <>
            <AddReactionIcon style={{ fontSize: "13px" }} />
            <p>Add Reaction</p>
            </>
        }

        {showEmojis && (
          <div className="emoji-popup"
          onMouseLeave={() => setShowEmojis(false)}
          >
            {emojis.map((emoji) => (
              <span
                key={emoji}
                className="emoji"
                onClick={() => {setSelectedEmoji(emoji); 
                    setShowEmojis(false); 
                    setReactCount(reactCount + 1)}}
              >
                {emoji}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmojiPopupContent;
