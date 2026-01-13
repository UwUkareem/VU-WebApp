import './Toggle.css';
import PropTypes from 'prop-types';

export function Toggle({
  checked = false,
  disabled = false,
  onChange,
  id,
  name,
  className = '',
  ...props
}) {
  const handleChange = (e) => {
    if (!disabled && onChange) {
      onChange(e.target.checked);
    }
  };

  return (
    <label
      className={`toggle ${disabled ? 'toggle--disabled' : ''} ${className}`.trim()}
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
}

Toggle.propTypes = {
  checked: PropTypes.bool,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  id: PropTypes.string,
  name: PropTypes.string,
  className: PropTypes.string,
};
