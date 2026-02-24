import { memo, useMemo, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  RadarChart as RechartsRadar,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { CHART_BRAND, CHART_GRID } from '../chartTokens';
import './RadarChart.css';

const FILL_COLOR = `${CHART_BRAND}40`; // brand @ 25% opacity
const STROKE_COLOR = CHART_BRAND;
const ACTIVE_FILL = `${CHART_BRAND}66`; // brand @ 40% opacity

/** Custom tooltip */
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;

  const { value } = payload[0];

  return (
    <div className="radar-chart__tooltip">
      <span className="radar-chart__tooltip-label">{label}</span>
      <span className="radar-chart__tooltip-value">{value}%</span>
    </div>
  );
}

/** Custom axis tick with hover highlight */
function AxisTick({ x, y, payload, textAnchor }) {
  const words = payload.value.split(' ');

  return (
    <text
      x={x}
      y={y}
      textAnchor={textAnchor}
      fill="rgba(255,255,255,0.7)"
      fontSize={12}
      fontFamily="Inter, sans-serif"
    >
      {words.map((word, index) => (
        <tspan key={index} x={x} dy={index === 0 ? 0 : 14}>
          {word}
        </tspan>
      ))}
    </text>
  );
}
export const RadarChart = memo(function RadarChart({
  title,
  stats = [],
  className = '',
  animated = true,
}) {
  const [activeLabel, setActiveLabel] = useState(null);

  const data = useMemo(
    () => stats.map((s) => ({ ...s, value: Math.min(Math.max(s.value, 0), 100) })),
    [stats]
  );

  const handleMouseMove = useCallback((state) => {
    if (state?.activeLabel) setActiveLabel(state.activeLabel);
  }, []);

  const handleMouseLeave = useCallback(() => setActiveLabel(null), []);

  return (
    <div className={['radar-chart', className].filter(Boolean).join(' ')}>
      {title && <h3 className="radar-chart__title">{title}</h3>}
      {title && <div className="radar-chart__divider" />}
      <div className="radar-chart__body">
        <ResponsiveContainer width="100%" height={280}>
          <RechartsRadar
            data={data}
            cx="50%"
            cy="50%"
            outerRadius="75%"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <PolarGrid stroke={CHART_GRID} strokeDasharray="3 3" />
            <PolarAngleAxis dataKey="label" tick={<AxisTick activeLabel={activeLabel} />} />
            <Tooltip
              content={<ChartTooltip />}
              cursor={false}
              isAnimationActive={false}
              wrapperStyle={{ outline: 'none', pointerEvents: 'none', zIndex: 10 }}
              allowEscapeViewBox={{ x: true, y: true }}
            />
            <Radar
              dataKey="value"
              stroke={STROKE_COLOR}
              strokeWidth={2}
              fill={activeLabel ? ACTIVE_FILL : FILL_COLOR}
              fillOpacity={1}
              dot={{
                r: 4,
                fill: STROKE_COLOR,
                stroke: 'var(--bg-card)',
                strokeWidth: 2,
              }}
              activeDot={{
                r: 6,
                fill: STROKE_COLOR,
                stroke: 'var(--bg-card)',
                strokeWidth: 2,
              }}
              isAnimationActive={animated}
              animationDuration={800}
              animationEasing="ease-out"
            />
          </RechartsRadar>
        </ResponsiveContainer>
      </div>
    </div>
  );
});

RadarChart.propTypes = {
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
