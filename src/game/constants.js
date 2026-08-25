export const COLS = 10;
export const ROWS = 20;
export const VISIBLE_ROWS = 20;
export const BUFFER_ROWS = 0;
export const TOTAL_ROWS = ROWS + BUFFER_ROWS;

export const PIECE_TYPES = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];

export const GAME_STATE = {
  IDLE: 'IDLE',
  PLAYING: 'PLAYING',
  PAUSED: 'PAUSED',
  LINE_CLEARING: 'LINE_CLEARING',
  GAME_OVER: 'GAME_OVER',
};

export const LINE_CLEAR_ANIMATION_MS = 300;
export const LOCK_DELAY_MS = 500;
export const MAX_LOCK_RESETS = 15;

export const DAS_MS = 160;
export const ARR_MS = 40;
export const SOFT_DROP_FACTOR = 20;

export const SCORING = {
  SINGLE: 100,
  DOUBLE: 300,
  TRIPLE: 500,
  TETRIS: 800,
  SOFT_DROP: 1,
  HARD_DROP: 2,
  COMBO: 50,
  B2B_MULTIPLIER: 1.5,
  PERFECT_CLEAR: {
    SINGLE: 800,
    DOUBLE: 1200,
    TRIPLE: 1800,
    TETRIS: 2000,
  },
};

export const LINES_PER_LEVEL = 10;
export const MAX_LEVEL = 20;

export function gravityMsForLevel(level) {
  const clamped = Math.min(Math.max(level, 1), MAX_LEVEL);
  const framesPerRow = Math.pow(0.8 - (clamped - 1) * 0.007, clamped - 1);
  return Math.max(framesPerRow * 1000, 50);
}

export const NEXT_QUEUE_DEFAULT_SIZE = 4;
