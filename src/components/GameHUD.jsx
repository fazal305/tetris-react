import { memo } from 'react';
import styles from './GameHUD.module.css';

function StatBlock({ label, value }) {
  return (
    <div className={styles.stat}>
      <span className={styles.label}>{label}</span>
      <span className={styles.value}>{value}</span>
    </div>
  );
}

function GameHUD({ score, level, lines, combo }) {
  return (
    <section className={styles.hud} aria-label="Game status">
      <StatBlock label="Score" value={score.toLocaleString()} />
      <StatBlock label="Level" value={level} />
      <StatBlock label="Lines" value={lines} />
      {combo > 0 && <StatBlock label="Combo" value={`x${combo}`} />}
    </section>
  );
}

export default memo(GameHUD);
