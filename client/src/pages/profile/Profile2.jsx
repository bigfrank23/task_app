// pages/Profile.jsx - IMPROVED VERSION

import "./profile.css";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LocationPinIcon from "@mui/icons-material/LocationPin";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import TaskIcon from "@mui/icons-material/Task";
import CommentIcon from "@mui/icons-material/Comment";

import Header from "../../components/header/Header";
import useAuthStore from "../../utils/authStore";
import { useNotification } from "../../utils/useNotification";
import { 
  useUserProfile, 
  useDeleteAvatar, 
  useDeleteCoverPhoto 
} from "../../utils/useProfileHooks";
import LoadingSpinner from "../../components/tasks/TaskUtils";
import ErrorMessage from "../../components/tasks/TaskUtils";

// ✅ Helper function to generate color from initials
const stringToColor = (str) => {
  if (!str) return '#667eea';
  
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const hue = hash % 360;
  return `hsl(${hue}, 70%, 60%)`;
};

const Profile2 = () => {
  const navigate = useNavigate();
  const { userId } = useParams(); // Get userId from URL
  const { user: currentUser } = useAuthStore(); // Currently logged-in user
  const { showSuccess, showError } = useNotification();
  
  // ✅ Fetch profile data
  const { 
    data: profileData, 
    isPending, 
    error 
  } = useUserProfile(userId);

  // Mutations
  const deleteAvatarMutation = useDeleteAvatar();
  const deleteCoverPhotoMutation = useDeleteCoverPhoto();

  // Extract data
  const user = profileData?.user;
  const tasks = profileData?.tasks || [];
  const stats = profileData?.stats || {};

  // Check if viewing own profile
  const isOwnProfile = currentUser?._id === userId;

  // Generate initials
  const initials = `${user?.firstName?.charAt(0) ?? ""}${
    user?.lastName?.charAt(0) ?? ""
  }`.toUpperCase();

  const goToEdit = () => navigate("/profile/edit");

  const handleDeleteAvatar = (e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete your profile photo?")) {
      deleteAvatarMutation.mutate(undefined, {
        onSuccess: (data) => {
          showSuccess(data?.message || "Profile photo deleted");
        },
        onError: (error) => {
          showError(error.response?.data?.message || "Failed to delete");
        }
      });
    }
  };

  const handleDeleteCover = (e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete your cover photo?")) {
      deleteCoverPhotoMutation.mutate(undefined, {
        onSuccess: (data) => {
          showSuccess(data?.message || "Cover photo deleted");
        },
        onError: (error) => {
          showError(error.response?.data?.message || "Failed to delete");
        }
      });
    }
  };

  // Loading state
  if (isPending) {
    return (
      <>
        <Header />
        <div style={{ padding: '60px 20px', textAlign: 'center' }}>
          <LoadingSpinner message="Loading profile..." />
        </div>
      </>
    );
  }

  // Error state
  if (error) {
    return (
      <>
        <Header />
        <div style={{ padding: '60px 20px' }}>
          <ErrorMessage 
            message={error.response?.data?.message || "Failed to load profile"} 
          />
        </div>
      </>
    );
  }

  // User not found
  if (!user) {
    return (
      <>
        <Header />
        <div style={{ 
          padding: '60px 20px', 
          textAlign: 'center',
          color: '#9ca3af' 
        }}>
          <h2>User not found</h2>
          <button 
            onClick={() => navigate('/')}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              background: '#535bf2',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Go Home
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="profile">
        <div className="profileContainer">
          <div className="prCard">
            {/* COVER IMAGE */}
            <div className="coverWrapper">
              {user?.coverPhoto ? (
                <img src={user.coverPhoto} alt="cover" className="bgCoverImg" />
              ) : (
                <div
                  className="bgCoverDiv"
                  style={{
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    width: '100%',
                    height: '200px',
                    borderTopLeftRadius: '16px',
                    borderTopRightRadius: '16px',
                    position: 'relative',
                  }}
                />
              )}
              
              {/* ✅ Only show edit/delete on own profile */}
              {isOwnProfile && (
                <>
                  <EditIcon className="editIcon coverEdit" onClick={goToEdit} />
                  {user?.coverPhoto && (
                    <DeleteOutlineIcon
                      className="editIcon coverDelete"
                      onClick={handleDeleteCover}
                      style={{
                        opacity: deleteCoverPhotoMutation.isPending ? 0.5 : 1,
                        pointerEvents: deleteCoverPhotoMutation.isPending ? "none" : "auto",
                      }}
                    />
                  )}
                </>
              )}
            </div>

            {/* PROFILE IMAGE */}
            <div className="profileImgBox">
              <div 
                className="avatarWrapper" 
                onClick={isOwnProfile ? goToEdit : undefined}
                style={{ cursor: isOwnProfile ? 'pointer' : 'default' }}
              >
                {user?.userImage ? (
                  <>
                    <img
                      src={user.userImage}
                      alt="profile"
                      className="profileImg"
                    />
                    {/* ✅ Only show delete on own profile */}
                    {isOwnProfile && (
                      <DeleteOutlineIcon
                        className="editIcon avatarDelete"
                        onClick={handleDeleteAvatar}
                        style={{
                          opacity: deleteAvatarMutation.isPending ? 0.5 : 1,
                          pointerEvents: deleteAvatarMutation.isPending ? "none" : "auto",
                        }}
                      />
                    )}
                  </>
                ) : (
                  <span 
                    className="profileImgFallback"
                    style={{ backgroundColor: stringToColor(initials) }}
                  >
                    {initials}
                  </span>
                )}
                {isOwnProfile && <EditIcon className="editIcon avatarEdit" />}
              </div>
            </div>

            {/* TEXT CONTENT */}
            <div className="profileContainerTxt">
              {isOwnProfile && (
                <EditIcon className="editIcon textEdit" onClick={goToEdit} />
              )}

              <h2 className="lUsername">
                {user?.firstName} {user?.lastName}
              </h2>
              <span>@{user?.displayName}</span>

              {user?.jobTitle && (
                <p className="lUserTitle">{user.jobTitle}</p>
              )}

              {user?.bio && (
                <p className="lUserBio">{user.bio}</p>
              )}

              <div className="lLocation">
                {user?.location && (
                  <div>
                    <LocationPinIcon style={{ fontSize: "13px" }} />
                    {user.location}
                  </div>
                )}
                <span>{user?.followerCount || 0} followers</span>
                <span>{user?.followingCount || 0} following</span>
              </div>

              {/* ✅ Show follow button on other profiles, edit on own */}
              <div className="profileBtnBox">
                {!isOwnProfile ? (
                  <div className="profileButton">
                    <button>
                      <PersonAddIcon style={{ fontSize: "13px" }} />
                      Follow
                    </button>
                    <button>Message</button>
                  </div>
                ) : (
                  <div className="profileButton">
                    <button onClick={goToEdit}>
                      <EditIcon style={{ fontSize: "13px" }} />
                      Edit Profile
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ACTIVITY SECTION */}
          <div className="prActivity" style={{ marginTop: "23px" }}>
            <h3>Activity</h3>
            
            {/* Stats */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
              gap: '10px',
              marginBottom: '20px'
            }}>
              <div style={{
                background: '#f0f9ff',
                padding: '15px',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#0284c7' }}>
                  {stats.totalTasks || 0}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  Total Tasks
                </div>
              </div>
              <div style={{
                background: '#f0fdf4',
                padding: '15px',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#16a34a' }}>
                  {stats.completedTasks || 0}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  Completed
                </div>
              </div>
              <div style={{
                background: '#fef3c7',
                padding: '15px',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#f59e0b' }}>
                  {stats.pendingTasks || 0}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  Pending
                </div>
              </div>
            </div>

            {/* Recent Tasks */}
            <div className="activityBtns">
              <div className="activityBtn active">
                <TaskIcon />
                Posts ({tasks.length})
              </div>
              <div className="activityBtn">
                <CommentIcon />
                Comments
              </div>
            </div>

            {/* Task List */}
            {tasks.length > 0 ? (
              <div style={{ marginTop: '20px' }}>
                {tasks.map((task) => (
                  <div 
                    key={task._id}
                    style={{
                      background: '#fff',
                      padding: '15px',
                      borderRadius: '8px',
                      marginBottom: '10px',
                      border: '1px solid #e5e7eb'
                    }}
                  >
                    <h4 style={{ margin: '0 0 8px 0', fontSize: '0.95rem' }}>
                      {task.title}
                    </h4>
                    {task.description && (
                      <p style={{ 
                        margin: '0 0 8px 0', 
                        fontSize: '0.85rem',
                        color: '#6b7280',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {task.description}
                      </p>
                    )}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '0.75rem',
                      color: '#9ca3af'
                    }}>
                      <span>{new Date(task.createdAt).toLocaleDateString()}</span>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: '4px',
                        background: task.status === 'completed' ? '#dcfce7' : '#fef3c7',
                        color: task.status === 'completed' ? '#16a34a' : '#f59e0b'
                      }}>
                        {task.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '40px 20px',
                color: '#9ca3af'
              }}>
                <p>No tasks yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile2;