import { describe, it, expect } from 'vitest';
import { createEmptyBoard, lockPieceToBoard, findCompletedRows, clearRows, isBoardEmpty } from '../board';
import { COLS, TOTAL_ROWS } from '../constants';

describe('board', () => {
  it('creates an empty board of the correct dimensions', () => {
    const board = createEmptyBoard();
    expect(board).toHaveLength(TOTAL_ROWS);
    expect(board[0]).toHaveLength(COLS);
    expect(isBoardEmpty(board)).toBe(true);
  });

  it('detects a fully filled row', () => {
    let board = createEmptyBoard();
    const cells = Array.from({ length: COLS }, (_, c) => [5, c]);
    board = lockPieceToBoard(board, cells, 'I');
    expect(findCompletedRows(board)).toEqual([5]);
  });

  it('does not flag a partially filled row', () => {
    let board = createEmptyBoard();
    board = lockPieceToBoard(board, [[5, 0], [5, 1]], 'I');
    expect(findCompletedRows(board)).toEqual([]);
  });

  it('clears rows and shifts the board down', () => {
    let board = createEmptyBoard();
    const cells = Array.from({ length: COLS }, (_, c) => [TOTAL_ROWS - 1, c]);
    board = lockPieceToBoard(board, cells, 'I');
    board = lockPieceToBoard(board, [[TOTAL_ROWS - 2, 0]], 'J');
    const cleared = clearRows(board, [TOTAL_ROWS - 1]);
    expect(cleared).toHaveLength(TOTAL_ROWS);
    expect(cleared[TOTAL_ROWS - 1][0]).toBe('J');
  });
});
