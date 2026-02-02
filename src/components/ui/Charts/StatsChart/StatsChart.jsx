import PropTypes from 'prop-types';
import { useEffect, useState, useRef } from 'react';
import './StatsChart.css';

const DEFAULT_COLORS = [
  'var(--green-700)',
  'var(--blue-700)',
  'var(--yellow-700)',
  'var(--red-700)',
  'var(--purple-700)',
  'var(--teal-700)',
];

function getBarGradient(index, colors) {
  const color = colors[index % colors.length];
  return `
    linear-gradient(
      90deg,
      color-mix(in srgb, ${color} 40%, transparent),
      ${color}
    )
  `;
}

export function StatsChart({ title, stats = [], colors = [], className = '', animated = true }) {
  const [isVisible, setIsVisible] = useState(!animated);
  const chartRef = useRef(null);
  const resolvedColors = Array.isArray(colors) && colors.length > 0 ? colors : DEFAULT_COLORS;

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
      <div className="stats-chart__header">
        {title && <h3 className="stats-chart__title">{title}</h3>}
      </div>
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
                  background: getBarGradient(index, resolvedColors),
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
  colors: PropTypes.arrayOf(PropTypes.string),
  className: PropTypes.string,
  animated: PropTypes.bool,
};
