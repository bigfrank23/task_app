// components/tasks/TaskInteractionModal.jsx
import { useState } from 'react';
import GlassModal from '../../components/modal/GlassModal';
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import FavoriteIcon from "@mui/icons-material/Favorite";
import HandshakeIcon from "@mui/icons-material/Handshake";
import SendIcon from "@mui/icons-material/Send";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CloseIcon from "@mui/icons-material/Close";
import ReplyIcon from "@mui/icons-material/Reply";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DOMPurify from 'dompurify';
import { useToggleReaction, useAddComment, useAddReply, useToggleReplyReaction } from '../../utils/useSocialInteractions';
import { useNotification } from '../../utils/useNotification';
import Avatar from '../../components/avatar/Avatar';
import { formatRelativeTime } from '../../utils/time';
import useOnlineUsersStore from '../../utils/onlineUsersStore';

const TaskInteractionModal = ({ task, open, onClose, user }) => {
  const [commentText, setCommentText] = useState('');
  const [commentAttachments, setCommentAttachments] = useState([]);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [replyAttachments, setReplyAttachments] = useState([]);

  const { showSuccess, showError } = useNotification();
  const toggleReaction = useToggleReaction();
  const addComment = useAddComment();
  const addReply = useAddReply();
  const toggleReplyReaction = useToggleReplyReaction();
  const { onlineUsers } = useOnlineUsersStore();

  const handleReact = (reactionType) => {
    toggleReaction.mutate(
      { taskId: task._id, reactionType },
      {
        onSuccess: (data) => {
          showSuccess(data.message || 'Reaction updated');
        },
        onError: (error) => {
          showError(error.response?.data?.message || 'Failed to react');
        }
      }
    );
  };

  const handleAddComment = () => {
    if (!commentText.trim() && commentAttachments.length === 0) {
      showError('Please enter a comment or attach a file');
      return;
    }

    const files = commentAttachments.map(att => att.file);

    addComment.mutate(
      { taskId: task._id, text: commentText, attachments: files },
      {
        onSuccess: () => {
          showSuccess('Comment added');
          setCommentText('');
          setCommentAttachments([]);
        },
        onError: (error) => {
          showError(error.response?.data?.message || 'Failed to add comment');
        }
      }
    );
  };

  const handleAddReply = (commentId) => {
    if (!replyText.trim() && replyAttachments.length === 0) {
      showError('Please enter a reply or attach a file');
      return;
    }

    const files = replyAttachments.map(att => att.file);

    addReply.mutate(
      { taskId: task._id, commentId, text: replyText, attachments: files },
      {
        onSuccess: () => {
          showSuccess('Reply added');
          setReplyText('');
          setReplyAttachments([]);
          setReplyingTo(null);
        },
        onError: (error) => {
          showError(error.response?.data?.message || 'Failed to add reply');
        }
      }
    );
  };

  const handleReplyReact = (commentId, replyId, reactionType) => {
    toggleReplyReaction.mutate(
      { taskId: task._id, commentId, replyId, reactionType },
      {
        onSuccess: (data) => {
          showSuccess(data.message || 'Reaction updated');
        },
        onError: (error) => {
          showError(error.response?.data?.message || 'Failed to react');
        }
      }
    );
  };

  const handleFileSelect = (e, isReply = false) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => file.size <= 10 * 1024 * 1024);

    if (validFiles.length !== files.length) {
      showError('Some files exceed 10MB limit');
    }

    const fileObjects = validFiles.map(file => ({
      file,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
      name: file.name,
      type: file.type
    }));

    if (isReply) {
      setReplyAttachments(prev => [...prev, ...fileObjects]);
    } else {
      setCommentAttachments(prev => [...prev, ...fileObjects]);
    }

    e.target.value = '';
  };

  const removeAttachment = (index, isReply = false) => {
    if (isReply) {
      setReplyAttachments(prev => {
        if (prev[index].preview) URL.revokeObjectURL(prev[index].preview);
        return prev.filter((_, i) => i !== index);
      });
    } else {
      setCommentAttachments(prev => {
        if (prev[index].preview) URL.revokeObjectURL(prev[index].preview);
        return prev.filter((_, i) => i !== index);
      });
    }
  };

  if (!task) return null;

  console.log(task);
  console.log(user);
  
  

  const reactions = [
    { type: 'like', icon: ThumbUpIcon, color: '#1877f2', label: 'Like' },
    { type: 'love', icon: FavoriteIcon, color: '#e74c3c', label: 'Love' },
    { type: 'celebrate', icon: HandshakeIcon, color: '#f39c12', label: 'Celebrate' },
    { type: 'dislike', icon: ThumbDownIcon, color: '#95a5a6', label: 'Dislike' }
  ];

  return (
    <GlassModal open={open} onClose={onClose} maxWidth="800px">
      <div 
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '80vh',
          maxHeight: '80vh',
          overflow: 'hidden'
        }}
      >
        {/* Task Content */}
        <div 
          style={{ 
            flexShrink: 0,
            paddingBottom: '20px', 
            borderBottom: '1px solid #e5e7eb',
            marginBottom: '20px',
            maxHeight: '200px',
            overflowY: 'auto',
            paddingRight: '10px'
          }}
        >
          <h2 
            style={{ 
              margin: '0 0 10px 0',
              wordWrap: 'break-word',
              overflowWrap: 'anywhere',
              fontSize: '1.25rem'
            }}
          >
            <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(task.title) }} />
          </h2>
          <div 
            style={{
              wordWrap: 'break-word',
              overflowWrap: 'anywhere',
              lineHeight: 1.5,
              fontSize: '0.95rem'
            }}
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(task.description) }} 
          />
        </div>

        {/* Reactions Bar */}
        <div 
          style={{
            flexShrink: 0,
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px',
            padding: '15px 0',
            borderBottom: '1px solid #e5e7eb',
            marginBottom: '20px'
          }}
        >
          {reactions.map(({ type, icon: Icon, color, label }) => {
            const isActive = task.reactions?.[type]?.includes(user._id);
            const count = task.reactions?.[type]?.length || 0;

            return (
              <div
                key={type}
                onClick={() => handleReact(type)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '8px 12px',
                  border: `2px solid ${isActive ? color : '#e5e7eb'}`,
                  background: isActive ? `${color}15` : 'white',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  whiteSpace: 'nowrap',
                  flexShrink: 0
                }}
              >
                <Icon style={{ fontSize: '16px', color: isActive ? color : '#6b7280' }} />
                <span style={{ color: isActive ? color : '#6b7280' }}>
                  {label} {count > 0 && `(${count})`}
                </span>
              </div>
            );
          })}
        </div>

        {/* Comments Section */}
        <div 
          style={{ 
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}
        >
          <h3 style={{ 
            flexShrink: 0,
            margin: '0 0 15px 0', 
            fontSize: '1.125rem' 
          }}>
            Comments ({task.comments?.filter(c => !c.deleted).length || 0})
          </h3>

          {/* Add Comment Form */}
          <div 
            style={{
              flexShrink: 0,
              background: '#f9fafb',
              padding: '15px',
              borderRadius: '12px',
              marginBottom: '20px',
              maxHeight: '160px'
            }}
          >
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              style={{
                width: '100%',
                maxHeight: '80px',
                height: 'auto',
                padding: '12px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontFamily: 'inherit',
                resize: 'vertical',
                outline: 'none',
                marginBottom: '10px',
                overflowY: 'auto',
                lineHeight: 1.4
              }}
            />

            {commentAttachments.length > 0 && (
              <div style={{ 
                display: 'flex', 
                gap: '8px', 
                marginBottom: '10px', 
                flexWrap: 'wrap' 
              }}>
                {commentAttachments.map((att, idx) => (
                  <div key={idx} style={{ position: 'relative', flexShrink: 0 }}>
                    {att.preview ? (
                      <img 
                        src={att.preview} 
                        alt={att.name} 
                        style={{ 
                          width: '60px', 
                          height: '60px', 
                          objectFit: 'cover', 
                          borderRadius: '4px' 
                        }} 
                      />
                    ) : (
                      <div style={{ 
                        width: '60px', 
                        height: '60px', 
                        background: '#e5e7eb', 
                        borderRadius: '4px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        fontSize: '0.75rem',
                        overflow: 'hidden'
                      }}>
                        {att.name.split('.').pop()}
                      </div>
                    )}
                    <div
                      onClick={() => removeAttachment(idx, false)}
                      style={{
                        position: 'absolute',
                        top: '-5px',
                        right: '-5px',
                        background: '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '20px',
                        height: '20px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      ×
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <label style={{ cursor: 'pointer', flexShrink: 0 }}>
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*,.pdf,.doc,.docx"
                  onChange={(e) => handleFileSelect(e, false)}
                  style={{ display: 'none' }}
                />
                <AttachFileIcon style={{ color: '#6b7280', fontSize: '20px' }} />
              </label>
              <div
                onClick={handleAddComment}
                style={{
                  marginLeft: 'auto',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '8px 16px',
                  background: '#535bf2',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  whiteSpace: 'nowrap'
                }}
              >
                <SendIcon style={{ fontSize: '16px' }} />
                {addComment.isPending ? 'Commenting...' : 'Comment'}
              </div>
            </div>
          </div>

          {/* Comments List */}
          <div 
            style={{ 
              flex: 1,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '15px',
              paddingRight: '5px'
            }}
          >
            {task.comments?.filter(c => !c.deleted).map((comment) => (
              <div key={comment._id} style={{
                padding: '15px',
                background: '#f9fafb',
                borderRadius: '12px',
                flexShrink: 0,
                maxWidth: '100%',
                color: '#111'
              }}>
                {/* Comment Header */}
                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px', color: "#111"}}>
                  <Avatar image={comment.author?.userImage} name={comment.author?.displayName} isOnline={onlineUsers[comment?.author]} size={25} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: '600', fontSize: '0.875rem' }}>
                      {comment.author?.displayName}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                      {formatRelativeTime(comment.createdAt)}
                    </div>
                  </div>
                </div>

                {/* Comment Text */}
                {/* <div style={{ 
                  marginBottom: '10px', 
                  fontSize: '0.875rem',
                  wordWrap: 'break-word',
                  overflowWrap: 'anywhere',
                  lineHeight: 1.4,
                  color: '#111'
                }}>
                  {comment.text}
                </div> */}
                <div
                style={{ 
                  marginBottom: '10px', 
                  fontSize: '0.875rem',
                  wordWrap: 'break-word',
                  overflowWrap: 'anywhere',
                  lineHeight: 1.4,
                  color: '#111'
                }}
                className="cs-text"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(comment.text || '') }}
                />

                {/* Comment Attachments */}
                {comment.attachments?.length > 0 && (
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
                    {comment.attachments.map((att, idx) => (
                      <a
                        key={idx}
                        href={att.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'block',
                          width: '80px',
                          height: '80px',
                          borderRadius: '4px',
                          overflow: 'hidden',
                          flexShrink: 0
                        }}
                      >
                        {att.type === 'image' ? (
                          <img src={att.url} alt={att.filename} style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                          onError={(e) => {
                          e.target.src = '/general/images/placeholder.jpg'
                        }}
                        loading="lazy"/>
                        ) : (
                          <div style={{ 
                            width: '100%', 
                            height: '100%', 
                            background: '#e5e7eb', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            fontSize: '0.75rem',
                            overflow: 'hidden'
                          }}>
                            {att.filename}
                          </div>
                        )}
                      </a>
                    ))}
                  </div>
                )}

                {/* Comment Actions */}
                <div style={{ display: 'flex', gap: '15px', fontSize: '0.75rem' }}>
                  <div
                    onClick={() => setReplyingTo(replyingTo === comment._id ? null : comment._id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#111',
                      cursor: 'pointer',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '3px'
                    }}
                  >
                    <ReplyIcon style={{ fontSize: '14px' }} />
                    Reply
                  </div>
                  <span style={{ color: '#111' }}>
                    {comment.replies?.length || 0} replies
                  </span>
                </div>

                {/* Reply Form */}
                {replyingTo === comment._id && (
                  <div style={{
                    marginTop: '15px',
                    padding: '12px',
                    background: 'white',
                    borderRadius: '8px',
                    maxHeight: '140px'
                  }}>
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Write a reply..."
                      style={{
                        width: '100%',
                        maxHeight: '60px',
                        height: 'auto',
                        padding: '10px',
                        border: '2px solid #e5e7eb',
                        borderRadius: '6px',
                        fontSize: '0.875rem',
                        resize: 'vertical',
                        outline: 'none',
                        marginBottom: '10px',
                        overflowY: 'auto',
                        lineHeight: 1.4
                      }}
                    />

                    {replyAttachments.length > 0 && (
                      <div style={{ display: 'flex', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
                        {replyAttachments.map((att, idx) => (
                          <div key={idx} style={{ position: 'relative', flexShrink: 0 }}>
                            {att.preview ? (
                              <img src={att.preview} alt={att.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                            ) : (
                              <div style={{ width: '50px', height: '50px', background: '#e5e7eb', borderRadius: '4px' }} />
                            )}
                            <button
                              onClick={() => removeAttachment(idx, true)}
                              style={{
                                position: 'absolute',
                                top: '-5px',
                                right: '-5px',
                                background: '#ef4444',
                                color: 'white',
                                border: 'none',
                                borderRadius: '50%',
                                width: '18px',
                                height: '18px',
                                cursor: 'pointer'
                              }}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <label style={{ cursor: 'pointer', flexShrink: 0 }}>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={(e) => handleFileSelect(e, true)}
                          style={{ display: 'none' }}
                        />
                        <AttachFileIcon style={{ color: '#6b7280', fontSize: '18px' }} />
                      </label>
                      <button
                        onClick={() => handleAddReply(comment._id)}
                        style={{
                          marginLeft: 'auto',
                          padding: '6px 12px',
                          background: '#535bf2',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '0.75rem'
                        }}
                      >
                        {addReply.isPending ? 'Posting...' : 'Reply'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Replies */}
                {comment.replies?.length > 0 && (
                  <div style={{ marginTop: '15px', marginLeft: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {comment.replies.map((reply) => (
                      <div key={reply._id} style={{
                        padding: '12px',
                        background: 'white',
                        borderRadius: '8px',
                        maxWidth: '100%'
                      }}>
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                          <Avatar image={reply.author?.userImage} name={reply.author?.displayName} size={20} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontWeight: '600', fontSize: '0.8125rem' }}>
                              {reply.author?.firstName} {reply.author?.lastName}
                            </div>
                            <div style={{ fontSize: '0.7rem', color: '#6b7280' }}>
                              {formatRelativeTime(reply.createdAt)}
                            </div>
                          </div>
                        </div>
                        <div style={{ 
                          fontSize: '0.8125rem', 
                          marginBottom: '8px',
                          wordWrap: 'break-word',
                          overflowWrap: 'anywhere',
                          lineHeight: 1.4
                        }}>
                          {reply.text}
                        </div>

                        {/* Reply Reactions */}
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          {reactions.map(({ type, icon: Icon, color }) => {
                            const count = reply.reactions?.[type]?.length || 0;
                            const isActive = reply.reactions?.[type]?.includes(user._id);

                            if (count === 0 && !isActive) return null;

                            return (
                              <button
                                key={type}
                                onClick={() => handleReplyReact(comment._id, reply._id, type)}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '3px',
                                  padding: '4px 8px',
                                  border: `1px solid ${isActive ? color : '#e5e7eb'}`,
                                  background: isActive ? `${color}15` : 'white',
                                  borderRadius: '12px',
                                  cursor: 'pointer',
                                  fontSize: '0.7rem'
                                }}
                              >
                                <Icon style={{ fontSize: '12px', color: isActive ? color : '#6b7280' }} />
                                <span>{count}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </GlassModal>
  );
};

export default TaskInteractionModal;
