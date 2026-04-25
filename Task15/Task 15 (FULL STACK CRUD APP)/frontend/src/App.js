import React, { useState } from 'react';
import { useUsers } from './hooks/useUsers';
import UserList from './components/UserList';
import UserFormModal from './components/UserFormModal';
import SearchBar from './components/SearchBar';
import Pagination from './components/Pagination';
import Toast from './components/Toast';
import './App.css';

function App() {
  const {
    users,
    loading,
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
    optimisticOperations,
  } = useUsers();

  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
    setCurrentPage(1);
  };

  const handleSaveUser = async (userData) => {
    let result;
    if (editingUser) {
      result = await updateUser(editingUser.id, userData);
      if (result.success) {
        showToast('User updated successfully!', 'success');
      } else {
        showToast(result.error, 'error');
      }
    } else {
      result = await createUser(userData);
      if (result.success) {
        showToast('User created successfully!', 'success');
      } else {
        showToast(result.error, 'error');
      }
    }
    return result;
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    const result = await deleteUser(userId);
    if (result.success) {
      showToast('User deleted successfully!', 'success');
    } else {
      showToast(result.error, 'error');
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowModal(true);
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setShowModal(true);
  };

  return (
    <div className="app-container">
      <div className="header">
        <h1>👥 User Management System</h1>
        <p>Full-Stack CRUD Application with React & MySQL</p>
      </div>

      <div className="content">
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={(value) => {
            setItemsPerPage(value);
            setCurrentPage(1);
          }}
        />

        <div className="add-button-container">
          <button className="btn btn-primary" onClick={handleAddUser}>
            ➕ Add User
          </button>
        </div>

        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading users...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="empty-state">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3>No users found</h3>
            <p>
              {searchTerm 
                ? 'Try adjusting your search terms' 
                : 'Get started by adding your first user'}
            </p>
          </div>
        ) : (
          <>
            <UserList
              users={users}
              onEdit={handleEditUser}
              onDelete={handleDeleteUser}
              sortField={sortField}
              sortOrder={sortOrder}
              onSort={handleSort}
              optimisticOperations={optimisticOperations}
            />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalUsers={totalUsers}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>

      {showModal && (
        <UserFormModal
          user={editingUser}
          onClose={() => {
            setShowModal(false);
            setEditingUser(null);
          }}
          onSave={handleSaveUser}
        />
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default App;
