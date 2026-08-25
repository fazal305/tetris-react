export const TETROMINO_COLORS = {
  I: { fill: '#4fd3e8', border: '#2fa7ba', ghost: 'rgba(79, 211, 232, 0.18)' },
  O: { fill: '#e8c94f', border: '#baa22f', ghost: 'rgba(232, 201, 79, 0.18)' },
  T: { fill: '#b56fe0', border: '#8a4cb3', ghost: 'rgba(181, 111, 224, 0.18)' },
  S: { fill: '#6fe08c', border: '#4cb367', ghost: 'rgba(111, 224, 140, 0.18)' },
  Z: { fill: '#e0716f', border: '#b34c4a', ghost: 'rgba(224, 113, 111, 0.18)' },
  J: { fill: '#6f8fe0', border: '#4c68b3', ghost: 'rgba(111, 143, 224, 0.18)' },
  L: { fill: '#e0a06f', border: '#b3784c', ghost: 'rgba(224, 160, 111, 0.18)' },
};

export const THEMES = {
  'dark-arcade': {
    label: 'Dark Arcade',
    tokens: {
      '--color-background': '#12141a',
      '--color-surface': '#181b23',
      '--color-panel': '#1f232d',
      '--color-border': '#2c3140',
      '--color-text': '#e9ecf4',
      '--color-muted': '#8b93a7',
      '--color-accent': '#5eead4',
      '--color-accent-strong': '#2dd4bf',
      '--color-danger': '#f37272',
    },
  },
  'light-arcade': {
    label: 'Light Arcade',
    tokens: {
      '--color-background': '#f2f4f8',
      '--color-surface': '#ffffff',
      '--color-panel': '#eef1f6',
      '--color-border': '#d7dce6',
      '--color-text': '#1a1e29',
      '--color-muted': '#5b6478',
      '--color-accent': '#0f9d8f',
      '--color-accent-strong': '#0b8377',
      '--color-danger': '#c94848',
    },
  },
};

export function applyTheme(themeId) {
  const theme = THEMES[themeId] || THEMES['dark-arcade'];
  const root = document.documentElement;
  Object.entries(theme.tokens).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
  root.setAttribute('data-theme', themeId);
}
