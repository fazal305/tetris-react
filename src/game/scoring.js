import { SCORING, LINES_PER_LEVEL, MAX_LEVEL } from './constants';

const LINE_CLEAR_NAMES = { 1: 'SINGLE', 2: 'DOUBLE', 3: 'TRIPLE', 4: 'TETRIS' };
const LINE_CLEAR_BASE = { 1: SCORING.SINGLE, 2: SCORING.DOUBLE, 3: SCORING.TRIPLE, 4: SCORING.TETRIS };
const PERFECT_CLEAR_BASE = {
  1: SCORING.PERFECT_CLEAR.SINGLE,
  2: SCORING.PERFECT_CLEAR.DOUBLE,
  3: SCORING.PERFECT_CLEAR.TRIPLE,
  4: SCORING.PERFECT_CLEAR.TETRIS,
};

export function calculateLevel(totalLines) {
  return Math.min(Math.floor(totalLines / LINES_PER_LEVEL) + 1, MAX_LEVEL);
}

export function calculateLineClearScore({
  linesCleared,
  level,
  combo,
  backToBack,
  isPerfectClear,
}) {
  if (linesCleared === 0) {
    return { points: 0, label: null, isTetris: false, newBackToBack: false };
  }

  const isTetrisOrBetter = linesCleared >= 4;
  let base = isPerfectClear
    ? PERFECT_CLEAR_BASE[linesCleared] || PERFECT_CLEAR_BASE[4]
    : LINE_CLEAR_BASE[linesCleared] || LINE_CLEAR_BASE[4];

  let points = base * level;

  const qualifiesForB2B = isTetrisOrBetter;
  if (qualifiesForB2B && backToBack) {
    points = Math.round(points * SCORING.B2B_MULTIPLIER);
  }

  if (combo > 0) {
    points += SCORING.COMBO * combo * level;
  }

  return {
    points,
    label: isPerfectClear ? 'PERFECT CLEAR' : LINE_CLEAR_NAMES[linesCleared] || 'TETRIS',
    isTetris: isTetrisOrBetter,
    newBackToBack: qualifiesForB2B,
  };
}

export function calculateSoftDropScore(cells) {
  return cells * SCORING.SOFT_DROP;
}

export function calculateHardDropScore(cells) {
  return cells * SCORING.HARD_DROP;
}
