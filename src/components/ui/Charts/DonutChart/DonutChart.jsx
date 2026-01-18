import PropTypes from 'prop-types';
import { useEffect, useState, useRef, useMemo } from 'react';
import './DonutChart.css';

// Default colors matching badge colors for dark mode
const DEFAULT_COLORS = [
  'var(--green-400)',
  'var(--blue-400)',
  'var(--yellow-400)',
  'var(--red-400)',
];

export function DonutChart({
  title,
  data = [],
  colors = DEFAULT_COLORS,
  size = 160,
  strokeWidth = 24,
  totalLabel = 'Total',
  className = '',
  animated = true,
}) {
  const [isVisible, setIsVisible] = useState(!animated);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const chartRef = useRef(null);

  // Calculate total
  const total = data.reduce((sum, item) => sum + item.value, 0);

  // SVG calculations
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  // Calculate percentages, angles, and stroke data
  const segmentData = useMemo(() => {
    const result = [];
    let cumulativePercentage = 0;

    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      const percentage = total > 0 ? (item.value / total) * 100 : 0;
      const dashArray = (percentage / 100) * circumference;
      const dashOffset = -((cumulativePercentage / 100) * circumference);

      result.push({
        ...item,
        percentage,
        color: colors[i % colors.length],
        dashArray,
        dashOffset,
      });

      cumulativePercentage += percentage;
    }

    return result;
  }, [data, total, circumference, colors]);

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
      className={`donut-chart ${isVisible ? 'donut-chart--visible' : ''} ${className}`.trim()}
    >
      {title && <h3 className="donut-chart__title">{title}</h3>}
      {title && <div className="donut-chart__divider" />}

      <div className="donut-chart__content">
        {/* Legend */}
        <div className="donut-chart__legend">
          {segmentData.map((segment, index) => (
            <div
              key={index}
              className={`donut-chart__legend-item ${hoveredIndex === index ? 'donut-chart__legend-item--active' : ''}`}
              style={{ '--item-delay': `${index * 100}ms` }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="donut-chart__legend-header">
                <span
                  className="donut-chart__legend-dot"
                  style={{ backgroundColor: segment.color }}
                />
                <span className="donut-chart__legend-label">{segment.label}</span>
              </div>
              <div className="donut-chart__legend-values">
                <span className="donut-chart__legend-count">{segment.value}</span>
                <span className="donut-chart__legend-percent">
                  {segment.percentage.toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Donut Chart */}
        <div className="donut-chart__visual">
          <svg
            className="donut-chart__svg"
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
          >
            {/* Background circle */}
            <circle
              className="donut-chart__background"
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke="var(--border-subtle)"
              strokeWidth={strokeWidth}
            />
            {/* Segments */}
            {segmentData.map((segment, index) => (
              <circle
                key={index}
                className={`donut-chart__segment ${hoveredIndex === index ? 'donut-chart__segment--active' : ''} ${hoveredIndex !== null && hoveredIndex !== index ? 'donut-chart__segment--dimmed' : ''}`}
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke={segment.color}
                strokeWidth={strokeWidth}
                strokeDasharray={`${segment.dashArray} ${circumference}`}
                strokeDashoffset={segment.dashOffset}
                style={{
                  '--segment-delay': `${index * 100}ms`,
                  '--segment-dasharray': `${segment.dashArray} ${circumference}`,
                }}
                transform={`rotate(-90 ${center} ${center})`}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <title>
                  {segment.label}: {segment.value} ({segment.percentage.toFixed(1)}%)
                </title>
              </circle>
            ))}
          </svg>

          {/* Total in center - or show hovered segment info */}
          <div className="donut-chart__center">
            {hoveredIndex !== null ? (
              <>
                <span className="donut-chart__center-label">{segmentData[hoveredIndex].label}</span>
                <span className="donut-chart__center-value">
                  {segmentData[hoveredIndex].percentage.toFixed(1)}%
                </span>
              </>
            ) : (
              <>
                <span className="donut-chart__center-label">{totalLabel}</span>
                <span className="donut-chart__center-value">{total}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

DonutChart.propTypes = {
  title: PropTypes.string,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
    })
  ),
  colors: PropTypes.arrayOf(PropTypes.string),
  size: PropTypes.number,
  strokeWidth: PropTypes.number,
  totalLabel: PropTypes.string,
  className: PropTypes.string,
  animated: PropTypes.bool,
};
