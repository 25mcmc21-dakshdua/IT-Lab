import { useState, useEffect, useCallback } from 'react';
import { userApi } from '../services/api';

export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        sortField,
        sortOrder,
        ...(searchTerm && { search: searchTerm })
      };
      
      const response = await userApi.getUsers(params);
      setUsers(response.data.users);
      setTotalUsers(response.data.totalUsers);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, sortField, sortOrder, searchTerm]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const createUser = async (userData) => {
    try {
      const response = await userApi.createUser(userData);
      await fetchUsers(); // Refresh the list
      return { success: true, data: response.data };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.error || 'Failed to create user' 
      };
    }
  };

  const updateUser = async (id, userData) => {
    try {
      const response = await userApi.updateUser(id, userData);
      await fetchUsers(); // Refresh the list
      return { success: true, data: response.data };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.error || 'Failed to update user' 
      };
    }
  };

  const deleteUser = async (id) => {
    try {
      await userApi.deleteUser(id);
      await fetchUsers(); // Refresh the list
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.error || 'Failed to delete user' 
      };
    }
  };

  return {
    users,
    loading,
    error,
    totalUsers,
    totalPages,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    searchTerm,
    setSearchTerm,
    sortField,
    sortOrder,
    setSortField,
    setSortOrder,
    createUser,
    updateUser,
    deleteUser,
    refreshUsers: fetchUsers,
  };
};