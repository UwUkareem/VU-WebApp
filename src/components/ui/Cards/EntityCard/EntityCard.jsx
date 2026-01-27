import PropTypes from 'prop-types';
import { useEffect, useState, useRef } from 'react';
import { MoreHorizontal, Bookmark } from 'lucide-react';
import { User } from '../../User';
import { Button } from '../../Button';
import { Badge } from '../../Badge';
import './EntityCard.css';

export function EntityCard({
  // User section
  showAvatar = true,
  userName,
  userEmail,
  userIcon,
  // Header controls
  caption,
  showBadge = false,
  badgeType = 'candidateState',
  badgeVariant = 'accepted',
  showButton = false,
  buttonText = 'Edit',
  buttonVariant = 'primary',
  onButtonClick,
  showSave = false,
  onSave,
  // Column data
  colLeft,
  colMid,
  colRight,
  showMenu = false,
  onMenuClick,
  // Description section
  showDescription = false,
  descriptionTitle,
  descriptionContent,
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
      className={`entity-card ${isVisible ? 'entity-card--visible' : ''} ${className}`.trim()}
    >
      {/* Top section - User, Caption, Badge, Button, Save */}
      <div className="entity-card__top">
        <div className="entity-card__top-left">
          {showAvatar && userName && (
            <User className="entity-card__user" name={userName} email={userEmail} icon={userIcon} />
          )}
        </div>
        <div className="entity-card__top-right">
          {caption && <span className="entity-card__caption">{caption}</span>}
          {showBadge && <Badge type={badgeType} variant={badgeVariant} />}
          {showButton && (
            <Button
              className="entity-card__button"
              variant={buttonVariant}
              size="md"
              onClick={onButtonClick}
            >
              {buttonText}
            </Button>
          )}
          {showSave && (
            <button className="entity-card__save" onClick={onSave} aria-label="Save">
              <Bookmark size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Separator */}
      {(colLeft || colMid || colRight) && <div className="entity-card__separator" />}

      {/* Columns section */}
      {(colLeft || colMid || colRight) && (
        <div className="entity-card__cols">
          <div className="entity-card__cols-content">
            {colLeft && (
              <div className="entity-card__col">
                {colLeft.icon && <colLeft.icon className="entity-card__col-icon" size={16} />}
                <div className="entity-card__col-text">
                  <div className="entity-card__col-title">{colLeft.title}</div>
                  {colLeft.subtitle && (
                    <div className="entity-card__col-subtitle">{colLeft.subtitle}</div>
                  )}
                </div>
              </div>
            )}
            {colMid && (
              <div className="entity-card__col">
                {colMid.icon && <colMid.icon className="entity-card__col-icon" size={16} />}
                <div className="entity-card__col-text">
                  <div className="entity-card__col-title">{colMid.title}</div>
                  {colMid.subtitle && (
                    <div className="entity-card__col-subtitle">{colMid.subtitle}</div>
                  )}
                </div>
              </div>
            )}
            {colRight && (
              <div className="entity-card__col">
                {colRight.icon && <colRight.icon className="entity-card__col-icon" size={16} />}
                <div className="entity-card__col-text">
                  <div className="entity-card__col-title">{colRight.title}</div>
                  {colRight.subtitle && (
                    <div className="entity-card__col-subtitle">{colRight.subtitle}</div>
                  )}
                </div>
              </div>
            )}
          </div>
          {showMenu && (
            <button className="entity-card__menu" onClick={onMenuClick} aria-label="Menu">
              <MoreHorizontal size={20} />
            </button>
          )}
        </div>
      )}

      {/* Description section */}
      {showDescription && descriptionTitle && (
        <>
          <div className="entity-card__description">
            <h3 className="entity-card__description-title">{descriptionTitle}</h3>
            {descriptionContent && (
              <p className="entity-card__description-content">{descriptionContent}</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

EntityCard.propTypes = {
  showAvatar: PropTypes.bool,
  userName: PropTypes.string,
  userEmail: PropTypes.string,
  userIcon: PropTypes.elementType,
  caption: PropTypes.string,
  showBadge: PropTypes.bool,
  badgeType: PropTypes.oneOf(['candidateState', 'cheatingFlag', 'jobStatus', 'role']),
  badgeVariant: PropTypes.string,
  showButton: PropTypes.bool,
  buttonText: PropTypes.string,
  buttonVariant: PropTypes.oneOf(['primary', 'secondary', 'success', 'danger', 'ghost']),
  onButtonClick: PropTypes.func,
  showSave: PropTypes.bool,
  onSave: PropTypes.func,
  colLeft: PropTypes.shape({
    icon: PropTypes.elementType,
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
  }),
  colMid: PropTypes.shape({
    icon: PropTypes.elementType,
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
  }),
  colRight: PropTypes.shape({
    icon: PropTypes.elementType,
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
  }),
  showMenu: PropTypes.bool,
  onMenuClick: PropTypes.func,
  showDescription: PropTypes.bool,
  descriptionTitle: PropTypes.string,
  descriptionContent: PropTypes.string,
  className: PropTypes.string,
  animated: PropTypes.bool,
};

export default EntityCard;
