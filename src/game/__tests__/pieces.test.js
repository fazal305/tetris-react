import { describe, it, expect } from 'vitest';
import { createPiece, getPieceCells, ROTATION_STATES } from '../pieces';

describe('pieces', () => {
  it('spawns each piece with 4 cells', () => {
    for (const type of Object.keys(ROTATION_STATES)) {
      const piece = createPiece(type);
      expect(getPieceCells(piece)).toHaveLength(4);
    }
  });

  it('O piece has identical cells across all rotation states', () => {
    const states = ROTATION_STATES.O;
    expect(states[0]).toEqual(states[1]);
    expect(states[1]).toEqual(states[2]);
    expect(states[2]).toEqual(states[3]);
  });

  it('I piece has 4 distinct rotation states', () => {
    const states = ROTATION_STATES.I;
    expect(states).toHaveLength(4);
    const serialized = states.map((s) => JSON.stringify(s));
    expect(new Set(serialized).size).toBeGreaterThan(1);
  });
});
