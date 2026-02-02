import { useEffect, useState, useRef } from 'react';
import { useConversations, useMessages, useFollowing, useDeleteMessage } from '../../utils/useSocialFeatures';
import useAuthStore from '../../utils/authStore';
import Header from '../../components/header/Header';
// import { useSocket } from '../../utils/useSocket';
import { formatTime } from '../../utils/time';
import { AttachmentIcon, CheckMarkIcon, ClearIcon, DeleteIcon, DeleteIcon2 } from '../../utils/svgIcons';
import apiRequest from '../../utils/apiRequest';
import { useNotification } from '../../utils/useNotification';
import './messages.css'
import useOnlineUsersStore from '../../utils/onlineUsersStore';
import { useSocket } from '../../utils/SocketProvider';
import Avatar from '../../components/avatar/Avatar';

// ---------- MessageBubble Component ----------
const MessageBubble = ({ msg, isCurrentUser, isPending, onDelete, onUndo }) => {
  const isRead = msg.read === true;

  return (
    <div
      id={`message-${msg._id}`}
      style={{
        marginBottom: '15px',
        display: 'flex',
        justifyContent: isCurrentUser ? 'flex-end' : 'flex-start',
        alignItems: 'flex-end',
        gap: '5px',
        transition: 'background-color 0.3s ease' 
      }}
    >
      {/* Checkmarks for current user */}
      {isCurrentUser && (
        <div style={{ display: 'flex', alignItems: 'center', color: isRead ? '#535bf2' : 'initial' }}>
          {isPending ? <CheckMarkIcon size={12} /> : <><CheckMarkIcon size={12} /><CheckMarkIcon size={12} /></>}
        </div>
      )}

      {/* Message bubble */}
      <div
        style={{
          background: isCurrentUser ? '#535bf2' : '#f3f4f6',
          color: isCurrentUser ? 'white' : '#1f2937',
          padding: '10px 15px',
          borderRadius: '12px',
          maxWidth: '70%',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          gap: '5px',
        }}
      >
        {/* Text content */}
        {msg?.deleted ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <i>This message was deleted</i>
            
            {/* Show undo button only for sender */}
            {msg.canUndo && isCurrentUser && (
              <button
                onClick={() => onUndo(msg._id)}
                style={{
                  background: 'transparent',
                  border: '1px solid',
                  borderColor: isCurrentUser ? 'white' : '#1f2937',
                  color: isCurrentUser ? 'white' : '#1f2937',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Undo
              </button>
            )}
          </div>
        ) : (
          <span>{msg?.content}</span>
        )}


        {/* Attachments */}
        {!msg.deleted && msg.attachments?.length > 0 && (
          <>
          {msg.attachments?.map((att, idx) => (
            <div key={idx}>
              {att.type === 'image' && <img src={att.url} alt={att.filename} style={{ maxWidth: '200px', borderRadius: 8 }} />}
              {att.type === 'video' && <video src={att.url} controls style={{ maxWidth: '200px', borderRadius: 8 }} />}
              {att.type === 'file' && (
                <a href={att.url} target="_blank" rel="noopener noreferrer" style={{ color: isCurrentUser ? 'white' : '#1f2937' }}>
                  📄 {att.filename}
                </a>
              )}
            </div>
          ))}
          </>
      )}

        <span
          style={{
            position: 'absolute',
            bottom: '-8px',
            left: 0,
            fontSize: '8px',
            color: 'firebrick'
          }}
        >
          {formatTime(msg.createdAt)}
        </span>

           {/* Delete button for sender */}
      {isCurrentUser && !msg.deleted && (
        <div
          onClick={() => onDelete(msg._id)}
          style={{
            position: 'absolute',
            top: '-5px',
            right: '-5px',
            border: 'none',
            width: 18,
            height: 18,
            cursor: 'pointer'
          }}
        >
          <DeleteIcon2 color='red' size={15}/>
        </div>
      )}
      </div>

      {/* Checkmarks for other user */}
      {!isCurrentUser && (
        <div style={{ display: 'flex', alignItems: 'center', color: isRead ? '#535bf2' : 'initial' }}>
          {isPending ? <CheckMarkIcon size={12} /> : <><CheckMarkIcon size={12} /><CheckMarkIcon size={12} /></>}
        </div>
      )}
    </div>
  );
};

// ---------- ConversationItem Component ----------
const ConversationItem = ({ conv, isSelected, onlineUsers, onClick, isTyping }) => {
  const lastMsg = conv.lastMessage;
  
  // Determine preview text
  let preview = '';
  if (lastMsg) {
    // Handle deleted messages
    if (lastMsg.deleted) {
      preview = 'Message deleted';
    } else {
      const attachmentCount = lastMsg.attachments?.length || 0;

    if (lastMsg.content && attachmentCount > 0) {
      preview = `${lastMsg.content.slice(0, 30)}…`;
    } else if (lastMsg.content) {
      preview = lastMsg.content.slice(0, 30);
    } else if (attachmentCount > 0) {
      preview = `${attachmentCount} attachment${attachmentCount > 1 ? 's' : ''}`;
    }
  }
}

  return (
    <div
      key={conv._id}
      onClick={onClick}
      style={{
        padding: '15px',
        borderBottom: '1px solid #f3f4f6',
        cursor: 'pointer',
        background: isSelected ? '#f3f4f6' : 'white'
      }}
    >
      {isTyping && <span style={{ fontSize: '12px', color: '#6b7280', fontStyle: 'italic' }}>is typing...</span>}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Avatar
            image={conv.otherParticipant?.userImage}
            name={conv.otherParticipant?.displayName}
            isOnline={onlineUsers[conv.otherParticipant?._id]}
          />
          <div>
          <div style={{display: 'flex', flexDirection: 'column'}}>
          {conv.otherParticipant?.displayName}
          {
            onlineUsers[conv.otherParticipant?._id] ? (
              <span style={{fontSize: '10px', color: '#6b7280'}}> online now</span>
            ) : (
              <span style={{fontSize: '10px', color: '#6b7280'}}> last seen: {formatTime(conv.otherParticipant?.lastSeen)}</span>

            )
          }
          </div>
          </div>
        </div>

        {/* Last message preview */}
        <div style={{ fontSize: '0.875rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <div style={{display: 'flex', flexDirection: 'column'}}>
          {preview}
          <span style={{fontSize: '10px'}}>
          {formatTime(lastMsg?.createdAt)}
          </span>
          </div>
          {/* Show last message attachments thumbnails */}
          {lastMsg?.attachments?.slice(0, 2).map((att, idx) => (
            <div key={idx}>
              {att.type === 'image' && <img src={att.url} alt={att.filename} style={{ width: 20, height: 20, borderRadius: 4 }} />}
              {att.type === 'video' && <video src={att.url} style={{ width: 20, height: 20, borderRadius: 4 }} />}
              {att.type === 'file' && <span style={{ fontSize: 12 }}>📄</span>}
            </div>
          ))}
          {lastMsg?.attachments?.length > 2 && <span>+{lastMsg.attachments.length - 2}
          </span>}
        </div>
      </div>
    </div>
  );
};


// ---------- Main Messages2 Component ----------
const Messages2 = () => {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [newMessageRecipient, setNewMessageRecipient] = useState(null);
  // const [onlineUsers, setOnlineUsers] = useState({});
  const [attachments, setAttachments] = useState([]);
  const [localMessages, setLocalMessages] = useState([]);

  const { data: conversationsData } = useConversations();
  const { data: messagesData, isPending } = useMessages(selectedConversation?.conversationId || newMessageRecipient?.conversationId);
  const { data: followingData } = useFollowing(useAuthStore().user?._id);
  const { user } = useAuthStore();
  // const socketInstance = useSocket();
  const { showError } = useNotification();
  const [isUploading, setIsUploading] = useState(false);

  const [deletedMessages, setDeletedMessages] = useState(new Map()); // messageId

  const [isTyping, setIsTyping] = useState(false);
  const [usersTyping, setUsersTyping] = useState(new Map());
  const typingTimeoutRef = useRef(null);

  const deleteMessageMutation = useDeleteMessage();

  const conversations = conversationsData?.conversations || [];
  // const messages = messagesData?.messages || [];
  const followingUsers = followingData?.following || [];
  
  const messagesContainerRef = useRef(null);
  const messagesEndRef = useRef(null);

   const [newMessageNotification, setNewMessageNotification] = useState(null);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(true);

  // ✅ Get socket instance from context (no new connection)
  const socketInstance = useSocket();
  
  // ✅ Get onlineUsers from Zustand store
  const { onlineUsers } = useOnlineUsersStore();


  // Check if user is at bottom of messages
  const checkIfAtBottom = () => {
    const container = messagesContainerRef.current;
    if (!container) return true;
    const threshold = 100;
    return container.scrollHeight - container.scrollTop - container.clientHeight < threshold;
  };

  // Handle scroll
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      setHasScrolledToBottom(checkIfAtBottom());
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

   // Scroll to specific message
  const scrollToMessage = (messageId) => {
    const messageElement = document.getElementById(`message-${messageId}`);
    if (messageElement) {
      messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Highlight the message briefly
      messageElement.style.backgroundColor = '#fef3c7';
      setTimeout(() => {
        messageElement.style.backgroundColor = '';
      }, 2000);
    }
    setNewMessageNotification(null);
  };

  const scrollToBottom = () => {
    const container = messagesContainerRef.current;
    if (!container) return;
    const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;
    if (isNearBottom) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => { scrollToBottom(); }, [localMessages]);

// Single effect to handle message syncing
// Single effect to handle message syncing
useEffect(() => {
  if (!messagesData?.messages) return;
  
  setLocalMessages(prev => {
    // Track messages that have canUndo flag
    const canUndoMap = new Map(
      prev.filter(m => m.canUndo).map(m => [m._id, true])
    );
    
    // Merge server data while preserving canUndo flags
    return messagesData.messages.map(serverMsg => {
      if (canUndoMap.has(serverMsg._id)) {
        return { ...serverMsg, canUndo: true };
      }
      return serverMsg;
    });
  });
}, [messagesData]);


  // ---------- File attachment ----------
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setAttachments(prev => [...prev, ...files]);
  };

  const removeAttachment = (index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  // ---------- Send message ----------
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() && attachments.length === 0) return;

    setIsUploading(true);

    const recipientId = selectedConversation?.otherParticipant?._id || newMessageRecipient?._id;
     if (!recipientId) {
      console.error("❌ No recipientId found");
      showError("Cannot send message: recipient not found");
      return;
    }

    try {
      const formData = new FormData();
      formData.append('content', messageText);
      formData.append('recipientId', recipientId);
      attachments.forEach(file => formData.append('attachments', file));

      const response = await apiRequest.post('/messages/send', formData, {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });

      const data = response.data;
      if (!data.success) {
      console.error('Message failed:', data.message);
      showError(`Failed to send message: ${data.message}`);
      return;
    }

      socketInstance.emit("message:send", {
        recipientId,
        content: messageText,
        attachments: data.data.attachments,
        conversationId: selectedConversation?.conversationId || data.data.conversationId
      });

      setMessageText('');
      setAttachments([]);
      setIsUploading(false)
    } catch (error) {
      console.error('❌ Send message error:', error);
      showError('Failed to send message. Please try again.');
    }
  };

  // ---------- Toggle delete message ----------
  const handleDeleteMessage = (messageId) => {
    // Store original message for undo
    const originalMessage = localMessages.find(m => m._id === messageId);
    if (originalMessage && !originalMessage.deleted) {
      setDeletedMessages(prev => new Map(prev).set(messageId, originalMessage));
    }

    // Mark as deleted locally
    setLocalMessages(prev => prev.map(msg => 
      msg._id === messageId ? { ...msg, deleted: true, canUndo: true } : msg
    ));

    // Broadcast deletion to other users
    socketInstance.emit('message:deleted', { messageId, canUndo: true });

   // Actually delete from database
    deleteMessageMutation.mutate(messageId, {
      onError: () => {
        // Revert on error
        setLocalMessages(prev => prev.map(msg => 
          msg._id === messageId ? originalMessage : msg
        ));
        setDeletedMessages(prev => {
          const newMap = new Map(prev);
          newMap.delete(messageId);
          return newMap;
        });
        showError('Failed to delete message');
      }
    });
  };


  // ---------- Undo delete ----------
  const handleUndoDelete = (messageId) => {
    const originalMessage = deletedMessages.get(messageId);
    
    if (originalMessage) {
      // Restore message locally
      setLocalMessages(prev => prev.map(msg => 
        msg._id === messageId ? { ...originalMessage, canUndo: false } : msg
      ));

      // Remove from deleted messages map
      setDeletedMessages(prev => {
        const newMap = new Map(prev);
        newMap.delete(messageId);
        return newMap;
      });

      // Broadcast undo to other users
      socketInstance.emit('message:restored', { messageId, message: originalMessage });

      // Restore in database
      apiRequest.patch(`/messages/${messageId}/restore`)
        .then(() => {
          console.log('✅ Message restored');
        })
        .catch(error => {
          console.error('❌ Failed to restore message:', error);
          alert('Failed to restore message');
        });
    }
  };

  // ---------- Typing indicator ----------
  const handleInputChange = (e) => {
    setMessageText(e.target.value);

    const recipientId = selectedConversation?.otherParticipant?._id || newMessageRecipient?._id;
    if (!recipientId) return;

    // Emit typing event
    if (!isTyping) {
      setIsTyping(true);
      socketInstance.emit('user:typing', { 
        recipientId, 
        conversationId: selectedConversation?.conversationId 
      });
    }

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Stop typing after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      socketInstance.emit('user:stop-typing', { 
        recipientId, 
        conversationId: selectedConversation?.conversationId 
      });
    }, 2000);
  };



  // ---------- Socket listeners ----------

