import { createEmptyBoard, lockPieceToBoard, findCompletedRows, clearRows, isBoardEmpty } from './board';
import { createPiece, getPieceCells } from './pieces';
import { isValidPosition } from './collision';
import { tryMove, tryRotate, hardDropDistance } from './movement';
import { calculateLineClearScore, calculateSoftDropScore, calculateHardDropScore, calculateLevel } from './scoring';
import { SevenBagRandomizer } from './randomizer';
import { GAME_STATE, NEXT_QUEUE_DEFAULT_SIZE, LOCK_DELAY_MS, MAX_LOCK_RESETS } from './constants';

export function createInitialStats() {
  return {
    gamesPlayed: 0,
    linesCleared: 0,
    tetrises: 0,
    bestScore: 0,
    bestLevel: 0,
    longestGameMs: 0,
    totalPlayTimeMs: 0,
    piecesPlaced: 0,
  };
}

export function createGame(seed = Date.now(), queueSize = NEXT_QUEUE_DEFAULT_SIZE) {
  const randomizer = new SevenBagRandomizer(seed);
  const board = createEmptyBoard();
  const nextTypes = randomizer.peek(queueSize + 1);
  const firstType = randomizer.next();
  randomizer.peek(queueSize);

  const state = {
    board,
    activePiece: createPiece(firstType),
    ghostPiece: null,
    holdType: null,
    canHold: true,
    queueSize,
    randomizer,
    nextQueue: randomizer.peek(queueSize),
    score: 0,
    level: 1,
    lines: 0,
    combo: -1,
    backToBack: false,
    gameState: GAME_STATE.PLAYING,
    lastClear: null,
    pendingClearRows: [],
    lockTimerMs: 0,
    lockResets: 0,
    isGrounded: false,
    gravityAccumulatorMs: 0,
    elapsedMs: 0,
    piecesPlaced: 0,
  };

  state.ghostPiece = computeGhost(state.board, state.activePiece);
  if (!isValidPosition(state.board, state.activePiece)) {
    state.gameState = GAME_STATE.GAME_OVER;
  }
  return state;
}

function computeGhost(board, piece) {
  if (!piece) return null;
  const { piece: dropped } = hardDropDistance(board, piece);
  return dropped;
}

function drawNext(state) {
  const type = state.randomizer.next();
  const nextQueue = state.randomizer.peek(state.queueSize);
  return { ...state, nextQueue, _drawnType: type };
}

export function spawnNextPiece(state) {
  const drawn = drawNext(state);
  const piece = createPiece(drawn._drawnType);
  const next = {
    ...state,
    activePiece: piece,
    canHold: true,
    lockTimerMs: 0,
    lockResets: 0,
    isGrounded: false,
    gravityAccumulatorMs: 0,
    nextQueue: drawn.nextQueue,
  };
  next.ghostPiece = computeGhost(next.board, piece);
  if (!isValidPosition(next.board, piece)) {
    next.gameState = GAME_STATE.GAME_OVER;
  }
  return next;
}

export function moveActive(state, dCol, dRow) {
  if (state.gameState !== GAME_STATE.PLAYING) return state;
  const moved = tryMove(state.board, state.activePiece, dCol, dRow);
  if (!moved) return state;
  const next = { ...state, activePiece: moved };
  next.ghostPiece = computeGhost(next.board, moved);
  return applyLockDelayOnMove(next);
}

export function rotateActive(state, direction) {
  if (state.gameState !== GAME_STATE.PLAYING) return state;
  const rotated = tryRotate(state.board, state.activePiece, direction);
  if (!rotated) return state;
  const next = { ...state, activePiece: rotated };
  next.ghostPiece = computeGhost(next.board, rotated);
  return applyLockDelayOnMove(next);
}

function applyLockDelayOnMove(state) {
  const grounded = computeGrounded(state.board, state.activePiece);
  if (grounded && state.isGrounded && state.lockResets < MAX_LOCK_RESETS) {
    return { ...state, isGrounded: true, lockTimerMs: 0, lockResets: state.lockResets + 1 };
  }
  return { ...state, isGrounded: grounded, lockTimerMs: grounded ? state.lockTimerMs : 0 };
}

function computeGrounded(board, piece) {
  const below = tryMove(board, piece, 0, 1);
  return below === null;
}

export function softDropStep(state) {
  if (state.gameState !== GAME_STATE.PLAYING) return state;
  const moved = tryMove(state.board, state.activePiece, 0, 1);
  if (!moved) return state;
  const next = {
    ...state,
    activePiece: moved,
    score: state.score + calculateSoftDropScore(1),
    gravityAccumulatorMs: 0,
    isGrounded: false,
    lockTimerMs: 0,
  };
  next.ghostPiece = computeGhost(next.board, moved);
  return next;
}

