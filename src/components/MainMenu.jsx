import { memo } from 'react';
import styles from './Screen.module.css';

function MainMenu({ onPlay, onHowToPlay, onStatistics, onSettings, onHighScores }) {
  return (
    <div className={styles.screen}>
      <div className={styles.content}>
        <header className={styles.header}>
          <h1 className={styles.title}>TETRIS</h1>
          <p className={styles.subtitle}>React Arcade Edition</p>
        </header>
        <nav className={styles.menuList} aria-label="Main menu">
          <button type="button" className={styles.menuButtonPrimary} onClick={onPlay} autoFocus>
            Play
          </button>
          <button type="button" className={styles.menuButton} onClick={onHowToPlay}>
            How to Play
          </button>
          <button type="button" className={styles.menuButton} onClick={onStatistics}>
            Statistics
          </button>
          <button type="button" className={styles.menuButton} onClick={onSettings}>
            Settings
          </button>
          <button type="button" className={styles.menuButton} onClick={onHighScores}>
            High Scores
          </button>
        </nav>
      </div>
    </div>
  );
}

export default memo(MainMenu);
