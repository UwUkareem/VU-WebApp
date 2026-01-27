import PropTypes from 'prop-types';
import { useEffect, useState, useRef } from 'react';
import { Star } from 'lucide-react';
import { Button } from '../../Button';
import { Badge } from '../../Badge';
import './ActionCard.css';

export function ActionCard({
  title,
  subtitle,
  caption,
  showBadge = false,
  badgeText = 'Accepted',
  badgeType = 'candidateState',
  badgeVariant = 'accepted',
  showButton = false,
  buttonText = 'Remove',
  onButtonClick,
  descriptionTitle,
  showDescriptionIcon = false,
  descriptionNumber,
  content,
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
      { threshold: 0.2 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [animated]);

  return (
    <div
      ref={cardRef}
      className={`action-card ${isVisible ? 'action-card--visible' : ''} ${className}`.trim()}
    >
      {/* Header row - Title, Caption, Badge, and Button */}
      <div className="action-card__header">
        <h2 className="action-card__title">{title}</h2>
        <div className="action-card__header-right">
          {caption && <span className="action-card__caption">{caption}</span>}
          {showBadge && (
            <Badge type={badgeType} variant={badgeVariant}>
              {badgeText}
            </Badge>
          )}
          {showButton && (
            <Button className="action-card__button" onClick={onButtonClick}>
              {buttonText}
            </Button>
          )}
        </div>
      </div>

      {/* Description row - Subtitle on left, icon/number/title on right */}
      {(subtitle || descriptionTitle) && (
        <div className="action-card__description-row">
          {subtitle && <p className="action-card__subtitle">{subtitle}</p>}
          {descriptionTitle && (
            <div className="action-card__description-meta">
              <span className="action-card__description-title">{descriptionTitle}</span>
              {showDescriptionIcon && <Star className="action-card__description-icon" size={16} />}
              {descriptionNumber && (
                <span className="action-card__description-number">{descriptionNumber}</span>
              )}
            </div>
          )}
        </div>
      )}

      {/* Content text */}
      {content && <p className="action-card__content">{content}</p>}
    </div>
  );
}

ActionCard.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  caption: PropTypes.string,
  showBadge: PropTypes.bool,
  badgeText: PropTypes.string,
  badgeType: PropTypes.oneOf(['candidateState', 'cheatingFlag', 'jobStatus', 'role']),
  badgeVariant: PropTypes.string,
  showButton: PropTypes.bool,
  buttonText: PropTypes.string,
  buttonVariant: PropTypes.oneOf(['primary', 'secondary', 'success', 'danger', 'ghost']),
  onButtonClick: PropTypes.func,
  descriptionTitle: PropTypes.string,
  showDescriptionIcon: PropTypes.bool,
  descriptionNumber: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  content: PropTypes.string,
  className: PropTypes.string,
  animated: PropTypes.bool,
};

export default ActionCard;
