import PropTypes from 'prop-types';
import { MoreHorizontal } from 'lucide-react';
import { RowMenu } from '../RowMenu';
import './TableRow.css';

export function TableRow({
  children,
  showMenu = false,
  onMenuClick,
  onMenuSelect,
  onClick,
  className = '',
  gridTemplateColumns,
  menuOpen = false,
  onMenuClose,
}) {
  const isClickable = !!onClick;

  return (
    <div
      className={`table-row${isClickable ? ' table-row--clickable' : ''} ${className}`.trim()}
      onClick={onClick}
      role="row"
      style={gridTemplateColumns ? { display: 'grid', gridTemplateColumns } : {}}
    >
      {children}
      {showMenu && (
        <div className="table-row__menu-wrapper">
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
          <RowMenu open={menuOpen} onClose={onMenuClose} onSelect={onMenuSelect} />
        </div>
      )}
    </div>
  );
}

TableRow.propTypes = {
  children: PropTypes.node.isRequired,
  showMenu: PropTypes.bool,
  onMenuClick: PropTypes.func,
  onMenuSelect: PropTypes.func,
  onClick: PropTypes.func,
  className: PropTypes.string,
  gridTemplateColumns: PropTypes.string,
  menuOpen: PropTypes.bool,
  onMenuClose: PropTypes.func,
};
