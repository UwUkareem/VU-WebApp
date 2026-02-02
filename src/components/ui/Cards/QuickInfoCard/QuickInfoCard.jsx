import PropTypes from 'prop-types';
import { useEffect, useState, useRef } from 'react';
import Lottie from 'lottie-react';
import './QuickInfoCard.css';

export function QuickInfoCard({
  icon,
  lordicon,
  iconColor,
  number,
  title,
  className = '',
  animated = true,
  onClick,
}) {
  const [isVisible, setIsVisible] = useState(!animated);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);
  const lottieRef = useRef(null);

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

  // Trigger animation on hover
  useEffect(() => {
    if (!lottieRef.current) return;

    if (isHovered) {
      lottieRef.current.stop(); // resets internally WITHOUT clearing
      lottieRef.current.goToAndPlay(65, true);
    }
  }, [isHovered]);

  const isClickable = !!onClick;

  return (
    <div
      ref={cardRef}
      className={`quick-info-card ${
        isVisible ? 'quick-info-card--visible' : ''
      } ${isClickable ? 'quick-info-card--clickable' : ''} ${className}`.trim()}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
    >
      {lordicon ? (
        <div 
          className="quick-info-card__icon" 
          style={{ 
            '--icon-color': iconColor || 'var(--brand-500)',
          }}
        >
          <Lottie
            lottieRef={lottieRef}
            path={lordicon}
            loop={false}
            autoplay={false}
            onDOMLoaded={() => {
              lottieRef.current?.goToAndPlay(0, true);
            }}
            className="quick-info-card__lottie"
            style={{
              width: 40,
              height: 40,
            }}
          />
        </div>
      ) : icon ? (
        <div className="quick-info-card__icon" style={{ color: iconColor }}>
          {icon}
        </div>
      ) : null}

      <div className="quick-info-card__number">
        {typeof number === 'number' ? number.toLocaleString() : number}
      </div>

      <div className="quick-info-card__title">{title}</div>
    </div>
  );
}

QuickInfoCard.propTypes = {
  icon: PropTypes.node,
  lordicon: PropTypes.string,
  iconColor: PropTypes.string,
  number: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  title: PropTypes.string.isRequired,
  className: PropTypes.string,
  animated: PropTypes.bool,
  onClick: PropTypes.func,
};
