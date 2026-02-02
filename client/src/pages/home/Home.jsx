import Header from '../../components/header/Header'
import './home.css'
import PublicIcon from '@mui/icons-material/Public';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import CloseIcon from '@mui/icons-material/Close';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import AddIcon from '@mui/icons-material/Add';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HandshakeIcon from '@mui/icons-material/Handshake';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ReadMoreText from '../../components/readMoreText/ReadMoreText';
import CommentSection from '../../components/commentSection/CommentSection';
import InfoIcon from '@mui/icons-material/Info';
import React, { useMemo, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import Footer from '../../components/footer/Footer';
import {Link} from 'react-router-dom'
import { useInfiniteTasks } from '../../utils/useTasksHook';
import DOMPurify from 'dompurify'
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import InfiniteScroll from 'react-infinite-scroll-component'

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/scrollbar';

// import required modules
import { Scrollbar } from 'swiper/modules';
import SideBar from '../../components/sideBar/SideBar'
import CircularProgress from '@mui/material/CircularProgress';
import { formatRelativeTime } from '../../utils/time';
import { CalendarIcon, ClearIcon } from '../../utils/svgIcons';
import useTaskUIStore from '../../utils/taskUIStore';
import useAuthStore from '../../utils/authStore';
import { LoadingSpinner } from '../../components/tasks/TaskUtils';
import { useSuggestedUsers } from '../../utils/useSocialFeatures';
import Avatar from '../../components/avatar/Avatar';
import useOnlineUsersStore from '../../utils/onlineUsersStore';
import FollowButton from '../../components/social/FollowButton';
import { useTaskReactions, useToggleReaction, useToggleSave } from '../../utils/useSocialInteractions'
import ReactionPicker from '../../components/reactions/ReactionPicker';
import GlassModal from '../../components/modal/GlassModal';
import ReactionsUserList from '../../components/reactionsUserList/ReactionsUserList';

const Home = () => {
  const {user} = useAuthStore()
// ✅ Get search from Zustand store
  const searchQuery = useTaskUIStore((state) => state.searchQuery);

  const [openReactsModal, setOpenReactsModal] = useState(false);
const [selectedTask, setSelectedTask] = useState(null);

const { data: reactionsData, isLoading } = useTaskReactions(
  selectedTask?._id,
  openReactsModal
);



  
  // ✅ Build filters from search
  const filters = useMemo(() => {
    return searchQuery ? { search: searchQuery } : {};
  }, [searchQuery]);

const { data, fetchNextPage, hasNextPage, isPending, error, } = useInfiniteTasks(filters, 10);

const tasks = data?.pages.flatMap(page => page.data) || [];

const {data : suggestedUsers, isPending: loadingUsers} = useSuggestedUsers()

const { onlineUsers } = useOnlineUsersStore();

  // const toggleLikeMutation = useToggleLike();
  const toggleSaveMutation = useToggleSave();
  const [openCommentSections, setOpenCommentSections] = useState({});
   const toggleReactionMutation = useToggleReaction();

  //  const handleToggleLike = (taskId) => {
  //   toggleLikeMutation.mutate(taskId);
  // };
  console.log(tasks);
  

  const handleToggleSave = (taskId) => {
    toggleSaveMutation.mutate(taskId);
  };

  const handleShowCommentSection = (taskId) => {
    setOpenCommentSections(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };

    const handleReaction = (taskId, reactionType) => {
    toggleReactionMutation.mutate({ taskId, reactionType });
  };

  // Get user's current reaction(Comments)
  const getUserReaction = (task) => {
    if (task.reactions?.like?.includes(user?._id)) return 'like';
    if (task.reactions?.love?.includes(user?._id)) return 'love';
    if (task.reactions?.celebrate?.includes(user?._id)) return 'celebrate';
    if (task.reactions?.dislike?.includes(user?._id)) return 'dislike';
    return null;
  };
  
// ✅ SAFE reaction counts
  const reactionCounts = (task) => ({
    like: task.reactions?.like?.length || 0,
    love: task.reactions?.love?.length || 0,
    celebrate: task.reactions?.celebrate?.length || 0,
    dislike: task.reactions?.dislike?.length || 0,
    total:
      (task.reactions?.like?.length || 0) +
      (task.reactions?.love?.length || 0) +
      (task.reactions?.celebrate?.length || 0) +
      (task.reactions?.dislike?.length || 0),
  });



  const pluralize = (count, singular, plural = singular + 's') =>
  count === 1 ? `${count} ${singular}` : `${count} ${plural}`;

  const getTotalCommentsCount = (task) => {
  if (!task.comments || task.comments.length === 0) return 0;
  
  const commentsCount = task.comments.filter(c => !c.deleted).length;
  const repliesCount = task.comments.reduce((total, comment) => {
    return total + (comment.replies?.length || 0);
  }, 0);
  
  return commentsCount + repliesCount;
};


  if (isPending) {
    return <div style={{ textAlign: 'center', padding: 20 }}>
    <LoadingSpinner message='Home Page loading...'/>
  </div>
  }
  

  return (
      <>
      <div className='box'>
        <Header/>
      <div className='home'>
        <div className="left">
          <div className="lTop">
            <SideBar showEditProfile={false} showBottomAnalytics={false}/>
        </div>
            <div className="lBottom">
              <div style={{display: "flex", justifyContent: "space-between", marginBottom: "5px"}}>
                <p>Profile View</p>
                <span>2</span>
              </div>
                
              <p>View all Analytics</p>
            </div>
        </div>
          <div className="middle">
        <InfiniteScroll
        dataLength={tasks.length}
        next={fetchNextPage}
        hasMore={hasNextPage}
          loader={
            <div style={{textAlign: 'center', padding: '20px'}}>
              <CircularProgress size={24} />
            </div>
          }
          endMessage={
            tasks.length > 0 &&
            <div style={{textAlign: 'center', padding: '50px', color: '#6b7280'}}>
              No more tasks
            </div>
          }
        >
            {searchQuery && (
              <div style={{ padding: '10px', background: '#f0f9ff', borderRadius: '8px', marginBottom: '20px' }}>
                Showing results for: <strong>"{searchQuery}"</strong> 
                <ClearIcon size={15} color='red' onClick={() => useTaskUIStore.getState().clearSearch()} style={{ marginLeft: '10px', cursor: 'pointer'}} />
              </div>
            )}

            {isPending ? (
              <>
              <div style={{textAlign: 'center', padding: '50px'}}>
                <CircularProgress/>
                </div>
                </>
              ) : error ? (
                <div style={{textAlign: 'center', padding: '50px', color: 'red'}}>
                  Error loading tasks
                </div>
              ) : tasks.length === 0 ? (
                <div style={{textAlign: 'center', padding: '50px', marginTop: '10px'}}>No tasks found</div>
              ) : (
                tasks.map((task) => {
                  const counts = reactionCounts(task)
                  return (
                  <div key={task._id} className={task.attachments?.length === 0 ? 'removeHeight' : 'middleContents'}>
                    <div className="middleHeader">
                  <div className='middleHeaderContent'>
                    <Link to={`/profile/${task?.createdBy?._id}`}>
                    <Avatar image={task?.createdBy?.userImage} name={task?.createdBy?.displayName} isOnline={onlineUsers[task?.createdBy?._id]}/>
                    </Link>
                    <div className="middleHeaderTitle">
                      <h4>{task?.createdBy?.displayName}</h4>
                      <p>{task?.connections} connections</p>
                      <div style={{display: "flex", gap: "10px"}}>
                        <div style={{display: "flex"}}>
                          <AccessTimeFilledIcon style={{color: "#56687a", fontSize: "9px", alignSelf: "center"}} />
                          <span>{formatRelativeTime(task?.createdAt)}</span>
                        </div>
                        <PublicIcon style={{color: "#56687a", fontSize: "9px", alignSelf: "center"}}/>
                      </div>
                    </div>
                  </div>
                  <div className='middleHeaderIcons'>
                    <MoreHorizIcon style={{color: "#293138", fontSize: "16px", alignSelf: "center", cursor: "pointer"}} />
                    <CloseIcon style={{color: "#293138", fontSize: "16px", alignSelf: "center", cursor: "pointer"}} />
                  </div>
                </div>
              <div className="middleBody">
                <div>
                  <h3 style={{textAlign: 'center'}}
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(task?.title || "")
                    }}
                  />
                </div>
              <div className="middleBodyTxt">
                <div>
                  {task?.priority && (
                    <span style={{
                      display: 'inline-block',
                      marginBottom: '3px',
                      fontSize: '0.75rem',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      background: task?.priority === 'high' ? '#fef2f2' : task?.priority === 'low' ? '#f0fdf4' : '#E0E7FF',
                      color: task?.priority === 'high' ? '#dc2626' : task?.priority === 'low' ? '#16a34a' : '#3730A3' 
                    }}>
                      {task?.priority}
                    </span>
                  )}
                </div>
                {/* CreatedAt & Deadline */}
                <div style={{display: 'flex', gap: '5px'}}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '3px',
                    color: '#6b7280',
                    fontSize: '0.585rem',
                    marginBottom: '10px',
                  }}>
                    <span>Created At:</span>
                    <CalendarIcon size={10} />
                    {new Date(task?.createdAt).toLocaleDateString()}
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '3px',
                    color: '#474f5e',
                    fontSize: '0.585rem',
                    marginBottom: '10px',
                    fontWeight: '600'
                  }}>
                    <span>Deadline:</span>
                    <CalendarIcon size={10} />
                    {new Date(task?.dueDate).toLocaleDateString()}
                  </div>
                </div>
                {/* If description contains HTML, sanitize and inject */}
                <ReadMoreText>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(task?.description || "")
                    }}
                  />
                </ReadMoreText>

                <div style={{ alignSelf: "flex-end", marginTop: "5px" }}>
                  <span
                    className={
                      task?.status === "completed"
                        ? "mbStatusCom"
                        : task?.status === "pending"
                        ? "mbStatusPen"
                        : "mbStatusLat"
                    }
                  >
                    {task?.status}
                  </span>
                </div>
              </div>
              <div style={{
                  color: '#333',
                  fontSize: '0.585rem',
                  margin: '8px 0',
                  textAlign: 'center'
                  }}>
                    <p><b>Assigned to</b></p>
                    <div style={{display: 'flex', flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                      <Avatar image={task?.assignedTo?.userImage} name={task?.assignedTo?.displayName} isOnline={onlineUsers[task?.assignedTo?._id]}/>
                      <span><b>@{task?.assignedTo?.displayName}</b></span>
                      <span>{task?.assignedTo?.email}</span>
                    </div>
                  </div>

              <div
                className={
                  task?.attachments?.length === 0 ? "removeMD" : "middleBodyImgs"
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
                  <span style={{fontSize: '10px', color: '#797777', display: 'flex', justifyContent: 'center'}}><i>{task?.attachments?.length ? task?.attachments?.length : ''} Attachment</i></span>
                </>
              </div>
                <div className="middleBodyReacts">
                  <div className="mdBodyIcons"
                  style={{ cursor: counts.total > 0 ? "pointer" : "default" }}
                  onClick={() => {
                    if (counts.total > 0) {
                      setSelectedTask(task);
                      setOpenReactsModal(true);
                    }
                  }}
                   >
                    {counts.total > 0 ? (
                      <>
                        {counts.like > 0 && (
                          <div className="likeIconBg reactPop">
                            <ThumbUpIcon style={{ fontSize: 10, color: '#fff' }} />
                          </div>
                        )}

                        {counts.love > 0 && (
                          <div className="heartIconBg reactPop">
                            <FavoriteIcon style={{ fontSize: 10, color: '#fff' }} />
                          </div>
                        )}

                        {counts.celebrate > 0 && (
                          <div className="handShakeIconBg reactPop">
                            <HandshakeIcon style={{ fontSize: 10, color: '#fff' }} />
                          </div>
                        )}

                        {counts.dislike > 0 && (
                          <div className="dislikeIconBg reactPop">
                            <ThumbDownIcon style={{ fontSize: 10, color: '#fff' }} />
                          </div>
                        )}

                        <span>{pluralize(counts.total, 'like')}</span>
                      </>
                    ) : (
                      <span className="noMetaText">No likes yet</span>
                    )}
                  </div>

                  <div className="mdComments">
                    <div style={{display: "flex", alignItems: 'center'}}>
                      <ChatBubbleOutlineIcon style={{color: "#293138", fontSize: "10px", cursor: "pointer"}}/>
                     <span>
                      {getTotalCommentsCount(task) > 0
                        ? pluralize(getTotalCommentsCount(task), 'comment')
                        : 'No comments yet'}
                    </span>
                    </div>
                    <div style={{display: "flex", alignItems: 'center'}}>
                      <BookmarkBorderIcon style={{color: "#293138", fontSize: "10px", cursor: "pointer"}}/>
                      <span>
                        {task?.saves > 0
                          ? pluralize(task.saves, 'save')
                          : <span className="noMetaText">No savess yet</span>
                          }
                      </span>
                    </div>
                  </div>
                </div>
                <div style={{display: "flex", justifyContent: "center"}}>
                  <hr className="postDivider" />
                </div>
                <div className="mdReactAndComment">
                  <ReactionPicker
                      onSelect={(type) => handleReaction(task._id, type)}
                      currentReaction={getUserReaction(task)}
                    />
                  {/* <div
                  onClick={() => handleToggleLike(task._id)} style={{display: "flex", gap: "3px", color: "#38434f", cursor: "pointer"}} >
                    {task.likedBy?.includes(user?._id) ? (
                      <ThumbUpIcon style={{ fontSize: "14px", color: "#535bf2" }} />
                    ) : (
                      <ThumbUpOffAltIcon style={{ fontSize: "14px" }} />
                    )}
                    <p>Like</p>
                  </div> */}
                  <div onClick={() => handleShowCommentSection(task._id)} style={{display: "flex", gap: "3px", color: "#38434f", cursor: "pointer", alignItems: 'center'}}>
                    <ChatBubbleOutlineIcon style={{fontSize: "14px"}}/>
                    <p style={{ fontWeight: openCommentSections[task._id] ? 600 : 400 }}>
                      {openCommentSections[task._id] ? 'Close comment' : 'Open to comment'}
                    </p>
                  </div>
                  <div onClick={() => handleToggleSave(task._id)} style={{display: "flex", gap: "3px", color: "#38434f", cursor: "pointer", alignItems: 'center'}}>
                    {task.savedBy?.includes(user?._id) ? (
                      <BookmarkBorderIcon style={{ fontSize: "14px", color: "#535bf2" }} />
                    ) : (
                      <BookmarkBorderIcon style={{ fontSize: "14px" }} />
                    )}
                    <p>Save</p>
                  </div>
                </div>
                <div className={openCommentSections[task._id] ? "commentSection" : "hideCommentSection"}>
                  <CommentSection taskId={task._id} />
                </div>
              </div>
                </div>
                )})
              )}
        </InfiniteScroll>
          </div>

        <div className="right">
          <div className="rContent">
            <div>
              <div className="rHeader">
                <h2 className="rTitle">Recommended</h2>
                <InfoIcon fontSize="small" />
              </div>

              <div className='flex-mini'>
                {loadingUsers ? (
                  <>
                  <LoadingSpinner message='Loading Recommended Users...'/>
                  </>
                ) : (
                  <>
                  {suggestedUsers?.map((suggestedUser, index) => (
                   <React.Fragment key={suggestedUser?._id}>
                     <div className="rBody">
                       <Link to={`/profile/${suggestedUser?._id}`}>
                       <Avatar image={suggestedUser?.userImage} name={suggestedUser?.displayName} isOnline={onlineUsers[suggestedUser?._id]}/>
                       </Link>
                       <div>
                         <h5 className="rBodyTitle">
                           {suggestedUser?.firstName} {suggestedUser?.lastName}
                         </h5>
                         <span>@{suggestedUser?.displayName}</span>
                         <p className="rBodyPara">{suggestedUser?.bio}</p>
   
                         <div style={{ marginTop: "7px" }}>
                           <FollowButton userId={suggestedUser?._id} displayName={suggestedUser?.displayName} variant='secondary'/>
                         </div>
                       </div>
                     </div>
   
                     {index !== suggestedUsers.length - 1 && (
                       <div className="rDivider" />
                     )}
                   </React.Fragment>
                 ))}
                 </>
                )}
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </div>
      </div>
      <GlassModal
  open={openReactsModal}
  onClose={() => {
    setOpenReactsModal(false);
    setSelectedTask(null);
  }}
  title="Reactions"
>
  {isLoading ? (
    <LoadingSpinner message="Loading reactions..." />
  ) : (
    <ReactionsUserList reactions={reactionsData} />
  )}
</GlassModal>


      </>
  )
}

export default Home