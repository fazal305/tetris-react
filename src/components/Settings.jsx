import { memo } from 'react';
import styles from './Screen.module.css';
import { THEMES } from '../data/themes';

function Toggle({ label, checked, onChange }) {
  return (
    <div className={styles.row}>
      <span>{label}</span>
      <button
        type="button"
        className={styles.toggle}
        role="switch"
        aria-checked={checked}
        aria-pressed={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
      >
        <span className={styles.toggleThumb} />
      </button>
    </div>
  );
}

function Settings({ settings, onUpdate, onReset, onBack, onClearStats, onClearHighScores }) {
  return (
    <div className={styles.screen}>
      <div className={styles.content}>
        <button type="button" className={styles.backButton} onClick={onBack}>
          ← Back
        </button>
        <header className={styles.header}>
          <h1 className={styles.title} style={{ fontSize: '1.6rem' }}>
            Settings
          </h1>
        </header>

        <section className={styles.panel}>
          <h2 className={styles.sectionTitle}>Appearance</h2>
          <div className={styles.row}>
            <span>Theme</span>
            <select
              className={styles.select}
              value={settings.theme}
              onChange={(e) => onUpdate('theme', e.target.value)}
            >
              {Object.entries(THEMES).map(([id, theme]) => (
                <option key={id} value={id}>
                  {theme.label}
                </option>
              ))}
            </select>
          </div>
          <Toggle label="Show Grid" checked={settings.showGrid} onChange={(v) => onUpdate('showGrid', v)} />
          <Toggle label="Ghost Piece" checked={settings.showGhost} onChange={(v) => onUpdate('showGhost', v)} />
          <Toggle
            label="Reduced Motion"
            checked={settings.reducedMotion}
            onChange={(v) => onUpdate('reducedMotion', v)}
          />
        </section>

        <section className={styles.panel}>
          <h2 className={styles.sectionTitle}>Audio</h2>
          <Toggle label="Sound Effects" checked={settings.soundOn} onChange={(v) => onUpdate('soundOn', v)} />
          <Toggle label="Music" checked={settings.musicOn} onChange={(v) => onUpdate('musicOn', v)} />
        </section>

        <section className={styles.panel}>
          <h2 className={styles.sectionTitle}>Gameplay</h2>
          <div className={styles.row}>
            <span>Next Queue Size</span>
            <select
              className={styles.select}
              value={settings.nextQueueSize}
              onChange={(e) => onUpdate('nextQueueSize', Number(e.target.value))}
            >
              {[3, 4, 5, 6].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
        </section>

        <section className={styles.panel}>
          <h2 className={styles.sectionTitle}>Data</h2>
          <div className={styles.row}>
            <span>Reset all settings</span>
            <button type="button" className={styles.backButton} onClick={onReset}>
              Reset
            </button>
          </div>
          <div className={styles.row}>
            <span>Clear statistics</span>
            <button type="button" className={styles.backButton} onClick={onClearStats}>
              Clear
            </button>
          </div>
          <div className={styles.row}>
            <span>Clear high scores</span>
            <button type="button" className={styles.backButton} onClick={onClearHighScores}>
              Clear
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default memo(Settings);
