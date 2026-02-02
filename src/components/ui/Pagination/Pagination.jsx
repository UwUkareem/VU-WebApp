import PropTypes from 'prop-types';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './Pagination.css';

export function Pagination({ currentPage = 1, totalPages = 1, onPageChange, className = '' }) {
  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

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

  const handlePageInput = (e) => {
    const value = parseInt(e.target.value, 10);
    if (value >= 1 && value <= totalPages && onPageChange) {
      onPageChange(value);
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
        <ChevronLeft size={16} />
      </button>

      <div className="pagination__info">
        <span className="pagination__label">Page</span>
        <input
          type="number"
          className="pagination__input"
          value={currentPage}
          onChange={handlePageInput}
          min="1"
          max={totalPages}
          aria-label="Current page"
        />
        <span className="pagination__label">of {totalPages}</span>
      </div>

      <button
        type="button"
        className="pagination__button pagination__button--nav"
        onClick={handleNext}
        disabled={!canGoNext}
        aria-label="Go to next page"
      >
        <ChevronRight size={16} />
      </button>
    </nav>
  );
}

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  className: PropTypes.string,
};
