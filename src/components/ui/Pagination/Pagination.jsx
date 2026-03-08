import { memo, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './Pagination.css';

/**
 * Build the array of page numbers / ellipsis markers to render.
 * Always shows first, last, and a window around the current page.
 */
function getPageNumbers(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages = new Set([1, total]);
  for (let i = current - 1; i <= current + 1; i++) {
    if (i >= 1 && i <= total) pages.add(i);
  }

  const sorted = [...pages].sort((a, b) => a - b);
  const result = [];
  let prev = 0;
  for (const p of sorted) {
    if (p - prev > 1) result.push('...');
    result.push(p);
    prev = p;
  }
  return result;
}

export const Pagination = memo(function Pagination({
  currentPage = 1,
  totalPages = 1,
  totalItems,
  itemsPerPage,
  onPageChange,
  className = '',
}) {
  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  const handlePrevious = useCallback(() => {
    if (canGoPrevious) onPageChange?.(currentPage - 1);
  }, [canGoPrevious, currentPage, onPageChange]);

  const handleNext = useCallback(() => {
    if (canGoNext) onPageChange?.(currentPage + 1);
  }, [canGoNext, currentPage, onPageChange]);

  const pages = useMemo(() => getPageNumbers(currentPage, totalPages), [currentPage, totalPages]);

  if (totalPages <= 0) return null;

  // Compute "Showing X–Y of Z"
  const showSummary = totalItems != null && itemsPerPage != null;
  const rangeStart = showSummary ? (currentPage - 1) * itemsPerPage + 1 : null;
  const rangeEnd = showSummary ? Math.min(currentPage * itemsPerPage, totalItems) : null;

  return (
    <nav className={['pagination', className].filter(Boolean).join(' ')} aria-label="Pagination">
      {/* Left — result summary */}
      <span className="pagination__summary">
        {showSummary ? (
          <>
            Showing{' '}
            <span className="pagination__summary-range">
              {rangeStart}–{rangeEnd}
            </span>{' '}
            of {totalItems}
          </>
        ) : (
          <>
            Page <span className="pagination__summary-range">{currentPage}</span> of {totalPages}
          </>
        )}
      </span>

      {/* Right — page navigation */}
      <div className="pagination__nav">
        <button
          type="button"
          className="pagination__arrow"
          onClick={handlePrevious}
          disabled={!canGoPrevious}
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </button>

        <div className="pagination__pages">
          {pages.map((page, i) =>
            page === '...' ? (
              <span key={`ellipsis-${i}`} className="pagination__ellipsis">
                …
              </span>
            ) : (
              <button
                key={page}
                type="button"
                className={['pagination__page', page === currentPage && 'pagination__page--active']
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => onPageChange?.(page)}
                aria-label={`Page ${page}`}
                aria-current={page === currentPage ? 'page' : undefined}
              >
                {page}
              </button>
            )
          )}
        </div>

        <button
          type="button"
          className="pagination__arrow"
          onClick={handleNext}
          disabled={!canGoNext}
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </nav>
  );
});

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  totalItems: PropTypes.number,
  itemsPerPage: PropTypes.number,
  onPageChange: PropTypes.func.isRequired,
  className: PropTypes.string,
};
