// utils/apiRequest.js
import axios from 'axios';

const apiRequest = axios.create({
  baseURL: import.meta.env.VITE_URL_API_ENDPOINT || 'http://localhost:8000/api',
  timeout: 30000, // 30 seconds
  withCredentials: true, // Important for cookies
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
apiRequest.interceptors.request.use(
  (config) => {
    // Get token from localStorage if exists
    const token = localStorage.getItem('token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log request in development
    if (import.meta.env.VITE_URL_API_ENDPOINT === 'development') {
      console.log(`[API] ${config.method.toUpperCase()} ${config.url}`);
    }
    
    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiRequest.interceptors.response.use(
  (response) => {
    // Log response in development
    if (import.meta.env.VITE_URL_API_ENDPOINT === 'development') {
      console.log(`[API Response] ${response.config.url}`, response.data);
    }
    
    return response;
  },
  (error) => {
    console.error('[API Response Error]', error);
    
    // Handle specific error cases
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Unauthorized - clear auth data and redirect to login
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          
          // Only redirect if not already on login page
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login';
          }
          break;
          
        case 403:
          // Forbidden
          console.error('Access forbidden:', data.message);
          break;
          
        case 404:
          // Not found
          console.error('Resource not found:', data.message);
          break;
          
        case 429:
          // Too many requests
          console.error('Rate limit exceeded:', data.message);
          break;
          
        case 500:
        case 502:
        case 503:
          // Server errors
          console.error('Server error:', data.message);
          break;
          
        default:
          console.error(`Error ${status}:`, data.message);
      }
      
      // Attach user-friendly message
      error.userMessage = data.message || 'An error occurred. Please try again.';
    } else if (error.request) {
      // Request made but no response received
      error.userMessage = 'Network error. Please check your connection.';
    } else {
      // Something else happened
      error.userMessage = 'An unexpected error occurred.';
    }
    
    return Promise.reject(error);
  }
);

export default apiRequest;

// utils/config.js
export const config = {
  // API Configuration
  api: {
    baseURL: import.meta.env.VITE_URL_API_ENDPOINT || 'http://localhost:5000/api',
    timeout: 30000,
  },
  
  // File Upload Configuration
  upload: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    maxFiles: 10,
    allowedImageTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
    allowedVideoTypes: ['video/mp4', 'video/mov', 'video/avi', 'video/quicktime'],
    getAllowedTypes() {
      return [...this.allowedImageTypes, ...this.allowedVideoTypes];
    }
  },
  
  // Task Configuration
  task: {
    priorities: ['low', 'medium', 'high'],
    statuses: ['pending', 'in_progress', 'late', 'completed'],
    defaultPriority: 'medium',
    defaultStatus: 'pending'
  },
  
  // Pagination Configuration
  pagination: {
    defaultPage: 1,
    defaultLimit: 50,
    maxLimit: 100
  },
  
  // Toast Configuration
  toast: {
    position: 'top-right',
    duration: 3000,
    success: {
      iconTheme: {
        primary: '#10b981',
        secondary: '#ffffff'
      }
    },
    error: {
      iconTheme: {
        primary: '#ef4444',
        secondary: '#ffffff'
      }
    }
  },
  
  // Date Configuration
  date: {
    format: 'MMM dd, yyyy',
    timeFormat: 'HH:mm',
    dateTimeFormat: 'MMM dd, yyyy HH:mm'
  }
};

// utils/validators.js
export const validators = {
  // Validate task title
  taskTitle: (title) => {
    if (!title || title.trim().length === 0) {
      return { valid: false, message: 'Task title is required' };
    }
    if (title.length > 200) {
      return { valid: false, message: 'Task title must be less than 200 characters' };
    }
    return { valid: true };
  },
  
  // Validate task description
  taskDescription: (description) => {
    if (description && description.length > 2000) {
      return { valid: false, message: 'Description must be less than 2000 characters' };
    }
    return { valid: true };
  },
  
  // Validate due date
  dueDate: (date) => {
    if (!date) {
      return { valid: false, message: 'Due date is required' };
    }
    
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      return { valid: false, message: 'Due date cannot be in the past' };
    }
    
    return { valid: true };
  },
  
  // Validate file upload
  fileUpload: (file) => {
    const { maxFileSize, getAllowedTypes } = config.upload;
    
    if (file.size > maxFileSize) {
      return { 
        valid: false, 
        message: `File size must be less than ${maxFileSize / (1024 * 1024)}MB` 
      };
    }
    
    if (!getAllowedTypes().includes(file.type)) {
      return { 
        valid: false, 
        message: 'File type not allowed. Only images and videos are supported.' 
      };
    }
    
    return { valid: true };
  },
  
  // Validate multiple files
  fileUploads: (files) => {
    if (files.length > config.upload.maxFiles) {
      return { 
        valid: false, 
        message: `Maximum ${config.upload.maxFiles} files allowed` 
      };
    }
    
    for (const file of files) {
      const validation = validators.fileUpload(file);
      if (!validation.valid) {
        return validation;
      }
    }
    
    return { valid: true };
  }
};

// utils/formatters.js
export const formatters = {
  // Format date
  date: (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  },
  
  // Format date and time
  dateTime: (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  },
  
  // Format file size
  fileSize: (bytes) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  },
  
  // Format status text
  status: (status) => {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  },
  
  // Truncate text
  truncate: (text, maxLength = 50) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  },
  
  // Format relative time (e.g., "2 hours ago")
  relativeTime: (date) => {
    if (!date) return '';
    
    const now = new Date();
    const diff = now - new Date(date);
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 7) {
      return formatters.date(date);
    } else if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  }
};

// utils/helpers.js
export const helpers = {
  // Debounce function
  debounce: (func, wait = 300) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },
  
  // Generate unique ID
  generateId: () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  },
  
  // Deep clone object
  deepClone: (obj) => {
    return JSON.parse(JSON.stringify(obj));
  },
  
  // Check if object is empty
  isEmpty: (obj) => {
    if (obj === null || obj === undefined) return true;
    if (Array.isArray(obj)) return obj.length === 0;
    if (typeof obj === 'object') return Object.keys(obj).length === 0;
    return !obj;
  },
  
  // Get status color
  getStatusColor: (status) => {
    const colors = {
      completed: '#10b981',
      late: '#ef4444',
      pending: '#f59e0b',
      in_progress: '#3b82f6'
    };
    return colors[status] || '#6b7280';
  },
  
  // Get priority color
  getPriorityColor: (priority) => {
    const colors = {
      high: '#ef4444',
      medium: '#f59e0b',
      low: '#10b981'
    };
    return colors[priority] || '#6b7280';
  }
};