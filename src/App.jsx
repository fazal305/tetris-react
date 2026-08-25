import { useCallback, useEffect, useState } from 'react';
import GameBoard from './components/GameBoard';
import GameHUD from './components/GameHUD';
import HoldPiece from './components/HoldPiece';
import NextQueue from './components/NextQueue';
import Controls from './components/Controls';
import TouchControls from './components/TouchControls';
import MainMenu from './components/MainMenu';
import PauseOverlay from './components/PauseOverlay';
import GameOver from './components/GameOver';
import Settings from './components/Settings';
import Statistics from './components/Statistics';
import HighScores from './components/HighScores';
import HowToPlay from './components/HowToPlay';
import { useGameLoop } from './hooks/useGameLoop';
import { useKeyboardControls } from './hooks/useKeyboardControls';
import { useTouchControls } from './hooks/useTouchControls';
import { useGameSettings } from './hooks/useGameSettings';
import { useGameStatistics } from './hooks/useGameStatistics';
import { GAME_STATE } from './game/constants';
import { primeAudioContext } from './services/audio';
import playScreenStyles from './components/PlayScreen.module.css';

const SCREENS = {
  MENU: 'menu',
  PLAYING: 'playing',
  SETTINGS: 'settings',
  STATISTICS: 'statistics',
  HIGH_SCORES: 'highScores',
  HOW_TO_PLAY: 'howToPlay',
};

function App() {
  const [screen, setScreen] = useState(SCREENS.MENU);
  const [lastGameResult, setLastGameResult] = useState(null);
  const { settings, updateSetting, resetSettings } = useGameSettings();
  const { stats, highScores, recordGameEnd, clearStats, clearHighScores } = useGameStatistics();

  const handleGameOver = useCallback(
    (result) => {
      const isNewHighScore = recordGameEnd({
        score: result.score,
        level: result.level,
        lines: result.lines,
        tetrises: result.lines >= 4 ? 1 : 0,
        playTimeMs: result.playTimeMs,
        piecesPlaced: result.piecesPlaced,
      });
      setLastGameResult({ ...result, isNewHighScore });
    },
    [recordGameEnd]
  );

  const loop = useGameLoop({ queueSize: settings.nextQueueSize, onGameOver: handleGameOver });

  const actions = {
    moveLeft: loop.moveLeft,
    moveRight: loop.moveRight,
    rotateCW: loop.rotateCW,
    rotateCCW: loop.rotateCCW,
    setSoftDropHeld: loop.setSoftDropHeld,
    hardDrop: loop.hardDrop,
    hold: loop.hold,
    togglePause: loop.togglePause,
  };

  useKeyboardControls(actions, { active: screen === SCREENS.PLAYING });
  const touch = useTouchControls(actions);

  useEffect(() => {
    document.documentElement.classList.toggle('reduced-motion', settings.reducedMotion);
  }, [settings.reducedMotion]);

  const startNewGame = useCallback(() => {
    primeAudioContext();
    setLastGameResult(null);
    loop.startGame(Date.now());
    setScreen(SCREENS.PLAYING);
  }, [loop]);

  const goToMenu = useCallback(() => setScreen(SCREENS.MENU), []);

  if (screen === SCREENS.MENU) {
    return (
      <MainMenu
        onPlay={startNewGame}
        onHowToPlay={() => setScreen(SCREENS.HOW_TO_PLAY)}
        onStatistics={() => setScreen(SCREENS.STATISTICS)}
        onSettings={() => setScreen(SCREENS.SETTINGS)}
        onHighScores={() => setScreen(SCREENS.HIGH_SCORES)}
      />
    );
  }

  if (screen === SCREENS.SETTINGS) {
    return (
      <Settings
        settings={settings}
        onUpdate={updateSetting}
        onReset={resetSettings}
        onBack={goToMenu}
        onClearStats={clearStats}
        onClearHighScores={clearHighScores}
      />
    );
  }

  if (screen === SCREENS.STATISTICS) {
    return <Statistics stats={stats} onBack={goToMenu} />;
  }

  if (screen === SCREENS.HIGH_SCORES) {
    return <HighScores highScores={highScores} onBack={goToMenu} />;
  }

  if (screen === SCREENS.HOW_TO_PLAY) {
    return <HowToPlay onBack={goToMenu} />;
  }

  const state = loop.state;
  if (!state) return null;

  return (
    <div className={playScreenStyles.layout}>
      <header className={playScreenStyles.header}>
        <h1 className={playScreenStyles.headerTitle}>TETRIS</h1>
        <button
          type="button"
          className={playScreenStyles.iconButton}
          onClick={loop.togglePause}
          disabled={state.gameState === GAME_STATE.GAME_OVER}
        >
          {state.gameState === GAME_STATE.PAUSED ? 'Resume' : 'Pause'}
        </button>
      </header>

      <main className={playScreenStyles.main}>
        <div className={playScreenStyles.leftColumn}>
          <HoldPiece type={state.holdType} canHold={state.canHold} />
          <Controls />
        </div>

        <div className={playScreenStyles.centerColumn}>
          <div className={playScreenStyles.boardWrapper}>
            {state.lastClear && state.gameState === GAME_STATE.PLAYING && (
              <ClearBanner clear={state.lastClear} />
            )}
            <GameBoard
              board={state.board}
              activePiece={state.gameState === GAME_STATE.LINE_CLEARING ? null : state.activePiece}
              ghostPiece={state.gameState === GAME_STATE.LINE_CLEARING ? null : state.ghostPiece}
              showGhost={settings.showGhost}
              showGrid={settings.showGrid}
              pendingClearRows={state.pendingClearRows}
              gameState={state.gameState}
            />
            {state.gameState === GAME_STATE.PAUSED && (
              <PauseOverlay
                onResume={loop.togglePause}
                onRestart={startNewGame}
                onQuit={goToMenu}
              />
            )}
            {state.gameState === GAME_STATE.GAME_OVER && lastGameResult && (
              <GameOver
                score={lastGameResult.score}
                level={lastGameResult.level}
                lines={lastGameResult.lines}
                bestScore={stats.bestScore}
                isNewHighScore={lastGameResult.isNewHighScore}
                onPlayAgain={startNewGame}
                onMainMenu={goToMenu}
              />
            )}
          </div>
          <GameHUD score={state.score} level={state.level} lines={state.lines} combo={state.combo} />
          <TouchControls
            onLeft={touch.onLeft}
            onRight={touch.onRight}
            onRotate={touch.onRotate}
            onHardDrop={touch.onHardDrop}
            onHold={touch.onHold}
            onSoftDropStart={touch.onSoftDropStart}
            onSoftDropEnd={touch.onSoftDropEnd}
          />
        </div>

        <div className={playScreenStyles.rightColumn}>
          <NextQueue queue={state.nextQueue} />
        </div>
      </main>
    </div>
  );
}

function ClearBanner({ clear }) {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => setVisible(false), 900);
    return () => clearTimeout(timer);
  }, [clear]);

  if (!visible || !clear.label) return null;
  return <div className={playScreenStyles.clearBanner}>{clear.label}</div>;
}

export default App;
