import { useState, useRef, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Badge } from './Badge';
import { BADGE_VARIANTS } from './variants.js';
import './RoleBadge.css';

const ROLES = Object.keys(BADGE_VARIANTS.role);

export function RoleBadge({ value = 'viewer', onChange, disabled, className = '' }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  const close = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    if (!isOpen) return;
    const handleEvent = (e) => {
      if (e.type === 'keydown' && e.key === 'Escape') close();
      if (e.type === 'mousedown' && ref.current && !ref.current.contains(e.target)) close();
    };
    document.addEventListener('mousedown', handleEvent);
    document.addEventListener('keydown', handleEvent);
    return () => {
      document.removeEventListener('mousedown', handleEvent);
      document.removeEventListener('keydown', handleEvent);
    };
  }, [isOpen, close]);

  const handleSelect = (role) => {
    onChange?.(role);
    close();
  };

  return (
    <div
      ref={ref}
      className={`role-badge${disabled ? ' role-badge--disabled' : ''} ${className}`.trim()}
    >
      <Badge
        type="role"
        variant={value}
        dropdown={!disabled}
        onClick={() => !disabled && setIsOpen((o) => !o)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      />
      {isOpen && (
        <div className="role-badge__dropdown" role="listbox">
          {ROLES.map((role) => (
            <button
              key={role}
              type="button"
              role="option"
              aria-selected={role === value}
              className={`role-badge__option role-badge__option--${BADGE_VARIANTS.role[role].color}${role === value ? ' role-badge__option--selected' : ''}`}
              onClick={() => handleSelect(role)}
            >
              {BADGE_VARIANTS.role[role].label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

RoleBadge.propTypes = {
  value: PropTypes.oneOf(['owner', 'editor', 'viewer']),
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};
