/**
 * Chart colour palette — single-hue tint scale derived from the brand accent.
 * Gives a cohesive, modern SaaS look instead of a multi-colour rainbow.
 */
const cssVar = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

/** Brand / primary chart colour (full strength) */
export const CHART_BRAND = cssVar('--darkred-500'); // #ff5d31

/**
 * 6-slot single-hue scale — brand tinted toward white.
 * Strong → light, suitable for bar / area / donut fills.
 */
export const CHART_PALETTE = [
  '#ff5d31', // brand – full
  '#ff7d5a', // 80 %
  '#ff9e83', // 60 %
  '#ffb6a2', // 45 %
  '#ffcec1', // 30 %
  '#ffe7e0', // 15 %
];

/**
 * Value-based colour — maps a numeric score to the brand hue.
 * Low → muted/dim, High → full brand strength.
 * @param {number} value  0-100 (clamped)
 * @param {number} max    domain ceiling (default 100)
 */
export const getValueColor = (value, max = 100) => {
  const t = Math.max(0, Math.min(1, value / max));
  const s = Math.round(30 + 70 * t); // 30 % → 100 %
  const l = Math.round(35 + 25 * t); // 35 % → 60 %
  return `hsl(14, ${s}%, ${l}%)`;
};

/** Bar chart — neutral fill for non-highlighted bars */
export const CHART_BAR_NEUTRAL = 'rgba(255, 255, 255, 0.10)';

/** Reusable chart constants */
export const CHART_GRID = 'rgba(255, 255, 255, 0.08)';
export const CHART_AXIS_X = 'rgba(255, 255, 255, 0.45)';
export const CHART_AXIS_Y = 'rgba(255, 255, 255, 0.35)';
