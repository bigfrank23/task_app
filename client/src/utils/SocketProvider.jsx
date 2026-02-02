// utils/SocketProvider.jsx
import { createContext, useContext, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import useAuthStore from './authStore';
import useOnlineUsersStore from './onlineUsersStore';

const SocketContext = createContext(null);


export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);
  const { user } = useAuthStore();
  const { setMultipleOnline, updateUserStatus } = useOnlineUsersStore();
  

  useEffect(() => {
    if (!user?._id) {
      if (socketRef.current) {
        console.log('👤 User logged out, disconnecting socket...');
        socketRef.current.emit('user:offline', { userId: user?._id });
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      return;
    }

    if (!socketRef.current) {
      console.log('🔌 Initializing socket connection for user:', user._id);
      
      const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

      console.log('🔍 Socket config:', {
  url: SOCKET_URL,
  transports: ['polling', 'websocket'],
  userId: user._id
});
      
      socketRef.current = io(SOCKET_URL, {
        query: { userId: user._id },
        transports: ['polling', 'websocket'], // ✅ Try polling first, then upgrade
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 10,
        timeout: 20000,
        autoConnect: true,
        forceNew: false,
        upgrade: true, // ✅ Allow upgrade from polling to websocket
        rememberUpgrade: true,
        withCredentials: true // ✅ Important for CORS
      });

      socketRef.current.on('connect', () => {
        console.log('✅ Socket connected successfully with ID:', socketRef.current.id);
        socketRef.current.emit('user:online', { userId: user._id });
      });

      socketRef.current.on('reconnect', (attemptNumber) => {
        console.log(`✅ Socket reconnected after ${attemptNumber} attempts`);
        socketRef.current.emit('user:online', { userId: user._id });
      });

      socketRef.current.on('reconnect_attempt', (attemptNumber) => {
        console.log(`🔄 Reconnection attempt ${attemptNumber}...`);
      });

      socketRef.current.on('reconnect_error', (error) => {
        console.error('❌ Reconnection error:', error.message);
      });

      socketRef.current.on('reconnect_failed', () => {
        console.error('❌ Reconnection failed after all attempts');
      });

      socketRef.current.on('online:users', ({ userIds }) => {
        console.log('📋 Received online users:', userIds.length);
        setMultipleOnline(userIds);
      });

      socketRef.current.on('user:status', ({ userId, isOnline }) => {
        console.log(`👤 User status: ${userId} → ${isOnline ? '🟢 online' : '⚪ offline'}`);
        updateUserStatus(userId, isOnline);
      });

      socketRef.current.on('disconnect', (reason) => {
        console.log('❌ Socket disconnected. Reason:', reason);
        if (reason === 'io server disconnect') {
          // Server disconnected, manually reconnect
          socketRef.current.connect();
        }
      });

      socketRef.current.on('connect_error', (error) => {
        console.error('❌ Socket connection error:', error.message);
        console.log('🔄 Trying to connect with polling transport...');
      });

      socketRef.current.on('error', (error) => {
        console.error('❌ Socket error:', error);
      });
    }

    const handleBeforeUnload = () => {
      if (socketRef.current) {
        socketRef.current.emit('user:offline', { userId: user._id });
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [user?._id, setMultipleOnline, updateUserStatus]);

  useEffect(() => {
    return () => {
      if (socketRef.current) {
        console.log('🧹 Cleaning up socket connection...');
        socketRef.current.emit('user:offline', { userId: user?._id });
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [user?._id]);

  return (
    <SocketContext.Provider value={socketRef.current}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const socket = useContext(SocketContext);
  return socket;
};