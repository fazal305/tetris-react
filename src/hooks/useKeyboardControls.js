import { useEffect, useRef } from 'react';
import { DAS_MS, ARR_MS } from '../game/constants';

const GAME_KEYS = new Set([
  'ArrowLeft',
  'ArrowRight',
  'ArrowDown',
  'ArrowUp',
  ' ',
  'Spacebar',
  'c',
  'C',
  'p',
  'P',
  'Escape',
  'z',
  'Z',
]);

export function useKeyboardControls(actions, { active } = { active: true }) {
  const dasTimerRef = useRef(null);
  const arrTimerRef = useRef(null);
  const heldDirectionRef = useRef(null);
  const actionsRef = useRef(actions);
  actionsRef.current = actions;

  useEffect(() => {
    if (!active) return undefined;

    function clearHorizontalTimers() {
      if (dasTimerRef.current) clearTimeout(dasTimerRef.current);
      if (arrTimerRef.current) clearInterval(arrTimerRef.current);
      dasTimerRef.current = null;
      arrTimerRef.current = null;
    }

    function startHorizontalRepeat(direction) {
      const moveFn = direction === -1 ? actionsRef.current.moveLeft : actionsRef.current.moveRight;
      moveFn();
      dasTimerRef.current = setTimeout(() => {
        arrTimerRef.current = setInterval(() => {
          moveFn();
        }, ARR_MS);
      }, DAS_MS);
    }

    function handleKeyDown(e) {
      if (GAME_KEYS.has(e.key)) {
        e.preventDefault();
      }
      if (e.repeat && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight' && e.key !== 'ArrowDown') return;

      switch (e.key) {
        case 'ArrowLeft':
          if (heldDirectionRef.current !== -1) {
            clearHorizontalTimers();
            heldDirectionRef.current = -1;
            startHorizontalRepeat(-1);
          }
          break;
        case 'ArrowRight':
          if (heldDirectionRef.current !== 1) {
            clearHorizontalTimers();
            heldDirectionRef.current = 1;
            startHorizontalRepeat(1);
          }
          break;
        case 'ArrowDown':
          actionsRef.current.setSoftDropHeld(true);
          break;
        case 'ArrowUp':
          if (!e.repeat) actionsRef.current.rotateCW();
          break;
        case 'z':
        case 'Z':
          if (!e.repeat) actionsRef.current.rotateCCW();
          break;
        case ' ':
        case 'Spacebar':
          if (!e.repeat) actionsRef.current.hardDrop();
          break;
        case 'c':
        case 'C':
          if (!e.repeat) actionsRef.current.hold();
          break;
        case 'p':
        case 'P':
        case 'Escape':
          if (!e.repeat) actionsRef.current.togglePause();
          break;
        default:
          break;
      }
    }

    function handleKeyUp(e) {
      if (GAME_KEYS.has(e.key)) {
        e.preventDefault();
      }
      switch (e.key) {
        case 'ArrowLeft':
          if (heldDirectionRef.current === -1) {
            clearHorizontalTimers();
            heldDirectionRef.current = null;
          }
          break;
        case 'ArrowRight':
          if (heldDirectionRef.current === 1) {
            clearHorizontalTimers();
            heldDirectionRef.current = null;
          }
          break;
        case 'ArrowDown':
          actionsRef.current.setSoftDropHeld(false);
          break;
        default:
          break;
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      clearHorizontalTimers();
      actionsRef.current.setSoftDropHeld(false);
    };
  }, [active]);
}
