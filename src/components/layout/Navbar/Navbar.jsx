import { useState, useRef, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Bell } from 'lucide-react';
import { Breadcrumb } from '../../ui/Breadcrumb';
import { NotificationDropdown } from './NotificationDropdown';
import './Navbar.css';

export function Navbar({ breadcrumbItems = [], className = '' }) {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);
  const dropdownRef = useRef(null);

  const close = useCallback(() => setIsNotificationOpen(false), []);

  useEffect(() => {
    if (!isNotificationOpen) return;
    const handleEvent = (e) => {
      if (e.type === 'keydown' && e.key === 'Escape') close();
      if (e.type === 'mousedown' && dropdownRef.current && !dropdownRef.current.contains(e.target))
        close();
    };
    document.addEventListener('mousedown', handleEvent);
    document.addEventListener('keydown', handleEvent);
    return () => {
      document.removeEventListener('mousedown', handleEvent);
      document.removeEventListener('keydown', handleEvent);
    };
  }, [isNotificationOpen, close]);

  const handleNotificationClick = () => {
    setIsNotificationOpen((prev) => !prev);
    if (!isNotificationOpen && notificationCount > 0) {
      // Mark as read when opened
      setNotificationCount(0);
    }
  };

  return (
    <nav className={`navbar ${className}`.trim()}>
      <div className="navbar__breadcrumb">
        {breadcrumbItems.length > 0 && <Breadcrumb items={breadcrumbItems} />}
      </div>
      <div className="navbar__actions">
        <div ref={dropdownRef} className="navbar__notification-wrapper">
          <button
            type="button"
            className={`navbar__notification-button${isNotificationOpen ? ' navbar__notification-button--active' : ''}`}
            onClick={handleNotificationClick}
            aria-label="Notifications"
            aria-expanded={isNotificationOpen}
          >
            <Bell size={20} />
            {notificationCount > 0 && (
              <span className="navbar__notification-badge">{notificationCount}</span>
            )}
          </button>
          <NotificationDropdown open={isNotificationOpen} onClose={close} />
        </div>
      </div>
    </nav>
  );
}

Navbar.propTypes = {
  breadcrumbItems: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      href: PropTypes.string,
      onClick: PropTypes.func,
    })
  ),
  className: PropTypes.string,
};
