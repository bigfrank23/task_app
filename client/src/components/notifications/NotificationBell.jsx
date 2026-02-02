import { useState, useRef, useEffect } from 'react';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { 
  useNotifications, 
  useUnreadNotificationCount,
  useMarkNotificationRead,
  useMarkAllNotificationsRead 
} from '../../utils/useSocialFeatures';
import { useNavigate } from 'react-router-dom';
import './notificationBell.css';
import { NewFollowerIcon, NewMessageIcon } from '../../utils/svgIcons';
import { formatTime } from '../../utils/time';

const NotificationBell = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const { data: unreadCount = 0 } = useUnreadNotificationCount();
  const { data: notificationData, isLoading } = useNotifications(1, false);
  const markAsReadMutation = useMarkNotificationRead();
  const markAllReadMutation = useMarkAllNotificationsRead();

  const notifications = notificationData?.notifications || [];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsReadMutation.mutate(notification._id);
    }
    if (notification.link) {
      navigate(notification.link);
    }
    setShowDropdown(false);
  };

  const handleMarkAllRead = () => {
    markAllReadMutation.mutate();
  };

  const getNotificationIcon = (type) => {
    const icons = {
      follow: <NewFollowerIcon size={20} color='#535bf2'/>,
      message: <NewMessageIcon size={20} color='#535bf2'/>,
      task_comment: '💬',
      task_like: '❤️',
      task_mention: '@',
      task_assigned: '📋'
    };
    return icons[type] || '🔔';
  };

  return (
    <div className="notification-bell-container" ref={dropdownRef}>
      <button 
        className="notification-bell-button"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <NotificationsIcon />
        {unreadCount > 0 && (
          <span className="notification-badge">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h3>Notifications</h3>
            {unreadCount > 0 && (
              <button 
                className="mark-all-read-btn"
                onClick={handleMarkAllRead}
                disabled={markAllReadMutation.isPending}
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="notification-list">
            {isLoading ? (
              <div className="notification-loading">Loading...</div>
            ) : notifications.length === 0 ? (
              <div className="notification-empty">
                <span style={{ fontSize: '3rem' }}>🔔</span>
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.slice(0, 10).map((notification) => (
                <div
                  key={notification._id}
                  className={`notification-item ${!notification.read ? 'unread' : ''}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="notification-icon">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="notification-content">
                    <div className="notification-title">{notification.title}</div>
                    {
                      notification?.sender?.userImage ? (
                      <div style={{display: 'flex', gap: '3px'}}>
                        <img src={notification?.sender?.userImage} alt="" style={{width: '30px', height: '30px', borderRadius: '50%'}}/>
                        <div>
                        <div className="notification-message">{notification.message}</div>
                        <div className="notification-time">{formatTime(notification.createdAt)}</div>
                        </div>
                      </div>
                      ):(
                        <>
                        <div className="notification-message">{notification.message}</div>
                        <div className="notification-time">{formatTime(notification.createdAt)}</div>
                        </>
                      )
                    }
                  </div>
                  {!notification.read && <div className="notification-dot"></div>}
                </div>
              ))
            )}
          </div>

          <div className="notification-footer">
            <button onClick={() => { navigate('/notifications'); setShowDropdown(false); }}>
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;