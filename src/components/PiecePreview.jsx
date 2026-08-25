import { memo } from 'react';
import { SHAPES } from '../game/pieces';
import { TETROMINO_COLORS } from '../data/themes';
import styles from './PiecePreview.module.css';

function PiecePreview({ type, dimmed = false, size = 4 }) {
  if (!type) {
    return <div className={styles.empty} style={{ '--size': size }} aria-hidden="true" />;
  }
  const { cells } = SHAPES[type];
  const colors = TETROMINO_COLORS[type];
  const minRow = Math.min(...cells.map(([r]) => r));
  const minCol = Math.min(...cells.map(([, c]) => c));
  const cellSet = new Set(cells.map(([r, c]) => `${r - minRow},${c - minCol}`));

  const grid = [];
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      grid.push(cellSet.has(`${r},${c}`));
    }
  }

  return (
    <div
      className={`${styles.preview} ${dimmed ? styles.dimmed : ''}`}
      style={{ '--size': size }}
      role="img"
      aria-label={`${type} piece`}
    >
      {grid.map((filled, idx) => (
        <div
          key={idx}
          className={styles.cell}
          style={filled ? { background: colors.fill, borderColor: colors.border } : undefined}
        />
      ))}
    </div>
  );
}

export default memo(PiecePreview);
