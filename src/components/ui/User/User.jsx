import PropTypes from 'prop-types';
import './User.css';

export function User({ name, email, icon: Icon, className = '' }) {
  return (
    <div className={`user ${className}`.trim()}>
      {Icon && (
        <div className="user__icon" aria-hidden="true">
          <Icon size={20} />
        </div>
      )}
      <div className="user__info">
        <div className="user__name">{name}</div>
        <div className="user__email">{email}</div>
      </div>
    </div>
  );
}

User.propTypes = {
  name: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  icon: PropTypes.elementType,
  className: PropTypes.string,
};
