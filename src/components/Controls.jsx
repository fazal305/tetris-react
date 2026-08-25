import { memo } from 'react';
import styles from './Controls.module.css';

const BINDINGS = [
  ['Move', '← →'],
  ['Soft Drop', '↓'],
  ['Hard Drop', 'Space'],
  ['Rotate CW', '↑'],
  ['Rotate CCW', 'Z'],
  ['Hold', 'C'],
  ['Pause', 'P / Esc'],
];

function Controls() {
  return (
    <section className={styles.panel} aria-label="Keyboard controls">
      <h2 className={styles.title}>Controls</h2>
      <dl className={styles.list}>
        {BINDINGS.map(([label, key]) => (
          <div className={styles.row} key={label}>
            <dt>{label}</dt>
            <dd>
              <kbd className={styles.key}>{key}</kbd>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export default memo(Controls);
