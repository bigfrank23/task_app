// utils/onlineUsersStore.js
import { create } from 'zustand';

const useOnlineUsersStore = create((set) => ({
  onlineUsers: {},
  
  setOnlineUsers: (users) => set({ onlineUsers: users }),
  
  updateUserStatus: (userId, isOnline) => 
    set((state) => ({
      onlineUsers: { ...state.onlineUsers, [userId]: isOnline }
    })),
  
  setMultipleOnline: (userIds) => 
    set(() => {
      const onlineUsersMap = {};
      userIds.forEach(id => {
        onlineUsersMap[id] = true;
      });
      return { onlineUsers: onlineUsersMap };
    }),
  
  isUserOnline: (userId) => (state) => state.onlineUsers[userId] || false,
}));

export default useOnlineUsersStore;