// Update socket listener for new messages
  useEffect(() => {
    if (!socketInstance) return;

    socketInstance.on('message:deleted', ({ messageId, canUndo }) => {
      setLocalMessages(prev => prev.map(msg => 
        msg._id === messageId ? { ...msg, deleted: true, canUndo } : msg
      ));
    });

    socketInstance.on('message:restored', ({ messageId, message }) => {
      setLocalMessages(prev => prev.map(msg => 
        msg._id === messageId ? { ...message, canUndo: false } : msg
      ));
    });

    socketInstance.on('message:received', (newMessage) => {
      if (newMessage.conversationId === selectedConversation?.conversationId) {
        setLocalMessages(prev => [...prev, newMessage]);
        
        // ✅ Show notification if user is not at bottom
        if (!checkIfAtBottom()) {
          setNewMessageNotification({
            messageId: newMessage._id,
            sender: newMessage.sender.displayName,
            preview: newMessage.content?.slice(0, 50) || 'Sent an attachment'
          });
        } else {
          // Auto-scroll if already at bottom
          setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }
        
        socketInstance.emit('message:read', { 
          messageId: newMessage._id, 
          conversationId: newMessage.conversationId 
        });
      }
    });

    socketInstance.on('user:typing', ({ conversationId }) => {
      setUsersTyping(prev => new Map(prev).set(conversationId, true));
    });

    socketInstance.on('user:stop-typing', ({ conversationId }) => {
      setUsersTyping(prev => new Map(prev).set(conversationId, false));
    });

    return () => {
      socketInstance.off('message:deleted');
      socketInstance.off('message:restored');
      socketInstance.off('message:received');
      socketInstance.off('user:typing');
      socketInstance.off('user:stop-typing');
    };
  }, [selectedConversation, socketInstance, hasScrolledToBottom]);


 // Clean up typing timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const activeConversation = selectedConversation || newMessageRecipient;

  const handleConversationClick = (conv) => {
  setSelectedConversation(conv);
  setLocalMessages([]); // Clear messages when switching conversations
};


  return (
    <>
      <Header />
      <div style={{ display: 'flex', height: 'calc(100vh - 60px)', padding: '40px' }}>

        {/* Conversations List */}
        <div style={{ width: '300px', borderRight: '1px solid #e5e7eb', overflowY: 'auto' }}>
          <div style={{ padding: '20px', borderBottom: '1px solid #e5e7eb' }}>
            <h2>Messages</h2>
          </div>
          {conversations.map((conv) => (
            <ConversationItem
              key={conv._id}
              conv={conv}
              isSelected={selectedConversation?._id === conv._id}
              onlineUsers={onlineUsers}
              isTyping={usersTyping.get(conv.conversationId)}
               onClick={() => handleConversationClick(conv)}
            />
          ))}
        </div>

        {/* Messages Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {/* Typing indicator */}
                {usersTyping.get(selectedConversation?.conversationId) && (
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    gap: '5px', 
                    color: '#6b7280',
                    fontSize: '14px',
                    marginLeft: '10px'
                  }}>
                    <span>{selectedConversation?.otherParticipant?.displayName || newMessageRecipient?.displayName} is typing</span>
                    <div style={{ display: 'flex', gap: '2px' }}>
                      <span style={{ animation: 'bounce 1.4s infinite' }}>.</span>
                      <span style={{ animation: 'bounce 1.4s infinite 0.2s' }}>.</span>
                      <span style={{ animation: 'bounce 1.4s infinite 0.4s' }}>.</span>
                    </div>
                  </div>
                )}

          {activeConversation ? (
            <>
              <div ref={messagesContainerRef} style={{ flex: 1, overflowY: 'auto', padding: '20px',}}>
                {localMessages.map(msg => (
                  <MessageBubble
                    key={msg._id}
                    msg={msg}
                    isCurrentUser={msg.sender?._id === user?._id}
                    isPending={isPending}
                    onDelete={handleDeleteMessage}
                    onUndo={handleUndoDelete}
                  />
                ))}

                  {/* ✅ New Message Notification Popup */}
                  {newMessageNotification && (
                    <div
                      onClick={() => scrollToMessage(newMessageNotification.messageId)}
                      style={{
                        position: 'fixed', // Changed from absolute to fixed
                        top: '100px', // Position at top instead of bottom
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: '#535bf2',
                        color: 'white',
                        padding: '12px 20px',
                        borderRadius: '25px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        zIndex: 10000,
                        animation: 'slideUp 0.3s ease',
                        maxWidth: '80%'
                      }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <strong style={{ fontSize: '14px' }}>New message from {newMessageNotification.sender}</strong>
                        <span style={{ fontSize: '12px', opacity: 0.9 }}>{newMessageNotification.preview}</span>
                      </div>
                      <span style={{ fontSize: '20px' }}>↓</span>
                    </div>
                  )}

                <div ref={messagesEndRef} />
              </div>

              {/* Send Message */}
              <form onSubmit={handleSendMessage} style={{ padding: '20px', borderTop: '1px solid #e5e7eb' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {/* Attachments Preview */}
                  {attachments.length > 0 && (
                    <div style={{ display: 'flex', gap: '10px', overflowX: 'auto' }}>
                      {attachments.map((file, index) => (
                        <div key={index} style={{ position: 'relative' }}>
                          {file.type.startsWith('image/') && (
                            <img src={URL.createObjectURL(file)} alt={file.name} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8 }} />
                          )}
                          {file.type.startsWith('video/') && (
                            <video src={URL.createObjectURL(file)} style={{ width: 60, height: 60, borderRadius: 8 }} />
                          )}
                          {!file.type.startsWith('image/') && !file.type.startsWith('video/') && (
                            <div style={{ width: 60, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f3f4f6', borderRadius: 8 }}>
                              📄
                            </div>
                          )}
                          <div type="button" onClick={() => removeAttachment(index)} style={{ position: 'absolute', top: -5, right: -12,
                             borderRadius: '50%', width: 18, height: 18, cursor: 'pointer' }}>
                            <ClearIcon color='red' size={20}/>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input
                      type="text"
                      value={messageText}
                      onChange={handleInputChange}
                      placeholder="Type a message..."
                      style={{ flex: 1, padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                    />
                    <input type="file" multiple onChange={handleFileChange} style={{ display: 'none' }} id="file-input" />
                    <label htmlFor="file-input" style={{ padding: '12px', background: '#e5e7eb', borderRadius: '8px', cursor: 'pointer' }}><AttachmentIcon size={19}/></label>
                    <button type="submit" disabled={!messageText.trim() && attachments.length === 0} style={{ padding: '12px 24px', background: '#535bf2', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                     {isUploading ? 'Sending...' : 'Send'}
                    </button>
                  </div>
                </div>
              </form>
            </>
          ) : conversations.length === 0 ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
              <p style={{ color: '#9ca3af', marginBottom: '30px' }}>No conversations yet. Start messaging someone!</p>
              {followingUsers.length > 0 && (
                <div style={{ width: '100%', maxWidth: '300px' }}>
                  <h3 style={{ marginBottom: '15px' }}>Message someone you follow</h3>
                  {followingUsers?.map(user => (
                    <div key={user._id} onClick={() => setNewMessageRecipient(user)} style={{ padding: '12px', marginBottom: '8px', background: '#f3f4f6', borderRadius: '8px', cursor: 'pointer' }}>
                      {user?.userImage ? (
                        <div style={{ display: 'flex', gap:'5px', alignItems: 'center' }}>
                          <img src={user.userImage} alt={user.firstName} style={{ width: '30px', height: '30px', borderRadius:'50%' }}/>
                          <div>
                            <p>{user.displayName}</p>
                            <span style={{ fontSize: '12px', fontStyle: 'italic', color: '#555' }}>{user?.jobTitle}</span>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <p>{user.displayName}</p>
                          <span style={{ fontSize: '12px', fontStyle: 'italic', color: '#555' }}>{user?.jobTitle}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>
              Select a conversation to start messaging
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Messages2;
