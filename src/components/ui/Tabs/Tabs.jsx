import PropTypes from 'prop-types';
import './Tabs.css';

export function Tabs({ items = [], className = '' }) {
  return (
    <div className={`tabs ${className}`.trim()} role="tablist">
      {items.map((item, index) => (
        <Tab key={index} label={item.label} isActive={item.isActive} onClick={item.onClick} />
      ))}
    </div>
  );
}

function Tab({ label, isActive, onClick }) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      className={`tab${isActive ? ' tab--active' : ''}`}
      onClick={onClick}
    >
      <span className="tab__label">{label}</span>
      {isActive && <span className="tab__indicator" aria-hidden="true" />}
    </button>
  );
}

Tabs.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      isActive: PropTypes.bool,
      onClick: PropTypes.func,
    })
  ),
  className: PropTypes.string,
};

Tab.propTypes = {
  label: PropTypes.string.isRequired,
  isActive: PropTypes.bool,
  onClick: PropTypes.func,
};
