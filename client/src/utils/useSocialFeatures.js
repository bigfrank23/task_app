// =====================================
// utils/useSocialFeatures.js
// =====================================

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiRequest from "./apiRequest";

// ==================== FOLLOW HOOKS ====================

// Follow a user
export const useFollowUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId) => {
      const { data } = await apiRequest.post(`/follow/${userId}/follow`);
      return data;
    },
    onSuccess: (data, userId) => {
      queryClient.invalidateQueries(['userProfile', userId]);
      queryClient.invalidateQueries(['followStatus', userId]);
      queryClient.invalidateQueries(['suggestedUsers']);
      console.log('✅ Followed user successfully');
    },
    onError: (error) => {
      console.error('Follow error:', error);
    }
  });
};

// Unfollow a user
export const useUnfollowUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId) => {
      const { data } = await apiRequest.delete(`/follow/${userId}/unfollow`);
      return data;
    },
    onSuccess: (data, userId) => {
      queryClient.invalidateQueries(['userProfile', userId]);
      queryClient.invalidateQueries(['followStatus', userId]);
      console.log('✅ Unfollowed user successfully');
    },
    onError: (error) => {
      console.error('Unfollow error:', error);
    }
  });
};

// Get follow status
export const useFollowStatus = (userId) => {
  return useQuery({
    queryKey: ['followStatus', userId],
    queryFn: async () => {
      if (!userId) return { isFollowing: false };
      const { data } = await apiRequest.get(`/follow/${userId}/follow-status`);
      return data.data;
    },
    enabled: !!userId,
    staleTime: 60000
  });
};

// Get followers
export const useFollowers = (userId, page = 1) => {
  return useQuery({
    queryKey: ['followers', userId, page],
    queryFn: async () => {
      const { data } = await apiRequest.get(`/follow/${userId}/followers?page=${page}`);
      return data.data;
    },
    enabled: !!userId,
    keepPreviousData: true
  });
};

// Get following
export const useFollowing = (userId, page = 1) => {
  return useQuery({
    queryKey: ['following', userId, page],
    queryFn: async () => {
      const { data } = await apiRequest.get(`/follow/${userId}/following?page=${page}`);
      return data.data;
    },
    enabled: !!userId,
    keepPreviousData: true
  });
};

// Get suggested users
export const useSuggestedUsers = (limit = 5) => {
  return useQuery({
    queryKey: ['suggestedUsers', limit],
    queryFn: async () => {
      const { data } = await apiRequest.get(`/follow/suggestions?limit=${limit}`);
      return data.data;
    },
    staleTime: 300000 // 5 minutes
  });
};

// Get connections for current user
export const useConnections = () => {
  return useQuery({
    queryKey: ['connections'],
    queryFn: async () => {
      const { data } = await apiRequest.get('/follow/users/me/connections');
      return data.data;
    }
  });
};

// Get connections for any user by ID
export const useUserConnections = (userId) => {
  return useQuery({
    queryKey: ['connections', userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data } = await apiRequest.get(`/follow/users/${userId}/connections`);
      return data.data;
    },
    enabled: !!userId
  });
};

// ==================== MESSAGE HOOKS ====================

// Send message
export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ recipientId, content }) => {
      const { data } = await apiRequest.post('/messages/send', {
        recipientId,
        content
      });
      return data.data;
    },
    onSuccess: (message) => {
      queryClient.invalidateQueries(['conversations']);
      queryClient.invalidateQueries(['messages', message.conversationId]);
      queryClient.invalidateQueries(['unreadMessages']);
      console.log('✅ Message sent');
    },
    onError: (error) => {
      console.error('Send message error:', error);
    }
  });
};

// Get conversations
export const useConversations = (page = 1) => {
  return useQuery({
    queryKey: ['conversations', page],
    queryFn: async () => {
      const { data } = await apiRequest.get(`/messages/conversations?page=${page}`);
      return data.data;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
    keepPreviousData: true
  });
};

// Get messages in conversation
export const useMessages = (conversationId, page = 1) => {
  return useQuery({
    queryKey: ['messages', conversationId, page],
    queryFn: async () => {
      if (!conversationId) return { messages: [], pagination: {} };
      const { data } = await apiRequest.get(`/messages/conversations/${conversationId}?page=${page}`);
      return data.data;
    },
    enabled: !!conversationId,
    refetchInterval: 5000, // Refetch every 5 seconds for real-time feel
    keepPreviousData: true
  });
};

// Mark conversation as read
export const useMarkConversationRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (conversationId) => {
      const { data } = await apiRequest.patch(`/messages/conversations/${conversationId}/read`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['conversations']);
      queryClient.invalidateQueries(['unreadMessages']);
    }
  });
};

// Get unread message count
export const useUnreadMessageCount = () => {
  return useQuery({
    queryKey: ['unreadMessages'],
    queryFn: async () => {
      const { data } = await apiRequest.get('/messages/unread-count');
      return data.data.unreadCount;
    },
    refetchInterval: 30000, // Check every 30 seconds
    staleTime: 10000
  });
};

// Delete message
// export const useDeleteMessage = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async (messageId) => {
//       const { data } = await apiRequest.delete(`/messages/${messageId}`);
//       return data;
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries(['messages']);
//       queryClient.invalidateQueries(['conversations']);
//     }
//   });
// };

// In your useDeleteMessage hook - REMOVE the invalidation
export const useDeleteMessage = () => {
  return useMutation({
    mutationFn: async (messageId) => {
      const { data } = await apiRequest.delete(`/messages/${messageId}`);
      return data;
    }
    // Remove onSuccess with invalidateQueries
  });
};


// export const useDeleteMessage = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async (messageId) => {
//       const { data } = await apiRequest.delete(`/messages/${messageId}`);
//       return data;
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries(['messages']);
//       queryClient.invalidateQueries(['conversations']);
//     }
//   });
// };

// ==================== NOTIFICATION HOOKS ====================

// Get notifications
export const useNotifications = (page = 1, unreadOnly = false) => {
  return useQuery({
    queryKey: ['notifications', page, unreadOnly],
    queryFn: async () => {
      const { data } = await apiRequest.get(
        `/notifications?page=${page}&unreadOnly=${unreadOnly}`
      );
      return data.data;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
    keepPreviousData: true, //Polling
    staleTime: 15000, //Prevent unnecessary refresh
  });
};

// Get unread notification count
export const useUnreadNotificationCount = () => {
  return useQuery({
    queryKey: ['unreadNotifications'],
    queryFn: async () => {
      const { data } = await apiRequest.get('/notifications/unread-count');
      return data.data.unreadCount;
    },
    refetchInterval: 30000, // Check every 30 seconds
    staleTime: 10000
  });
};

// Mark notification as read
export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId) => {
      const { data } = await apiRequest.patch(`/notifications/${notificationId}/read`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications']);
      queryClient.invalidateQueries(['unreadNotifications']);
    }
  });
};

// Mark all notifications as read
export const useMarkAllNotificationsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data } = await apiRequest.patch('/notifications/mark-all-read');
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications']);
      queryClient.invalidateQueries(['unreadNotifications']);
      console.log('✅ All notifications marked as read');
    }
  });
};

// Delete notification
export const useDeleteNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId) => {
      const { data } = await apiRequest.delete(`/notifications/${notificationId}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications']);
      queryClient.invalidateQueries(['unreadNotifications']);
    }
  });
};

// Update notification settings
export const useUpdateNotificationSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settings) => {
      const { data } = await apiRequest.patch('/notifications/settings', settings);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['myProfile']);
      console.log('✅ Notification settings updated');
    }
  });
};


