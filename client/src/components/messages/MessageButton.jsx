import ChatIcon from '@mui/icons-material/Chat';
import { useNavigate } from 'react-router-dom';
import { useUnreadMessageCount } from '../../utils/useSocialFeatures';

const MessageButton = ({ recipientId, recipientName }) => {
  const navigate = useNavigate();
  const { data: unreadCount = 0 } = useUnreadMessageCount();

  const handleClick = () => {
    if (recipientId) {
      // Navigate to message page with this user
      navigate(`/messages/${recipientId}`);
    } else {
      // Navigate to messages list
      navigate('/messages');
    }
  };

  return (
    <button
      onClick={handleClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '8px 16px',
        background: 'transparent',
        color: '#374151',
        border: '2px solid #374151',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '0.875rem',
        fontWeight: '600',
        transition: 'all 0.2s',
        position: 'relative'
      }}
      onMouseEnter={(e) => {
        e.target.style.background = '#374151';
        e.target.style.color = 'white';
      }}
      onMouseLeave={(e) => {
        e.target.style.background = 'transparent';
        e.target.style.color = '#374151';
      }}
    >
      <ChatIcon style={{ fontSize: '16px' }}
       />
      {recipientId ? `Message ${recipientName || ''}` : 'Messages'}
      {!recipientId && unreadCount > 0 && (
        <span style={{
          position: 'absolute',
          top: '-8px',
          right: '-8px',
          background: '#ef4444',
          color: 'white',
          borderRadius: '50%',
          width: '20px',
          height: '20px',
          fontSize: '0.65rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: '700'
        }}>
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </button>
  );
};

export default MessageButton;