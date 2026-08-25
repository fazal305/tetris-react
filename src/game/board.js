import { COLS, TOTAL_ROWS } from './constants';

export function createEmptyBoard() {
  return Array.from({ length: TOTAL_ROWS }, () => Array(COLS).fill(null));
}

export function cloneBoard(board) {
  return board.map((row) => [...row]);
}

export function lockPieceToBoard(board, cells, pieceType) {
  const next = cloneBoard(board);
  for (const [r, c] of cells) {
    if (r >= 0 && r < TOTAL_ROWS && c >= 0 && c < COLS) {
      next[r][c] = pieceType;
    }
  }
  return next;
}

export function findCompletedRows(board) {
  const completed = [];
  for (let r = 0; r < TOTAL_ROWS; r++) {
    if (board[r].every((cell) => cell !== null)) {
      completed.push(r);
    }
  }
  return completed;
}

export function clearRows(board, rowIndices) {
  const rowsToClear = new Set(rowIndices);
  const remaining = board.filter((_, idx) => !rowsToClear.has(idx));
  const cleared = rowIndices.length;
  const newRows = Array.from({ length: cleared }, () => Array(COLS).fill(null));
  return [...newRows, ...remaining];
}

export function isBoardEmpty(board) {
  return board.every((row) => row.every((cell) => cell === null));
}
