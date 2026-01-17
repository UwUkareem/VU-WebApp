import PropTypes from 'prop-types';
import { ChevronUp, ChevronDown } from 'lucide-react';
import './TableHeader.css';

export function TableHeader({ columns = [], onSort, className = '' }) {
  const handleSort = (column, currentSort) => {
    if (!column.sortable || !onSort) return;

    let newSort = 'asc';
    if (currentSort === 'asc') {
      newSort = 'desc';
    } else if (currentSort === 'desc') {
      newSort = null;
    }

    onSort(column.key, newSort);
  };

  return (
    <div className={`table-header ${className}`.trim()} role="row">
      {columns.map((column, index) => (
        <div
          key={index}
          className={`table-header__cell${column.sortable ? ' table-header__cell--sortable' : ''}`}
          style={{ width: column.width }}
          onClick={() => column.sortable && handleSort(column, column.sortState)}
          role="columnheader"
        >
          <span className="table-header__label">{column.label}</span>
          {column.sortable && (
            <span className="table-header__sort" aria-hidden="true">
              <ChevronUp
                size={12}
                className={`table-header__sort-icon${column.sortState === 'asc' ? ' table-header__sort-icon--active' : ''}`}
              />
              <ChevronDown
                size={12}
                className={`table-header__sort-icon${column.sortState === 'desc' ? ' table-header__sort-icon--active' : ''}`}
              />
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

TableHeader.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      width: PropTypes.string,
      sortable: PropTypes.bool,
      sortState: PropTypes.oneOf(['asc', 'desc', null]),
    })
  ),
  onSort: PropTypes.func,
  className: PropTypes.string,
};
