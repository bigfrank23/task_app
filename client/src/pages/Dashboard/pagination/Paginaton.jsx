import './pagination.css'

// export default Pagination;
const Pagination = ({ currentPage, totalPages, onPageChange, isLoading }) => {
  // ✅ Add safety checks
  const safeTotalPages = totalPages || 0;
  const safeCurrentPage = currentPage || 1;

  // console.log('🔢 Pagination:', { currentPage: safeCurrentPage, totalPages: safeTotalPages });

  if (safeTotalPages <= 1) return null;

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    
    // Always show first page
    range.push(1);
    
    // Show pages around current
    for (
      let i = Math.max(2, safeCurrentPage - delta);
      i <= Math.min(safeTotalPages - 1, safeCurrentPage + delta);
      i++
    ) {
      range.push(i);
    }
    
    // Always show last page
    if (safeTotalPages > 1) range.push(safeTotalPages);

    // Build range with ellipsis
    const rangeWithDots = [];
    let prev;
    for (const i of range) {
      if (prev) {
        if (i - prev === 2) {
          rangeWithDots.push(prev + 1);
        } else if (i - prev > 2) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      prev = i;
    }

    return rangeWithDots;
  };

  return (
    <div className="pagination">
      {/* First Page */}
      <button
        className="pagination-first"
        disabled={safeCurrentPage === 1 || isLoading}
        onClick={() => onPageChange(1)}
      >
        1
      </button>

      {/* Previous */}
      <button
        disabled={safeCurrentPage === 1 || isLoading}
        onClick={() => onPageChange(safeCurrentPage - 1)}
        className="pagination-btn"
      >
        ← Prev
      </button>

      {/* Page Numbers */}
      <div className="pagination-pages">
        {getVisiblePages().map((pageNum, idx) => (
          pageNum === '...' ? (
            <span key={`dots-${idx}`} className="pagination-dots">...</span>
          ) : (
            <button
              key={pageNum}
              className={`pagination-btn ${pageNum === safeCurrentPage ? 'active' : ''}`}
              onClick={() => onPageChange(pageNum)}
              disabled={isLoading}
            >
              {pageNum}
            </button>
          )
        ))}
      </div>

      {/* Next */}
      <button
        disabled={safeCurrentPage >= safeTotalPages || isLoading}
        onClick={() => onPageChange(safeCurrentPage + 1)}
        className="pagination-btn"
      >
        Next →
      </button>

      {/* Page Info */}
      <span className="pagination-info">
        Page {safeCurrentPage} of {safeTotalPages}
      </span>
    </div>
  );
};

export default Pagination;
