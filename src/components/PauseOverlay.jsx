import { memo } from 'react';
import styles from './Overlay.module.css';

function PauseOverlay({ onResume, onRestart, onQuit }) {
  return (
    <div className={styles.backdrop} role="dialog" aria-modal="true" aria-labelledby="pause-heading">
      <div className={styles.card}>
        <h2 id="pause-heading" className={styles.heading}>
          Paused
        </h2>
        <div className={styles.actions}>
          <button type="button" className={styles.buttonPrimary} onClick={onResume} autoFocus>
            Resume
          </button>
          <button type="button" className={styles.buttonSecondary} onClick={onRestart}>
            Restart
          </button>
          <button type="button" className={styles.buttonSecondary} onClick={onQuit}>
            Quit to Menu
          </button>
        </div>
      </div>
    </div>
  );
}

export default memo(PauseOverlay);
