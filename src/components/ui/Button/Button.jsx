import './Button.css';
import PropTypes from 'prop-types';

const VARIANTS = ['primary', 'secondary', 'ghost'];

export function Button({
  children,
  variant = 'primary',
  disabled = false,
  iconLeft,
  iconRight,
  type = 'button',
  className = '',
  ...props
}) {
  // Fallback to primary if invalid variant passed
  const safeVariant = VARIANTS.includes(variant) ? variant : 'primary';

  return (
    <button
      type={type}
      className={`btn btn--${safeVariant} btn-text-lg-medium ${className}`.trim()}
      disabled={disabled}
      {...props}
    >
      {iconLeft && (
        <span className="btn__icon" aria-hidden="true">
          {iconLeft}
        </span>
      )}
      {children && <span>{children}</span>}
      {iconRight && (
        <span className="btn__icon" aria-hidden="true">
          {iconRight}
        </span>
      )}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.oneOf(['primary', 'secondary', 'ghost']),
  disabled: PropTypes.bool,
  iconLeft: PropTypes.node,
  iconRight: PropTypes.node,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  className: PropTypes.string,
};
