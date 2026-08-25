import { PIECE_TYPES } from './constants';

function shuffle(array, rng) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function mulberry32(seed) {
  let a = seed;
  return function rng() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export class SevenBagRandomizer {
  constructor(seed = Date.now()) {
    this.rng = mulberry32(seed);
    this.queue = [];
    this._refill();
  }

  _refill() {
    this.queue.push(...shuffle(PIECE_TYPES, this.rng));
  }

  next() {
    if (this.queue.length <= PIECE_TYPES.length) {
      this._refill();
    }
    return this.queue.shift();
  }

  peek(count) {
    while (this.queue.length < count) {
      this._refill();
    }
    return this.queue.slice(0, count);
  }
}
