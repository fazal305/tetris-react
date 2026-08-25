import { memo } from 'react';
import PiecePreview from './PiecePreview';
import styles from './SidePanel.module.css';

function NextQueue({ queue }) {
  return (
    <section className={styles.panel} aria-label="Next pieces">
      <h2 className={styles.title}>Next</h2>
      <div className={styles.queueList}>
        {queue.map((type, idx) => (
          <div className={styles.queueItem} key={`${type}-${idx}`}>
            <PiecePreview type={type} size={4} />
          </div>
        ))}
      </div>
    </section>
  );
}

export default memo(NextQueue);
