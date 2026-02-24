import { memo } from 'react';
import PropTypes from 'prop-types';
import {
  BarChart as RechartsBar,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { CHART_PALETTE, CHART_AXIS_X, CHART_AXIS_Y, CHART_GRID } from '../chartTokens';
import './BarChart.css';

const DEFAULT_COLORS = CHART_PALETTE;

/* Custom Tooltip */
function ChartTooltip({ active, payload, label, barColor }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="bar-chart__tooltip">
      <span className="bar-chart__tooltip-label">{label}</span>
      {payload.map((entry, i) => (
        <span key={i} className="bar-chart__tooltip-value">
          <span
            className="bar-chart__tooltip-dot"
            style={{ backgroundColor: barColor || entry.color || entry.fill }}
          />
          {entry.name}: {entry.value}
        </span>
      ))}
    </div>
  );
}

/* Custom X Tick */
function CustomXTick({ x, y, payload }) {
  const label = payload.value.length > 12 ? payload.value.slice(0, 11) + '…' : payload.value;

  return (
    <text
      x={x}
      y={y + 12}
      textAnchor="middle"
      fill={CHART_AXIS_X}
      fontSize={11}
      fontFamily="Inter, sans-serif"
    >
      {label}
    </text>
  );
}

/* Custom Y Tick */
function CustomYTick({ x, y, payload }) {
  return (
    <text
      x={x - 8}
      y={y + 4}
      textAnchor="end"
      fill={CHART_AXIS_Y}
      fontSize={11}
      fontFamily="Inter, sans-serif"
    >
      {payload.value}
    </text>
  );
}

export const BarChart = memo(function BarChart({
  title,
  data = [],
  dataKeys = [{ key: 'value', label: 'Value' }],
  xKey = 'label',
  colors = DEFAULT_COLORS,
  className = '',
  animated = true,
}) {
  const isMultiBar = dataKeys.length > 1;

  return (
    <div className={['bar-chart', className].filter(Boolean).join(' ')}>
      {title && <h3 className="bar-chart__title">{title}</h3>}
      {title && <div className="bar-chart__divider" />}

      <div className="bar-chart__body">
        <ResponsiveContainer width="100%" height={240}>
          <RechartsBar
            data={data}
            margin={{ top: 8, right: 8, bottom: 0, left: -16 }}
            barCategoryGap="25%"
          >
            <CartesianGrid stroke={CHART_GRID} strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey={xKey} tick={<CustomXTick />} axisLine={false} tickLine={false} />
            <YAxis tick={<CustomYTick />} axisLine={false} tickLine={false} />
            <Tooltip
              content={(props) => {
                const idx = data.findIndex((d) => d[xKey] === props.label);
                const barColor = !isMultiBar && idx >= 0 ? colors[idx % colors.length] : null;
                return <ChartTooltip {...props} barColor={barColor} />;
              }}
              cursor={{ fill: 'transparent' }}
              isAnimationActive={false}
              wrapperStyle={{ outline: 'none', pointerEvents: 'none' }}
            />

            {dataKeys.map((dk, keyIdx) => (
              <Bar
                key={dk.key}
                dataKey={dk.key}
                name={dk.label}
                fill={colors[keyIdx % colors.length]}
                radius={[4, 4, 0, 0]}
                isAnimationActive={animated}
                animationDuration={800}
                animationEasing="ease-out"
                activeBar={{ fillOpacity: 1 }}
              >
                {!isMultiBar &&
                  data.map((_, index) => (
                    <Cell key={index} fill={colors[index % colors.length]} fillOpacity={0.6} />
                  ))}
              </Bar>
            ))}
          </RechartsBar>
        </ResponsiveContainer>
      </div>
    </div>
  );
});

BarChart.propTypes = {
  title: PropTypes.string,
  data: PropTypes.arrayOf(PropTypes.object),
  dataKeys: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
  xKey: PropTypes.string,
  colors: PropTypes.arrayOf(PropTypes.string),
  className: PropTypes.string,
  animated: PropTypes.bool,
};
