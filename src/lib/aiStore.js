const SETTINGS_KEY = 'p5chat:ai';
const HISTORY_KEY = 'p5chat:ai:history:';

export const DEFAULT_SETTINGS = { baseUrl: 'https://api.openai.com/v1', apiKey: '', model: '' };

const read = (storage, key, fallback) => {
  try {
    return JSON.parse(storage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
};

// Settings and history live only in this browser's localStorage.
export const loadSettings = (storage = localStorage) => ({
  ...DEFAULT_SETTINGS,
  ...read(storage, SETTINGS_KEY, {}),
});

export const saveSettings = (settings, storage = localStorage) =>
  storage.setItem(SETTINGS_KEY, JSON.stringify(settings));

export const isConfigured = (settings) => Boolean(settings.baseUrl?.trim() && settings.model?.trim());

export const loadHistory = (id, storage = localStorage) => read(storage, HISTORY_KEY + id, []);

export const saveHistory = (id, messages, storage = localStorage) =>
  storage.setItem(HISTORY_KEY + id, JSON.stringify(messages.slice(-200)));

export const clearHistory = (id, storage = localStorage) => storage.removeItem(HISTORY_KEY + id);
