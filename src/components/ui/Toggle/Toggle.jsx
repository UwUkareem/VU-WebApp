import { memo, useCallback } from 'react';
import PropTypes from 'prop-types';
import './Toggle.css';

export const Toggle = memo(function Toggle({
  checked = false,
  disabled = false,
  onChange,
  id,
  name,
  className = '',
  ...props
}) {
  const handleChange = useCallback(
    (e) => {
      if (!disabled) onChange?.(e.target.checked);
    },
    [disabled, onChange]
  );

  return (
    <label
      className={['toggle', disabled && 'toggle--disabled', className].filter(Boolean).join(' ')}
      {...props}
    >
      <input
        type="checkbox"
        className="toggle__input"
        checked={checked}
        disabled={disabled}
        onChange={handleChange}
        id={id}
        name={name}
      />
      <span className="toggle__track">
        <span className="toggle__thumb" />
      </span>
    </label>
  );
});

Toggle.propTypes = {
  checked: PropTypes.bool,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  id: PropTypes.string,
  name: PropTypes.string,
  className: PropTypes.string,
};
