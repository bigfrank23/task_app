import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiRequest from "./apiRequest";

export const useUpdateProfile = () =>
  useMutation({
    mutationFn: (data) => apiRequest.patch("/user/profile/info", data),
  });

export const useUpdatePassword = () =>
  useMutation({
    mutationFn: (data) => apiRequest.patch("/user/profile/password", data),
  });

export const useUploadAvatar = () =>
  useMutation({
    mutationFn: (file) => {
      const formData = new FormData();
      formData.append("avatar", file);
      return apiRequest.patch("/user/profile/avatar", formData);
    },
  });

export const useUploadCover = () =>
  useMutation({
    mutationFn: (file) => {
      const formData = new FormData();
      formData.append("cover", file);
      return apiRequest.patch("/user/profile/cover", formData);
    },
  });

// Get user profile by ID (public)
export const useUserProfile = (userId, page) => {
  return useQuery({
    queryKey: ["profile", userId, page],
    queryFn: async () => {
      if (!userId) throw new Error('User ID is required');

      const res = await apiRequest.get(
        `/user/profile/${userId}?page=${page}&limit=10`
      );
      return res.data.data;
    },
    keepPreviousData: true,
    enabled: !!userId, // Only run query if userId exists
    staleTime: 60000, // 1 minute
    retry: 2,
    onError: (error) => {
      console.error('Failed to fetch user profile:', error);
    }
  });
};


// Get my own profile
export const useMyProfile = () => {
  return useQuery({
    queryKey: ['myProfile'],
    queryFn: async () => {
      const { data } = await apiRequest.get('/user/profile/me');
      return data.data;
    },
    staleTime: 300000, // 5 minutes
    retry: 2
  });
};





// Update profile info
// export const useUpdateProfile = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async (profileData) => {
//       const { data } = await apiRequest.patch('/user/profile/info', profileData);
//       return data.data;
//     },
//     onSuccess: (updatedUser) => {
//       // Update both my profile and the specific user profile cache
//       queryClient.invalidateQueries(['myProfile']);
//       queryClient.invalidateQueries(['userProfile', updatedUser._id]);
//       console.log('Profile updated successfully!');
//     },
//     onError: (error) => {
//       console.error('Failed to update profile:', error);
//     }
//   });
// };

// // Upload avatar
// export const useUploadAvatar = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async (file) => {
//       const formData = new FormData();
//       formData.append('avatar', file);
      
//       const { data } = await apiRequest.patch('/user/profile/avatar', formData, {
//         headers: { 'Content-Type': 'multipart/form-data' }
//       });
      
//       return data.data;
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries(['myProfile']);
//       queryClient.invalidateQueries(['userProfile']);
//       console.log('Avatar uploaded successfully!');
//     },
//     onError: (error) => {
//       console.error('Failed to upload avatar:', error);
//     }
//   });
// };

// Delete avatar
export const useDeleteAvatar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data } = await apiRequest.delete('/user/profile/avatar');
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['myProfile']);
      queryClient.invalidateQueries(['userProfile']);
      console.log('Avatar deleted successfully!');
    },
    onError: (error) => {
      console.error('Failed to delete avatar:', error);
    }
  });
};

// Upload cover photo
export const useUploadCoverPhoto = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file) => {
      const formData = new FormData();
      formData.append('cover', file);
      
      const { data } = await apiRequest.patch('/user/profile/cover-photo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['myProfile']);
      queryClient.invalidateQueries(['userProfile']);
      console.log('Cover photo uploaded successfully!');
    },
    onError: (error) => {
      console.error('Failed to upload cover photo:', error);
    }
  });
};

// Delete cover photo
export const useDeleteCoverPhoto = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data } = await apiRequest.delete('/user/profile/cover-photo');
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['myProfile']);
      queryClient.invalidateQueries(['userProfile']);
      console.log('Cover photo deleted successfully!');
    },
    onError: (error) => {
      console.error('Failed to delete cover photo:', error);
    }
  });
};
