import { COLS, TOTAL_ROWS } from './constants';
import { getPieceCells } from './pieces';

export function isValidPosition(board, piece) {
  const cells = getPieceCells(piece);
  for (const [r, c] of cells) {
    if (c < 0 || c >= COLS) return false;
    if (r >= TOTAL_ROWS) return false;
    if (r < 0) continue;
    if (board[r][c] !== null) return false;
  }
  return true;
}

export function isValidPositionWithCells(board, cells) {
  for (const [r, c] of cells) {
    if (c < 0 || c >= COLS) return false;
    if (r >= TOTAL_ROWS) return false;
    if (r < 0) continue;
    if (board[r][c] !== null) return false;
  }
  return true;
}
