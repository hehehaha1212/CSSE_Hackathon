import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  login: (email, password) =>
    api.post('/auth/login', { email, password }),
  
  register: (name, email, password) =>
    api.post('/auth/register', { name, email, password }),
  
  me: () => api.get('/auth/me'),
  
  logout: () => api.post('/auth/logout'),
};

// User APIs
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  
  updateProfile: (data) => api.put('/users/profile', data),
  
  getStats: () => api.get('/users/stats'),
};

// Carbon APIs
export const carbonAPI = {
  logActivity: (activity) => api.post('/carbon/activities', activity),
  
  getActivities: () => api.get('/carbon/activities'),
  
  getFootprint: () => api.get('/carbon/footprint'),
  
  getRecommendations: () => api.get('/carbon/recommendations'),
};

// Challenges APIs
export const challengesAPI = {
  getChallenges: () => api.get('/challenges'),
  
  joinChallenge: (challengeId) => 
    api.post(`/challenges/${challengeId}/join`),
  
  leaveChallenge: (challengeId) => 
    api.post(`/challenges/${challengeId}/leave`),
  
  getMyChallenges: () => api.get('/challenges/my'),
  
  updateProgress: (challengeId, progress) =>
    api.put(`/challenges/${challengeId}/progress`, { progress }),
};

// Community APIs
export const communityAPI = {
  getPosts: () => api.get('/community/posts'),
  
  createPost: (content) => api.post('/community/posts', { content }),
  
  likePost: (postId) => api.post(`/community/posts/${postId}/like`),
  
  commentPost: (postId, comment) =>
    api.post(`/community/posts/${postId}/comments`, { comment }),
};

export default api; 