import React from 'react';
import './SearchBar.css';

const SearchBar = ({ searchTerm, onSearchChange, itemsPerPage, onItemsPerPageChange }) => {
  return (
    <div className="toolbar">
      <div className="search-box">
        <input
          type="text"
          placeholder="🔍 Search users by name, email, role, or department..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      <div className="select-wrapper">
        <label>Show:</label>
        <select
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="15">15</option>
          <option value="20">20</option>
        </select>
      </div>
    </div>
  );
};

export default SearchBar;