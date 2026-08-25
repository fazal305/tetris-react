import { useCallback, useEffect, useRef, useState } from 'react';
import {
  createGame,
  moveActive,
  rotateActive,
  softDropStep,
  hardDrop,
  holdActive,
  tickGravity,
  resolveLineClear,
  pauseGame,
  resumeGame,
} from '../game/engine';
import { GAME_STATE, gravityMsForLevel, LINE_CLEAR_ANIMATION_MS, SOFT_DROP_FACTOR } from '../game/constants';
import { playSound } from '../services/audio';

export function useGameLoop({ queueSize = 4, onGameOver } = {}) {
  const engineRef = useRef(null);
  const [snapshot, setSnapshot] = useState(null);
  const rafRef = useRef(null);
  const lastTimeRef = useRef(null);
  const softDropHeldRef = useRef(false);
  const clearTimeoutRef = useRef(null);
  const startTimeRef = useRef(null);
  const onGameOverRef = useRef(onGameOver);
  onGameOverRef.current = onGameOver;

  const commit = useCallback((next) => {
    engineRef.current = next;
    setSnapshot(next);
    return next;
  }, []);

  const startGame = useCallback(
    (seed) => {
      const initial = createGame(seed, queueSize);
      startTimeRef.current = performance.now();
      lastTimeRef.current = null;
      commit(initial);
    },
    [commit, queueSize]
  );

  useEffect(() => {
    if (!snapshot) return undefined;

    if (snapshot.gameState === GAME_STATE.LINE_CLEARING) {
      playSound(snapshot.pendingClearRows.length >= 4 ? 'tetris' : 'lineClear');
      clearTimeoutRef.current = setTimeout(() => {
        const resolved = resolveLineClear(engineRef.current);
        if (resolved.lastClear?.leveledUp) {
          playSound('levelUp');
        }
        commit(resolved);
      }, LINE_CLEAR_ANIMATION_MS);
      return () => clearTimeout(clearTimeoutRef.current);
    }

    if (snapshot.gameState === GAME_STATE.GAME_OVER) {
      playSound('gameOver');
      const playTimeMs = startTimeRef.current ? performance.now() - startTimeRef.current : 0;
      onGameOverRef.current?.({
        score: snapshot.score,
        level: snapshot.level,
        lines: snapshot.lines,
        piecesPlaced: snapshot.piecesPlaced,
        playTimeMs,
      });
    }
    return undefined;
  }, [snapshot, commit]);

  useEffect(() => {
    function frame(time) {
      rafRef.current = requestAnimationFrame(frame);
      const state = engineRef.current;
      if (!state || state.gameState !== GAME_STATE.PLAYING) {
        lastTimeRef.current = time;
        return;
      }
      if (lastTimeRef.current === null) {
        lastTimeRef.current = time;
        return;
      }
      const dt = time - lastTimeRef.current;
      lastTimeRef.current = time;

      const baseGravity = gravityMsForLevel(state.level);
      const gravityMs = softDropHeldRef.current ? baseGravity / SOFT_DROP_FACTOR : baseGravity;

      const next = tickGravity(state, dt, gravityMs);
      if (next !== state) {
        commit(next);
      }
    }
    rafRef.current = requestAnimationFrame(frame);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [commit]);

  const moveLeft = useCallback(() => {
    const next = moveActive(engineRef.current, -1, 0);
    if (next !== engineRef.current) {
      playSound('move');
      commit(next);
    }
  }, [commit]);

  const moveRight = useCallback(() => {
    const next = moveActive(engineRef.current, 1, 0);
    if (next !== engineRef.current) {
      playSound('move');
      commit(next);
    }
  }, [commit]);

  const rotateCW = useCallback(() => {
    const next = rotateActive(engineRef.current, 1);
    if (next !== engineRef.current) {
      playSound('rotate');
      commit(next);
    }
  }, [commit]);

  const rotateCCW = useCallback(() => {
    const next = rotateActive(engineRef.current, -1);
    if (next !== engineRef.current) {
      playSound('rotate');
      commit(next);
    }
  }, [commit]);

  const setSoftDropHeld = useCallback((held) => {
    softDropHeldRef.current = held;
  }, []);

  const softDropOnce = useCallback(() => {
    const next = softDropStep(engineRef.current);
    if (next !== engineRef.current) commit(next);
  }, [commit]);

  const doHardDrop = useCallback(() => {
    const before = engineRef.current;
    const next = hardDrop(before);
    if (next !== before) {
      playSound('hardDrop');
      commit(next);
    }
  }, [commit]);

  const doHold = useCallback(() => {
    const next = holdActive(engineRef.current);
    if (next !== engineRef.current) {
      playSound('hold');
      commit(next);
    }
  }, [commit]);

  const togglePause = useCallback(() => {
    const state = engineRef.current;
    if (!state) return;
    if (state.gameState === GAME_STATE.PLAYING) {
      commit(pauseGame(state));
    } else if (state.gameState === GAME_STATE.PAUSED) {
      lastTimeRef.current = null;
      commit(resumeGame(state));
    }
  }, [commit]);

  return {
    state: snapshot,
    startGame,
    moveLeft,
    moveRight,
    rotateCW,
    rotateCCW,
    setSoftDropHeld,
    softDropOnce,
    hardDrop: doHardDrop,
    hold: doHold,
    togglePause,
  };
}
