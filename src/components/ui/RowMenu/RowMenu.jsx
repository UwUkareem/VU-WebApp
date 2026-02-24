import { useRef, useEffect, useCallback, useState, memo } from 'react';
import PropTypes from 'prop-types';
import { Check, ListFilter, X, Eye } from 'lucide-react';
import './RowMenu.css';

const DEFAULT_OPTIONS = [
  { id: 'accept', label: 'Accept', icon: Check, variant: 'success' },
  { id: 'shortlist', label: 'Shortlist', icon: ListFilter, variant: 'info' },
  { id: 'reject', label: 'Reject', icon: X, variant: 'danger' },
  { id: 'view', label: 'View Details', icon: Eye, variant: 'default' },
];

export const RowMenu = memo(function RowMenu({
  options = DEFAULT_OPTIONS,
  onSelect,
  open,
  onClose,
  triggerRef,
}) {
  const menuRef = useRef(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  // Position the menu relative to the trigger button
  useEffect(() => {
    if (!open || !triggerRef?.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const menuHeight = menuRef.current?.offsetHeight || 160;
    const spaceBelow = window.innerHeight - rect.bottom;
    const top = spaceBelow < menuHeight + 8 ? rect.top - menuHeight - 4 : rect.bottom + 4;
    setPos({ top, left: rect.right - (menuRef.current?.offsetWidth || 160) });
  }, [open, triggerRef]);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e) => {
      if (e.target.closest('.table-row__menu')) return;
      if (menuRef.current && !menuRef.current.contains(e.target)) onClose?.();
    };

    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose?.();
    };

    const id = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }, 0);

    return () => {
      clearTimeout(id);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open, onClose]);

  const handleOptionClick = useCallback(
    (optionId) => {
      onSelect?.(optionId);
      onClose?.();
    },
    [onSelect, onClose]
  );

  return (
    <div
      ref={menuRef}
      className={['row-menu', open && 'row-menu--open'].filter(Boolean).join(' ')}
      role="menu"
      style={{ top: pos.top, left: pos.left }}
    >
      {options.map(({ id, label, icon: Icon, variant = 'default' }) => (
        <button
          key={id}
          type="button"
          role="menuitem"
          className={`row-menu__item row-menu__item--${variant}`}
          onClick={() => handleOptionClick(id)}
        >
          {Icon && <Icon size={16} className="row-menu__icon" />}
          <span className="row-menu__label">{label}</span>
        </button>
      ))}
    </div>
  );
});

RowMenu.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      icon: PropTypes.elementType,
      variant: PropTypes.oneOf(['default', 'success', 'info', 'danger']),
    })
  ),
  onSelect: PropTypes.func,
  open: PropTypes.bool,
  onClose: PropTypes.func,
  triggerRef: PropTypes.object,
};
