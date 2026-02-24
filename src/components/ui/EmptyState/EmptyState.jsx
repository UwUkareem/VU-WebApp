import PropTypes from 'prop-types';
import './EmptyState.css';

/**
 * EmptyState - Reusable placeholder for pages/sections with no content
 *
 * Usage:
 * <EmptyState
 *   icon={<Briefcase size={24} />}
 *   title="No jobs yet"
 *   description="Create your first job posting to get started."
 * />
 */
export function EmptyState({ icon, title, description, action, className = '' }) {
  return (
    <div className={`empty-state ${className}`.trim()}>
      {icon && <div className="empty-state__icon">{icon}</div>}
      {title && <h3 className="empty-state__title">{title}</h3>}
      {description && <p className="empty-state__description">{description}</p>}
      {action && <div className="empty-state__action">{action}</div>}
    </div>
  );
}

EmptyState.propTypes = {
  /** Lucide icon or custom element displayed in the icon container */
  icon: PropTypes.node,
  /** Primary heading text */
  title: PropTypes.string,
  /** Supporting description text */
  description: PropTypes.string,
  /** Optional action element (e.g. a Button) */
  action: PropTypes.node,
  /** Additional CSS classes */
  className: PropTypes.string,
};
