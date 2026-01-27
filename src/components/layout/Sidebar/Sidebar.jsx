import PropTypes from 'prop-types';
import { SidebarButton } from '../../ui/SidebarButton';
import { User } from '../../ui/User';
import './Sidebar.css';

export function Sidebar({ logo, navItems = [], user, className = '' }) {
  return (
    <aside className={`sidebar ${className}`.trim()}>
      <div className="sidebar__content">
        {/* Logo */}
        <div className="sidebar__logo">
          {logo || <span className="sidebar__logo-placeholder">Logo</span>}
        </div>

        {/* Navigation */}
        <nav className="sidebar__nav">
          {navItems.map((item, index) => (
            <div key={index}>
              {item.separator && <div className="sidebar__separator" />}
              <SidebarButton
                icon={item.icon}
                label={item.label}
                isActive={item.isActive}
                onClick={item.onClick}
                subItems={item.subItems}
              />
            </div>
          ))}
        </nav>
      </div>

      {/* User */}
      {user && (
        <div className="sidebar__user">
          <User name={user.name} email={user.email} icon={user.icon} />
        </div>
      )}
    </aside>
  );
}

Sidebar.propTypes = {
  logo: PropTypes.node,
  navItems: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.elementType,
      label: PropTypes.string.isRequired,
      isActive: PropTypes.bool,
      onClick: PropTypes.func,
      separator: PropTypes.bool,
      subItems: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string.isRequired,
          isActive: PropTypes.bool,
          onClick: PropTypes.func,
        })
      ),
    })
  ),
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    icon: PropTypes.elementType,
  }),
  className: PropTypes.string,
};
