import { memo } from 'react';
import styles from './Screen.module.css';

function HighScores({ highScores, onBack }) {
  return (
    <div className={styles.screen}>
      <div className={styles.content}>
        <button type="button" className={styles.backButton} onClick={onBack}>
          ← Back
        </button>
        <header className={styles.header}>
          <h1 className={styles.title} style={{ fontSize: '1.6rem' }}>
            High Scores
          </h1>
        </header>
        {highScores.length === 0 ? (
          <p className={styles.emptyState}>No scores yet — play a game to set your first record.</p>
        ) : (
          <section className={styles.panel}>
            {highScores.map((entry, idx) => (
              <div className={styles.row} key={`${entry.date}-${idx}`}>
                <span>
                  #{idx + 1} · {new Date(entry.date).toLocaleDateString()}
                </span>
                <strong>{entry.score.toLocaleString()}</strong>
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  );
}

export default memo(HighScores);
