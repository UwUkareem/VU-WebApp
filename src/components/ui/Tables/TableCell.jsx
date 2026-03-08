import { memo } from 'react';
import PropTypes from 'prop-types';
import './TableCell.css';

export const TableCell = memo(function TableCell({
  children,
  color = 'primary',
  icon,
  className = '',
}) {
  return (
    <div className={['table-cell', `table-cell--${color}`, className].filter(Boolean).join(' ')}>
      {icon && <span className="table-cell__icon">{icon}</span>}
      <span className="table-cell__content">{children}</span>
    </div>
  );
});

TableCell.propTypes = {
  children: PropTypes.node,
  color: PropTypes.oneOf(['primary', 'secondary', 'tertiary', 'accent']),
  icon: PropTypes.node,
  className: PropTypes.string,
};
