import PropTypes from 'prop-types';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import './Pagination.css';

export function Pagination({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  siblingCount = 1,
  className = '',
}) {
  const generatePageNumbers = () => {
    const pages = [];
    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const showLeftDots = leftSiblingIndex > 2;
    const showRightDots = rightSiblingIndex < totalPages - 1;

    // Always show first page
    pages.push(1);

    // Show left dots
    if (showLeftDots) {
      pages.push('left-dots');
    }

    // Show sibling pages
    for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
      if (i !== 1 && i !== totalPages) {
        pages.push(i);
      }
    }

    // Show right dots
    if (showRightDots) {
      pages.push('right-dots');
    }

    // Always show last page
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const pages = generatePageNumbers();
  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  const handlePageClick = (page) => {
    if (page !== currentPage && onPageChange) {
      onPageChange(page);
    }
  };

  const handlePrevious = () => {
    if (canGoPrevious && onPageChange) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (canGoNext && onPageChange) {
      onPageChange(currentPage + 1);
    }
  };

  if (totalPages <= 0) return null;

  return (
    <nav className={`pagination ${className}`.trim()} aria-label="Pagination">
      <button
        type="button"
        className="pagination__button pagination__button--nav"
        onClick={handlePrevious}
        disabled={!canGoPrevious}
        aria-label="Go to previous page"
      >
        <ChevronLeft size={18} />
        <span className="pagination__nav-text">Back</span>
      </button>

      <ul className="pagination__list">
        {pages.map((page, index) => {
          if (page === 'left-dots' || page === 'right-dots') {
            return (
              <li key={`dots-${index}`} className="pagination__item">
                <span className="pagination__dots" aria-hidden="true">
                  <MoreHorizontal size={18} />
                </span>
              </li>
            );
          }

          const isActive = page === currentPage;

          return (
            <li key={page} className="pagination__item">
              <button
                type="button"
                className={`pagination__button pagination__button--page${isActive ? ' pagination__button--active' : ''}`}
                onClick={() => handlePageClick(page)}
                disabled={isActive}
                aria-label={`Go to page ${page}`}
                aria-current={isActive ? 'page' : undefined}
              >
                {page}
              </button>
            </li>
          );
        })}
      </ul>

      <button
        type="button"
        className="pagination__button pagination__button--nav"
        onClick={handleNext}
        disabled={!canGoNext}
        aria-label="Go to next page"
      >
        <span className="pagination__nav-text">Next</span>
        <ChevronRight size={18} />
      </button>
    </nav>
  );
}

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  siblingCount: PropTypes.number,
  className: PropTypes.string,
};
