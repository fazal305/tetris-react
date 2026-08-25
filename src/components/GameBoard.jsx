import { memo, useMemo } from 'react';
import { COLS, TOTAL_ROWS, ROWS } from '../game/constants';
import { getPieceCells } from '../game/pieces';
import { TETROMINO_COLORS } from '../data/themes';
import styles from './GameBoard.module.css';

const VISIBLE_START = TOTAL_ROWS - ROWS;

function buildGrid(board, activePiece, ghostPiece, showGhost, pendingClearRows) {
  const grid = board.map((row) => row.map((cell) => (cell ? { type: cell, kind: 'locked' } : null)));

  if (showGhost && ghostPiece) {
    for (const [r, c] of getPieceCells(ghostPiece)) {
      if (r >= 0 && r < TOTAL_ROWS && c >= 0 && c < COLS && !grid[r][c]) {
        grid[r][c] = { type: ghostPiece.type, kind: 'ghost' };
      }
    }
  }

  if (activePiece) {
    for (const [r, c] of getPieceCells(activePiece)) {
      if (r >= 0 && r < TOTAL_ROWS && c >= 0 && c < COLS) {
        grid[r][c] = { type: activePiece.type, kind: 'active' };
      }
    }
  }

  const clearingSet = new Set(pendingClearRows);
  return { grid, clearingSet };
}

function GameBoard({ board, activePiece, ghostPiece, showGhost, showGrid, pendingClearRows, gameState }) {
  const { grid, clearingSet } = useMemo(
    () => buildGrid(board, activePiece, ghostPiece, showGhost, pendingClearRows),
    [board, activePiece, ghostPiece, showGhost, pendingClearRows]
  );

  const visibleRows = grid.slice(VISIBLE_START);

  return (
    <div
      className={`${styles.board} ${showGrid ? styles.showGrid : ''}`}
      role="img"
      aria-label={`Tetris board, ${gameState === 'PLAYING' ? 'game in progress' : gameState.toLowerCase()}`}
      style={{ '--cols': COLS, '--rows': ROWS }}
    >
      {visibleRows.map((row, rowIdx) => {
        const isClearing = clearingSet.has(rowIdx + VISIBLE_START);
        return row.map((cell, colIdx) => {
          const key = `${rowIdx}-${colIdx}`;
          if (!cell) {
            return <div key={key} className={styles.cell} />;
          }
          const colors = TETROMINO_COLORS[cell.type];
          const cellClass = [
            styles.cell,
            styles.filled,
            cell.kind === 'ghost' ? styles.ghost : '',
            cell.kind === 'active' ? styles.active : '',
            isClearing ? styles.clearing : '',
          ]
            .filter(Boolean)
            .join(' ');
          return (
            <div
              key={key}
              className={cellClass}
              style={
                cell.kind === 'ghost'
                  ? { borderColor: colors.border, background: colors.ghost }
                  : { background: colors.fill, borderColor: colors.border }
              }
            />
          );
        });
      })}
    </div>
  );
}

export default memo(GameBoard);
