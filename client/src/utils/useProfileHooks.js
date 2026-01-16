import { useMutation } from "@tanstack/react-query";
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
