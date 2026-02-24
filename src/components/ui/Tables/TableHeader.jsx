import { memo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { ChevronUp, ChevronDown } from 'lucide-react';
import './TableHeader.css';

export const TableHeader = memo(function TableHeader({
  columns = [],
  onSort,
  className = '',
  gridTemplateColumns,
  showMenu,
}) {
  const handleSort = useCallback(
    (column) => {
      if (!column.sortable || !onSort) return;
      const next = column.sortState === 'asc' ? 'desc' : column.sortState === 'desc' ? null : 'asc';
      onSort(column.key, next);
    },
    [onSort]
  );

  return (
    <div
      className={['table-header', className].filter(Boolean).join(' ')}
      role="row"
      style={gridTemplateColumns ? { display: 'grid', gridTemplateColumns } : undefined}
    >
      {columns.map((column) => (
        <div
          key={column.key}
          className={['table-header__cell', column.sortable && 'table-header__cell--sortable']
            .filter(Boolean)
            .join(' ')}
          onClick={() => handleSort(column)}
          role="columnheader"
        >
          <span className="table-header__label">{column.label}</span>
          {column.sortable && (
            <span
              className={['table-header__sort', column.sortState && 'table-header__sort--active']
                .filter(Boolean)
                .join(' ')}
              aria-hidden="true"
            >
              {column.sortState === 'desc' ? (
                <ChevronDown size={14} strokeWidth={2} />
              ) : (
                <ChevronUp size={14} strokeWidth={2} />
              )}
            </span>
          )}
        </div>
      ))}
      {showMenu && <div className="table-header__cell" aria-hidden="true" />}
    </div>
  );
});

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
  gridTemplateColumns: PropTypes.string,
  showMenu: PropTypes.bool,
};
