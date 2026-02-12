import "./profile.css";
import LocationPinIcon from "@mui/icons-material/LocationPin";
import ReadMoreText from "../../components/readMoreText/ReadMoreText";
import { useEffect, useState } from "react";
import TaskIcon from "@mui/icons-material/Task";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import CollectionsIcon from "@mui/icons-material/Collections";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import FollowButton from "../../components/social/FollowButton";
import MessageButton from "../../components/messages/MessageButton";
import DOMPurify from 'dompurify'
import FolderIcon from "@mui/icons-material/Folder";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import "swiper/css/scrollbar";

// import required modules
import { Scrollbar } from "swiper/modules";

import { Link, useNavigate, useParams } from "react-router-dom";
import Header from "../../components/header/Header";
import useAuthStore from "../../utils/authStore";
import { useMutation } from "@tanstack/react-query";
import apiRequest from "../../utils/apiRequest";
import { useNotification } from "../../utils/useNotification";
import { useProfileViewers, useTrackProfileView, useUserMedia, useUserMediaCounts, useUserProfile } from "../../utils/useProfileHooks";
import { ErrorMessage, LoadingSpinner } from "../../components/tasks/TaskUtils";
import {
  useFollowing,
  useFollowers,
  useSuggestedUsers,
  useUserConnections,
} from "../../utils/useSocialFeatures";
import GlassModal from "../../components/modal/GlassModal";
import Avatar from "../../components/avatar/Avatar";
import useOnlineUsersStore from "../../utils/onlineUsersStore";
import { formatTime } from "../../utils/time";
import Pagination from "../Dashboard/pagination/Paginaton";
import OptimizedImage from "../../components/optimizedImage/OptimizedImage";
import MediaLightbox from "../../media/mansoryGrid/MediaLightBox";
import MediaMasonry from "../../media/mansoryGrid/MediaMansory";
import FileList from "./fileList/FileList";
import Footer from "../../components/footer/Footer";

