import { memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import './User.css';

const getInitials = (name) => {
  if (!name) return '';
  const parts = name.trim().split(/\s+/);
  return parts
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase();
};

export const User = memo(function User({ name, email, icon: Icon, image, className = '' }) {
  const initials = useMemo(() => getInitials(name), [name]);

  return (
    <div className={['user', className].filter(Boolean).join(' ')}>
      <div className="user__icon" aria-hidden="true">
        {image ? (
          <img src={image} alt={name} className="user__avatar-img" />
        ) : Icon ? (
          <Icon size={20} />
        ) : (
          <span className="user__initials">{initials}</span>
        )}
      </div>
      <div className="user__info">
        <span className="user__name">{name}</span>
        {email && <span className="user__email">{email}</span>}
      </div>
    </div>
  );
});

User.propTypes = {
  name: PropTypes.string.isRequired,
  email: PropTypes.string,
  icon: PropTypes.elementType,
  image: PropTypes.string,
  className: PropTypes.string,
};
