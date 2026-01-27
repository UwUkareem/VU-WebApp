import './Badge.css';
import PropTypes from 'prop-types';
import { ChevronDown } from 'lucide-react';
import { BADGE_VARIANTS } from './variants.js';

export function Badge({
  type = 'candidateState',
  variant,
  iconLeft,
  iconRight,
  dropdown,
  onClick,
  children,
  className = '',
  ...props
}) {
  const config = BADGE_VARIANTS[type]?.[variant];
  if (!config) return null;

  const { label, color, Icon } = config;
  const isClickable = !!onClick || dropdown;

  return (
    <span
      className={`badge badge--${color}${isClickable ? ' badge--clickable' : ''} ${className}`.trim()}
      onClick={onClick}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      {...props}
    >
      {iconLeft && (
        <span className="badge__icon">{iconLeft === true ? <Icon size={14} /> : iconLeft}</span>
      )}
      <span>{children || label}</span>
      {iconRight && (
        <span className="badge__icon">{iconRight === true ? <Icon size={14} /> : iconRight}</span>
      )}
      {dropdown && (
        <span className="badge__icon badge__dropdown">
          <ChevronDown size={14} />
        </span>
      )}
    </span>
  );
}

Badge.propTypes = {
  type: PropTypes.oneOf(['candidateState', 'cheatingFlag', 'jobStatus', 'role']),
  variant: PropTypes.string.isRequired,
  iconLeft: PropTypes.oneOfType([PropTypes.bool, PropTypes.node]),
  iconRight: PropTypes.oneOfType([PropTypes.bool, PropTypes.node]),
  dropdown: PropTypes.bool,
  onClick: PropTypes.func,
  children: PropTypes.node,
  className: PropTypes.string,
};
