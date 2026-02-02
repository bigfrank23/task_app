import { useEffect, useState, useRef } from 'react';
import { useConversations, useMessages, useFollowing, useSendMessage, useDeleteMessage } from '../../utils/useSocialFeatures';
import useAuthStore from '../../utils/authStore';
import { useSocket } from '../../utils/useSocket';
import { formatTime } from '../../utils/time';
import { CheckMarkIcon } from '../../utils/svgIcons';
import apiRequest from '../../utils/apiRequest';
import Header from '../../components/header/Header';

// ---------- MessageBubble Component ----------
const MessageBubble = ({ msg, isCurrentUser, isPending, onDelete }) => (
  <div
    style={{
      marginBottom: '15px',
      display: 'flex',
      justifyContent: isCurrentUser ? 'flex-end' : 'flex-start',
      alignItems: 'flex-end',
      gap: '5px',
      position: 'relative'
    }}
  >
    <div
      style={{
        background: isCurrentUser ? '#535bf2' : '#f3f4f6',
        color: isCurrentUser ? 'white' : '#1f2937',
        padding: '10px 15px',
        borderRadius: '12px',
        maxWidth: '70%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {msg.deleted ? <i>This message was deleted</i> : msg.content}

      {/* Attachments */}
      {!msg.deleted && msg.attachments?.length > 0 && (
        <div style={{ display: 'flex', gap: '5px', marginTop: '5px' }}>
          {msg.attachments.map((att, idx) => (
            <div key={idx}>
              {att.type === 'image' && (
                <img
                  src={att.url}
                  alt={att.filename}
                  style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 4 }}
                />
              )}
              {att.type === 'video' && (
                <video src={att.url} style={{ width: 60, height: 60, borderRadius: 4 }} />
              )}
              {att.type === 'file' && <span>📄</span>}
            </div>
          ))}
        </div>
      )}

      <span style={{ fontSize: '8px', color: 'firebrick', marginTop: '5px' }}>
        {formatTime(msg.createdAt)}
      </span>

      {/* Delete button for sender */}
      {isCurrentUser && !msg.deleted && (
        <button
          onClick={() => onDelete(msg._id)}
          style={{
            position: 'absolute',
            top: '-5px',
            right: '-5px',
            background: 'red',
            color: 'white',
            borderRadius: '50%',
            border: 'none',
            width: 18,
            height: 18,
            cursor: 'pointer'
          }}
        >
          ×
        </button>
      )}
    </div>
  </div>
);

