// utils/useComments.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiRequest from "./apiRequest";

// Get comments
export const useComments = (taskId, page = 1) => {
  return useQuery({
    queryKey: ["comments", taskId, page],
    queryFn: async () => {
      const { data } = await apiRequest.get(
        `/socials/tasks/${taskId}/comments?page=${page}&limit=10`
      );
      return data;
    },
    enabled: !!taskId,
    staleTime: 0, // ✅ Add this - consider data stale immediately
    cacheTime: 0, // ✅ Add this - don't cache at all
  });
};

// Add comment
export const useAddComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ taskId, text, attachments }) => {
      console.log('📤 Adding comment:', { taskId, text });
      const formData = new FormData();
      formData.append("text", text || "");

      if (attachments?.length) {
        attachments.forEach((file) => {
          formData.append("attachments", file);
        });
      }

      const { data } = await apiRequest.post(
        `/socials/tasks/${taskId}/comments`,
        formData
      );
      console.log('✅ Comment added:', data);
      return data;
    },
    onSuccess: (data, { taskId }) => {
      console.log('🔄 Invalidating queries for taskId:', taskId);
      
      // ✅ Invalidate and refetch
      queryClient.invalidateQueries({ 
        queryKey: ["comments", taskId],
        refetchType: 'active'
      });
      
      // ✅ Also reset to page 1
      queryClient.setQueryData(["comments", taskId, 1], (old) => {
        console.log('Old data:', old);
        return undefined; // Force refetch
      });
    },
  });
};

// Delete comment
export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ commentId }) => {
      const { data } = await apiRequest.delete(`/socials/comments/${commentId}`);
      return data;
    },
    onSuccess: (_, { taskId }) => {
      queryClient.invalidateQueries({ queryKey: ["comments", taskId] });
    },
  });
};

// React to comment
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
      queryClient.invalidateQueries({ queryKey: ["comments", taskId] });
    },
  });
};

// Get replies
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

// Add reply
export const useAddReply = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ commentId, text, attachments }) => {
      const formData = new FormData();
      formData.append("text", text || "");

      if (attachments?.length) {
        attachments.forEach((file) => {
          formData.append("attachments", file);
        });
      }

      const { data } = await apiRequest.post(
        `/socials/comments/${commentId}/replies`,
        formData
      );
      return data;
    },
    onSuccess: (_, { commentId }) => {
      queryClient.invalidateQueries({ queryKey: ["replies", commentId] });
    },
  });
};

// Delete reply
export const useDeleteReply = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ replyId }) => {
      const { data } = await apiRequest.delete(`/socials/replies/${replyId}`);
      return data;
    },
    onSuccess: (_, { commentId }) => {
      queryClient.invalidateQueries({ queryKey: ["replies", commentId] });
    },
  });
};

// React to reply
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
      queryClient.invalidateQueries({ queryKey: ["replies", commentId] });
    },
  });
};