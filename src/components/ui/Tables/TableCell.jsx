import PropTypes from 'prop-types';
import './TableCell.css';

export function TableCell({ children, color = 'primary', icon, width, className = '' }) {
  return (
    <div className={`table-cell table-cell--${color} ${className}`.trim()} style={{ width }}>
      {icon && <span className="table-cell__icon">{icon}</span>}
      <span className="table-cell__content">{children}</span>
    </div>
  );
}

TableCell.propTypes = {
  children: PropTypes.node,
  color: PropTypes.oneOf(['primary', 'secondary', 'tertiary']),
  icon: PropTypes.node,
  width: PropTypes.string,
  className: PropTypes.string,
};
