import { memo } from 'react';
import styles from './TouchControls.module.css';

function TouchButton({ label, onClick, onPressStart, onPressEnd, className = '' }) {
  const handlers = onPressStart
    ? {
        onPointerDown: (e) => {
          e.preventDefault();
          onPressStart();
        },
        onPointerUp: onPressEnd,
        onPointerLeave: onPressEnd,
        onPointerCancel: onPressEnd,
      }
    : { onClick };

  return (
    <button
      type="button"
      className={`${styles.button} ${className}`}
      aria-label={label}
      {...handlers}
    >
      {label}
    </button>
  );
}

function TouchControls({ onLeft, onRight, onRotate, onHardDrop, onHold, onSoftDropStart, onSoftDropEnd }) {
  return (
    <div className={styles.controls} aria-label="Touch controls">
      <div className={styles.dpad}>
        <TouchButton label="←" onClick={onLeft} className={styles.left} />
        <TouchButton
          label="↓"
          onPressStart={onSoftDropStart}
          onPressEnd={onSoftDropEnd}
          className={styles.down}
        />
        <TouchButton label="→" onClick={onRight} className={styles.right} />
      </div>
      <div className={styles.actions}>
        <TouchButton label="HOLD" onClick={onHold} className={styles.hold} />
        <TouchButton label="ROTATE" onClick={onRotate} className={styles.rotate} />
        <TouchButton label="DROP" onClick={onHardDrop} className={styles.drop} />
      </div>
    </div>
  );
}

export default memo(TouchControls);
