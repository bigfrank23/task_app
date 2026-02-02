import axios from 'axios'

const apiRequest = axios.create({
    baseURL: import.meta.env.VITE_URL_API_ENDPOINT,
    withCredentials: true,
    headers: {
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
  }
}) 

/**
 * Request interceptor
 * Automatically attach token to every request
 */

apiRequest.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("token") ||
      document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];
        
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Optional response interceptor (for global auth errors)
 */
apiRequest.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // optional: auto logout / redirect
      console.warn("Unauthorized — token expired or invalid");
    }
    return Promise.reject(error);
  }
);

export default apiRequest