export function hardDrop(state) {
  if (state.gameState !== GAME_STATE.PLAYING) return state;
  const { piece: dropped, distance } = hardDropDistance(state.board, state.activePiece);
  const withScore = { ...state, score: state.score + calculateHardDropScore(distance) };
  return lockPiece({ ...withScore, activePiece: dropped });
}

export function holdActive(state) {
  if (state.gameState !== GAME_STATE.PLAYING || !state.canHold) return state;
  const currentType = state.activePiece.type;

  if (state.holdType === null) {
    const drawn = drawNext(state);
    const piece = createPiece(drawn._drawnType);
    const next = {
      ...state,
      holdType: currentType,
      activePiece: piece,
      canHold: false,
      nextQueue: drawn.nextQueue,
      lockTimerMs: 0,
      lockResets: 0,
      isGrounded: false,
      gravityAccumulatorMs: 0,
    };
    next.ghostPiece = computeGhost(next.board, piece);
    return next;
  }

  const piece = createPiece(state.holdType);
  const next = {
    ...state,
    holdType: currentType,
    activePiece: piece,
    canHold: false,
    lockTimerMs: 0,
    lockResets: 0,
    isGrounded: false,
    gravityAccumulatorMs: 0,
  };
  next.ghostPiece = computeGhost(next.board, piece);
  return next;
}

export function lockPiece(state) {
  const cells = getPieceCells(state.activePiece);
  const boardWithPiece = lockPieceToBoard(state.board, cells, state.activePiece.type);
  const completedRows = findCompletedRows(boardWithPiece);
  const piecesPlaced = state.piecesPlaced + 1;

  if (completedRows.length === 0) {
    const cleared = calculateLineClearScore({
      linesCleared: 0,
      level: state.level,
      combo: -1,
      backToBack: state.backToBack,
      isPerfectClear: false,
    });
    const afterCombo = { ...state, board: boardWithPiece, combo: -1, lastClear: null, piecesPlaced };
    return spawnNextPiece(afterCombo);
  }

  return {
    ...state,
    board: boardWithPiece,
    gameState: GAME_STATE.LINE_CLEARING,
    pendingClearRows: completedRows,
    piecesPlaced,
  };
}

export function resolveLineClear(state) {
  const rows = state.pendingClearRows;
  const linesCleared = rows.length;
  const clearedBoard = clearRows(state.board, rows);
  const isPerfectClear = isBoardEmpty(clearedBoard);
  const newCombo = state.combo + 1;

  const result = calculateLineClearScore({
    linesCleared,
    level: state.level,
    combo: newCombo,
    backToBack: state.backToBack,
    isPerfectClear,
  });

  const totalLines = state.lines + linesCleared;
  const newLevel = calculateLevel(totalLines);

  const next = {
    ...state,
    board: clearedBoard,
    score: state.score + result.points,
    lines: totalLines,
    level: newLevel,
    combo: newCombo,
    backToBack: linesCleared >= 4 ? true : linesCleared > 0 ? false : state.backToBack,
    gameState: GAME_STATE.PLAYING,
    pendingClearRows: [],
    lastClear: {
      linesCleared,
      label: result.label,
      points: result.points,
      isPerfectClear,
      level: newLevel,
      leveledUp: newLevel > state.level,
    },
  };

  return spawnNextPiece(next);
}

export function tickGravity(state, dtMs, gravityMs) {
  if (state.gameState !== GAME_STATE.PLAYING) return state;

  const grounded = computeGrounded(state.board, state.activePiece);

  if (grounded) {
    const lockTimerMs = state.lockTimerMs + dtMs;
    if (lockTimerMs >= LOCK_DELAY_MS) {
      return lockPiece({ ...state, isGrounded: true, lockTimerMs: 0 });
    }
    return { ...state, isGrounded: true, lockTimerMs };
  }

  const accumulator = state.gravityAccumulatorMs + dtMs;
  if (accumulator >= gravityMs) {
    const moved = tryMove(state.board, state.activePiece, 0, 1);
    if (!moved) {
      return { ...state, gravityAccumulatorMs: 0, isGrounded: true, lockTimerMs: 0 };
    }
    const next = { ...state, activePiece: moved, gravityAccumulatorMs: accumulator - gravityMs, isGrounded: false };
    next.ghostPiece = computeGhost(next.board, moved);
    return next;
  }

  return { ...state, gravityAccumulatorMs: accumulator, isGrounded: false };
}

export function pauseGame(state) {
  if (state.gameState !== GAME_STATE.PLAYING) return state;
  return { ...state, gameState: GAME_STATE.PAUSED };
}

export function resumeGame(state) {
  if (state.gameState !== GAME_STATE.PAUSED) return state;
  return { ...state, gameState: GAME_STATE.PLAYING, gravityAccumulatorMs: 0 };
}
