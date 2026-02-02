import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiRequest from "./apiRequest";

export const useComments = (taskId, page = 1, limit = 10) => {
  return useQuery({
    queryKey: ["comments", taskId, page],
    queryFn: async () => {
      const { data } = await apiRequest.get(
        `/socials/tasks/${taskId}/comments?page=${page}&limit=${limit}`
      );
      return data;
    },
    enabled: !!taskId,
    // keepPreviousData: true,
  });
};


export const useAddComment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ taskId, text, attachments }) => {
      console.log('🚀 useAddComment starting:', { taskId, text, attachmentsCount: attachments?.length });
      
      const formData = new FormData();
      formData.append('text', text || '');
      
      if (attachments && attachments.length > 0) {
        attachments.forEach(file => {
          formData.append('attachments', file);
        });
      }

      console.log('📤 Sending request...');

      const { data } = await apiRequest.post(
        `/socials/tasks/${taskId}/comments`,
        formData
      );
      
      console.log('✅ Response received:', data);
      return data;
    },
    onSuccess: (data, variables) => {
      console.log('✅ Mutation successful, invalidating queries');
      queryClient.invalidateQueries(['tasks']);
      // ✅ Invalidate ALL comment queries for this task (all pages)
      queryClient.invalidateQueries({ 
        queryKey: ['comments', variables.taskId],
        exact: false  // This invalidates all pages
      });
    },
    onError: (error) => {
      console.error('❌ Mutation error:', error);
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


export const useReactToComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ commentId, reactionType }) => {
      const { data } = await apiRequest.post(
        `/socials/comments/${commentId}/reactions`,
        { reactionType }
      );
      return data;
    },
    onSuccess: (_, { taskId }) => {
      queryClient.invalidateQueries(["comments", taskId]);
    },
  });
};

export const useReplies = (commentId) => {
  return useQuery({
    queryKey: ["replies", commentId],
    queryFn: async () => {
      const { data } = await apiRequest.get(
        `/socials/comments/${commentId}/replies`
      );
      return data;
    },
    enabled: !!commentId,
  });
};


export const useAddReply = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ taskId, commentId, text, attachments }) => {
      console.log('🚀 useAddReply mutation starting:', { taskId, commentId, text, attachmentsCount: attachments?.length });
      
      const formData = new FormData();
      
      formData.append('text', text || '');
      
      if (attachments && attachments.length > 0) {
        attachments.forEach(file => {
          formData.append('attachments', file);
        });
      }

      console.log('📤 Sending request to:', `/socials/comments/${commentId}/replies`);

      const { data } = await apiRequest.post(
        `/socials/comments/${commentId}/replies`,
        formData
      );
      
      console.log('✅ Response received:', data);
      return data;
    },
    onSuccess: (data, variables) => {
      console.log('✅ Mutation successful, invalidating queries for:', {
        taskId: variables.taskId,
        commentId: variables.commentId
      });
      
      queryClient.invalidateQueries(['tasks']);
      queryClient.invalidateQueries(['comments', variables.taskId]);
      queryClient.invalidateQueries(['replies', variables.commentId]); // ✅ THIS IS CRITICAL
    },
    onError: (error) => {
      console.error('❌ Mutation error:', error);
    }
  });
};

export const useDeleteReply = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ replyId, commentId }) => { 
      const { data } = await apiRequest.delete(
        `/socials/replies/${replyId}`
      );
      return data;
    },
    onSuccess: (_, { commentId }) => {
      queryClient.invalidateQueries(["replies", commentId]);
    },
  });
};

export const useReactToReply = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ replyId, reactionType }) => {
      const { data } = await apiRequest.post(
        `/socials/replies/${replyId}/reactions`,
        { reactionType }
      );
      return data;
    },
    onSuccess: (_, { commentId }) => {
      queryClient.invalidateQueries(["replies", commentId]);
    },
  });
};




