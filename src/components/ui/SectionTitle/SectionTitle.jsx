import { memo } from 'react';
import PropTypes from 'prop-types';
import './SectionTitle.css';

export const SectionTitle = memo(function SectionTitle({
  children,
  description,
  action,
  className = '',
  as = 'h3',
}) {
  const Tag = as;
  return (
    <div className={['section-title', className].filter(Boolean).join(' ')}>
      <div className="section-title__content">
        <Tag className="section-title__heading">{children}</Tag>
        {description && <p className="section-title__description">{description}</p>}
      </div>
      {action && <div className="section-title__action">{action}</div>}
    </div>
  );
});

SectionTitle.propTypes = {
  children: PropTypes.node.isRequired,
  description: PropTypes.string,
  action: PropTypes.node,
  className: PropTypes.string,
  as: PropTypes.elementType,
};
