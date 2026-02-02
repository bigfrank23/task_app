import "./profile.css";
import LocationPinIcon from "@mui/icons-material/LocationPin";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import ReadMoreText from "../../components/readMoreText/ReadMoreText";
import HandshakeIcon from "@mui/icons-material/Handshake";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import { useEffect, useState } from "react";
import Popup from "../../components/popup/Popup";
import FlagIcon from "@mui/icons-material/Flag";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import EmojiPopupContent from "../../components/emojiPopupContent/EmojiPopupContent";
import TaskIcon from "@mui/icons-material/Task";
import CommentIcon from "@mui/icons-material/Comment";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import CollectionsIcon from "@mui/icons-material/Collections";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import PublicIcon from "@mui/icons-material/Public";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import FollowButton from '../../components/social/FollowButton';
import MessageButton from '../../components/messages/MessageButton';
import SideBar from '../../components/sideBar/SideBar'

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import "swiper/css/scrollbar";

// import required modules
import { Scrollbar } from "swiper/modules";

// import required modules
import { Navigation } from "swiper/modules";
import { Link, useNavigate, useParams } from "react-router-dom";
import Header from "../../components/header/Header";
import useAuthStore from "../../utils/authStore";
import { useMutation } from "@tanstack/react-query";
import apiRequest from "../../utils/apiRequest";
import { useNotification } from "../../utils/useNotification";
import { useUserProfile } from "../../utils/useProfileHooks";
import { ErrorMessage, LoadingSpinner } from "../../components/tasks/TaskUtils";
import { useFollowing, useFollowers, useSuggestedUsers, useConnections } from "../../utils/useSocialFeatures";
import { contents } from "../../utils/dummyData";
import GlassModal from "../../components/modal/GlassModal";
import Avatar from '../../components/avatar/Avatar'
import useOnlineUsersStore from "../../utils/onlineUsersStore";
import CircleIcon from '@mui/icons-material/Circle';
import { formatTime } from "../../utils/time";
import Pagination from "../Dashboard/pagination/Paginaton";

