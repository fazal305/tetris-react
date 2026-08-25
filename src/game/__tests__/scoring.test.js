import { describe, it, expect } from 'vitest';
import { calculateLineClearScore, calculateLevel } from '../scoring';

describe('scoring', () => {
  it('calculates level from total lines', () => {
    expect(calculateLevel(0)).toBe(1);
    expect(calculateLevel(9)).toBe(1);
    expect(calculateLevel(10)).toBe(2);
    expect(calculateLevel(95)).toBe(10);
  });

  it('caps level at MAX_LEVEL', () => {
    expect(calculateLevel(100000)).toBeLessThanOrEqual(20);
  });

  it('awards more points for a Tetris than a single', () => {
    const single = calculateLineClearScore({ linesCleared: 1, level: 1, combo: -1, backToBack: false, isPerfectClear: false });
    const tetris = calculateLineClearScore({ linesCleared: 4, level: 1, combo: -1, backToBack: false, isPerfectClear: false });
    expect(tetris.points).toBeGreaterThan(single.points);
    expect(tetris.isTetris).toBe(true);
    expect(single.isTetris).toBe(false);
  });

  it('applies back-to-back multiplier for consecutive Tetrises', () => {
    const withoutB2B = calculateLineClearScore({ linesCleared: 4, level: 1, combo: -1, backToBack: false, isPerfectClear: false });
    const withB2B = calculateLineClearScore({ linesCleared: 4, level: 1, combo: -1, backToBack: true, isPerfectClear: false });
    expect(withB2B.points).toBeGreaterThan(withoutB2B.points);
  });

  it('adds combo bonus for consecutive clears', () => {
    const noCombo = calculateLineClearScore({ linesCleared: 1, level: 1, combo: 0, backToBack: false, isPerfectClear: false });
    const withCombo = calculateLineClearScore({ linesCleared: 1, level: 1, combo: 3, backToBack: false, isPerfectClear: false });
    expect(withCombo.points).toBeGreaterThan(noCombo.points);
  });

  it('returns zero points for zero lines cleared', () => {
    const result = calculateLineClearScore({ linesCleared: 0, level: 1, combo: -1, backToBack: false, isPerfectClear: false });
    expect(result.points).toBe(0);
    expect(result.label).toBeNull();
  });
});
