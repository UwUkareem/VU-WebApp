import './Hint.css';
import PropTypes from 'prop-types';
import { memo } from 'react';

export const Hint = memo(function Hint({ error, children, className = '', id }) {
  if (!children) return null;

  return (
    <span
      id={id}
      className={['input-hint', error && 'input-hint--error', className].filter(Boolean).join(' ')}
      role={error ? 'alert' : undefined}
      aria-live={error ? 'assertive' : undefined}
    >
      {children}
    </span>
  );
});

Hint.propTypes = {
  error: PropTypes.bool,
  children: PropTypes.node,
  className: PropTypes.string,
  id: PropTypes.string,
};
