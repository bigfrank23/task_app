// utils/useSocialInteractions.js
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiRequest from './apiRequest';

// utils/useSocialInteractions.js

export const useToggleReaction = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ taskId, reactionType }) => {
      const { data } = await apiRequest.post(`/socials/tasks/${taskId}/react`, {
        reactionType
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks']);
    }
  });
};

export const useAddComment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ taskId, text, attachments }) => {
      const formData = new FormData();
      
      // ✅ Add text
      formData.append('text', text || '');
      
      // ✅ Add files individually (NOT as array string)
      if (attachments && attachments.length > 0) {
        attachments.forEach(file => {
          formData.append('attachments', file); // Each file separately
        });
      }

      const { data } = await apiRequest.post(
        `/socials/tasks/${taskId}/comments`,
        formData,
        {
          headers: { 
            'Content-Type': 'multipart/form-data' 
          }
        }
      );
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['tasks']);
      queryClient.invalidateQueries(['comments', variables.taskId]);
    }
  });
};

export const useAddReply = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ taskId, commentId, text, attachments }) => {
      const formData = new FormData();
      
      // ✅ Add text
      formData.append('text', text || '');
      
      // ✅ Add files individually
      if (attachments && attachments.length > 0) {
        attachments.forEach(file => {
          formData.append('attachments', file);
        });
      }

      const { data } = await apiRequest.post(
        `/socials/tasks/${taskId}/comments/${commentId}/reply`,
        formData,
        {
          headers: { 
            'Content-Type': 'multipart/form-data' 
          }
        }
      );
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['tasks']);
      queryClient.invalidateQueries(['comments', variables.taskId]);
    }
  });
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ taskId, commentId }) => {
      const { data } = await apiRequest.delete(
        `/socials/tasks/${taskId}/comments/${commentId}`
      );
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['tasks']);
      queryClient.invalidateQueries(['comments', variables.taskId]);
    }
  });
};

export const useDeleteReply = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ taskId, commentId, replyId }) => {
      const { data } = await apiRequest.delete(
        `/socials/tasks/${taskId}/comments/${commentId}/replies/${replyId}`
      );
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['tasks']);
      queryClient.invalidateQueries(['comments', variables.taskId]);
    }
  });
};

export const useToggleReplyReaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ taskId, commentId, replyId, reactionType }) => {
      const { data } = await apiRequest.post(
        `/socials/tasks/${taskId}/comments/${commentId}/replies/${replyId}/react`,
        { reactionType }
      );
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['tasks']);
      queryClient.invalidateQueries(['comments', variables.taskId]);
    }
  });
};


export const useToggleLike = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (taskId) => {
      const { data } = await apiRequest.post(`/socials/tasks/${taskId}/like`);
      console.log(data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks']);
      
    }
  });
};

export const useToggleSave = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (taskId) => {
      const { data } = await apiRequest.post(`/socials/tasks/${taskId}/save`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks']);
    }
  });
};


export const useToggleCommentLike = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ taskId, commentId }) => {
      const { data } = await apiRequest.post(
        `/socials/tasks/${taskId}/comments/${commentId}/like`
      );
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['comments', variables.taskId]);
    }
  });
};

export const useComments = (taskId, page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['comments', taskId, page],
    queryFn: async () => {
      const { data } = await apiRequest.get(
        `/socials/tasks/${taskId}/comments?page=${page}&limit=${limit}`
      );
      return data;
    },
    enabled: !!taskId,
    keepPreviousData: true // ✅ Keep previous data while loading next page
  });
};

export const useTaskReactions = (taskId, enabled) => {
  return useQuery({
    queryKey: ['task-reactions', taskId],
    queryFn: async () => {
      const res = await apiRequest.get(`/socials/tasks/${taskId}/reactions`);
      return res.data.data;
    },
    enabled: !!taskId && enabled,
  });
};


// export const useComments = (taskId) => {
//   return useQuery({
//     queryKey: ['comments', taskId],
//     queryFn: async () => {
//       const { data } = await apiRequest.get(`/socials/tasks/${taskId}/comments`);
//       return data.data;
//     },
//     enabled: !!taskId
//   });
// };