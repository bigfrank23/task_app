import { useNotifications, useMarkNotificationRead } from '../../utils/useSocialFeatures';
import { useNavigate } from 'react-router-dom';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import Header from '../../components/header/Header';
import { ClockIcon, NotificationBellIcon, NotificationIcon } from '../../utils/svgIcons';
import { formatTime } from '../../utils/time';
import { useState } from 'react';
import { LoadingSpinner } from '../../components/tasks/TaskUtils';
import Pagination from '../Dashboard/pagination/Paginaton'
import Avatar from '../../components/avatar/Avatar';
import useOnlineUsersStore from '../../utils/onlineUsersStore';

const Notifications = () => {
  const navigate = useNavigate();
  // const { data: notificationData, isPending } = useNotifications(1, false);
  const markAsReadMutation = useMarkNotificationRead();

  const { onlineUsers } = useOnlineUsersStore();

  // ✅ Pagination + filter state
  const [currentPage, setCurrentPage] = useState(1);
  const [unreadOnly, setUnreadOnly] = useState(false);

   // ✅ SINGLE query
  const { data, isFetching, error, isPending } = useNotifications(currentPage, unreadOnly);
  if (error) return <div>Something went wrong</div>;

 const notifications = data?.notifications || [];
  const pagination = data?.pagination || {};

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  const handleClick = (notification) => {
    if (!notification.read) {
      markAsReadMutation.mutate(notification._id);
    }
    if (notification.link) {
      navigate(notification.link);
    }
  };

  
  const unreadCount = unreadOnly ? pagination.total : null;

  return (
    <>
      <Header />
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', marginTop: '30px', justifyContent: 'center' }}>
        <button
          onClick={() => {
            setUnreadOnly(false);
            setCurrentPage(1);
          }}
          style={{
            padding: '6px 12px',
            borderRadius: '6px',
            border: '1px solid #e5e7eb',
            background: !unreadOnly ? '#535bf2' : 'white',
            color: !unreadOnly ? 'white' : '#374151',
          }}
        >
          All
        </button>

        <button
          onClick={() => {
            setUnreadOnly(true);
            setCurrentPage(1);
          }}
          style={{
            padding: '6px 12px',
            borderRadius: '6px',
            border: '1px solid #e5e7eb',
            background: unreadOnly ? '#535bf2' : 'white',
            color: unreadOnly ? 'white' : '#374151',
          }}
        >
          Unread
        </button>
      </div>
      <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px' }}>
        <h1 style={{fontSize: '2.2em', marginBottom: '15px', textAlign: 'center'}}>
          {!unreadOnly
            ? <>You have {pagination.total} Notifications <NotificationIcon size={20}/></>
            : unreadCount > 0
            ? <>You have {unreadCount} unread notifications <NotificationBellIcon size={20}/></>
            : null
          }
        </h1>
        {isPending ? (
          <div>
            <LoadingSpinner message='Loading Notifications...'/>
          </div>
        ) : notifications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#9ca3af' }}>
            <span>
              <NotificationBellIcon size={90}/>
            </span>
            <p>No unread notifications yet</p>
          </div>
        ) : (
          <div>
            {notifications.map((notification) => (
              <div
                key={notification._id}
                onClick={() => handleClick(notification)}
                style={{
                  padding: '20px',
                  background: notification.read ? 'white' : '#eff6ff',
                  borderRadius: '12px',
                  marginBottom: '10px',
                  cursor: 'pointer',
                  border: '1px solid #e5e7eb'
                }}
              >
                <div style={{ fontWeight: '600', marginBottom: '8px' }}>
                  {notification.title}
                </div>
                <div style={{display: 'flex', flexDirection: 'column', gap: '1px'}}>
                <Avatar isOnline={onlineUsers[notification?.sender?._id]} image={notification?.sender?.userImage} name={notification?.sender?.displayName} size={25}/>
                <div style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '8px' }}>
                  {notification.message}
                </div>
                </div>
                <div style={{ color: '#6b7280', fontSize: '0.575rem', display: 'flex', alignItems: 'center' }}>
                  <ClockIcon size={10}/>
                  <span>{formatTime(notification?.createdAt)}</span>
                </div>
              </div>
              
            ))}
          </div>
        )}
        {/* ✅ Pagination */}
        {pagination.pages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={pagination.pages}
            onPageChange={handlePageChange}
            isLoading={isFetching}
          />
        )}
      </div>
    </>
  );
};

export default Notifications;