import PropTypes from 'prop-types';
import { useEffect, useState, useRef } from 'react';
import { Sparkles } from 'lucide-react';
import './InfoCard.css';

export function InfoCard({
  title,
  description,
  showAiIcon = false,
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
      className={`info-card ${
        isVisible ? 'info-card--visible' : ''
      } ${isClickable ? 'info-card--clickable' : ''} ${showAiIcon ? 'info-card--has-ai' : ''} ${className}`.trim()}
      onClick={onClick}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
    >
      {/* Inner content wrapper */}
      <div className="info-card__inner">
        {/* Content */}
        <div className="info-card__header">
          <h3 className="info-card__title">{title}</h3>
          {showAiIcon && (
            <div className="info-card__ai-icon">
              <Sparkles size={16} />
            </div>
          )}
        </div>

        {description && <p className="info-card__description">{description}</p>}
      </div>
    </div>
  );
}

InfoCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  showAiIcon: PropTypes.bool,
  className: PropTypes.string,
  animated: PropTypes.bool,
  onClick: PropTypes.func,
};
