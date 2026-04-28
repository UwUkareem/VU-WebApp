export const THEME_STORAGE_KEY = 'vu-theme';

export const THEMES = Object.freeze({
  dark: 'dark',
  light: 'light',
});

function isValidTheme(value) {
  return value === THEMES.dark || value === THEMES.light;
}

function getPreferredTheme() {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return THEMES.dark;
  }

  return window.matchMedia('(prefers-color-scheme: light)').matches ? THEMES.light : THEMES.dark;
}

export function getStoredTheme() {
  if (typeof window === 'undefined') return null;

  try {
    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    return isValidTheme(storedTheme) ? storedTheme : null;
  } catch {
    return null;
  }
}

export function getInitialTheme() {
  return getStoredTheme() || getPreferredTheme();
}

export function applyTheme(theme) {
  const nextTheme = isValidTheme(theme) ? theme : THEMES.dark;

  if (typeof document !== 'undefined') {
    document.documentElement.dataset.theme = nextTheme;
  }

  return nextTheme;
}

export function persistTheme(theme) {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Ignore write failures (private mode/storage restrictions).
  }
}

export function initializeTheme() {
  const theme = getInitialTheme();
  applyTheme(theme);
  persistTheme(theme);
  return theme;
}

export function getActiveTheme() {
  if (typeof document !== 'undefined') {
    const currentTheme = document.documentElement.dataset.theme;
    if (isValidTheme(currentTheme)) return currentTheme;
  }

  return getInitialTheme();
}

export function toggleTheme(currentTheme) {
  const nextTheme = currentTheme === THEMES.light ? THEMES.dark : THEMES.light;
  applyTheme(nextTheme);
  persistTheme(nextTheme);
  return nextTheme;
}
