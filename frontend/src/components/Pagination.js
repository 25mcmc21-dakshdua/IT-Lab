import React from 'react';
import './Pagination.css';

const Pagination = ({ currentPage, totalPages, totalUsers, onPageChange }) => {
  return (
    <div className="pagination">
      <button
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
      >
        « First
      </button>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        ‹ Previous
      </button>
      
      <div className="page-info">
        Page {currentPage} of {totalPages} ({totalUsers} total users)
      </div>
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next ›
      </button>
      <button
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
      >
        Last »
      </button>
    </div>
  );
};

export default Pagination;