const Profile = () => {
  const [openModal, setOpenModal] = useState(false);
  const [modalType, setModalType] = useState(null);

  const [slides, setSlides] = useState(3);
  const { updateUser } = useAuthStore();
  const { showSuccess, showError } = useNotification();
// In your Profile component, update state
const [activeActivity, setActiveActivity] = useState("tasks");
const [lightboxOpen, setLightboxOpen] = useState(false);
const [lightboxIndex, setLightboxIndex] = useState(0);
const [currentMediaType, setCurrentMediaType] = useState("image"); // Track what we're viewing



  // ✅ Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // Add state for media pagination
const [mediaPage, setMediaPage] = useState(1);
const MEDIA_LIMIT = 12;

  const navigate = useNavigate();
  const { userId } = useParams(); // Get userId from URL
  const { user: currentUser } = useAuthStore(); // Currently logged-in user
  const { data: followersData } = useFollowers(userId);
  const { data: followingData } = useFollowing(userId);
  const { data: suggestedUsers } = useSuggestedUsers();

  // Fetch connections for the profile being viewed
  const { data: connections = [], isLoading: connectionsLoading } =
    useUserConnections(userId);

    console.log(currentUser);
    
  console.log(connections);

    const trackView = useTrackProfileView();
  const { data: viewersData } = useProfileViewers(userId);

  const { onlineUsers } = useOnlineUsersStore();


  const goToEdit = () => navigate("/profile/edit");

  // ✅ Fetch profile data
  const {
    data: profileData,
    isPending,
    error,
  } = useUserProfile(userId, currentPage);


const { data: mediaCountsData } = useUserMediaCounts(userId);
const mediaCounts = mediaCountsData?.counts || { images: 0, videos: 0, files: 0 };

  // Fetch media with pagination
const { data: mediaData, isLoading: mediaLoading } = useUserMedia(
  userId,
  activeActivity === "images" ? "image" 
    : activeActivity === "videos" ? "video" 
    : activeActivity === "files" ? "file" 
    : null,
  mediaPage,
  MEDIA_LIMIT
);



  // Extract data
  const user = profileData?.user;
  const tasks = profileData?.tasks || [];
  const stats = profileData?.stats || {};
  const followers = followersData?.followers || {};
  const following = followingData?.following || {};
  const pagination = profileData?.pagination || {};

  // Extract data

const paginatedMedia = mediaData?.media || [];
const mediaPagination = mediaData?.pagination || {};

  // console.log('user', user);
  console.log("tasks", tasks);

const allImages = paginatedMedia
  .filter(item => item.media.type === "image")
  .map(item => ({ ...item.media, taskId: item.taskId }));

const allVideos = paginatedMedia
  .filter(item => item.media.type === "video")
  .map(item => ({ ...item.media, taskId: item.taskId }));

const allFiles = paginatedMedia
  .filter(item => item.media.type === "file")
  .map(item => ({ ...item.media, taskId: item.taskId }));

console.log('📁 Files for display:', allFiles);

// Reset page when changing tabs
const handleActivityChange = (activity) => {
  setActiveActivity(activity);
  setMediaPage(1); // Reset to page 1
};

// Handle opening lightbox
const handleOpenLightbox = (type) => (index) => {
  setCurrentMediaType(type);
  setLightboxIndex(index);
  setLightboxOpen(true);
};
console.log('🖼️ Images for display:', allImages);
console.log('🎥 Videos for display:', allVideos);

  // Check if viewing own profile
  const isOwnProfile = currentUser?._id === userId;

  const initials = `${user?.firstName?.charAt(0) ?? ""}${
    user?.lastName?.charAt(0) ?? ""
  }`.toUpperCase();

   // Track profile view when component mounts
  useEffect(() => {
    if (userId && !isOwnProfile) {
      trackView.mutate(userId);
    }
  }, [userId, isOwnProfile]);

  useEffect(() => {
    //Slide update logic
    const updateSlides = () => {
      if (window.innerWidth < 600) setSlides(1);
      else if (window.innerWidth < 1024) setSlides(2);
      else setSlides(3);
    };

    updateSlides();
    window.addEventListener("resize", updateSlides);

    return () => window.removeEventListener("resize", updateSlides);
  }, []);


  // Delete avatar mutation
  const deleteAvatarMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest.delete("/user/profile/avatar");
      return response.data;
    },
    onSuccess: (data) => {
      console.log(data);

      updateUser({ userImage: null });
      showSuccess(data?.message);
    },
    onError: (error) => {
      showError(
        error.response?.data?.message || "Failed to delete profile photo",
      );
    },
  });

  // Delete cover photo mutation
  const deleteCoverPhotoMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest.delete("/user/profile/cover-photo");
      return response.data;
    },
    onSuccess: (data) => {
      console.log(data);

      updateUser({ coverPhoto: null });
      showSuccess(data?.message);
    },
    onError: (error) => {
      showError(
        error.response?.data?.message || "Failed to delete cover photo",
      );
    },
  });

  const handleDeleteAvatar = (e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete your profile photo?")) {
      deleteAvatarMutation.mutate();
    }
  };

  const handleDeleteCover = (e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete your cover photo?")) {
      deleteCoverPhotoMutation.mutate();
    }
  };

  // Loading state
  if (isPending) {
    return (
      <>
        <Header />
        <div style={{ padding: "60px 20px", textAlign: "center" }}>
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
        <div style={{ padding: "60px 20px" }}>
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
        <div
          style={{
            padding: "60px 20px",
            textAlign: "center",
            color: "#9ca3af",
          }}
        >
          <h2>User not found</h2>
          <button
            onClick={() => navigate("/")}
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              background: "#535bf2",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Go Home
          </button>
        </div>
      </>
    );
  }

  const openFollowersModal = () => {
    setModalType("followers");
    setOpenModal(true);
  };

  const openFollowingModal = () => {
    setModalType("following");
    setOpenModal(true);
  };

  const openConnectionsModal = () => {
    setModalType("connections");
    setOpenModal(true);
  };

  const handleUserClick = () => {
    setOpenModal(false);
    setModalType(null);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  console.log(viewersData);
  


  return (
    <>
      <Header />
      <div>
      <div className="profile">

      <div className="profileLeft">
        {isOwnProfile && viewersData && (
          <div className="lBottom">
            <div style={{display: "flex", justifyContent: "space-between", marginBottom: "10px"}}>
              <p style={{ fontWeight: 600 }}>Profile Views (Last 30 days)</p>
              <span style={{ 
                background: '#535bf2', 
                color: 'white', 
                padding: '2px 8px', 
                borderRadius: '50%',
                fontSize: '0.85rem',
                fontWeight: 600,
                width: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {viewersData.totalViewers}
              </span>
            </div>
            
            {/* Viewers List */}
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {viewersData?.recentViewers?.length === 0 ? (
                <p style={{ color: '#9ca3af', textAlign: 'center', padding: '20px 0' }}>
                  No views yet
                </p>
              ) : (
                viewersData?.recentViewers?.map((viewer) => (
                  <Link 
                    to={`/profile/${viewer?.viewer?._id}`} 
                    key={viewer?._id}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '10px', 
                      padding: '10px',
                      borderBottom: '1px solid #e5e7eb',
                      textDecoration: 'none',
                      color: 'inherit',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <Avatar 
                      size={40} 
                      image={viewer?.viewer?.userImage} 
                      name={viewer?.viewer?.displayName} 
                      isOnline={onlineUsers[viewer?.viewer?._id]}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 500, fontSize: '0.9rem' }}>
                        {viewer?.viewer?.firstName} {viewer?.viewer?.lastName}
                      </div>
                      <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                        @{viewer?.viewer?.displayName}
                      </span>
                      {viewer?.viewer?.jobTitle && (
                        <div style={{ fontSize: '0.7rem', color: '#9ca3af', marginTop: '2px' }}>
                          {viewer?.viewer?.jobTitle}
                        </div>
                      )}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#9ca3af' }}>
                      {new Date(viewer.createdAt).toLocaleDateString()}
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        )}
      </div>
        <div className="profileContainer">
          {/* <div className="prCard"> */}
          <div className="prCard">
            {/* COVER IMAGE */}
            <div className="coverWrapper">
              {user?.coverPhoto ? (
                <img
                  src={user?.coverPhoto}
                  alt=""
                  className="bgCoverImg"
                  onError={(e) => {
                    e.target.src = "/general/images/placeholder.jpg";
                    e.target.alt = "Image fail to load";
                  }}
                  loading="lazy"
                />
              ) : (
                <div
                  className="bgCoverDiv"
                  style={{
                    backgroundImage: user?.coverImg
                      ? `url(${user.coverImg})`
                      : `linear-gradient(135deg, #667eea, #764ba2)`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    width: "100%",
                    height: "200px",
                    borderTopLeftRadius: "16px",
                    borderTopRightRadius: "16px",
                    position: "relative",
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
                        pointerEvents: deleteCoverPhotoMutation.isPending
                          ? "none"
                          : "auto",
                      }}
                    />
                  )}
                </>
              )}
            </div>

            {/* PROFILE IMAGE */}
            <div className="profileImgBox">
              <div className="avatarWrapper" onClick={goToEdit}>
                {user?.userImage ? (
                  <>
                    <img
                      src={user?.userImage}
                      alt="user_profile_img"
                      className="profileImg"
                      onError={(e) => {
                        e.target.src = "/general/images/user.png";
                        e.target.alt = "Image fail to load";
                      }}
                      loading="lazy"
                    />
                    {/* ✅ Only show delete on own profile */}
                    {isOwnProfile && (
                      <DeleteOutlineIcon
                        className="editIcon avatarDelete"
                        onClick={handleDeleteAvatar}
                        style={{
                          opacity: deleteAvatarMutation.isPending ? 0.5 : 1,
                          pointerEvents: deleteAvatarMutation.isPending
                            ? "none"
                            : "auto",
                        }}
                      />
                    )}
                  </>
                ) : (
                  <span className="profileImgFallback">{initials}</span>
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

              <p className="lUserTitle">{user?.jobTitle}</p>
              <p className="lUserBio">{user?.bio}</p>

              <div className="lLocation">
                <div>
                  <LocationPinIcon style={{ fontSize: "13px" }} />
                  {user?.location || "Lagos, Nigeria"}
                </div>
                <span
                  onClick={openConnectionsModal}
                  style={{ cursor: "pointer", textDecoration: "underline" }}
                >
                  {connections.length} connections
                </span>
              </div>

              <div className="profileBtnBox">
                {!isOwnProfile ? (
                  <div className="profileButton">
                    <FollowButton
                      userId={userId}
                      displayName={user?.displayName}
                    />
                    <MessageButton
                      recipientId={userId}
                      recipientName={user?.displayName}
                    />
                  </div>
                ) : (
                  <>
                  <div className="profileButton">
                    <div onClick={goToEdit} className="editProfileBtn">
                      <EditIcon style={{ fontSize: "13px" }} />
                      Edit Profile
                    </div>
                  </div>
                  </>
                )}
                {/* ✅ Fixed follower count section */}
                <div className="followerCount">
                  <div
                    className="profileFollowerCount"
                    style={{ cursor: "pointer" }}
                    onClick={openFollowersModal}
                  >
                    <span>followers {followers?.length || 0}</span>
                  </div>
                  <div
                    className="profileFollowingCount"
                    style={{ cursor: "pointer" }}
                    onClick={openFollowingModal}
                  >
                    <span>following {following?.length || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ACTIVITY SECTION */}
          <div className="prActivity" style={{ marginTop: "23px" }}>
            <h3>Activity</h3>

            {/* Stats */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
                gap: "10px",
                marginBottom: "20px",
                marginTop: "10px",
              }}
            >
              <div
                style={{
                  background: "#f0f9ff",
                  padding: "15px",
                  borderRadius: "8px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "700",
                    color: "#0284c7",
                  }}
                >
                  {stats.totalTasks || 0}
                </div>
                <div style={{ fontSize: "0.75rem", color: "#64748b" }}>
                  Total Tasks
                </div>
              </div>
              <div
                style={{
                  background: "#f0fdf4",
                  padding: "15px",
                  borderRadius: "8px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "700",
                    color: "#16a34a",
                  }}
                >
                  {stats.completedTasks || 0}
                </div>
                <div style={{ fontSize: "0.75rem", color: "#64748b" }}>
                  Completed
                </div>
              </div>
              <div
                style={{
                  background: "#fef3c7",
                  padding: "15px",
                  borderRadius: "8px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "700",
                    color: "#f59e0b",
                  }}
                >
                  {stats.pendingTasks || 0}
                </div>
                <div style={{ fontSize: "0.75rem", color: "#64748b" }}>
                  Pending
                </div>
              </div>
              <div
                style={{
                  background: "rgb(239 68 68 / 19%)",
                  padding: "15px",
                  borderRadius: "8px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "700",
                    color: "#ef4444",
                  }}
                >
                  {stats.lateTasks || 0}
                </div>
                <div style={{ fontSize: "0.75rem", color: "#64748b" }}>
                  Late
                </div>
              </div>
            </div>

           {/* Activity Tabs */}
          <div className="activityBtns">
            <div
              className={`activityBtn ${activeActivity === "tasks" ? "active" : ""}`}
              onClick={() => handleActivityChange("tasks")}
            >
              <TaskIcon />
              Recent Tasks ({tasks.length})
            </div>

            <div
              className={`activityBtn ${activeActivity === "images" ? "active" : ""}`}
              onClick={() => handleActivityChange("images")}
            >
              <CollectionsIcon />
              Images ({mediaCounts.images}) {/* ✅ Global count */}
            </div>

            <div
              className={`activityBtn ${activeActivity === "videos" ? "active" : ""}`}
              onClick={() => handleActivityChange("videos")}
            >
              <VideoLibraryIcon />
              Videos ({mediaCounts.videos}) {/* ✅ Global count */}
            </div>

             <div
                className={`activityBtn ${activeActivity === "files" ? "active" : ""}`}
                onClick={() => handleActivityChange("files")}
              >
                <FolderIcon style={{ fontSize: '20px' }} /> {/* or InsertDriveFileIcon */}
                Files ({mediaCounts.files})
              </div>
          </div>

            {/* Task List */}
            {activeActivity === "tasks" && tasks.length > 0 ? (
              <>
              <div style={{ marginTop: "20px" }}>
                {tasks.map((task) => (
                  <div
                    key={task._id}
                    style={{
                      background: "#fff",
                      padding: "15px",
                      borderRadius: "8px",
                      marginBottom: "10px",
                      border: "1px solid #e5e7eb",
                    }}
                  >
                    <h4 style={{ margin: "0 0 8px 0", fontSize: "0.95rem" }}>
                      <div
                          dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(task?.title || "")
                          }}
                        />
                    </h4>
                    {task.description && (
                      <ReadMoreText>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(task?.description || "")
                          }}
                        />
                      </ReadMoreText>
                    )}
                    <div>
                      <div
                        className={
                          task?.attachments?.length === 0
                            ? "removeMD"
                            : "profileTaskImgs"
                        }
                      >
                        <>
                          {/* Single attachment */}
                          {task?.attachments?.length === 1 && (
                            <>
                              {task.attachments[0].type === "image" ? (
                                <OptimizedImage
                                  src={task.attachments[0].url}
                                  alt={task.attachments[0].filename}
                                  width={task.attachments[0].width}
                                  height={task.attachments[0].height}
                                  blurhash={task.attachments[0].blurhash}
                                  className="pMiddleBodyImg"
                                  priority={false}
                                />
                              ) : task.attachments[0].type === "video" ? (
                                <video
                                  src={task.attachments[0].url}
                                  controls
                                  className="pMiddleBodyImg"
                                  style={{
                                    maxWidth: "300px",
                                    borderRadius: "8px",
                                  }}
                                />
                              ) : (
                                <a
                                  href={task.attachments[0].url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="pMiddleBodyFile"
                                >
                                  📄 {task.attachments[0].filename}
                                </a>
                              )}
                            </>
                          )}

                          {/* Multiple attachments */}
                          {task?.attachments?.length > 1 && (
                            <Swiper
                              slidesPerView="auto"
                              spaceBetween={30}
                              scrollbar={{ hide: true }}
                              modules={[Scrollbar]}
                              className="mySwiper"
                            >
                              {task.attachments.map((file, index) => (
                                <SwiperSlide key={index}>
                                  {file.type === "image" ? (
                                    <OptimizedImage
                                      src={file.url}
                                      alt={file.filename}
                                      width={file.width}
                                      height={file.height}
                                      blurhash={file.blurhash}
                                      className="middleBodyImg"
                                    />
                                  ) : file.type === "video" ? (
                                    <video
                                      src={file.url}
                                      controls
                                      className="middleBodyImg"
                                      style={{ borderRadius: "8px", height: "200px", objectFit: "cover" }}
                                    />
                                  ) : (
                                    <a
                                      href={file.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="pMiddleBodyFile"
                                    >
                                      📄 {file.filename}
                                    </a>
                                  )}
                                </SwiperSlide>
                              ))}
                            </Swiper>
                          )}
                          <span style={{ fontSize: "10px", color: "#797777" }}>
                            <i>
                              {task?.attachments?.length
                                ? task?.attachments?.length
                                : ""}{" "}
                              Attachment
                            </i>
                          </span>
                        </>
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        fontSize: "0.75rem",
                        color: "#9ca3af",
                      }}
                    >
                      <span>
                        {new Date(task.createdAt).toLocaleDateString()}
                      </span>
                      <span
                        style={{
                          padding: "2px 8px",
                          borderRadius: "4px",
                          background:
                            task.status === "completed" ? "#dcfce7" : "#fef3c7",
                          color:
                            task.status === "completed" ? "#16a34a" : "#f59e0b",
                        }}
                      >
                        {task.status}
                      </span>
                    </div>
                  </div>
                ) 

                )}
                {/* ✅ Pagination */}
                {pagination?.pages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={pagination?.pages}
                    onPageChange={handlePageChange}
                    // isLoading={isFetching}
                    />
                )}
              </div>
                    </>
            ): tasks.length === 0 && (
                  <p style={{ textAlign: "center", color: "#9ca3af", padding: "40px 0" }}>
                    No tasks yet
                  </p>)}

          {/* Images Tab */}
            {activeActivity === "images" && (
              <div style={{ marginTop: "20px" }}>
                {mediaLoading ? (
                  <LoadingSpinner message="Loading images..." />
                ) : allImages.length === 0 ? (
                  <p style={{ textAlign: "center", color: "#9ca3af", padding: "40px 0" }}>
                    No images posted yet
                  </p>
                ) : (
                  <>
                    <MediaMasonry
                      media={allImages}
                      onOpen={handleOpenLightbox("image")}
                    />
                    
                    {/* Pagination */}
                    {mediaPagination.totalPages > 1 && (
                      <Pagination
                        currentPage={mediaPage}
                        totalPages={mediaPagination.totalPages}
                        onPageChange={(page) => setMediaPage(page)}
                      />
                    )}
                  </>
                )}
              </div>
            )}

            {/* Videos Tab */}
            {activeActivity === "videos" && (
              <div style={{ marginTop: "20px" }}>
                {mediaLoading ? (
                  <LoadingSpinner message="Loading videos..." />
                ) : allVideos.length === 0 ? (
                  <p style={{ textAlign: "center", color: "#9ca3af", padding: "40px 0" }}>
                    No videos posted yet
                  </p>
                ) : (
                  <>
                    <MediaMasonry
                      media={allVideos}
                      onOpen={handleOpenLightbox("video")}
                    />
                    
                    {/* Pagination */}
                    {mediaPagination.totalPages > 1 && (
                      <Pagination
                        currentPage={mediaPage}
                        totalPages={mediaPagination.totalPages}
                        onPageChange={(page) => setMediaPage(page)}
                      />
                    )}
                  </>
                )}
              </div>
            )}

            {/* Files Tab */}
            {activeActivity === "files" && (
              <div style={{ marginTop: "20px" }}>
                {mediaLoading ? (
                  <LoadingSpinner message="Loading files..." />
                ) : allFiles.length === 0 ? (
                  <p style={{ textAlign: "center", color: "#9ca3af", padding: "40px 0" }}>
                    No files posted yet
                  </p>
                ) : (
                  <>
                    <FileList files={allFiles} />
                    
                    {/* Pagination */}
                    {mediaPagination.totalPages > 1 && (
                      <div style={{ marginTop: '20px' }}>
                        <Pagination
                          currentPage={mediaPage}
                          totalPages={mediaPagination.totalPages}
                          onPageChange={(page) => setMediaPage(page)}
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
            
          </div>
        </div>
        {/* SUGGESTED PROFILES - Only show if there are suggested users */}
        {suggestedUsers && suggestedUsers.length > 0 && (
          <div className="profileRight">
            <div className="prBody">
              <h3>Suggested profiles for you</h3>
              <div className="grid-md">
                {suggestedUsers?.map((suggestedUser) => (
                  <div key={suggestedUser?._id} className="grid-md-center">
                    <Link to={`/profile/${suggestedUser?._id}`}>
                      <Avatar
                        image={suggestedUser?.userImage}
                        name={suggestedUser?.displayName}
                        isOnline={onlineUsers[suggestedUser?._id]}
                      />
                    </Link>
                    <div>
                      <h5 className="rBodyTitle">
                        {suggestedUser?.firstName} {suggestedUser?.lastName}
                      </h5>
                      <span style={{ fontSize: "0.75rem", color: "#6b7280" }}>
                        @{suggestedUser?.displayName}
                      </span>
                      <p className="rBodyPara">{suggestedUser?.bio}</p>
                      <div
                        style={{
                          display: "flex",
                          marginTop: "7px",
                          cursor: "pointer",
                        }}
                        >
                        <FollowButton
                          userId={suggestedUser?._id}
                          displayName={suggestedUser?.displayName}
                          variant="primary"
                          />
                      </div>
                    </div>
                    <hr />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      <div style={{ paddingTop: "20px" }}>
      <Footer />
      </div>
      </div>

      {/* ✅ SINGLE MODAL - Outside main div, handles all three types */}
      <GlassModal open={openModal} onClose={() => setOpenModal(false)}>
        <h2 style={{ marginBottom: "12px" }}>
          {modalType === "followers"
            ? "Followers"
            : modalType === "following"
              ? "Following"
              : "Connections"}
        </h2>

        <div style={{ maxHeight: "400px", overflowY: "auto" }}>
          {/* Loading state */}
          {modalType === "connections" && connectionsLoading ? (
            <LoadingSpinner message="Loading connections..." />
          ) : null}

          {/* Empty state */}
          {modalType === "followers" && followers.length === 0 && (
            <p
              style={{ color: "#9ca3af", textAlign: "center", padding: "20px" }}
            >
              No followers yet
            </p>
          )}
          {modalType === "following" && following.length === 0 && (
            <p
              style={{ color: "#9ca3af", textAlign: "center", padding: "20px" }}
            >
              Not following anyone yet
            </p>
          )}
          {modalType === "connections" &&
            !connectionsLoading &&
            connections.length === 0 && (
              <p
                style={{
                  color: "#9ca3af",
                  textAlign: "center",
                  padding: "20px",
                }}
              >
                No mutual connections yet
              </p>
            )}

          {/* Render list based on modal type */}
          {modalType === "followers" &&
            followers.map((follow) => (
              <UserCard
                key={follow._id}
                user={follow}
                onlineUsers={onlineUsers}
                onUserClick={handleUserClick}
              />
            ))}

          {modalType === "following" &&
            following.map((follow) => (
              <UserCard
                key={follow._id}
                user={follow}
                onlineUsers={onlineUsers}
                onUserClick={handleUserClick}
              />
            ))}

          {modalType === "connections" &&
            !connectionsLoading &&
            connections.map((connection) => (
              <ConnectionCard
                key={connection._id}
                user={connection}
                onlineUsers={onlineUsers}
                onUserClick={handleUserClick}
              />
            ))}
        </div>
      </GlassModal>



<MediaLightbox
  open={lightboxOpen}
  close={() => setLightboxOpen(false)}
  index={lightboxIndex}
  media={currentMediaType === "image" ? allImages : allVideos}
/>


    </>
  );
};

// ✅ Extract UserCard component to avoid repetition
const UserCard = ({ user, onlineUsers, onUserClick }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "10px",
      padding: "12px 8px",
      borderBottom: "1px solid rgba(255,255,255,0.1)",
    }}
  >
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Link
        to={`/profile/${user._id}`}
        onClick={(e) => {
          e.stopPropagation();
          onUserClick?.();
        }}
      >
        <Avatar
          image={user.userImage}
          name={user.displayName}
          isOnline={onlineUsers[user._id]}
        />
      </Link>
      <span style={{ fontSize: "10px", marginTop: "4px", color: "#9ca3af" }}>
        {onlineUsers[user._id]
          ? "online"
          : `offline${user.lastSeen ? ` ${formatTime(user.lastSeen)}` : ""}`}
      </span>
    </div>
    <div style={{ flex: 1 }}>
      <Link
        to={`/profile/${user._id}`}
        style={{ textDecoration: "none", color: "inherit" }}
        onClick={(e) => {
          e.stopPropagation();
          onUserClick?.();
        }}
      >
        <div style={{ fontWeight: 500 }}>
          {user.firstName} {user.lastName}
        </div>
        <div style={{ fontSize: "12px", opacity: 0.7 }}>
          @{user.displayName}
        </div>
      </Link>
      {user.bio && (
        <div style={{ fontSize: "11px", opacity: 0.6, marginTop: "4px" }}>
          {user.bio.substring(0, 50)}
          {user.bio.length > 50 ? "..." : ""}
        </div>
      )}
      <div style={{ marginTop: "8px" }}>
        <FollowButton
          size="sm"
          userId={user._id}
          displayName={user.displayName}
          variant="secondary"
        />
      </div>
    </div>
  </div>
);

// ✅ ConnectionCard shows message button instead of follow
const ConnectionCard = ({ user, onlineUsers, onUserClick }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "10px",
      padding: "12px 8px",
      borderBottom: "1px solid rgba(255,255,255,0.1)",
    }}
  >
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Link
        to={`/profile/${user._id}`}
        onClick={(e) => {
          e.stopPropagation();
          onUserClick?.();
        }}
      >
        <Avatar
          image={user.userImage}
          name={user.displayName}
          isOnline={onlineUsers[user._id]}
        />
      </Link>
      <span style={{ fontSize: "10px", marginTop: "4px", color: "#9ca3af" }}>
        {onlineUsers[user._id]
          ? "online"
          : `offline${user.lastSeen ? ` ${formatTime(user.lastSeen)}` : ""}`}
      </span>
    </div>
    <div style={{ flex: 1 }}>
      <Link
        to={`/profile/${user._id}`}
        style={{ textDecoration: "none", color: "inherit" }}
        onClick={(e) => {
          e.stopPropagation();
          onUserClick?.();
        }}
      >
        <div style={{ fontWeight: 500 }}>
          {user.firstName} {user.lastName}
        </div>
        <div style={{ fontSize: "12px", opacity: 0.7 }}>
          @{user.displayName}
        </div>
      </Link>
      {user.jobTitle && (
        <div style={{ fontSize: "11px", opacity: 0.6, marginTop: "2px" }}>
          {user.jobTitle}
        </div>
      )}
      <div style={{ marginTop: "8px" }}>
        <MessageButton
          recipientId={user._id}
          recipientName={user.displayName}
        />
      </div>
    </div>
  </div>
);

export default Profile;
