import { useEffect, useRef, useState } from 'react';
import { useConversations, useMessages, useSendMessage, useFollowing } from '../../utils/useSocialFeatures';
import useAuthStore from '../../utils/authStore';
import Header from '../../components/header/Header';
import { useSocket } from '../../utils/useSocket';
import socket from '../../utils/socket';
import { formatTime } from '../../utils/time';
import { CheckMarkIcon } from '../../utils/svgIcons';

const Messages = () => {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [newMessageRecipient, setNewMessageRecipient] = useState(null);

  const [onlineUsers, setOnlineUsers] = useState({}); // track online status

  const { data: conversationsData, isLoading: conversationsLoading } = useConversations();
  const { data: messagesData, isPending } = useMessages(selectedConversation?.conversationId || newMessageRecipient?.conversationId);
  const { data: followingData } = useFollowing(useAuthStore().user?._id);
  const sendMessageMutation = useSendMessage();

   const { user } = useAuthStore();

   const messagesEndRef = useRef(null);

  console.log('Conversations Data:', conversationsData);
  
  const conversations = conversationsData?.conversations || [];
  const messages = messagesData?.messages || [];
  const followingUsers = followingData?.following || [];

// In Messages component
const socketInstance = useSocket(); // Get socket instance

   // Listen for online/offline updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

    const handleStatusUpdate = (e) => {
      const { userId, isOnline } = e.detail;
      setOnlineUsers(prev => ({ ...prev, [userId]: isOnline }));
    };

    window.addEventListener('userStatusUpdate', handleStatusUpdate);
    return () => window.removeEventListener('userStatusUpdate', handleStatusUpdate);
  }, [messages]);

  // const handleSendMessage = async (e) => {
  //   e.preventDefault();
  //   if (!messageText.trim()) return;

  //   const recipientId = (selectedConversation || newMessageRecipient)?._id || 
  //                      (selectedConversation || newMessageRecipient)?.otherParticipant?._id;
  //   // console.log("Sending to:", recipientId);

  //   if (!recipientId) return;

  //   await sendMessageMutation.mutateAsync({
  //     recipientId,
  //     content: messageText
  //   });

  //   setMessageText('');
  //   setNewMessageRecipient(null);
  // };

  const handleSendMessage = async (e) => {
  e.preventDefault();
  if (!messageText.trim()) return;

  let recipientId = null;

  // Case 1: Existing conversation
  if (selectedConversation?.otherParticipant?._id) {
    recipientId = selectedConversation.otherParticipant._id;
  }

  // Case 2: New message
  if (newMessageRecipient?._id) {
    recipientId = newMessageRecipient._id;
  }

  if (!recipientId) {
    console.error("❌ No recipientId found");
    return;
  }

  await sendMessageMutation.mutateAsync({
    recipientId,
    content: messageText
  });

  // emit socket event
socketInstance.emit("message:send", { recipientId, content: messageText });

  setMessageText('');
};


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
          {conversations.map((conv) => (
            <div
              key={conv._id}
              onClick={() => setSelectedConversation(conv)}
              style={{
                padding: '15px',
                borderBottom: '1px solid #f3f4f6',
                cursor: 'pointer',
                background: selectedConversation?._id === conv._id ? '#f3f4f6' : 'white'
              }}
            >
               <div style={{ fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                {conv.otherParticipant?.displayName}
                <div style={{
                  width: '10px', 
                  height: '10px', 
                  borderRadius: '50%',
                  background: onlineUsers[conv.otherParticipant?._id] ? '#10b981' : '#6b7280'
                }} />
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                {conv.lastMessage?.content}
              </div>
            </div>
          ))}
        </div>

        {/* Messages Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {activeConversation ? (
            <>
              {/* Messages */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
                {messages.map((msg) => (
                  <div
                    key={msg._id}
                    style={{
                      marginBottom: '15px',
                      display: 'flex',
                      justifyContent: msg.sender._id === user._id ? 'flex-end' : 'flex-start'
                    }}
                  >
                    {
                      msg.sender._id == user._id &&
                      <div style={{display: 'flex', alignItems: 'center', color: msg?.read === true ? '#535bf2' : 'initial'}}>
                        {isPending ? <CheckMarkIcon size={12}/> : <><CheckMarkIcon size={12}/><CheckMarkIcon size={12}/></>}
                        </div>
                    }
                    <div
                      style={{
                        background: msg.sender._id === user._id ? '#535bf2' : '#f3f4f6',
                        color: msg.sender._id === user._id ? 'white' : '#1f2937',
                        padding: '10px 15px',
                        borderRadius: '12px',
                        maxWidth: '70%',
                        // my styles
                        display: 'flex',
                        flexDirection: 'column',
                        position: 'relative'
                      }}
                      >
                      {msg.content}
                      <span style={{position: 'absolute', bottom: '-8px', color: 'firebrick', fontSize: '8px', width: 'max-content',
                       left: 0
                      }}>{formatTime(msg.createdAt)}</span>
                    </div>
                    {
                      msg.sender._id !== user._id &&
                      <div style={{display: 'flex', alignItems: 'center', color: msg?.read === true ? '#535bf2' : 'initial'}}>
                        {isPending ? <CheckMarkIcon size={12}/> : <><CheckMarkIcon size={12}/><CheckMarkIcon size={12}/></>}
                      </div>
                    }
                  </div>
                ))}
                  {/* Auto-scroll target */}
                  <div ref={messagesEndRef} />
              </div>

              {/* Send Message */}
              <form onSubmit={handleSendMessage} style={{ padding: '20px', borderTop: '1px solid #e5e7eb' }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input
                    type="text"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Type a message..."
                    style={{
                      flex: 1,
                      padding: '12px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                  />
                  <button
                    type="submit"
                    disabled={!messageText.trim() || sendMessageMutation.isPending}
                    style={{
                      padding: '12px 24px',
                      background: '#535bf2',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                  >
                    Send
                  </button>
                </div>
              </form>
            </>
          ) : conversations.length === 0 ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
              <p style={{ color: '#9ca3af', marginBottom: '30px' }}>No conversations yet. Start messaging someone!</p>
              {followingUsers.length > 0 ? (
                <div style={{ width: '100%', maxWidth: '300px' }}>
                  <h3 style={{ marginBottom: '15px' }}>Message someone you follow</h3>
                  {followingUsers.map((user) => (
                    <div
                      key={user._id}
                      onClick={() => setNewMessageRecipient(user)}
                      style={{
                        padding: '12px',
                        marginBottom: '8px',
                        background: '#f3f4f6',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'background 0.2s'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.background = '#e5e7eb'}
                      onMouseOut={(e) => e.currentTarget.style.background = '#f3f4f6'}
                    >
                      {
                        user?.userImage ? (
                        <div style={{display: 'flex', gap:'5px', alignItems: 'center'}}>
                          <img src={user?.userImage} alt={user?.firstName} style={{width: '30px', height: '30px', borderRadius:'50%'}}/>
                          <div>
                          <p>{user.displayName}</p>
                          <span style={{fontSize: '12px', fontStyle: 'italic', color: '#555'}}>{user?.jobTitle}</span>
                          </div>
                        </div>
                        ):(
                        <div>
                          <p>{user.displayName}</p>
                          <span style={{fontSize: '12px', fontStyle: 'italic', color: '#555'}}>{user?.jobTitle}</span>
                        </div>
                        )
                      }
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: '#9ca3af' }}>Follow users first to start messaging</p>
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

export default Messages;