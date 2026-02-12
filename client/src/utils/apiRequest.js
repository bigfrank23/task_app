import axios from "axios";
import useAuthStore from "./authStore";

const apiRequest = axios.create({
  baseURL: import.meta.env.VITE_URL_API_ENDPOINT,
  withCredentials: true, // ✅ send cookies automatically
  headers: {
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
  }
});

// Optional: response interceptor for 401
apiRequest.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      const user = useAuthStore.getState().user;
      // Only redirect if user WAS logged in (session expired)
      // Don't redirect if user is already null (accessing protected endpoint while logged out is expected)
      if (user) {
        console.warn("❌ Unauthorized - session expired, clearing store & redirecting");
        useAuthStore.getState().logout();
        window.location.href = "/signin";
      }
    }
    return Promise.reject(error);
  }
);

export default apiRequest;