const Profile = () => {
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [modalType, setModalType] = useState(null);
  

  const [slides, setSlides] = useState(3);
  const { updateUser } = useAuthStore();
  const { showSuccess, showError } = useNotification();

    // ✅ Pagination state
    const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();
  const { userId } = useParams(); // Get userId from URL
  const { user: currentUser } = useAuthStore(); // Currently logged-in user
  const { data: followersData } = useFollowers(userId);
  const { data: followingData } = useFollowing(userId);
  const {data : suggestedUsers} = useSuggestedUsers()

const { data: connectionsData, isLoading: connectionsLoading } = useConnections();

console.log(connectionsData);

  const { onlineUsers } = useOnlineUsersStore();
    
  const goToEdit = () => navigate("/profile/edit");

  // ✅ Fetch profile data
    const { data: profileData, isPending, error } = useUserProfile(userId, currentPage);


     // Extract data
  const user = profileData?.user;
  const tasks = profileData?.tasks || [];
  const stats = profileData?.stats || {};
  const followers = followersData?.followers || {};
  const following = followingData?.following || {};
  const pagination = profileData?.pagination || {};
  

  // console.log('user', user);
  console.log('tasks', tasks);
  // console.log('stats', stats);
  // console.log('followers', followers);
  // console.log('following', following);
  
  // Check if viewing own profile
  const isOwnProfile = currentUser?._id === userId;
  

  const initials = `${user?.firstName?.charAt(0) ?? ""}${
    user?.lastName?.charAt(0) ?? ""
  }`.toUpperCase();


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

  const openFollowersModal = () => {
  setModalType("followers");
  setOpenModal(true);
};

const openFollowingModal = () => {
  setModalType("following");
  setOpenModal(true);
};


const handlePageChange = (page) => {
    setCurrentPage(page);
    // window.scrollTo({ top: '200px', behavior: 'smooth' });
};


  return (
    <>
      <Header />
      <div className="profile">
        <div className="profileContainer">
          {/* <div className="prCard"> */}
          <div className="prCard">
            {/* COVER IMAGE */}
            <div className="coverWrapper">
              {user?.coverPhoto ? (
                <img src={user?.coverPhoto} alt="" className="bgCoverImg" />
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
                        pointerEvents: deleteCoverPhotoMutation.isPending ? "none" : "auto",
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
                      onError={(e)=> {e.target.src = '/general/images/user.png'; e.target.alt = 'Image fail to load'}}
                      loading="lazy"
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

              <p className="lUserTitle">{user?.jobitle}</p>

              <p className="lUserBio">{user?.bio}</p>

              <div className="lLocation">
                <div>
                  <LocationPinIcon style={{ fontSize: "13px" }} />
                  Lagos,Nigeria
                </div>
                <span>{user?.connections} connections</span>
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
                      <div style={{ position: "relative", width: "100%" }}>
                    <button onClick={() => setOpen(true)}>more</button>
                    <Popup
                      isOpen={open}
                      onClose={() => setOpen(false)}
                      // title="Confirm Action"
                    >
                      {/* <button onClick={() => setOpen(false)}>OK</button> */}
                      <EmojiPopupContent />
                      <div className="popup-icons">
                        <SaveAltIcon style={{ fontSize: "13px" }} />
                        <p>Save to PDF</p>
                      </div>
                      <div className="popup-icons">
                        <FlagIcon style={{ fontSize: "13px" }} />
                        <p>Report/Block</p>
                      </div>
                    </Popup>
                  </div>
                    </div>
                  ) : (
                    <div className="profileButton">
                      <button onClick={goToEdit}>
                        <EditIcon style={{ fontSize: "13px" }} />
                        Edit Profile
                      </button>
                    </div>
                  )}
                  <div className="followerCount">
                    <div className="profileFollowerCount"
                    style={{ cursor: "pointer" }}
                    onClick={openFollowersModal}>
                      <span>followers {followers?.length}</span>
                    </div>
                    <div className="profileFollowingCount" 
                    style={{ cursor: "pointer" }}
                    onClick={openFollowingModal}>
                      <span>following {following?.length}</span>
                    </div>
                  </div>
                  <>
                  <GlassModal open={openModal} onClose={() => setOpenModal(false)}>
                  <h2 style={{ marginBottom: "12px" }}>
                    {modalType === "followers" ? "Followers" : "Following"}
                  </h2>

                  <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                    {(modalType === "followers" ? followers : following)?.length === 0 && (
                      <p style={{ color: "#9ca3af" }}>No users found</p>
                    )}

                    {(modalType === "followers" ? followers : following)?.map((follow) => (
                      <div
                        key={follow._id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          padding: "8px 0",
                          borderBottom: "1px solid rgba(255,255,255,0.1)",
                          position: 'relative'
                        }}
                      >
                        {
                          follow.userImage ? (
                            <>
                            <div style={{display: 'flex', flexDirection: 'column'}}>
                              <Link to={`/profile/${follow?._id}`}>
                                  <Avatar image={follow?.userImage} name={follow?.displayName} isOnline={onlineUsers[follow._id]}/>
                              </Link>
                          <span style={{fontSize: '10px'}}>
                            {onlineUsers[follow._id] ? 'online' : `offline${follow.lastSeen ? ` ${formatTime(follow.lastSeen)}` : ''}`}
                          </span>
                            </div>
                          
                            </>
                          ) : (
                            <>
                            <div style={{display: 'flex', flexDirection: 'column'}}>
                              <Link to={`/profile/${follow?._id}`}>
                                <Avatar image={follow?.userImage} name={follow?.displayName} isOnline={onlineUsers[follow._id]}/>
                              </Link>
                            <span style={{fontSize: '10px'}}>
                              {onlineUsers[follow._id] ? 'online' : `offline${follow.lastSeen ? ` ${formatTime(follow.lastSeen)}` : ''}`}
                            </span>
                            </div>
                            </>
                          )
                        }
                        <div>
                          <div style={{ fontWeight: 500 }}>
                            {follow.firstName} {follow.lastName}
                          </div>
                          <div style={{ fontSize: "12px", opacity: 0.7 }}>
                            @{follow.displayName}
                          </div>
                          <div style={{marginTop: '5px'}}>
                          <FollowButton size="sm" userId={follow._id} displayName={follow?.displayName} variant="secondary"/>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassModal>

                </>
              </div>
              {/* </div> */}
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
              marginBottom: '20px',
              marginTop: '10px'
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
              <div style={{
                background: 'rgb(239 68 68 / 19%)',
                padding: '15px',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#ef4444' }}>
                  {stats.lateTasks || 0}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  Late
                </div>
              </div>
            </div>

            {/* Recent Tasks */}
            <div className="activityBtns">
              <div className="activityBtn active">
                <TaskIcon />
                Recent Tasks ({tasks.length})
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
                    <div>
                      <div
                      className={
                        task?.attachments?.length === 0 ? "removeMD" : "profileTaskImgs"
                      }
                    >
                      <>
                        {/* Single attachment */}
                        {task?.attachments?.length === 1 && (
                          <img
                            src={task.attachments[0].url}
                            alt={task.attachments[0].filename}
                            className="middleBodyImg"
                            onError={(e)=> {e.target.src = '/general/images/placeholder.jpg'; e.target.alt = 'Image fail to load'}}
                            loading="lazy"
                            width={300}
                          />
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
                                  <img
                                    src={file.url}
                                    alt={file.filename}
                                    className="middleBodyImg"
                                    onError={(e)=> {e.target.src = '/general/images/placeholder.jpg'; e.target.alt = 'Image fail to load'}}
                                    loading="lazy"
                                  />
                                ) : (
                                  <a
                                    href={file.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="middleBodyFile"
                                  >
                                    {file.filename}
                                  </a>
                                )}
                              </SwiperSlide>
                            ))}
                          </Swiper>
                        )}
                        <span style={{fontSize: '10px', color: '#797777'}}><i>{task?.attachments?.length ? task?.attachments?.length : ''} Attachment</i></span>
                      </>
                    </div>
                    </div>
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
          <div className="prActivity" style={{ marginTop: "23px" }}>
            <h3>Activity</h3>
            <div className="activityBtns">
              <div className="activityBtn">
                <TaskIcon />
                Posts
              </div>
              <div className="activityBtn">
                <CommentIcon />
                Comments
              </div>
              <div className="activityBtn">
                <VideoLibraryIcon />
                Videos
              </div>
              <div className="activityBtn">
                <CollectionsIcon />
                Images
              </div>
            </div>
            <div className="activitySlide">
              <Swiper
                slidesPerView={slides}
                spaceBetween={30}
                pagination={{ clickable: true }}
                modules={[Pagination]}
                className="mySwiper"
              >
                {contents.map((content) => (
                  <SwiperSlide key={content.id}>
                    <div className="middle" id="middle">
                      <div className="middleContents">
                        {/* Header */}
                        <div className="middleHeader">
                          <div className="middleHeaderContent">
                            <Link to="/:profile">
                              <img
                                className="middleheaderUserImg"
                                src={content.userImg}
                                alt={content.username}
                              />
                            </Link>

                            <div className="middleHeaderTitle">
                              <h4>{content.username}</h4>
                              <p>{content.connections} connections</p>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                gap: "10px",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  gap: "2px",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <AccessTimeFilledIcon
                                  style={{ color: "#56687a", fontSize: "13px" }}
                                />
                                <span style={{ fontSize: "10px" }}>
                                  {content.time}
                                </span>
                              </div>
                              <PublicIcon
                                style={{ color: "#56687a", fontSize: "13px" }}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Body */}
                        <div className="middleBody">
                          <div className="middleBodyTxt">
                            <div className="truncateTxt">{content.task}</div>

                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginTop: "5px",
                              }}
                            >
                              {/* Reactions */}
                              <div className="middleBodyReacts">
                                <div className="mdComments">
                                  <span>{content.likes} likes</span>
                                  <span>{content.comment} comments</span>
                                  <span>{content.saves} saved</span>
                                </div>
                              </div>
                              <span
                                className={
                                  content.status === "completed"
                                    ? "mbStatusCom"
                                    : content.status === "pending"
                                      ? "mbStatusPen"
                                      : "mbStatusLat"
                                }
                              >
                                {content.status}
                              </span>
                            </div>
                          </div>

                          {/* Images */}
                          {content.imgs.length > 0 && (
                            <div className="profileTaskImgs">
                              {content.imgs.length === 1 ? (
                                <img
                                  src={content.imgs[0]}
                                  alt=""
                                  className="middleBodyImg"
                                  style={{borderRadius: '10px'}}
                                  onError={(e)=> {e.target.src = '/general/images/placeholder.jpg'; e.target.alt = 'Image fail to load'}}
                                  loading="lazy"
                                />
                              ) : (
                                <Swiper
                                  slidesPerView="auto"
                                  spaceBetween={20}
                                  scrollbar={{ hide: true }}
                                  modules={[Scrollbar]}
                                >
                                  {content.imgs.map((img, index) => (
                                    <SwiperSlide key={index}>
                                      <img
                                        src={img}
                                        alt=""
                                        className="middleBodyImg"
                                        style={{borderRadius: '10px'}}
                                        onError={(e)=> {e.target.src = '/general/images/placeholder.jpg'; e.target.alt = 'Image fail to load'}}
                                        loading="lazy"
                                      />
                                    </SwiperSlide>
                                  ))}
                                </Swiper>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
        <div className="profileRight">
          <div className="prBody">
            <h3>Suggested profiles for you</h3>
            <div className="grid-md">
              {
                suggestedUsers?.map((suggestedUser)=>(
                <div key={suggestedUser?._id} className="grid-md-center">
                  <Link to={`/profile/${suggestedUser?._id}`}>
                  <Avatar image={suggestedUser?.userImage} name={suggestedUser?.displayName} isOnline={onlineUsers[suggestedUser?._id]}/>
                  </Link>
                  <div>
                    <h5 className="rBodyTitle">{suggestedUser?.firstName} {suggestedUser?.lastName}</h5>
                     <span style={{ fontSize: '0.75rem', color: '#6b7280'}}>@{suggestedUser?.displayName}</span>
                    <p className="rBodyPara">
                     {suggestedUser?.bio}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        marginTop: "7px",
                        cursor: "pointer",
                      }}
                    >
                      <FollowButton userId={suggestedUser?._id} displayName={suggestedUser?.displayName} variant='primary'/>
                    </div>
                  </div>
                  <hr />
                </div>
                ))
              }
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
