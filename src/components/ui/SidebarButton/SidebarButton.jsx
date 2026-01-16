import PropTypes from 'prop-types';
import './SidebarButton.css';

export function SidebarButton({
  icon: Icon,
  label,
  isActive = false,
  onClick,
  subItems = [],
  className = '',
}) {
  const hasSubItems = subItems.length > 0;
  const hasActiveSubItem = hasSubItems && subItems.some((item) => item.isActive);
  const isButtonActive = isActive || hasActiveSubItem;

  return (
    <div className={`sidebar-button-wrapper ${className}`.trim()}>
      <button
        type="button"
        className={`sidebar-button${isButtonActive ? ' sidebar-button--active' : ''}`}
        onClick={onClick}
      >
        {Icon && (
          <span className="sidebar-button__icon" aria-hidden="true">
            <Icon size={20} />
          </span>
        )}
        <span className="sidebar-button__label">{label}</span>
      </button>

      {hasSubItems && hasActiveSubItem && (
        <div className="sidebar-button__subitems">
          {subItems.map((subItem, index) => (
            <SidebarSubItem
              key={index}
              label={subItem.label}
              isActive={subItem.isActive}
              onClick={subItem.onClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function SidebarSubItem({ label, isActive, onClick }) {
  return (
    <button
      type="button"
      className={`sidebar-subitem${isActive ? ' sidebar-subitem--active' : ''}`}
      onClick={onClick}
    >
      {isActive && <span className="sidebar-subitem__indicator" aria-hidden="true" />}
      <span className="sidebar-subitem__label">{label}</span>
    </button>
  );
}

SidebarButton.propTypes = {
  icon: PropTypes.elementType,
  label: PropTypes.string.isRequired,
  isActive: PropTypes.bool,
  onClick: PropTypes.func,
  subItems: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      isActive: PropTypes.bool,
      onClick: PropTypes.func,
    })
  ),
  className: PropTypes.string,
};

SidebarSubItem.propTypes = {
  label: PropTypes.string.isRequired,
  isActive: PropTypes.bool,
  onClick: PropTypes.func,
};
