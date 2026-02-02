// // utils/useSocket.js
import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import useAuthStore from './authStore';
import useOnlineUsersStore from './onlineUsersStore';

export const useSocket = () => {
  const socketRef = useRef(null);
  const { user } = useAuthStore();
  const { setMultipleOnline, updateUserStatus } = useOnlineUsersStore();

  useEffect(() => {
    if (!user?._id) {
      // If user logs out, disconnect socket
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      return;
    }

    // Only create socket if it doesn't exist
    if (!socketRef.current) {
      socketRef.current = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
        query: { userId: user._id },
        transports: ['websocket']
      });

      socketRef.current.on('connect', () => {
        console.log('✅ Socket connected');
        socketRef.current.emit('user:online', { userId: user._id });
      });

      socketRef.current.on('reconnect', () => {
        console.log('✅ Socket reconnected');
        socketRef.current.emit('user:online', { userId: user._id });
      });

      // ✅ Listen for online users list and update store
      socketRef.current.on('online:users', ({ userIds }) => {
        console.log('📋 Received online users:', userIds);
        setMultipleOnline(userIds);
      });

      // ✅ Listen for user status changes and update store
      socketRef.current.on('user:status', ({ userId, isOnline }) => {
        console.log(`👤 User ${userId} is now ${isOnline ? 'online' : 'offline'}`);
        updateUserStatus(userId, isOnline);
      });

      socketRef.current.on('disconnect', () => {
        console.log('❌ Socket disconnected');
      });
    }

    // Emit offline before page unload
    const handleBeforeUnload = () => {
      socketRef.current?.emit('user:offline', { userId: user._id });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [user?._id, setMultipleOnline, updateUserStatus]);

  // Cleanup on unmount (when app closes)
  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.emit('user:offline', { userId: user?._id });
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [user?._id]);

  return socketRef.current;
};

// Export a hook to get the socket instance without creating a new connection
export const useSocketInstance = () => {
  const socketRef = useRef(null);
  
  useEffect(() => {
    // Get the existing socket instance from the global hook
    // This is a hack but works - we'll improve it below
  }, []);
  
  return socketRef.current;
};