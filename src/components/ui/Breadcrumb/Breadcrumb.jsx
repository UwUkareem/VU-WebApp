import './Breadcrumb.css';
import PropTypes from 'prop-types';
import { ChevronRight } from 'lucide-react';

export function Breadcrumb({ items = [], className = '' }) {
  if (!items.length) return null;

  return (
    <nav className={`breadcrumb ${className}`.trim()} aria-label="Breadcrumb">
      <ol className="breadcrumb__list">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const isClickable = !isLast && (item.href || item.onClick);

          return (
            <li key={index} className="breadcrumb__item">
              {isClickable ? (
                <a
                  href={item.href}
                  onClick={item.onClick}
                  className="breadcrumb__link"
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </a>
              ) : (
                <span
                  className={`breadcrumb__text${isLast ? ' breadcrumb__text--current' : ''}`}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              )}
              {!isLast && (
                <ChevronRight size={16} className="breadcrumb__separator" aria-hidden="true" />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

Breadcrumb.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      href: PropTypes.string,
      onClick: PropTypes.func,
    })
  ).isRequired,
  className: PropTypes.string,
};
