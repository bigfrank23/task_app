// components/commentSection/CommentSection.jsx
import './commentSection.css';
import { useRef, useState } from 'react';
import { 
  useAddComment, 
  useAddReply, 
  useComments, 
  useDeleteComment,
  useDeleteReply,
  useToggleReplyReaction
} from '../../utils/useSocialInteractions';
import useAuthStore from '../../utils/authStore';
import { formatRelativeTime } from '../../utils/time';
import DOMPurify from 'dompurify';
import RichTextComment from './RichTextComment';
import DeleteIcon from '@mui/icons-material/Delete';
import Avatar from '../avatar/Avatar';
import useOnlineUsersStore from '../../utils/onlineUsersStore';
import { LoadingSpinner } from '../tasks/TaskUtils';
import ReactionPicker from '../reactions/ReactionPicker';
import Pagination from '../../pages/Dashboard/pagination/Paginaton';
import OptimizedImage from '../optimizedImage/OptimizedImage';

const CommentSection = ({ taskId }) => {
  const { user } = useAuthStore();
  const [currentPage, setCurrentPage] = useState(1); 

  const commentSectionRef = useRef(null);
  
  // ✅ Only use this one - remove the duplicate
  const { data: commentsData, isPending } = useComments(taskId, currentPage, 10);
  
  const addCommentMutation = useAddComment();
  const addReplyMutation = useAddReply();
  const deleteCommentMutation = useDeleteComment();
  const deleteReplyMutation = useDeleteReply();
  const toggleReplyReaction = useToggleReplyReaction();

  const { onlineUsers } = useOnlineUsersStore();
  const [replyMap, setReplyMap] = useState({});

  // ✅ Extract comments and pagination from response
  const comments = commentsData?.data || [];
  const pagination = commentsData?.pagination || {};

  const addComment = (text, attachments) => {
    addCommentMutation.mutate(
      { taskId, text, attachments },
      {
        onSuccess: () => {
          setCurrentPage(1); // Reset to first page after adding comment
        }
      }
    );
  };

const handlePageChange = (page) => {
  setCurrentPage(page);

  requestAnimationFrame(() => {
    commentSectionRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  });
};


  const handleDeleteComment = (commentId) => {
    if (window.confirm('Delete this comment?')) {
      deleteCommentMutation.mutate({ taskId, commentId });
    }
  };

  const handleDeleteReply = (commentId, replyId) => {
    if (window.confirm('Delete this reply?')) {
      deleteReplyMutation.mutate({ taskId, commentId, replyId });
    }
  };

  const toggleReplyInput = (id) => {
    setReplyMap(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const addReply = (commentId, replyText, replyAttachments = []) => {
    const t = replyText?.trim();
    if (!t && !replyAttachments?.length) return;

    addReplyMutation.mutate(
      { taskId, commentId, text: t, attachments: replyAttachments },
      {
        onSuccess: () => {
          setReplyMap(prev => ({ ...prev, [commentId]: false }));
        }
      }
    );
  };

  const getUserReplyReaction = (reply) => {
    if (reply.reactions?.like?.includes(user._id)) return 'like';
    if (reply.reactions?.love?.includes(user._id)) return 'love';
    if (reply.reactions?.celebrate?.includes(user._id)) return 'celebrate';
    if (reply.reactions?.dislike?.includes(user._id)) return 'dislike';
    return null;
  };

  const replyReactionCounts = (reply) => ({
    like: reply.reactions?.like?.length || 0,
    love: reply.reactions?.love?.length || 0,
    celebrate: reply.reactions?.celebrate?.length || 0,
    dislike: reply.reactions?.dislike?.length || 0,
  });

  if (isPending) {
    return (
      <div className="cs-root" ref={commentSectionRef}>
        <LoadingSpinner size='20' message='Loading comments...'/>
      </div>
    );
  }

  return (
    <div className="cs-root">
      <RichTextComment onSubmit={addComment} />

      <div className="cs-list">
        {comments.map(c => {
          return (
            <div className="cs-item" key={c._id}>
              <div className="cs-left">
                <div className="cs-avatar">
                  <Avatar 
                    image={c?.author?.userImage} 
                    name={c?.author?.displayName} 
                    isOnline={onlineUsers[c?.author?._id]}
                  />
                </div>
              </div>
              
              <div className="cs-right">
                <div className="cs-header">
                  <span className="cs-author">{c.author?.displayName}</span>
                  <span className="cs-time">{formatRelativeTime(c.createdAt)}</span>
                  {c.author?._id === user?._id && !c.deleted && (
                    <DeleteIcon
                      onClick={() => handleDeleteComment(c._id)}
                      style={{
                        fontSize: 16,
                        cursor: 'pointer',
                        color: '#ef4444',
                        marginLeft: 'auto'
                      }}
                    />
                  )}
                </div>

                {c.deleted ? (
                  <i style={{ color: '#6b7280' }}>Comment deleted</i>
                ) : (
                  <>
                    <div
                      className="cs-text"
                      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(c.text || '') }}
                    />

                    {c.attachments?.length > 0 && (
                      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px' }}>
                        {c.attachments.map((att, idx) => (
                          <div key={idx}>
                            {att.type === 'image' && (
                              // <img src={att.url} alt={att.filename} style={{ maxWidth: 200, borderRadius: 8 }} onError={(e) => {
                              //   e.target.src = '/general/images/placeholder.jpg'
                              // }}
                              // loading="lazy" />
                              <OptimizedImage
                              src={att.url}
                              alt={att.filename}
                              width={att.width}
                              height={att.height}
                              blurhash={att.blurhash}
                              className="comment-attachment"
                            />
                            )}
                            {att.type === 'video' && (
                              <video src={att.url} controls style={{ maxWidth: 200, borderRadius: 8 }} />
                            )}
                            {att.type === 'file' && (
                              <a href={att.url} target="_blank" rel="noopener noreferrer">
                                📄 {att.filename}
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="cs-actions-row">
                      <div className="cs-action" onClick={() => toggleReplyInput(c._id)}>
                        Reply
                      </div>
                    </div>
                  </>
                )}

                {replyMap[c._id] && (
                  <ReplyBox 
                    commentId={c._id}
                    onAdd={addReply}
                  />
                )}

                {c.replies && c.replies.length > 0 && (
                  <div className="cs-replies">
                    {c.replies.map(r => (
                      <div className="cs-reply" key={r._id}>
                        <div className="cs-avatar small">
                          <Avatar 
                            image={r?.author?.userImage} 
                            name={r?.author?.displayName} 
                            isOnline={onlineUsers[r?.author?._id]}
                          />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div className="cs-header">
                            <span className="cs-author">{r.author?.displayName}</span>
                            <span className="cs-time">{formatRelativeTime(r.createdAt)}</span>
                            {r.author?._id === user?._id && !r.deleted && (
                              <DeleteIcon
                                onClick={() => handleDeleteReply(c._id, r._id)}
                                style={{
                                  fontSize: 14,
                                  cursor: 'pointer',
                                  color: '#ef4444',
                                  marginLeft: 'auto'
                                }}
                              />
                            )}
                          </div>

                          {r.deleted ? (
                            <i style={{ color: '#6b7280', fontSize: '13px' }}>Reply deleted</i>
                          ) : (
                            <>
                              <div 
                                className="cs-text"
                                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(r.text || '') }}
                              />
                              
                              {r.attachments?.length > 0 && (
                                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '5px' }}>
                                  {r.attachments.map((att, idx) => (
                                    <div key={idx}>
                                      {att.type === 'image' && (
                          //               <img src={att.url} alt={att.filename} style={{ maxWidth: 150, borderRadius: 8 }}  onError={(e) => {
                          // e.target.src = '/general/images/placeholder.jpg'}}/>
                                        <OptimizedImage
                                            src={att.url}
                                            alt={att.filename}
                                            width={att.width}
                                            height={att.height}
                                            blurhash={att.blurhash}
                                            
                                          />
                                      )}
                                      {att.type === 'video' && (
                                        <video src={att.url} controls style={{ maxWidth: 150, borderRadius: 8 }} />
                                      )}
                                      {att.type === 'file' && (
                                        <a href={att.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '12px' }}>
                                          📄 {att.filename}
                                        </a>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}

                              <div className="cs-reply-actions">
                                <ReactionPicker
                                  currentReaction={getUserReplyReaction(r)}
                                  onSelect={(type) =>
                                    toggleReplyReaction.mutate({
                                      taskId,
                                      commentId: c._id,
                                      replyId: r._id,
                                      reactionType: type
                                    })
                                  }
                                />

                                {(() => {
                                  const counts = replyReactionCounts(r);
                                  const total = counts.like + counts.love + counts.celebrate + counts.dislike;
                                  return total > 0 ? (
                                    <span style={{fontSize: '13px'}}>{total} reactions</span>
                                  ) : (
                                    <span className="noMetaText">No reactions</span>
                                  );
                                })()}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ✅ Pagination */}
      {pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
          isLoading={isPending}
        />
      )}
    </div>
  );
};

const ReplyBox = ({ commentId, onAdd }) => {
  return (
    <div className="cs-reply-box">
      <RichTextComment
        placeholder="Write a reply..."
        submitLabel="Reply"
        onSubmit={(text, attachments) => {
          onAdd(commentId, text, attachments);
        }}
      />
    </div>
  );
};

export default CommentSection;