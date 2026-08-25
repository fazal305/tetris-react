import { memo } from 'react';
import styles from './Screen.module.css';

const SECTIONS = [
  {
    title: 'Movement',
    body: 'Use ← → to move the falling piece sideways. Press ↓ to soft drop faster for a small score bonus.',
  },
  {
    title: 'Rotation',
    body: 'Rotate clockwise with ↑, counter-clockwise with Z. Pieces "kick" away from walls and other blocks automatically when there is room.',
  },
  {
    title: 'Hard Drop',
    body: 'Press Space to instantly drop the piece to the bottom and lock it in place for bonus points.',
  },
  {
    title: 'Hold',
    body: 'Press C to store the current piece for later. You can swap it back in once per piece — the hold resets after each piece locks.',
  },
  {
    title: 'Ghost Piece',
    body: 'The translucent outline shows exactly where your piece will land, updating as you move and rotate.',
  },
  {
    title: 'Line Clearing',
    body: 'Fill an entire row with blocks to clear it. Clearing multiple rows at once (up to a Tetris — 4 lines) scores far more.',
  },
  {
    title: 'Scoring',
    body: 'Single, Double, Triple, and Tetris clears award increasing points, multiplied by your level. Consecutive clears build a combo bonus, and back-to-back Tetrises earn a multiplier.',
  },
  {
    title: 'Levels',
    body: 'Every 10 lines cleared advances you a level, increasing gravity speed. Higher levels mean faster falling pieces and higher scores.',
  },
];

function HowToPlay({ onBack }) {
  return (
    <div className={styles.screen}>
      <div className={styles.content}>
        <button type="button" className={styles.backButton} onClick={onBack}>
          ← Back
        </button>
        <header className={styles.header}>
          <h1 className={styles.title} style={{ fontSize: '1.6rem' }}>
            How to Play
          </h1>
        </header>
        {SECTIONS.map((section) => (
          <section className={styles.panel} key={section.title}>
            <h2 className={styles.sectionTitle}>{section.title}</h2>
            <p style={{ margin: 0, lineHeight: 1.5 }}>{section.body}</p>
          </section>
        ))}
      </div>
    </div>
  );
}

export default memo(HowToPlay);
