import { useMutation } from "@tanstack/react-query";
import apiRequest from "./apiRequest";

export const useImageUpload = () => {
  return useMutation({
    mutationFn: async ({ endpoint, formData, onProgress }) => {
      const res = await apiRequest.patch(endpoint, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
        onUploadProgress: (e) => {
          if (!e.total) return;
          const percent = Math.round((e.loaded * 100) / e.total);
          onProgress?.(percent);
        },
      })
      return res.data;
    },
  });
};
