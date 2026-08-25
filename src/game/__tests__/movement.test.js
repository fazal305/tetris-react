import { describe, it, expect } from 'vitest';
import { createEmptyBoard } from '../board';
import { createPiece } from '../pieces';
import { tryMove, tryRotate, hardDropDistance, isGrounded } from '../movement';
import { TOTAL_ROWS } from '../constants';

describe('movement', () => {
  it('moves a piece left and right within bounds', () => {
    const board = createEmptyBoard();
    const piece = createPiece('T');
    const moved = tryMove(board, piece, 1, 0);
    expect(moved.col).toBe(piece.col + 1);
  });

  it('returns null when moving out of bounds', () => {
    const board = createEmptyBoard();
    const piece = { ...createPiece('O'), col: 0 };
    expect(tryMove(board, piece, -1, 0)).toBeNull();
  });

  it('rotates T piece with a valid result', () => {
    const board = createEmptyBoard();
    const piece = createPiece('T');
    const rotated = tryRotate(board, piece, 1);
    expect(rotated).not.toBeNull();
    expect(rotated.rotation).toBe(1);
  });

  it('wall-kicks a piece rotating against the left wall', () => {
    const board = createEmptyBoard();
    const piece = { ...createPiece('I'), col: -2 };
    const rotated = tryRotate(board, piece, 1);
    expect(rotated).not.toBeNull();
  });

  it('hard drop lands piece on the floor', () => {
    const board = createEmptyBoard();
    const piece = createPiece('O');
    const { piece: dropped } = hardDropDistance(board, piece);
    expect(isGrounded(board, dropped)).toBe(true);
    expect(dropped.row).toBeLessThan(TOTAL_ROWS);
  });
});
