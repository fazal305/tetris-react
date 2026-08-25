import { describe, it, expect } from 'vitest';
import { createEmptyBoard, lockPieceToBoard } from '../board';
import { isValidPosition } from '../collision';
import { createPiece } from '../pieces';
import { COLS, TOTAL_ROWS } from '../constants';

describe('collision', () => {
  it('accepts a piece in an empty board', () => {
    const board = createEmptyBoard();
    const piece = createPiece('T');
    expect(isValidPosition(board, piece)).toBe(true);
  });

  it('rejects a piece that goes out of left bound', () => {
    const board = createEmptyBoard();
    const piece = { ...createPiece('O'), col: -1 };
    expect(isValidPosition(board, piece)).toBe(false);
  });

  it('rejects a piece that goes out of right bound', () => {
    const board = createEmptyBoard();
    const piece = { ...createPiece('O'), col: COLS - 1 };
    expect(isValidPosition(board, piece)).toBe(false);
  });

  it('rejects a piece overlapping locked cells', () => {
    let board = createEmptyBoard();
    board = lockPieceToBoard(board, [[TOTAL_ROWS - 1, 4]], 'I');
    const piece = { ...createPiece('O'), row: TOTAL_ROWS - 2, col: 4 };
    expect(isValidPosition(board, piece)).toBe(false);
  });

  it('rejects a piece below the floor', () => {
    const board = createEmptyBoard();
    const piece = { ...createPiece('O'), row: TOTAL_ROWS };
    expect(isValidPosition(board, piece)).toBe(false);
  });
});
