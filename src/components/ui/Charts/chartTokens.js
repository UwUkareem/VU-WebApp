/**
 * Chart color palette resolved from design system CSS tokens at runtime.
 * Any change to these token values in tokens.css automatically reflects here.
 */
const cssVar = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

// 6-color palette — each mapped to a primitive token in tokens.css
export const CHART_PALETTE = [
  cssVar('--darkred-500'), // --brand-default  →  #ff5d31
  cssVar('--blue-500'), //                  →  #007aff
  cssVar('--yellow-500'), //                  →  #ffcc00
  cssVar('--teal-500'), //                  →  #30b0c7
  cssVar('--purple-500'), //                  →  #af52de
  cssVar('--green-500'), //                  →  #34c759
];

/** Brand/primary chart color (first slot in palette) */
export const CHART_BRAND = CHART_PALETTE[0];

/** Reusable chart constants */
export const CHART_GRID = 'rgba(255, 255, 255, 0.04)';
export const CHART_AXIS_X = 'rgba(255, 255, 255, 0.45)';
export const CHART_AXIS_Y = 'rgba(255, 255, 255, 0.35)';
