import { describe, it, expect } from 'vitest';
import { SevenBagRandomizer } from '../randomizer';
import { PIECE_TYPES } from '../constants';

describe('SevenBagRandomizer', () => {
  it('produces each of the 7 piece types exactly once per bag', () => {
    const randomizer = new SevenBagRandomizer(42);
    const drawn = Array.from({ length: 7 }, () => randomizer.next());
    expect(drawn.sort()).toEqual([...PIECE_TYPES].sort());
  });

  it('never repeats a piece within consecutive bags more than allowed', () => {
    const randomizer = new SevenBagRandomizer(1);
    const drawn = Array.from({ length: 14 }, () => randomizer.next());
    const firstBag = drawn.slice(0, 7).sort();
    const secondBag = drawn.slice(7, 14).sort();
    expect(firstBag).toEqual([...PIECE_TYPES].sort());
    expect(secondBag).toEqual([...PIECE_TYPES].sort());
  });

  it('peek does not consume the queue', () => {
    const randomizer = new SevenBagRandomizer(7);
    const peeked = randomizer.peek(3);
    const next = randomizer.next();
    expect(peeked[0]).toBe(next);
  });

  it('is deterministic for a given seed', () => {
    const a = new SevenBagRandomizer(123);
    const b = new SevenBagRandomizer(123);
    const seqA = Array.from({ length: 20 }, () => a.next());
    const seqB = Array.from({ length: 20 }, () => b.next());
    expect(seqA).toEqual(seqB);
  });
});
