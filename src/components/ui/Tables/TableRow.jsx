import PropTypes from 'prop-types';
import { MoreHorizontal } from 'lucide-react';
import './TableRow.css';

export function TableRow({ children, showMenu = false, onMenuClick, onClick, className = '' }) {
  const isClickable = !!onClick;

  return (
    <div
      className={`table-row${isClickable ? ' table-row--clickable' : ''} ${className}`.trim()}
      onClick={onClick}
      role="row"
    >
      <div className="table-row__content">{children}</div>
      {showMenu && (
        <button
          className="table-row__menu"
          onClick={(e) => {
            e.stopPropagation();
            onMenuClick?.(e);
          }}
          aria-label="Row actions"
        >
          <MoreHorizontal size={16} />
        </button>
      )}
    </div>
  );
}

TableRow.propTypes = {
  children: PropTypes.node.isRequired,
  showMenu: PropTypes.bool,
  onMenuClick: PropTypes.func,
  onClick: PropTypes.func,
  className: PropTypes.string,
};
