const KEYS = {
  SETTINGS: 'tetris.settings.v1',
  STATS: 'tetris.stats.v1',
  HIGH_SCORES: 'tetris.highScores.v1',
};

function safeGet(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    if (parsed === null || typeof parsed !== 'object') return fallback;
    return { ...fallback, ...parsed };
  } catch {
    return fallback;
  }
}

function safeSet(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export const DEFAULT_SETTINGS = {
  theme: 'dark-arcade',
  soundOn: true,
  musicOn: false,
  reducedMotion: false,
  showGrid: true,
  showGhost: true,
  nextQueueSize: 4,
};

export const DEFAULT_STATS = {
  gamesPlayed: 0,
  linesCleared: 0,
  tetrises: 0,
  bestScore: 0,
  bestLevel: 0,
  longestGameMs: 0,
  totalPlayTimeMs: 0,
  piecesPlaced: 0,
};

export function loadSettings() {
  return safeGet(KEYS.SETTINGS, DEFAULT_SETTINGS);
}

export function saveSettings(settings) {
  return safeSet(KEYS.SETTINGS, settings);
}

export function loadStats() {
  return safeGet(KEYS.STATS, DEFAULT_STATS);
}

export function saveStats(stats) {
  return safeSet(KEYS.STATS, stats);
}

export function loadHighScores() {
  try {
    const raw = window.localStorage.getItem(KEYS.HIGH_SCORES);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (entry) => entry && typeof entry.score === 'number' && typeof entry.date === 'string'
    );
  } catch {
    return [];
  }
}

export function saveHighScores(scores) {
  return safeSet(KEYS.HIGH_SCORES, scores);
}

export function addHighScore(entry, maxEntries = 10) {
  const scores = loadHighScores();
  const updated = [...scores, entry]
    .sort((a, b) => b.score - a.score)
    .slice(0, maxEntries);
  saveHighScores(updated);
  return updated;
}

export function clearHighScores() {
  saveHighScores([]);
}

export function clearStats() {
  saveStats(DEFAULT_STATS);
}

export function resetSettings() {
  saveSettings(DEFAULT_SETTINGS);
  return DEFAULT_SETTINGS;
}
