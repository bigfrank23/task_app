// ============================================
// FIXED useTasksHook.js - COMPLETE VERSION
// ============================================

import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import apiRequest from "../utils/apiRequest";

export const useTasks = (filters = {}, page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['tasks', filters, page, limit],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),      // ✅ Convert to string for URLSearchParams
        limit: String(limit)
      });
      
      if (filters.status) params.append('status', filters.status);
      if (filters.priority) params.append('priority', filters.priority);
      if (filters.search) params.append('search', filters.search);
      
      console.log('📤 Request URL:', `/task/tasks?${params.toString()}`);
      
      const { data } = await apiRequest.get(`/task/tasks?${params.toString()}`);
      
      console.log('📥 Response:', {
        tasksCount: data.data?.length,
        pagination: data.pagination
      });
      
      return data;
    },
    keepPreviousData: true,
    staleTime: 30000,
    retry: 2
  });
};

export const useInfiniteTasks = (filters = {}, limit = 10) => {
  return useInfiniteQuery({
    queryKey: ['tasks', filters, limit],
    queryFn: async ({ pageParam = 1 }) => { 
      const params = new URLSearchParams({
        page: String(pageParam),
        limit: String(limit),
      });

      if (filters.status) params.append('status', filters.status);
      if (filters.priority) params.append('priority', filters.priority);
      if (filters.search) params.append('search', filters.search);

      const { data } = await apiRequest.get(`/task?${params.toString()}`);
      return data;
    },
    getNextPageParam: (lastPage) => {
      const { page, pages } = lastPage.pagination;
      return page < pages ? page + 1 : undefined;
    },
    staleTime: 30000,
  });
};

// Get task statistics (optional - can be removed if using stats from useTasks)
export const useTaskStats = () => {
  return useQuery({
    queryKey: ['task-stats'],
    queryFn: async () => {
      const { data } = await apiRequest.get('/task');
      return data.stats;
    },
    staleTime: 60000,
  });
};

// Create task mutation
export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskData) => {
      const formData = new FormData();
      
      formData.append('title', taskData.title);
      if (taskData.description) formData.append('description', taskData.description);
      formData.append('dueDate', taskData.dueDate);
      formData.append('priority', taskData.priority || 'medium');
      formData.append('assignedTo', taskData.assignedTo);
      
      if (taskData.tags) {
        formData.append('tags', JSON.stringify(taskData.tags));
      }
      
      if (taskData.attachments && taskData.attachments.length > 0) {
        taskData.attachments.forEach(file => {
          formData.append('attachments', file);
        });
      }

      const { data } = await apiRequest.post('/task', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      return data.data;
    },
    onSuccess: () => {
      // Invalidate all task queries to refetch
      queryClient.invalidateQueries(['tasks']);
      console.log("Task created successfully!");
    },
    onError: (error) => {
      console.error('Create task error:', error);
    }
  });
};

// Update task status mutation
export const useUpdateTaskStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ taskId, status }) => {
      const { data } = await apiRequest.patch(`/task/${taskId}/status`, { status });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks']);
      console.log("Task status updated!");
    },
    onError: (error) => {
      console.error(error.response?.data?.message || "Failed to update task status");
    }
  });
};

// Update task mutation
export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ taskId, updates }) => {
      const { data } = await apiRequest.patch(`/task/${taskId}`, updates);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks']);
      console.log("Task updated successfully!");
    },
    onError: (error) => {
      console.error(error.response?.data?.message || "Failed to update task");
    }
  });
};

// Delete task mutation
export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskId) => {
      await apiRequest.delete(`/task/${taskId}`);
      return taskId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks']);
      console.log("Task deleted successfully!");
    },
    onError: (error) => {
      console.error(error.response?.data?.message || "Failed to delete task");
    }
  });
};

// Archive task mutation
export const useArchiveTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskId) => {
      const { data } = await apiRequest.patch(`/task/${taskId}/archive`);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks']);
      console.log("Task archived successfully!");
    },
    onError: (error) => {
      console.error(error.response?.data?.message || "Failed to archive task");
    }
  });
};

// Get archived tasks
export const useArchivedTasks = () => {
  return useQuery({
    queryKey: ['tasks', 'archived'],
    queryFn: async () => {
      const { data } = await apiRequest.get('/task/archived');
      return data.data;
    },
    staleTime: 60000,
  });
};
