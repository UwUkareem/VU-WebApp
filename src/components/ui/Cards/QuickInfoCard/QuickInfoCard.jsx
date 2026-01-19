import PropTypes from 'prop-types';
import { useEffect, useState, useRef } from 'react';
import './QuickInfoCard.css';

export function QuickInfoCard({ icon, number, title, className = '', animated = true, onClick }) {
  const [isVisible, setIsVisible] = useState(!animated);
  const cardRef = useRef(null);

  useEffect(() => {
    if (!animated) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [animated]);

  const isClickable = !!onClick;

  return (
    <div
      ref={cardRef}
      className={`quick-info-card ${
        isVisible ? 'quick-info-card--visible' : ''
      } ${isClickable ? 'quick-info-card--clickable' : ''} ${className}`.trim()}
      onClick={onClick}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
    >
      {icon && <div className="quick-info-card__icon">{icon}</div>}
      <div className="quick-info-card__number">
        {typeof number === 'number' ? number.toLocaleString() : number}
      </div>

      <div className="quick-info-card__title">{title}</div>
    </div>
  );
}

QuickInfoCard.propTypes = {
  icon: PropTypes.node,
  number: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  title: PropTypes.string.isRequired,
  className: PropTypes.string,
  animated: PropTypes.bool,
  onClick: PropTypes.func,
};
