import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import { useFollowUser, useUnfollowUser, useFollowStatus } from '../../utils/useSocialFeatures';
import { useNotification } from '../../utils/useNotification';
import useAuthStore from '../../utils/authStore';

const SIZE_STYLES = {
  sm: {
    padding: '6px 12px',
    fontSize: '0.75rem',
    iconSize: '14px',
  },
  md: {
    padding: '8px 16px',
    fontSize: '0.875rem',
    iconSize: '16px',
  },
  lg: {
    padding: '10px 20px',
    fontSize: '1rem',
    iconSize: '18px',
  },
};

const FollowButton = ({
  userId,
  displayName,
  variant = 'primary',
  size = 'md',
}) => {
  const { showSuccess, showError } = useNotification();
  const { user: currentUser } = useAuthStore();

  const { data: statusData, isLoading: statusLoading } = useFollowStatus(userId);
  const isFollowing = statusData?.isFollowing || false;

  const followMutation = useFollowUser();
  const unfollowMutation = useUnfollowUser();

  const isPending = followMutation.isPending || unfollowMutation.isPending;

  // 🔹 resolve size once, reuse everywhere
  const sizeStyle = SIZE_STYLES[size] || SIZE_STYLES.md;

  const handleFollow = async () => {
    try {
      await followMutation.mutateAsync(userId);
      showSuccess(`You are now following ${displayName}`);
    } catch (error) {
      showError(error.response?.data?.message || 'Failed to follow user');
    }
  };

  const handleUnfollow = async () => {
    if (!window.confirm(`Unfollow ${displayName}?`)) return;

    try {
      await unfollowMutation.mutateAsync(userId);
      showSuccess(`You unfollowed ${displayName}`);
    } catch (error) {
      showError(error.response?.data?.message || 'Failed to unfollow user');
    }
  };

  const getButtonStyle = () => {
    const baseStyle = {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      padding: sizeStyle.padding,
      border: 'none',
      borderRadius: '8px',
      cursor: isPending || statusLoading ? 'not-allowed' : 'pointer',
      fontSize: sizeStyle.fontSize,
      fontWeight: '600',
      transition: 'all 0.2s',
      opacity: isPending || statusLoading ? 0.6 : 1,
    };

    if (isFollowing) {
      return {
        ...baseStyle,
        background: '#e5e7eb',
        color: '#374151',
      };
    }

    if (variant === 'secondary') {
      return {
        ...baseStyle,
        background: 'transparent',
        color: '#535bf2',
        border: '2px solid #535bf2',
      };
    }

    return {
      ...baseStyle,
      background: 'linear-gradient(135deg, #535bf2 0%, #764ba2 100%)',
      color: 'white',
    };
  };

  if (statusLoading) {
    return (
      <button style={getButtonStyle()} disabled>
        Loading...
      </button>
    );
  }

  // 🚫 don’t show follow button for yourself
  if (userId === currentUser?._id) return null;

  return (
    <button
      onClick={isFollowing ? handleUnfollow : handleFollow}
      disabled={isPending}
      style={getButtonStyle()}
      onMouseEnter={(e) => {
        if (!isPending && !statusLoading) {
          e.target.style.transform = 'translateY(-2px)';
          e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        }
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = 'translateY(0)';
        e.target.style.boxShadow = 'none';
      }}
    >
      {isFollowing ? (
        <>
          <PersonRemoveIcon style={{ fontSize: sizeStyle.iconSize }} />
          {isPending ? 'Unfollowing...' : 'Following'}
        </>
      ) : (
        <>
          <PersonAddIcon style={{ fontSize: sizeStyle.iconSize }} />
          {isPending ? 'Following...' : 'Follow'}
        </>
      )}
    </button>
  );
};

export default FollowButton;
