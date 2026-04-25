import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const userApi = {
  // Get all users with pagination, sorting, and search
  getUsers: (params) => {
    return api.get('/users', { params });
  },

  // Get single user
  getUser: (id) => {
    return api.get(`/users/${id}`);
  },

  // Create user
  createUser: (userData) => {
    return api.post('/users', userData);
  },

  // Update user
  updateUser: (id, userData) => {
    return api.put(`/users/${id}`, userData);
  },

  // Delete user
  deleteUser: (id) => {
    return api.delete(`/users/${id}`);
  },
};

export default api;