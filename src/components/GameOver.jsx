import { memo } from 'react';
import styles from './Overlay.module.css';

function GameOver({ score, level, lines, bestScore, isNewHighScore, onPlayAgain, onMainMenu }) {
  return (
    <div className={styles.backdrop} role="dialog" aria-modal="true" aria-labelledby="gameover-heading">
      <div className={styles.card}>
        {isNewHighScore && <span className={styles.badge}>New High Score</span>}
        <h2 id="gameover-heading" className={styles.heading}>
          Game Over
        </h2>
        <dl>
          <div className={styles.statRow}>
            <dt>Final Score</dt>
            <dd>{score.toLocaleString()}</dd>
          </div>
          <div className={styles.statRow}>
            <dt>Level</dt>
            <dd>{level}</dd>
          </div>
          <div className={styles.statRow}>
            <dt>Lines</dt>
            <dd>{lines}</dd>
          </div>
          <div className={styles.statRow}>
            <dt>Best Score</dt>
            <dd>{Math.max(bestScore, score).toLocaleString()}</dd>
          </div>
        </dl>
        <div className={styles.actions}>
          <button type="button" className={styles.buttonPrimary} onClick={onPlayAgain} autoFocus>
            Play Again
          </button>
          <button type="button" className={styles.buttonSecondary} onClick={onMainMenu}>
            Main Menu
          </button>
        </div>
      </div>
    </div>
  );
}

export default memo(GameOver);
