import { useEffect, useState, useRef, useMemo, memo } from 'react';
import PropTypes from 'prop-types';
import { Bookmark } from 'lucide-react';
import { User } from '../../User';
import { Button } from '../../Button';
import { Badge } from '../../Badge';
import './EntityCard.css';

const ICON_SIZE_SM = 16;
const ICON_SIZE_MD = 20;
const INTERSECTION_THRESHOLD = 0.2;
const SCORE_RADIUS = 20;
const SCORE_STROKE = 2.5;
const SCORE_CIRCUMFERENCE = 2 * Math.PI * SCORE_RADIUS;
const SCORE_RING_COLOR = 'rgba(255, 255, 255, 0.25)';

export const EntityCard = memo(function EntityCard({
  // User section
  showAvatar = true,
  userName,
  userEmail,
  userIcon,
  userImage,
  // Header controls
  caption,
  showBadge = false,
  badgeType = 'candidateState',
  badgeVariant = 'accepted',
  showButton = false,
  buttonText = 'Edit',
  onButtonClick,
  showSave = false,
  onSave,
  // Score indicator
  score,
  // Column data
  colLeft,
  colMid,
  colRight,
  // Description section
  showDescription = false,
  descriptionTitle,
  descriptionContent,
  className = '',
  animated = true,
}) {
  const [isVisible, setIsVisible] = useState(!animated);
  const cardRef = useRef(null);

  const scoreOffset = useMemo(() => {
    if (score == null) return SCORE_CIRCUMFERENCE;
    const pct = Math.max(0, Math.min(100, score)) / 100;
    return SCORE_CIRCUMFERENCE * (1 - pct);
  }, [score]);

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
      className={['entity-card', isVisible && 'entity-card--visible', className]
        .filter(Boolean)
        .join(' ')}
    >
      {/* Top section - User, Caption, Badge, Button, Save */}
      <div className="entity-card__top">
        <div className="entity-card__top-left">
          {showAvatar && userName && (
            <User
              className="entity-card__user"
              name={userName}
              email={userEmail}
              icon={userIcon}
              image={userImage}
            />
          )}
        </div>
        <div className="entity-card__top-right">
          {caption && <span className="entity-card__caption">{caption}</span>}
          {showBadge && <Badge type={badgeType} variant={badgeVariant} />}
          {showButton && (
            <Button className="entity-card__button" onClick={onButtonClick}>
              {buttonText}
            </Button>
          )}
          {showSave && (
            <button className="entity-card__save" onClick={onSave} aria-label="Save">
              <Bookmark size={ICON_SIZE_MD} />
            </button>
          )}
        </div>
      </div>

      {/* Separator */}
      {(colLeft || colMid || colRight) && <div className="entity-card__separator" />}

      {/* Columns section */}
      {(colLeft || colMid || colRight || score != null) && (
        <div className="entity-card__cols">
          <div className="entity-card__cols-content">
            {colLeft && (
              <div className="entity-card__col">
                {colLeft.icon && (
                  <colLeft.icon className="entity-card__col-icon" size={ICON_SIZE_SM} />
                )}
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
                {colMid.icon && (
                  <colMid.icon className="entity-card__col-icon" size={ICON_SIZE_SM} />
                )}
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
                {colRight.icon && (
                  <colRight.icon className="entity-card__col-icon" size={ICON_SIZE_SM} />
                )}
                <div className="entity-card__col-text">
                  <div className="entity-card__col-title">{colRight.title}</div>
                  {colRight.subtitle && (
                    <div className="entity-card__col-subtitle">{colRight.subtitle}</div>
                  )}
                </div>
              </div>
            )}
          </div>
          {score != null && (
            <div className="entity-card__score-block">
              <span className="entity-card__score-title">Score</span>
              <div className="entity-card__score" aria-label={`Score ${score}`}>
                <svg className="entity-card__score-ring" viewBox="0 0 48 48">
                  <circle
                    className="entity-card__score-track"
                    cx="24"
                    cy="24"
                    r={SCORE_RADIUS}
                    fill="none"
                    strokeWidth={SCORE_STROKE}
                  />
                  <circle
                    className="entity-card__score-fill"
                    cx="24"
                    cy="24"
                    r={SCORE_RADIUS}
                    fill="none"
                    strokeWidth={SCORE_STROKE}
                    strokeDasharray={SCORE_CIRCUMFERENCE}
                    strokeDashoffset={scoreOffset}
                    stroke={SCORE_RING_COLOR}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="entity-card__score-value">{score}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Description section */}
      {showDescription && descriptionTitle && (
        <div className="entity-card__description">
          <h3 className="entity-card__description-title">{descriptionTitle}</h3>
          {descriptionContent && (
            <p className="entity-card__description-content">{descriptionContent}</p>
          )}
        </div>
      )}
    </div>
  );
});

EntityCard.propTypes = {
  showAvatar: PropTypes.bool,
  userName: PropTypes.string,
  userEmail: PropTypes.string,
  userIcon: PropTypes.elementType,
  userImage: PropTypes.string,
  caption: PropTypes.string,
  showBadge: PropTypes.bool,
  badgeType: PropTypes.oneOf(['candidateState', 'cheatingFlag', 'jobStatus', 'role']),
  badgeVariant: PropTypes.string,
  showButton: PropTypes.bool,
  buttonText: PropTypes.string,
  onButtonClick: PropTypes.func,
  showSave: PropTypes.bool,
  onSave: PropTypes.func,
  score: PropTypes.number,
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
  showDescription: PropTypes.bool,
  descriptionTitle: PropTypes.string,
  descriptionContent: PropTypes.string,
  className: PropTypes.string,
  animated: PropTypes.bool,
};
