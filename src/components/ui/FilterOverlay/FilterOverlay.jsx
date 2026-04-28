import { memo, useState, useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { X } from 'lucide-react';
import { Button } from '../Button';
import { Toggle } from '../Toggle';
import { InputField, DropdownInput } from '../Input';
import './FilterOverlay.css';

/**
 * Generic filter overlay panel.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {Function} props.onClose
 * @param {Array} props.filters - Array of filter definitions:
 *   { key, label, type: 'select'|'multiselect'|'range'|'toggle', options?, min?, max?, toggleLabel? }
 * @param {Object} props.values - Current filter values keyed by filter key
 * @param {Function} props.onApply - Called with final values object
 */
export const FilterOverlay = memo(function FilterOverlay({
  isOpen,
  onClose,
  filters = [],
  values = {},
  onApply,
}) {
  const [localValues, setLocalValues] = useState(values);
  const panelRef = useRef(null);

  // Sync when external values change
  useEffect(() => {
    setLocalValues(values);
  }, [values]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  // Click outside panel
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      const clickedPanel = panelRef.current && panelRef.current.contains(e.target);
      const clickedDropdownMenu = e.target.closest?.('.dropdown-input__menu');
      if (!clickedPanel && !clickedDropdownMenu) onClose();
    };
    // delay to avoid catching the click that opened the overlay
    const id = setTimeout(() => document.addEventListener('mousedown', handler), 0);
    return () => {
      clearTimeout(id);
      document.removeEventListener('mousedown', handler);
    };
  }, [isOpen, onClose]);

  const handleChange = useCallback((key, value) => {
    setLocalValues((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleMultiToggle = useCallback((key, option) => {
    setLocalValues((prev) => {
      const current = prev[key] || [];
      return {
        ...prev,
        [key]: current.includes(option)
          ? current.filter((v) => v !== option)
          : [...current, option],
      };
    });
  }, []);

  const handleApply = useCallback(() => {
    onApply(localValues);
    onClose();
  }, [localValues, onApply, onClose]);

  const handleReset = useCallback(() => {
    const empty = {};
    filters.forEach((f) => {
      if (f.type === 'multiselect') empty[f.key] = [];
      else if (f.type === 'range') empty[f.key] = { min: '', max: '' };
      else if (f.type === 'toggle') empty[f.key] = false;
      else empty[f.key] = '';
    });
    setLocalValues(empty);
    onApply(empty);
    onClose();
  }, [filters, onApply, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="filter-overlay">
      <div className="filter-overlay__backdrop" />
      <div className="filter-overlay__panel" ref={panelRef}>
        <div className="filter-overlay__header">
          <h3 className="filter-overlay__title">Filters</h3>
          <button className="filter-overlay__close" onClick={onClose} aria-label="Close filters">
            <X size={18} />
          </button>
        </div>

        <div className="filter-overlay__body">
          {filters.map((filter) => (
            <div key={filter.key} className="filter-overlay__section">
              <span className="filter-overlay__label">{filter.label}</span>
              {renderFilterControl(filter, localValues, handleChange, handleMultiToggle)}
            </div>
          ))}
        </div>

        <div className="filter-overlay__footer">
          <Button variant="ghost" size="sm" onClick={handleReset}>
            Reset All
          </Button>
          <Button variant="primary" size="sm" onClick={handleApply}>
            Apply Filters
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
});

function renderFilterControl(filter, values, onChange, onMultiToggle) {
  switch (filter.type) {
    case 'select': {
      const opts = filter.options.map((opt) =>
        typeof opt === 'string' ? { value: opt, label: opt } : opt
      );
      return (
        <DropdownInput
          showLabel={false}
          showHint={false}
          options={[{ value: '', label: 'All' }, ...opts]}
          value={values[filter.key] || ''}
          onChange={(val) => onChange(filter.key, val)}
        />
      );
    }

    case 'multiselect':
      return (
        <div className="filter-overlay__chips">
          {filter.options.map((opt) => {
            const value = opt.value ?? opt;
            const label = opt.label ?? opt;
            const isActive = (values[filter.key] || []).includes(value);
            return (
              <button
                key={value}
                type="button"
                className={`filter-overlay__chip${isActive ? ' filter-overlay__chip--active' : ''}`}
                onClick={() => onMultiToggle(filter.key, value)}
              >
                {label}
              </button>
            );
          })}
        </div>
      );

    case 'range': {
      const rangeVal = values[filter.key] || {};
      return (
        <div className="filter-overlay__range">
          <InputField
            type="number"
            placeholder={filter.minLabel || 'Min'}
            value={rangeVal.min ?? ''}
            onChange={(e) => onChange(filter.key, { ...rangeVal, min: e.target.value })}
          />
          <span className="filter-overlay__range-sep">—</span>
          <InputField
            type="number"
            placeholder={filter.maxLabel || 'Max'}
            value={rangeVal.max ?? ''}
            onChange={(e) => onChange(filter.key, { ...rangeVal, max: e.target.value })}
          />
        </div>
      );
    }

    case 'toggle':
      return (
        <div className="filter-overlay__toggle-row">
          <span className="filter-overlay__toggle-label">{filter.toggleLabel}</span>
          <Toggle
            checked={!!values[filter.key]}
            onChange={(checked) => onChange(filter.key, checked)}
          />
        </div>
      );

    default:
      return null;
  }
}

FilterOverlay.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  filters: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      type: PropTypes.oneOf(['select', 'multiselect', 'range', 'toggle']).isRequired,
      options: PropTypes.array,
      toggleLabel: PropTypes.string,
      minLabel: PropTypes.string,
      maxLabel: PropTypes.string,
    })
  ).isRequired,
  values: PropTypes.object.isRequired,
  onApply: PropTypes.func.isRequired,
};
