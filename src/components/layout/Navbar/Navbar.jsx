import { useState, useRef, useEffect, useCallback, memo } from 'react';
import PropTypes from 'prop-types';
import { Bell, UserCircle2, Building2, LogOut, User } from 'lucide-react';
import { Breadcrumb } from '../../ui/Breadcrumb';
import { NotificationDropdown } from './NotificationDropdown';
import './Navbar.css';

const EMPTY_BREADCRUMBS = [];

/* ── Helper: initials from name ── */
function getInitials(name = '') {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? '')
    .join('');
}

const Navbar = memo(function Navbar({
  breadcrumbItems = EMPTY_BREADCRUMBS,
  className = '',
  user,
  onNavigate,
}) {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);
  const [isAvatarOpen, setIsAvatarOpen] = useState(false);

  const notifRef = useRef(null);
  const avatarRef = useRef(null);

  /* ── Click-outside / Escape for both dropdowns ── */
  useEffect(() => {
    if (!isNotificationOpen && !isAvatarOpen) return;
    const handleEvent = (e) => {
      if (e.type === 'keydown' && e.key === 'Escape') {
        setIsNotificationOpen(false);
        setIsAvatarOpen(false);
        return;
      }
      if (e.type === 'mousedown') {
        if (isNotificationOpen && notifRef.current && !notifRef.current.contains(e.target))
          setIsNotificationOpen(false);
        if (isAvatarOpen && avatarRef.current && !avatarRef.current.contains(e.target))
          setIsAvatarOpen(false);
      }
    };
    document.addEventListener('mousedown', handleEvent);
    document.addEventListener('keydown', handleEvent);
    return () => {
      document.removeEventListener('mousedown', handleEvent);
      document.removeEventListener('keydown', handleEvent);
    };
  }, [isNotificationOpen, isAvatarOpen]);

  const handleNotificationClick = useCallback(() => {
    setIsAvatarOpen(false);
    setIsNotificationOpen((prev) => !prev);
    if (!isNotificationOpen && notificationCount > 0) setNotificationCount(0);
  }, [isNotificationOpen, notificationCount]);

  const handleAvatarClick = useCallback(() => {
    setIsNotificationOpen(false);
    setIsAvatarOpen((prev) => !prev);
  }, []);

  const handleNavItem = useCallback(
    (page) => {
      setIsAvatarOpen(false);
      onNavigate?.(page);
    },
    [onNavigate]
  );

  /* ── Avatar menu items ── */
  const AVATAR_MENU = [
    { icon: User, label: 'My Profile', page: 'profile' },
    { icon: Building2, label: 'Company Settings', page: 'company-settings' },
  ];

  return (
    <nav className={['navbar', className].filter(Boolean).join(' ')}>
      <div className="navbar__breadcrumb">
        {breadcrumbItems.length > 0 && <Breadcrumb items={breadcrumbItems} />}
      </div>
      <div className="navbar__actions">
        {/* Notifications */}
        <div ref={notifRef} className="navbar__notification-wrapper">
          <button
            type="button"
            className={[
              'navbar__notification-button',
              isNotificationOpen && 'navbar__notification-button--active',
            ]
              .filter(Boolean)
              .join(' ')}
            onClick={handleNotificationClick}
            aria-label="Notifications"
            aria-expanded={isNotificationOpen}
          >
            <Bell size={20} />
            {notificationCount > 0 && (
              <span className="navbar__notification-badge">{notificationCount}</span>
            )}
          </button>
          <NotificationDropdown
            open={isNotificationOpen}
            onClose={() => setIsNotificationOpen(false)}
          />
        </div>

        {/* Avatar */}
        <div ref={avatarRef} className="navbar__avatar-wrapper">
          <button
            type="button"
            className={['navbar__avatar-button', isAvatarOpen && 'navbar__avatar-button--active']
              .filter(Boolean)
              .join(' ')}
            onClick={handleAvatarClick}
            aria-label="User menu"
            aria-expanded={isAvatarOpen}
          >
            {user?.name ? (
              <span className="navbar__avatar-initials">{getInitials(user.name)}</span>
            ) : (
              <UserCircle2 size={20} />
            )}
          </button>

          {isAvatarOpen && (
            <div className="navbar__avatar-dropdown" role="menu">
              {/* User info header */}
              {user && (
                <div className="navbar__avatar-header">
                  <div className="navbar__avatar-header-avatar">{getInitials(user.name)}</div>
                  <div className="navbar__avatar-header-info">
                    <span className="navbar__avatar-name">{user.name}</span>
                    <span className="navbar__avatar-email">{user.email}</span>
                  </div>
                </div>
              )}

              <div className="navbar__avatar-divider" />

              {/* Menu items */}
              {AVATAR_MENU.map(({ icon: Icon, label, page }) => (
                <button
                  key={page}
                  type="button"
                  className="navbar__avatar-item"
                  role="menuitem"
                  onClick={() => handleNavItem(page)}
                >
                  <Icon size={14} />
                  <span>{label}</span>
                </button>
              ))}

              <div className="navbar__avatar-divider" />

              {/* Logout */}
              <button
                type="button"
                className="navbar__avatar-item navbar__avatar-item--danger"
                role="menuitem"
                onClick={() => setIsAvatarOpen(false)}
              >
                <LogOut size={14} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
});

export { Navbar };

Navbar.propTypes = {
  breadcrumbItems: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      href: PropTypes.string,
      onClick: PropTypes.func,
    })
  ),
  className: PropTypes.string,
  user: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
  }),
  onNavigate: PropTypes.func,
};
