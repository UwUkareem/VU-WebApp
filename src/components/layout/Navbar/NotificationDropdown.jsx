import PropTypes from 'prop-types';
import { Bell, X } from 'lucide-react';
import './NotificationDropdown.css';

// Dummy notification data
const DUMMY_NOTIFICATIONS = [
  {
    id: 1,
    userName: 'Kate Young',
    userAvatar: 'KY',
    message: 'Great Shot Adam! Really enjoying the composition on this piece.',
    time: '5 mins ago',
    unread: true,
  },
  {
    id: 2,
    userName: 'Brandon Newman',
    userAvatar: 'BN',
    message: 'Liked your photo: UI/UX Inspo',
    time: '21 mins ago',
    unread: true,
  },
  {
    id: 3,
    userName: 'Dave Wood',
    userAvatar: 'DW',
    message: 'Liked your photo: Daily UI Challenge 048',
    time: '3hrs ago',
    unread: false,
  },
  {
    id: 4,
    userName: 'Kate Young',
    userAvatar: 'KY',
    message: 'Liked your photo: Daily UI Challenge 048',
    time: '3hrs ago',
    unread: false,
  },
  {
    id: 5,
    userName: 'Anna Lee',
    userAvatar: 'AL',
    message: 'Woah! Loving these colours! Keep it up',
    time: '1 day ago',
    unread: false,
  },
];

export function NotificationDropdown({ onClose, open }) {
  const notifications = DUMMY_NOTIFICATIONS;
  const hasNotifications = notifications.length > 0;

  return (
    <div className={`notification-dropdown${open ? ' open' : ''}`}>
      <div className="notification-dropdown__header">
        <div className="notification-dropdown__title-wrapper">
          <Bell size={18} className="notification-dropdown__icon" />
          <h3 className="notification-dropdown__title">Notifications</h3>
        </div>
        <button
          type="button"
          className="notification-dropdown__close"
          onClick={onClose}
          aria-label="Close notifications"
        >
          <X size={18} />
        </button>
      </div>

      <div className="notification-dropdown__body">
        {hasNotifications ? (
          <>
            <ul className="notification-dropdown__list">
              {notifications.map((notification) => (
                <li
                  key={notification.id}
                  className={`notification-item${notification.unread ? ' notification-item--unread' : ''}`}
                >
                  <div className="notification-item__avatar">{notification.userAvatar}</div>
                  <div className="notification-item__content">
                    <div className="notification-item__header">
                      <span className="notification-item__name">{notification.userName}</span>
                      <span className="notification-item__time">{notification.time}</span>
                    </div>
                    <p className="notification-item__message">{notification.message}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="notification-dropdown__footer">
              <a href="#" className="notification-dropdown__link">
                See all incoming activity
              </a>
            </div>
          </>
        ) : (
          <div className="notification-dropdown__empty">
            <Bell size={48} className="notification-dropdown__empty-icon" />
            <h4 className="notification-dropdown__empty-title">No notifications yet</h4>
            <p className="notification-dropdown__empty-text">
              When you get notifications, they'll show up here
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

NotificationDropdown.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};
