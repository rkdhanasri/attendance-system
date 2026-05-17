import React from 'react';

export default function Pagination({ currentPage, totalPages, onPageChange, pageSize = 11 }) {
  if (totalPages <= 1) return null;

  const pages = [];
  const maxVisible = 5;
  let startPage = Math.max(0, currentPage - Math.floor(maxVisible / 2));
  let endPage = Math.min(totalPages - 1, startPage + maxVisible - 1);

  if (endPage - startPage + 1 < maxVisible) {
    startPage = Math.max(0, endPage - maxVisible + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="pagination">
      <button 
        onClick={() => onPageChange(0)} 
        disabled={currentPage === 0}
        className="page-btn"
      >
        First
      </button>
      <button 
        onClick={() => onPageChange(currentPage - 1)} 
        disabled={currentPage === 0}
        className="page-btn"
      >
        Prev
      </button>
      {pages.map(p => (
        <button 
          key={p} 
          onClick={() => onPageChange(p)}
          className={`page-btn ${p === currentPage ? 'active' : ''}`}
        >
          {p + 1}
        </button>
      ))}
      <button 
        onClick={() => onPageChange(totalPages - 1)} 
        disabled={currentPage === totalPages - 1}
        className="page-btn"
      >
        Last
      </button>
      <button 
        onClick={() => onPageChange(currentPage + 1)} 
        disabled={currentPage === totalPages - 1}
        className="page-btn"
      >
        Next
      </button>
      <span className="page-info">
        Page {currentPage + 1} of {totalPages} ({pageSize} per page)
      </span>
    </div>
  );
}
