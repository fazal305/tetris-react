import { memo } from 'react';
import styles from './Screen.module.css';

function formatDuration(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}m ${seconds}s`;
}

const ROWS = [
  ['Games Played', (s) => s.gamesPlayed],
  ['Lines Cleared', (s) => s.linesCleared],
  ['Tetrises', (s) => s.tetrises],
  ['Best Score', (s) => s.bestScore.toLocaleString()],
  ['Best Level', (s) => s.bestLevel],
  ['Longest Game', (s) => formatDuration(s.longestGameMs)],
  ['Total Play Time', (s) => formatDuration(s.totalPlayTimeMs)],
  ['Pieces Placed', (s) => s.piecesPlaced],
];

function Statistics({ stats, onBack }) {
  return (
    <div className={styles.screen}>
      <div className={styles.content}>
        <button type="button" className={styles.backButton} onClick={onBack}>
          ← Back
        </button>
        <header className={styles.header}>
          <h1 className={styles.title} style={{ fontSize: '1.6rem' }}>
            Statistics
          </h1>
        </header>
        <section className={styles.panel}>
          {ROWS.map(([label, getValue]) => (
            <div className={styles.row} key={label}>
              <span>{label}</span>
              <strong>{getValue(stats)}</strong>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}

export default memo(Statistics);
