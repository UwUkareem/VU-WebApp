import { useEffect, useState, useRef, memo } from 'react';
import PropTypes from 'prop-types';
import './QuickInfoCard.css';

const INTERSECTION_THRESHOLD = 0.2;

export const QuickInfoCard = memo(function QuickInfoCard({
  icon,
  number,
  title,
  className = '',
  animated = true,
}) {
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
      { threshold: INTERSECTION_THRESHOLD }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [animated]);

  return (
    <div
      ref={cardRef}
      className={['quick-info-card', isVisible && 'quick-info-card--visible', className].filter(Boolean).join(' ')}
    >
      {icon && <div className="quick-info-card__icon">{icon}</div>}

      <div className="quick-info-card__content">
        <div className="quick-info-card__number">
          {typeof number === 'number' ? number.toLocaleString() : number}
        </div>

        <div className="quick-info-card__title">{title}</div>
      </div>
    </div>
  );
});

QuickInfoCard.propTypes = {
  icon: PropTypes.node,
  number: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  title: PropTypes.string.isRequired,
  className: PropTypes.string,
  animated: PropTypes.bool,
};
