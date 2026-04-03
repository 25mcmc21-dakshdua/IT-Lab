import React from 'react';
import './UserList.css';

const getDepartmentBadgeClass = (department) => {
  const badgeMap = {
    'Engineering': 'badge-engineering',
    'Design': 'badge-design',
    'Operations': 'badge-operations',
    'Analytics': 'badge-analytics',
    'HR': 'badge-hr',
    'Content': 'badge-content',
    'Research': 'badge-research',
    'Sales': 'badge-sales',
    'Marketing': 'badge-marketing',
    'Management': 'badge-management'
  };
  return `badge ${badgeMap[department] || 'badge-default'}`;
};

const UserList = ({ users, onEdit, onDelete, sortField, sortOrder, onSort }) => {
  const renderSortIndicator = (field) => {
    if (sortField !== field) return <span className="sort-indicator">↕</span>;
    return <span className="sort-indicator">{sortOrder === 'asc' ? '↑' : '↓'}</span>;
  };

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th onClick={() => onSort('id')} className={sortField === 'id' ? 'sorted' : ''}>
              ID {renderSortIndicator('id')}
            </th>
            <th onClick={() => onSort('name')} className={sortField === 'name' ? 'sorted' : ''}>
              Name {renderSortIndicator('name')}
            </th>
            <th onClick={() => onSort('email')} className={sortField === 'email' ? 'sorted' : ''}>
              Email {renderSortIndicator('email')}
            </th>
            <th onClick={() => onSort('role')} className={sortField === 'role' ? 'sorted' : ''}>
              Role {renderSortIndicator('role')}
            </th>
            <th onClick={() => onSort('department')} className={sortField === 'department' ? 'sorted' : ''}>
              Department {renderSortIndicator('department')}
            </th>
            <th onClick={() => onSort('created_at')} className={sortField === 'created_at' ? 'sorted' : ''}>
              Created {renderSortIndicator('created_at')}
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td><strong>{user.name}</strong></td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <span className={getDepartmentBadgeClass(user.department)}>
                  {user.department}
                </span>
              </td>
              <td>{new Date(user.created_at).toLocaleDateString()}</td>
              <td>
                <div className="action-buttons">
                  <button
                    className="btn btn-secondary btn-icon"
                    onClick={() => onEdit(user)}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    className="btn btn-danger btn-icon"
                    onClick={() => onDelete(user.id)}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;