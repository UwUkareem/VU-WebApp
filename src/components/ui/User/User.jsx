import { memo } from 'react';
import PropTypes from 'prop-types';
import './User.css';

export const User = memo(function User({ name, email, icon: Icon, className = '' }) {
  return (
    <div className={['user', className].filter(Boolean).join(' ')}>
      {Icon && (
        <div className="user__icon" aria-hidden="true">
          <Icon size={20} />
        </div>
      )}
      <div className="user__info">
        <span className="user__name">{name}</span>
        <span className="user__email">{email}</span>
      </div>
    </div>
  );
});

User.propTypes = {
  name: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  icon: PropTypes.elementType,
  className: PropTypes.string,
};
