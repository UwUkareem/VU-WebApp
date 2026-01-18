import PropTypes from 'prop-types';
import { useEffect, useState, useRef } from 'react';
import './StatsChart.css';

/**
 * Interpolate between brand colors based on value (0-100)
 * Uses HSL interpolation for smooth color transitions
 * brand-100 (#ffdacc) -> brand-default (#ff5d31)
 */
function getBarColor(value) {
  // Clamp value between 0 and 100
  const v = Math.min(Math.max(value, 0), 100);

  // HSL values for brand-100 to brand-default
  // brand-100: hsl(17, 100%, 90%)
  // brand-default: hsl(13, 100%, 60%)
  const startHue = 17;
  const endHue = 13;
  const startSat = 100;
  const endSat = 100;
  const startLight = 90;
  const endLight = 60;

  // Interpolate based on value (0 = lightest, 100 = most vibrant)
  const t = v / 100;
  const hue = startHue + (endHue - startHue) * t;
  const sat = startSat + (endSat - startSat) * t;
  const light = startLight + (endLight - startLight) * t;

  return `hsl(${hue}, ${sat}%, ${light}%)`;
}

export function StatsChart({ title, stats = [], className = '', animated = true }) {
  const [isVisible, setIsVisible] = useState(!animated);
  const chartRef = useRef(null);

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

    if (chartRef.current) {
      observer.observe(chartRef.current);
    }

    return () => observer.disconnect();
  }, [animated]);

  return (
    <div
      ref={chartRef}
      className={`stats-chart ${isVisible ? 'stats-chart--visible' : ''} ${className}`.trim()}
    >
      {title && <h3 className="stats-chart__title">{title}</h3>}
      {title && <div className="stats-chart__divider" />}
      <div className="stats-chart__list">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="stats-chart__item"
            style={{ '--item-delay': `${index * 100}ms` }}
          >
            <div className="stats-chart__item-header">
              <span className="stats-chart__item-label">{stat.label}</span>
              <span className="stats-chart__item-value">{stat.value}%</span>
            </div>
            <div className="stats-chart__bar-track">
              <div
                className="stats-chart__bar-fill"
                style={{
                  '--bar-width': `${Math.min(Math.max(stat.value, 0), 100)}%`,
                  '--bar-color': getBarColor(stat.value),
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

StatsChart.propTypes = {
  title: PropTypes.string,
  stats: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
    })
  ),
  className: PropTypes.string,
  animated: PropTypes.bool,
};
