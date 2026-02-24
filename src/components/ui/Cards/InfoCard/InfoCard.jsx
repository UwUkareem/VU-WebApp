import { useEffect, useState, useRef, memo } from 'react';
import PropTypes from 'prop-types';
import './InfoCard.css';

const INTERSECTION_THRESHOLD = 0.2;

export const InfoCard = memo(function InfoCard({
  title,
  description,
  className = '',
  animated = true,
  onClick,
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

  const isClickable = !!onClick;

  return (
    <div
      ref={cardRef}
      className={['info-card', isVisible && 'info-card--visible', isClickable && 'info-card--clickable', className].filter(Boolean).join(' ')}
      onClick={onClick}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
    >
      <h3 className="info-card__title">{title}</h3>
      {description && <p className="info-card__description">{description}</p>}
    </div>
  );
});

InfoCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  className: PropTypes.string,
  animated: PropTypes.bool,
  onClick: PropTypes.func,
};
