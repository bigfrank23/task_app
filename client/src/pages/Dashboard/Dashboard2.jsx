import { useState, useRef, useEffect, useMemo } from "react";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SwitchLeftIcon from '@mui/icons-material/SwitchLeft';
import SwitchRightIcon from '@mui/icons-material/SwitchRight';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import 'quill-emoji/dist/quill-emoji.css';
import 'quill-emoji/dist/quill-emoji.js';

import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import FavoriteIcon from "@mui/icons-material/Favorite";
import HandshakeIcon from "@mui/icons-material/Handshake";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";

import ReadMoreText from "../../components/readMoreText/ReadMoreText";
import Footer from "../../components/footer/Footer";
import SideBar from "../../components/sideBar/SideBar";
import Header from "../../components/header/Header";
import useAuthStore from "../../utils/authStore";
import { CalendarIcon, ClockIcon, DislikeSVG, FileSVG, LikedSVG, LikeSVG, VideoSVG } from "../../utils/svgIcons";
import './dashboard.css';
import DOMPurify from 'dompurify'


import { 
  useTasks, 
  useCreateTask, 
  useUpdateTaskStatus, 
  useDeleteTask 
} from "../../utils/useTasksHook";
import TaskFilters from "../../components/tasks/TaskUtils";
import LoadingSpinner from "../../components/tasks/TaskUtils";
import ErrorMessage from "../../components/tasks/TaskUtils";
import { useNotification } from "../../utils/useNotification";
import Pagination from './pagination/Paginaton';
import { useConnections } from "../../utils/useSocialFeatures";
import TaskBadge from "./util/TaskBadge";
import { formatRelativeTime } from "../../utils/time";
import { useTaskReactions } from "../../utils/useSocialInteractions";
import ReactionsUserList from "../../components/reactionsUserList/ReactionsUserList";
import GlassModal from "../../components/modal/GlassModal";
import TaskInteractionModal from './TaskInteractionModal';
import TodayTasksSidebar from "./todayTasksSideBar/TodayTasksSideBar";
import DailyAgendaSidebar from "./todayTasksSidebar/DailyAgendaSidebar";
import TodayAgenda from "./todayTasksSidebar/TodayAgenda";

