const SETTINGS_KEY = 'vu-settings';

const DEFAULTS = {
  theme: 'system',
  notifications: { email: true, push: false, slack: false },
  localization: { language: 'en', timezone: 'utc' },
  privacy: { shareData: false, publicProfile: true },
  defaultJobStatus: 'All',
};

let listeners = [];

export function loadSettings() {
  try {
    const raw = window.localStorage.getItem(SETTINGS_KEY);
    if (!raw) return { ...DEFAULTS };
    const parsed = JSON.parse(raw);
    const rest = Object.fromEntries(
      Object.entries(parsed || {}).filter(([key]) => key !== 'itemsPerPage')
    );
    return { ...DEFAULTS, ...rest };
  } catch {
    return { ...DEFAULTS };
  }
}

export function saveSettings(next) {
  try {
    window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
    listeners.forEach((l) => l(next));
  } catch {
    // ignore
  }
}

export function subscribeSettings(cb) {
  listeners.push(cb);
  return () => {
    listeners = listeners.filter((l) => l !== cb);
  };
}

export function getDefaults() {
  return { ...DEFAULTS };
}