// ---------- ConversationItem Component ----------
const ConversationItem = ({ conv, isSelected, onlineUsers, onClick }) => (
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
    <div style={{ fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
      {conv.otherParticipant?.displayName}
      <div
        style={{
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          background: onlineUsers[conv.otherParticipant?._id] ? '#10b981' : '#6b7280'
        }}
      />
    </div>
    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
      {conv.lastMessage?.deleted ? 'This message was deleted' : conv.lastMessage?.content}
    </div>
  </div>
);

// ---------- Messages2 Component ----------
const Messages3 = () => {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [newMessageRecipient, setNewMessageRecipient] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState({});
  const [attachments, setAttachments] = useState([]);
  const [localMessages, setLocalMessages] = useState([]);
  const [localConversations, setLocalConversations] = useState([]);

  const { data: conversationsData } = useConversations();
  const { data: messagesData, isPending } = useMessages(
    selectedConversation?.conversationId || newMessageRecipient?.conversationId
  );
  const { data: followingData } = useFollowing(useAuthStore().user?._id);
  const sendMessageMutation = useSendMessage();
  const deleteMessageMutation = useDeleteMessage();
  const { user } = useAuthStore();
  const socketInstance = useSocket();

  const conversations = conversationsData?.conversations || [];
  const messages = messagesData?.messages || [];
  const followingUsers = followingData?.following || [];

  const messagesContainerRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    const container = messagesContainerRef.current;
    if (!container) return;
    const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;
    if (isNearBottom) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Merge server conversations/messages with local updates
  useEffect(() => {
    setLocalMessages(messages);
    setLocalConversations(conversations);
    scrollToBottom();
  }, [messages, conversations]);

  useEffect(() => {
    const handleStatusUpdate = (e) => {
      const { userId, isOnline } = e.detail;
      setOnlineUsers(prev => ({ ...prev, [userId]: isOnline }));
    };
    window.addEventListener('userStatusUpdate', handleStatusUpdate);
    return () => window.removeEventListener('userStatusUpdate', handleStatusUpdate);
  }, []);

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

    const recipientId = selectedConversation?.otherParticipant?._id || newMessageRecipient?._id;
    if (!recipientId) return console.error("❌ No recipientId found");

    try {
      const formData = new FormData();
      formData.append('content', messageText);
      formData.append('recipientId', recipientId);
      attachments.forEach(file => formData.append('attachments', file));

      const response = await apiRequest.post('/messages/send', formData, {
        headers: { Authorization: `Bearer ${user.token}` }
      });

      const data = response.data;
      if (!data.success) return console.error('Message failed:', data.message);

      // Emit new message via socket
      socketInstance.emit("message:send", {
        recipientId,
        content: messageText,
        attachments: data.data.attachments,
        conversationId: selectedConversation?.conversationId || data.data.conversationId
      });

      setMessageText('');
      setAttachments([]);
    } catch (error) {
      console.error('❌ Send message error:', error);
    }
  };

  // ---------- Delete message ----------
  const handleDeleteMessage = (messageId) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      deleteMessageMutation.mutate(messageId, {
        onSuccess: () => {
          // Update local messages
          setLocalMessages(prev => prev.map(msg => msg._id === messageId ? { ...msg, deleted: true } : msg));
          socketInstance.emit('message:deleted', { messageId });
        }
      });
    }
  };

  // ---------- Socket listeners ----------
  useEffect(() => {
    socketInstance.on('message:deleted', ({ messageId }) => {
      setLocalMessages(prev => prev.map(msg => msg._id === messageId ? { ...msg, deleted: true } : msg));
      // Update conversation preview if last message deleted
      setLocalConversations(prev =>
        prev.map(conv => conv.lastMessage?._id === messageId
          ? { ...conv, lastMessage: { ...conv.lastMessage, deleted: true } }
          : conv
        )
      );
    });

    socketInstance.on('message:received', (newMessage) => {
      setLocalMessages(prev => [...prev, newMessage]);

      // Update conversation preview
      setLocalConversations(prev => {
        const existing = prev.find(c => c.conversationId === newMessage.conversationId);
        if (existing) {
          return prev.map(c => c.conversationId === newMessage.conversationId
            ? { ...c, lastMessage: newMessage }
            : c
          );
        } else {
          // Add new conversation if it doesn't exist
          return [{ 
            _id: newMessage.conversationId,
            conversationId: newMessage.conversationId,
            otherParticipant: newMessage.sender._id === user._id ? newMessage.recipient : newMessage.sender,
            lastMessage: newMessage
          }, ...prev];
        }
      });
    });

    return () => {
      socketInstance.off('message:deleted');
      socketInstance.off('message:received');
    };
  }, [socketInstance, user._id]);

  const activeConversation = selectedConversation || newMessageRecipient;

  return (
    <>
      <Header />
      <div style={{ display: 'flex', height: 'calc(100vh - 60px)', padding: '40px' }}>
        {/* Conversations List */}
        <div style={{ width: '300px', borderRight: '1px solid #e5e7eb', overflowY: 'auto' }}>
          <div style={{ padding: '20px', borderBottom: '1px solid #e5e7eb' }}>
            <h2>Messages</h2>
          </div>
          {localConversations.map((conv) => (
            <ConversationItem
              key={conv._id}
              conv={conv}
              isSelected={selectedConversation?._id === conv._id}
              onlineUsers={onlineUsers}
              onClick={() => setSelectedConversation(conv)}
            />
          ))}
        </div>

        {/* Messages Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {activeConversation ? (
            <>
              <div ref={messagesContainerRef} style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
                {localMessages.map((msg) => (
                  <MessageBubble
                    key={msg._id}
                    msg={msg}
                    isCurrentUser={msg.sender?._id === user?._id}
                    isPending={isPending}
                    onDelete={handleDeleteMessage}
                  />
                ))}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={handleSendMessage} style={{ padding: '20px', borderTop: '1px solid #e5e7eb' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
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
                            <div style={{ width: 60, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f3f4f6', borderRadius: 8 }}>📄</div>
                          )}
                          <button type="button" onClick={() => removeAttachment(index)} style={{ position: 'absolute', top: -5, right: -5, background: 'red', color: 'white', borderRadius: '50%', width: 18, height: 18 }}>×</button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input
                      type="text"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      placeholder="Type a message..."
                      style={{ flex: 1, padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                    />
                    <input type="file" multiple onChange={handleFileChange} style={{ display: 'none' }} id="file-input" />
                    <label htmlFor="file-input" style={{ padding: '12px', background: '#e5e7eb', borderRadius: '8px', cursor: 'pointer' }}>📎</label>
                    <button type="submit" disabled={!messageText.trim() && attachments.length === 0} style={{ padding: '12px 24px', background: '#535bf2', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Send</button>
                  </div>
                </div>
              </form>
            </>
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

export default Messages3;
