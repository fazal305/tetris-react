import { memo } from 'react';
import PiecePreview from './PiecePreview';
import styles from './SidePanel.module.css';

function HoldPiece({ type, canHold }) {
  return (
    <section className={styles.panel} aria-label="Hold piece">
      <h2 className={styles.title}>Hold</h2>
      <div className={styles.previewSlot}>
        <PiecePreview type={type} dimmed={!canHold} size={4} />
      </div>
    </section>
  );
}

export default memo(HoldPiece);