const Dashboard2 = () => {
  const { user } = useAuthStore();
  const headings = ["Task", "Status", "Deadline", "Action"];
  const { showSuccess, showError } = useNotification();

    const [openReactsModal, setOpenReactsModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const [selectedTaskForInteraction, setSelectedTaskForInteraction] = useState(null);
  const [showInteractionModal, setShowInteractionModal] = useState(false);

  
  const { data: reactionsData, isLoading } = useTaskReactions(
    selectedTask?._id,
    openReactsModal
  );

  console.log(reactionsData);
  

  const { data: connections = [], isLoading: connectionsLoading } = useConnections()

  // ✅ Add state for assignedTo
  const [assignedTo, setAssignedTo] = useState(user?._id || '');

    // Update when user loads
  useEffect(() => {
    if (user?._id && !assignedTo) {
      setAssignedTo(user._id);
    }
  }, [user]);

  const textareaRef = useRef(null);

  // ✅ Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);


  // Filters state
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    search: ''
  });

  // ✅ ONE QUERY with filters AND pagination
  const { 
    data: taskResponse, 
    isPending, 
    error,
    isFetching 
  } = useTasks(filters, currentPage, itemsPerPage);

  // Extract data from response
  const tasks = taskResponse?.data || [];
  const pagination = taskResponse?.pagination || { total: 0, pages: 0 };
  const stats = taskResponse?.stats || { total: 0, completed: 0, pending: 0, late: 0 };

  console.log(tasks);
  
  // Mutations
  const createTaskMutation = useCreateTask();
  const updateStatusMutation = useUpdateTaskStatus();
  const deleteTaskMutation = useDeleteTask();

  // Task form state
  const [richTitle, setRichTitle] = useState('');
  const [toggleQuill, setToggleQuill] = useState(false);
  const [plainText, setPlainText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [taskPriority, setTaskPriority] = useState('medium');
  const [richDescription, setRichDescription] = useState('');
  const [tags, setTags] = useState('');

  // File upload state
  const [attachments, setAttachments] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  const [dueDate, setDueDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });

  // Greeting logic
  const getHour = () => new Date().getHours();
  const [hour, setHour] = useState(getHour());

  useEffect(() => {
    const interval = setInterval(() => setHour(getHour()), 60000);
    return () => clearInterval(interval);
  }, []);

  const greeting = useMemo(() => {
    if (hour < 12) return "Good Morning";
    if (hour < 15) return "Good Afternoon";
    return "Good Evening";
  }, [hour]);

  // Emoji picker
  const emojis = ['😀', '😃', '😄', '😁', '😅', '😂', '🤣', '😊', '😇', '🙂', 
    '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', 
    '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏', '👍', '👎', '👌', 
    '✌️', '🤞', '🤟', '🤘', '🤙'];

  // File handling
  const processFiles = (files) => {
    const fileArray = Array.from(files);
    
    if (attachments.length + fileArray.length > 10) {
      showError("Maximum 10 files allowed");
      return;
    }

    const validFiles = fileArray.filter(file => {
      // ✅ Accept images, videos, and documents
    const isValidType = 
      file.type.startsWith('image/') || 
      file.type.startsWith('video/') ||
      file.type.includes('pdf') ||
      file.type.includes('document') ||
      file.type.includes('spreadsheet') ||
      file.type.includes('presentation') ||
      file.type.includes('text') ||
      file.type.includes('zip') ||
      file.type === 'application/pdf' ||
      file.type === 'application/msword' ||
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      file.type === 'application/vnd.ms-excel' ||
      file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file.type === 'application/vnd.ms-powerpoint' ||
      file.type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
      
    const isValidSize = file.size <= 10 * 1024 * 1024;
      
      if (!isValidType) {
        showError(`${file.name} is not a valid file type`);
        return false;
      }
      if (!isValidSize) {
        showError(`${file.name} exceeds 10MB limit`);
        return false;
      }
      return true;
    });

    // const newFiles = validFiles.map((file) => ({
    //   file,
    //   preview: URL.createObjectURL(file),
    //   type: file.type,
    //   name: file.name
    // }));
  //   setAttachments((prev) => [...prev, ...newFiles]);
  // };
    const newFiles = validFiles.map((file) => {
    // ✅ Determine file type for preview
    let fileType = 'file';
    if (file.type.startsWith('image/')) {
      fileType = 'image';
    } else if (file.type.startsWith('video/')) {
      fileType = 'video';
    }

    return {
      file,
      preview: fileType === 'image' ? URL.createObjectURL(file) : null,
      type: file.type,
      name: file.name,
      displayType: fileType
    };
  });

  setAttachments((prev) => [...prev, ...newFiles]);
};


  const handleFileChange = (e) => {
    processFiles(e.target.files);
    e.target.value = '';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    processFiles(e.dataTransfer.files);
  };

  const removeAttachment = (index) => {
    setAttachments((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  useEffect(() => {
    const preventDefault = (e) => e.preventDefault();
    window.addEventListener("dragover", preventDefault);
    window.addEventListener("drop", preventDefault);
    return () => {
      window.removeEventListener("dragover", preventDefault);
      window.removeEventListener("drop", preventDefault);
      attachments.forEach(att => URL.revokeObjectURL(att.preview));
    };
  }, [attachments]);

  const onEmojiClick = (emojiObject) => {
    const { emoji } = emojiObject;
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newText = plainText.substring(0, start) + emoji + plainText.substring(end);

    setPlainText(newText);
    setShowEmojiPicker(false);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + emoji.length, start + emoji.length);
    }, 0);
  };

  const isQuillEmpty = (html) => {
    if (!html) return true;
    const text = html.replace(/<[^>]*>/g, "").replace(/\u00A0/g, "").trim();
    return text === "";
  };

  // ✅ Handle filter change and reset pagination
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  // ✅ Handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleTask = (taskId, currentStatus) => {
    const newStatus = currentStatus === "completed" ? "pending" : "completed";
    updateStatusMutation.mutate({ taskId, status: newStatus });
  };

  const handleAddTask = () => {
    const title = toggleQuill 
      ? plainText 
      : richTitle.replace(/<[^>]*>/g, "").replace(/\u00A0/g, "").trim();

    if (!title.trim()) {
      showError("Please enter a task title");
      return;
    }

    if (!dueDate) {
      showError("Please select a due date");
      return;
    }

    const fileObjects = attachments.map(att => att.file);

    createTaskMutation.mutate({
      title: richTitle,
      description: richDescription || plainText,
      dueDate: new Date(dueDate),
      priority: taskPriority,
      assignedTo: assignedTo,
      attachments: fileObjects,
      tags: tags ? tags.split(",").map((tag) => tag.trim()) : []
    }, {
      onSuccess: () => {
        setPlainText('');
        setRichDescription('');
        setRichTitle('');
        setTags('');
        setAssignedTo(user._id);
        
        attachments.forEach(att => URL.revokeObjectURL(att.preview));
        setAttachments([]);
        
        setTaskPriority('medium');
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        setDueDate(tomorrow.toISOString().split('T')[0]);
        
        showSuccess("Task created successfully!");
      },
      onError: (error) => {
        showError(error.response?.data?.message || "Failed to create task");
      }
    });
  };

  const handleDeleteTask = (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTaskMutation.mutate(taskId);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      completed: '#10b981',
      late: '#ef4444',
      pending: '#f59e0b',
      in_progress: '#3b82f6'
    };
    return colors[status] || '#6b7280';
  };

  // Display richText or plainText
  const isRichText = (text) => {
    if (!text || typeof text !== 'string') return false;
    return /<[^>]+>/.test(text) || /&[a-zA-Z0-9#]+;/.test(text);
  };

  const SmartTextDisplay = ({ text, maxLines = 3 }) => {
    if (!text) return null;
    
    if (isRichText(text)) {
      return (
        <div 
          dangerouslySetInnerHTML={{ __html: text }} 
          style={{ lineClamp: maxLines }}
          className="smart-text-html"
        />
      );
    } else {
      return (
        <ReadMoreText maxLines={maxLines}>
          {text}
        </ReadMoreText>
      );
    }
  };

  if (error) {
    return <ErrorMessage message={error.message} />;
  }

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

  return (
    <>
      <Header />
      
      {/* Stats Section */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '20px',
        padding: '30px',
        marginBottom: '20px',
        marginTop: '20px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
      }}>
        <h1 style={{
          margin: '0 0 20px 0',
          fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: '800'
        }}>
          {greeting}, {user?.displayName}
        </h1>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '15px',
          marginTop: '20px'
        }}>
          {[
            { label: 'Total', value: stats.total, color: '#535bf2' },
            { label: 'Completed', value: stats.completed, color: '#10b981' },
            { label: 'Pending', value: stats.pending, color: '#f59e0b' },
            { label: 'Overdue', value: stats.late, color: '#ef4444' }
          ].map((stat) => (
            <div key={stat.label} style={{
              background: `linear-gradient(135deg, ${stat.color}15 0%, ${stat.color}25 100%)`,
              padding: '20px',
              borderRadius: '12px',
              border: `2px solid ${stat.color}30`,
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '2rem',
                fontWeight: '800',
                color: stat.color,
                marginBottom: '5px'
              }}>{stat.value}</div>
              <div style={{
                fontSize: '0.875rem',
                color: '#6b7280',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="dashboard">
        <SideBar />
        
        <div className="container">
          {/* Filters - Pass handleFilterChange */}
          <TaskFilters filters={filters} setFilters={handleFilterChange} />

          {/* Tasks List */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '20px',
            padding: '30px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            width: "100%",
            marginTop: '20px',
            position: 'relative'
          }}>
            {/* Loading overlay during page fetch */}
            {isFetching && !isPending && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(255, 255, 255, 0.7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '20px',
                zIndex: 10
              }}>
                <div style={{ textAlign: 'center' }}>
                  <LoadingSpinner />
                  <p style={{ marginTop: '10px', color: '#6b7280' }}>Loading page {currentPage}...</p>
                </div>
              </div>
            )}

            {/* Header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1fr 1.5fr',
              gap: '20px',
              padding: '15px 20px',
              background: '#f9fafb',
              borderRadius: '12px',
              marginBottom: '20px',
              fontWeight: '700',
              color: '#374151',
              fontSize: '0.875rem',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }} className="desktop-header">
              {headings.map((head) => (
                <div key={head}>{head}</div>
              ))}
            </div>

            {/* Initial Loading State */}
            {isPending && <LoadingSpinner />}

            {/* Empty State */}
            {!isPending && tasks.length === 0 && (
              <div style={{
                textAlign: 'center',
                padding: '60px 20px',
                color: '#9ca3af'
              }}>
                <AddCircleOutlineIcon style={{ fontSize: '4rem', marginBottom: '20px', opacity: 0.3 }} />
                <p style={{ fontSize: '1.25rem', fontWeight: '600' }}>No tasks found</p>
                <p>Try adjusting your filters or add a new task!</p>
              </div>
            )}

            {/* Task Items */}
{!isPending && tasks.map((task, index) => {
  // ✅ Calculate counts for THIS task
  const counts = reactionCounts(task);
  
  return (
    <div
      key={task._id}
      style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr 1fr 1.5fr',
        gap: '20px',
        padding: '20px',
        background: index % 2 === 0 ? '#ffffff' : '#f9fafb',
        borderRadius: '12px',
        marginBottom: '10px',
        alignItems: 'center',
        transition: 'all 0.2s',
        border: '1px solid #e5e7eb'
      }}
      className="task-row"
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateX(5px)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateX(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Task Content */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '15px'
      }} className="task-content">
        <input
          type="checkbox"
          checked={task.status === "completed"}
          onChange={() => handleToggleTask(task._id, task.status)}
          disabled={updateStatusMutation.isPending}
          style={{
            width: '20px',
            height: '20px',
            cursor: 'pointer',
            accentColor: getStatusColor(task.status),
            marginTop: '2px'
          }}
        />

        <div style={{ flex: 1 }}>
          <h3>
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(task?.title || "")
              }}
            />
          </h3>
          
          <TaskBadge task={task} user={user} />

          <ReadMoreText>
            <span style={{
              textDecoration: task?.status === 'completed' ? 'line-through' : 'none',
              opacity: task.status === 'completed' ? 0.6 : 1,
              color: '#1f2937'
            }}>
              <div
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(task?.description || "")
                }}
              />
            </span>
          </ReadMoreText>
          
          <div style={{display: 'flex', gap: '5px'}}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '3px',
              color: '#56687a',
              fontSize: '0.585rem',
              marginTop: '4px'
            }}>
              <span>Created At:</span>
              <CalendarIcon size={10} />
              {new Date(task?.createdAt).toLocaleDateString()}
            </div>
          </div>
          
          <div style={{display: "flex", gap: '3px', fontSize: '0.585rem', color: '#56687a', alignItems: 'center', marginBottom: '4px' }}>
            <ClockIcon size={10} color="#56687a" />
            <span>{formatRelativeTime(task?.createdAt)}</span>
          </div>
          
          {task.priority && (
            <span style={{
              display: 'inline-block',
              marginTop: '5px',
              fontSize: '0.75rem',
              padding: '2px 8px',
              borderRadius: '4px',
              background: task.priority === 'high' ? '#fef2f2' : task.priority === 'low' ? '#f0fdf4' : '#E0E7FF',
              color: task.priority === 'high' ? '#dc2626' : task.priority === 'low' ? '#16a34a' : '#3730A3' 
            }}>
              {task.priority}
            </span>
          )}
          
          {/* Attachments Preview */}
          {task.attachments && task.attachments.length > 0 && (
            <div style={{
              display: 'flex',
              gap: '6px',
              flexWrap: 'wrap',
              marginTop: '8px',
              padding: '8px',
              background: '#f9fafb',
              borderRadius: '8px',
              border: '1px solid #e5e7eb'
            }}>
              {task.attachments.slice(0, 3).map((attachment, idx) => {
                const isImage = attachment.type?.startsWith('image');
                const isVideo = attachment.type?.startsWith('video');
                return (
                  <div 
                    key={idx}
                    style={{
                      position: 'relative',
                      width: '40px',
                      height: '40px',
                      borderRadius: '6px',
                      overflow: 'hidden',
                      background: '#e5e7eb',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    onClick={() => window.open(attachment.url, '_blank')}
                  >
                    {isImage ? (
                      <img
                        src={attachment.url}
                        alt={attachment.filename}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.src = '/general/images/placeholder.jpg'
                        }}
                        loading="lazy"
                      />
                    ) : isVideo ? (
                      <VideoSVG />
                    ) : (
                      <FileSVG />
                    )}
                  </div>
                );
              })}
              {task.attachments.length > 3 && (
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: '#6b7280',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  color: 'white',
                  cursor: 'pointer'
                }}
                onClick={() => window.open(task.attachments[3].url, '_blank')}
                >
                  +{task.attachments.length - 3}
                </div>
              )}
            </div>
          )}
          
          {/* ✅ Reactions and Comments */}
          <div>
            <div className="middleBodyReacts" id="middleBodyReacts">
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
                  <span className="noMetaText" id="noMetaText">No likes yet</span>
                )}
              </div>

              <div className="mdComments">
                <div 
                id="mdCommentsL"
              style={{display: "flex", alignItems: 'center', cursor: 'not-allowed'}}
              // onClick={() => {
              //   setSelectedTaskForInteraction(task);
              //   setShowInteractionModal(true);
              // }}
            >
              <ChatBubbleOutlineIcon style={{color: "#293138", fontSize: "10px"}}/>
              <span style={{width: 'max-content'}}>
                {getTotalCommentsCount(task) > 0
                  ? pluralize(getTotalCommentsCount(task), 'comment')
                  : 'No comments yet'}
              </span>
                </div>
                <div style={{display: "flex", alignItems: 'center'}}>
                  <BookmarkBorderIcon style={{color: "#293138", fontSize: "10px", cursor: "not-allowed"}}/>
                  <span style={{width: 'max-content'}}>
                    {task?.saves > 0
                      ? pluralize(task.saves, 'save')
                      : <span className="noMetaText">No saves yet</span>
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="task-status">
        <span style={{
          display: 'inline-block',
          padding: '6px 16px',
          borderRadius: '20px',
          fontSize: '0.75rem',
          fontWeight: '700',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          background: `${getStatusColor(task.status)}20`,
          color: getStatusColor(task.status),
          border: `2px solid ${getStatusColor(task.status)}40`
        }}>
          {task.status.replace('_', ' ')}
        </span>
      </div>

      {/* Deadline */}
      <div className="task-deadline" style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        color: '#6b7280',
        fontSize: '0.875rem'
      }}>
        <CalendarIcon size={14} />
        {new Date(task.dueDate).toLocaleDateString()}
      </div>

      {/* Actions */}
      <div className="task-actions" style={{
        display: 'flex',
        gap: '10px',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={() => handleDeleteTask(task._id)}
          disabled={deleteTaskMutation.isPending}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            padding: '8px 16px',
            background: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontWeight: '600',
            flex: 1,
            minWidth: '80px',
            justifyContent: 'center'
          }}
        >
          <DeleteOutlineIcon style={{ fontSize: '1.125rem' }} />
          Delete
        </button>
      </div>
    </div>
  );
})}

            {/* ✅ PAGINATION COMPONENT */}
            {!isPending && tasks.length > 0 && (
              <Pagination 
                currentPage={currentPage}
                totalPages={pagination.pages}
                onPageChange={handlePageChange}
                isLoading={isFetching}
              />
            )}
          </div>
          
          {/* Add New Task Form */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '20px',
            padding: '30px',
            marginBottom: '20px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            marginTop: '20px',
            width: '100%'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
              flexWrap: 'wrap',
              gap: '10px'
            }}>
              <h2 style={{
                margin: 0,
                fontSize: '1.5rem',
                color: '#1f2937',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <AddCircleIcon style={{ color: '#535bf2' }} />
                Add New Task
              </h2>
              <button
                onClick={() => setToggleQuill(!toggleQuill)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 20px',
                  background: '#f3f4f6',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#374151',
                  transition: 'all 0.2s'
                }}
              >
                {toggleQuill ? <SwitchLeftIcon /> : <SwitchRightIcon />}
                {toggleQuill ? 'Plain Text' : 'Rich Text'}
              </button>
            </div>

            {/* Priority and Due Date */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '15px',
              marginBottom: '15px'
            }}>
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#374151'
                }}>
                  Priority
                </label>
                <select
                  value={taskPriority}
                  onChange={(e) => setTaskPriority(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '10px',
                    fontSize: '1rem',
                    fontFamily: 'inherit',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#535bf2'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#374151'
                }}>
                  Due Date
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '10px',
                    fontSize: '1rem',
                    fontFamily: 'inherit',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#535bf2'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>
            </div>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '15px',
              marginBottom: '15px'
            }}>
              {/* Tags field */}
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#374151'
                }}>
                  Tags (Optional)
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="e.g., urgent, review, meeting"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '10px',
                    fontSize: '1rem',
                    fontFamily: 'inherit',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#535bf2'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
                <span style={{color: '#6b7280', fontSize: '0.75rem', marginTop: '4px', display: 'block'}}>
                  Comma-separated (only you can see these)
                </span>
              </div>

              {/* Assign To field */}
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#374151'
                }}>
                  Assign To
                </label>
                <select
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  disabled={connectionsLoading}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '10px',
                    fontSize: '1rem',
                    fontFamily: 'inherit',
                    outline: 'none',
                    cursor: connectionsLoading ? 'wait' : 'pointer',
                    background: connectionsLoading ? '#f3f4f6' : 'white'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#535bf2'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                >
                  {/* Self */}
                  <option value={user?._id}>
                    👤 Myself ({user?.displayName})
                  </option>

                  {/* Connections */}
                  {connections.length > 0 && (
                    <optgroup label="─── My Connections ───">
                      {connections.map((connection) => (
                        <option key={connection._id} value={connection._id}>
                          🤝 {connection.firstName} {connection.lastName} (@{connection.displayName})
                        </option>
                      ))}
                    </optgroup>
                  )}

                  {/* Loading state */}
                  {connectionsLoading && (
                    <option disabled>Loading connections...</option>
                  )}

                  {/* Empty state */}
                  {!connectionsLoading && connections.length === 0 && (
                    <option disabled>No connections yet - connect with users to assign tasks</option>
                  )}
                </select>
                <span style={{color: '#6b7280', fontSize: '0.75rem', marginTop: '4px', display: 'block'}}>
                  {assignedTo === user?._id 
                    ? 'Assigning to yourself' 
                    : connections.find(c => c._id === assignedTo)
                      ? `Assigning to ${connections.find(c => c._id === assignedTo)?.firstName}`
                      : 'Select a person'}
                </span>
              </div>
            </div>

              {/* Title Field - Rich Text */}
            <div style={{
              gridColumn: '1 / -1',
              marginBottom: '15px'
            }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#374151'
              }}>
                Title (Optional)
              </label>
              <ReactQuill
                theme="snow"
                value={richTitle}
                onChange={setRichTitle}
                placeholder="Add more details about this task..."
                modules={{
                  toolbar: [
                    [{ 'header': [1, 2, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                    ['link', 'blockquote'],
                    [{ 'color': [] }, { 'background': [] }],
                    [{ 'align': [] }],
                    ['clean']
                  ],
                }}
                style={{
                  borderRadius: '12px',
                  overflow: 'hidden',
                  height: '120px',
                  borderBottom: '1px solid #ddd'
                }}
              />
            </div>

            {/* File Attachments */}
        {/* ✅ UNIFIED FILE ATTACHMENTS */}
            <div style={{ marginBottom: '15px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#374151'
              }}>
                Attachments (Optional) - Max 10 files, 10MB each
              </label>

              {/* Drop Zone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById('fileInput').click()}
                style={{
                  border: `2px dashed ${isDragging ? '#3b82f6' : '#e5e7eb'}`,
                  borderRadius: '12px',
                  padding: '24px',
                  textAlign: 'center',
                  background: isDragging ? '#eff6ff' : '#f9fafb',
                  cursor: 'pointer',
                  transition: '0.2s'
                }}
              >
                <input
                  id="fileInput"
                  type="file"
                  multiple
                  // accept="image/*,video/*"
                  accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.rar"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />

                <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📁</div>
                <p style={{ margin: 0, fontSize: '0.875rem', color: '#374151' }}>
                  <strong>Drag & drop</strong> images or videos here <br />
                  or <span style={{ color: '#3b82f6', fontWeight: '600' }}>browse files</span>
                </p>
                <p style={{ margin: '8px 0 0 0', fontSize: '0.75rem', color: '#6b7280' }}>
                  {attachments.length} / 10 files selected
                </p>
              </div>

              {/* Preview Grid */}
              {attachments.length > 0 && (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                  gap: '12px',
                  marginTop: '15px'
                }}>
                  {attachments.map((item, index) => (
                    <div
                      key={index}
                      style={{
                        position: 'relative',
                        paddingTop: '100%',
                        borderRadius: '10px',
                        overflow: 'hidden',
                        background: '#f3f4f6',
                        border: '2px solid #e5e7eb'
                      }}
                    >
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%'
                      }}>
                        {item.displayType === 'image' ? (
                          <img
                            src={item.preview}
                            alt={item.name}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover'
                            }}
                          />
                        ) : item.displayType === 'video' ? (
                          <div style={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: '#1f2937',
                            color: 'white'
                          }}>
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
                              <path d="M8 5v14l11-7z"/>
                            </svg>
                            <span style={{
                              fontSize: '0.65rem',
                              marginTop: '4px',
                              textAlign: 'center',
                              padding: '0 4px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              width: '100%'
                            }}>
                              {item.name}
                            </span>
                          </div>
                        ) : (
                          // ✅ File icon for documents
                          <div style={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: '#3b82f6',
                            color: 'white',
                            padding: '8px'
                          }}>
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
                              <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                            </svg>
                            <span style={{
                              fontSize: '0.65rem',
                              marginTop: '4px',
                              textAlign: 'center',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              width: '100%',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical'
                            }}>
                              {item.name}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Remove button */}
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          removeAttachment(index);
                        }}
                        style={{
                          position: 'absolute',
                          top: '6px',
                          right: '6px',
                          background: 'rgba(239, 68, 68, 0.9)',
                          border: 'none',
                          color: 'white',
                          borderRadius: '50%',
                          width: '24px',
                          height: '24px',
                          cursor: 'pointer',
                          fontSize: '16px',
                          lineHeight: '24px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 'bold',
                          transition: 'transform 0.2s',
                          zIndex: 10
                        }}
                        onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
                        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                      >
                        ×
                      </div>

                      {/* File type badge */}
                      <div style={{
                        position: 'absolute',
                        bottom: '6px',
                        left: '6px',
                        background: 'rgba(0, 0, 0, 0.7)',
                        color: 'white',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontSize: '0.65rem',
                        fontWeight: '600',
                        textTransform: 'uppercase'
                      }}>
                        {/* {item.type.split('/')[0]} */}
                        {item.name.split('.').pop()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {toggleQuill ? (
              /* Plain Text Editor */
              <div>
                <textarea
                  ref={textareaRef}
                  value={plainText}
                  onChange={(e) => setPlainText(e.target.value)}
                  placeholder="Enter your task details..."
                  style={{
                    width: '100%',
                    minHeight: '120px',
                    padding: '15px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    fontFamily: 'inherit',
                    resize: 'vertical',
                    marginBottom: '15px',
                    transition: 'border-color 0.2s',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#535bf2'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '10px',
                  position: 'relative'
                }}>
                  <button
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    style={{
                      padding: '10px 20px',
                      background: '#f3f4f6',
                      border: 'none',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      fontSize: '1.25rem',
                      transition: 'transform 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
                    onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                  >
                    😊
                  </button>
                  {showEmojiPicker && (
                    <div style={{
                      position: 'absolute',
                      bottom: '100%',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      zIndex: 1000,
                      marginBottom: '8px',
                      backgroundColor: '#ffffff',
                      border: '2px solid #e2e8f0',
                      borderRadius: '12px',
                      padding: '12px',
                      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(40px, 1fr))',
                      gap: '8px',
                      width: '100%',
                      maxWidth: '400px'
                    }} className="emoji-picker">
                      {emojis.map((emoji, idx) => (
                        <div
                          key={idx}
                          style={{
                            fontSize: '22px',
                            cursor: 'pointer',
                            padding: '10px',
                            borderRadius: '8px',
                            transition: 'background-color 0.2s',
                            textAlign: 'center',
                            userSelect: 'none'
                          }}
                          onClick={() => onEmojiClick({ emoji })}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#f1f5f9';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                        >
                          {emoji}
                        </div>
                      ))}
                    </div>
                  )}
                  <button
                    onClick={handleAddTask}
                    disabled={!plainText.trim() || createTaskMutation.isPending}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '12px 30px',
                      background: plainText.trim() && !createTaskMutation.isPending
                        ? 'linear-gradient(135deg, #535bf2 0%, #764ba2 100%)'
                        : '#d1d5db',
                      color: 'white',
                      border: 'none',
                      borderRadius: '10px',
                      cursor: plainText.trim() && !createTaskMutation.isPending ? 'pointer' : 'not-allowed',
                      fontSize: '1rem',
                      fontWeight: '600',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      boxShadow: plainText.trim() && !createTaskMutation.isPending ? '0 4px 15px rgba(102, 126, 234, 0.4)' : 'none'
                    }}
                    onMouseEnter={(e) => {
                      if (plainText.trim() && !createTaskMutation.isPending) {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.5)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = plainText.trim() && !createTaskMutation.isPending ? '0 4px 15px rgba(102, 126, 234, 0.4)' : 'none';
                    }}
                  >
                    {createTaskMutation.isPending ? 'Adding...' : 'Add Task'}
                    <AddCircleOutlineIcon />
                  </button>
                </div>
              </div>
            ) : (
              /* Rich Text Editor */
              <div>
                <ReactQuill
                  theme="snow"
                  value={richDescription}
                  onChange={setRichDescription}
                  placeholder="Enter your task with rich formatting..."
                  modules={{
                  toolbar: [
                    [{ 'header': [1, 2, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                    ['link', 'blockquote'],
                    [{ 'color': [] }, { 'background': [] }],
                    [{ 'align': [] }],
                    ['clean'],
                    ['emoji']
                  ],
                }}
                  style={{
                    marginBottom: '15px',
                    borderRadius: '12px',
                    overflow: 'hidden'
                  }}
                  
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    onClick={handleAddTask}
                    disabled={isQuillEmpty(richDescription) || createTaskMutation.isPending}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '12px 30px',
                      background: !isQuillEmpty(richDescription) && !createTaskMutation.isPending
                        ? 'linear-gradient(135deg, #535bf2 0%, #764ba2 100%)'
                        : '#d1d5db',
                      color: 'white',
                      border: 'none',
                      borderRadius: '10px',
                      cursor: !isQuillEmpty(richDescription) && !createTaskMutation.isPending ? 'pointer' : 'not-allowed',
                      fontSize: '1rem',
                      fontWeight: '600',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      boxShadow: !isQuillEmpty(richDescription) && !createTaskMutation.isPending ? '0 4px 15px rgba(102, 126, 234, 0.4)' : 'none'
                    }}
                    onMouseEnter={(e) => {
                      if (!isQuillEmpty(richDescription) && !createTaskMutation.isPending) {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.5)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = !isQuillEmpty(richDescription) && !createTaskMutation.isPending ? '0 4px 15px rgba(102, 126, 234, 0.4)' : 'none';
                    }}
                  >
                    {createTaskMutation.isPending ? 'Adding...' : 'Add Task'}
                    <AddCircleOutlineIcon />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="rightbar">
          <DailyAgendaSidebar tasks={tasks} />
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
      <Footer />

      {/* Mobile Responsive Styles */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-header {
            display: none !important;
          }
          
          .task-row {
            grid-template-columns: 1fr !important;
            gap: 15px !important;
          }
          
          .task-content {
            flex-direction: column !important;
          }
          
          .task-status::before {
            content: 'Status: ';
            font-weight: 600;
            color: #6b7280;
            margin-right: 8px;
          }
          
          .task-deadline::before {
            content: 'Deadline: ';
            font-weight: 600;
            color: #6b7280;
            margin-right: 8px;
          }
          
          .task-actions {
            padding-top: 10px;
            border-top: 1px solid #e5e7eb;
            width: 100%;
          }
          
          .task-actions button {
            flex: 1 1 calc(50% - 5px);
          }
        }
        
        @media (max-width: 480px) {
          .task-actions {
            flex-direction: column;
          }
          
          .task-actions button {
            width: 100%;
          }
          
          .emoji-picker {
            max-width: 90vw !important;
          }
        }
        
        .ql-container {
          min-height: 150px;
          border-bottom-left-radius: 12px;
          border-bottom-right-radius: 12px;
        }
        
        .ql-toolbar {
          border-top-left-radius: 12px;
          border-top-right-radius: 12px;
        }
      `}</style>

      {/* Add the interaction modal */}
      <TaskInteractionModal
        task={selectedTaskForInteraction}
        open={showInteractionModal}
        onClose={() => {
          setShowInteractionModal(false);
          setSelectedTaskForInteraction(null);
        }}
        user={user}
      />
    </>
  );
};

export default Dashboard2;