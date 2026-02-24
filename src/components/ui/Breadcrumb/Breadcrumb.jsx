import { memo } from 'react';
import PropTypes from 'prop-types';
import { ChevronRight } from 'lucide-react';
import './Breadcrumb.css';

const SEPARATOR_SIZE = 14;

export const Breadcrumb = memo(function Breadcrumb({ items = [], className = '' }) {
  if (!items.length) return null;

  return (
    <nav className={className ? `breadcrumb ${className}` : 'breadcrumb'} aria-label="Breadcrumb">
      <ol className="breadcrumb__list">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const isClickable = !isLast && (item.href || item.onClick);
          const LabelTag = isClickable ? 'a' : 'span';

          return (
            <li
              key={item.id || `breadcrumb-${index}`}
              className="breadcrumb__item"
              style={{ '--item-index': index }}
            >
              <LabelTag
                href={isClickable ? item.href : undefined}
                onClick={isClickable ? item.onClick : undefined}
                className={`breadcrumb__label ${isClickable ? 'breadcrumb__link' : 'breadcrumb__text'}${isLast ? ' breadcrumb__text--current' : ''}`}
                aria-current={isLast ? 'page' : undefined}
              >
                {item.label}
              </LabelTag>
              {!isLast && (
                <ChevronRight
                  size={SEPARATOR_SIZE}
                  className="breadcrumb__separator"
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
});

Breadcrumb.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      label: PropTypes.string.isRequired,
      href: PropTypes.string,
      onClick: PropTypes.func,
    })
  ).isRequired,
  className: PropTypes.string,
};
