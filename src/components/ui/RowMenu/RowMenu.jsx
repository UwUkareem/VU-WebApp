import { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Check, ListFilter, X, Eye } from 'lucide-react';
import './RowMenu.css';

const MENU_OPTIONS = [
  { id: 'accept', label: 'Accept', icon: Check, variant: 'success' },
  { id: 'shortlist', label: 'Shortlist', icon: ListFilter, variant: 'info' },
  { id: 'reject', label: 'Reject', icon: X, variant: 'danger' },
  { id: 'view', label: 'View Details', icon: Eye, variant: 'default' },
];

export function RowMenu({ onSelect, open, onClose }) {
  const menuRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event) => {
      // Check if click is on menu button (has the table-row__menu class)
      if (event.target.closest('.table-row__menu')) {
        return; // Don't close if clicking the menu button
      }
      
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose?.();
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose?.();
      }
    };

    // Use setTimeout to avoid closing immediately after opening
    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open, onClose]);

  const handleOptionClick = (optionId) => {
    onSelect?.(optionId);
    onClose?.();
  };

  return (
    <div ref={menuRef} className={`row-menu${open ? ' row-menu--open' : ''}`}>
      {MENU_OPTIONS.map((option) => {
        const Icon = option.icon;
        return (
          <button
            key={option.id}
            type="button"
            className={`row-menu__item row-menu__item--${option.variant}`}
            onClick={() => handleOptionClick(option.id)}
          >
            <Icon size={16} className="row-menu__icon" />
            <span className="row-menu__label">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}

RowMenu.propTypes = {
  onSelect: PropTypes.func,
  open: PropTypes.bool,
  onClose: PropTypes.func,
};
