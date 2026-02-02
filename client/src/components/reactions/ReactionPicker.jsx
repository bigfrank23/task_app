import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HandshakeIcon from '@mui/icons-material/Handshake';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import './reactionPicker.css';

const ReactionPicker = ({ onSelect, currentReaction }) => {
  const reactions = [
    { type: 'like', icon: <ThumbUpIcon fontSize="small" />, color: '#0a66c2' },
    { type: 'love', icon: <FavoriteIcon fontSize="small" />, color: '#df704d' },
    { type: 'celebrate', icon: <HandshakeIcon fontSize="small" />, color: '#6dae4f' },
    { type: 'dislike', icon: <ThumbDownIcon fontSize="small" />, color: '#dc2626' }
  ];

  const reactionConfig = {
  like: { icon: <ThumbUpIcon style={{fontSize: '14px'}} />, color: '#0a66c2', label: 'Like' },
  love: { icon: <FavoriteIcon style={{fontSize: '14px'}} />, color: '#df704d', label: 'Love' },
  celebrate: { icon: <HandshakeIcon style={{fontSize: '14px'}} />, color: '#6dae4f', label: 'Celebrate' },
  dislike: { icon: <ThumbDownIcon style={{fontSize: '14px'}} />, color: '#dc2626', label: 'dislike' }
};

const current = reactionConfig[currentReaction];


  return (
    <div className="reaction-wrapper">
      {/* Button */}
      {/* <div
        className="reaction-button"
        onClick={() => onSelect(currentReaction || 'like')}
      >
        {currentReaction
          ? reactions.find(r => r.type === currentReaction)?.icon
          : <ThumbUpIcon fontSize="small" />
        }
        <span>Like</span>
      </div> */}
      <div className="reaction-button" style={{ color: current?.color }}>
        {current ? current.icon : <ThumbUpOffAltIcon fontSize='small' />}
        <span style={{fontSize: "13px", textTransform: 'capitalize'}}>{current ? current.label : 'Like'}</span>
      </div>

      {/* Picker */}
      <div className="reaction-picker">
        {reactions.map(r => (
          <div
            key={r.type}
            className="reaction-icon"
            style={{ color: r.color}}
            onClick={() => onSelect(r.type)}
          >
            {r.icon}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReactionPicker;
