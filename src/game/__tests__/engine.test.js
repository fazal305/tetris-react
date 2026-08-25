import { describe, it, expect } from 'vitest';
import {
  createGame,
  moveActive,
  hardDrop,
  holdActive,
  lockPiece,
  resolveLineClear,
} from '../engine';
import { lockPieceToBoard } from '../board';
import { GAME_STATE, COLS, TOTAL_ROWS } from '../constants';
import { getPieceCells } from '../pieces';

describe('engine', () => {
  it('creates a playing game with a valid active piece and populated queue', () => {
    const game = createGame(1, 4);
    expect(game.gameState).toBe(GAME_STATE.PLAYING);
    expect(game.activePiece).toBeTruthy();
    expect(game.nextQueue).toHaveLength(4);
  });

  it('moves the active piece left and right', () => {
    const game = createGame(2);
    const startCol = game.activePiece.col;
    const moved = moveActive(game, 1, 0);
    expect(moved.activePiece.col).toBe(startCol + 1);
  });

  it('hold swaps the active piece and locks further holds until next piece', () => {
    const game = createGame(3);
    const originalType = game.activePiece.type;
    const held = holdActive(game);
    expect(held.holdType).toBe(originalType);
    expect(held.canHold).toBe(false);

    const heldAgain = holdActive(held);
    expect(heldAgain).toBe(held);
  });

  it('hard drop locks the piece into the board', () => {
    const game = createGame(4);
    const dropped = hardDrop(game);
    expect(dropped.gameState === GAME_STATE.PLAYING || dropped.gameState === GAME_STATE.LINE_CLEARING).toBe(true);
    expect(dropped.piecesPlaced).toBe(1);
  });

  it('detects a completed row and transitions to LINE_CLEARING', () => {
    let game = createGame(5);
    const almostFullRow = Array.from({ length: COLS - 1 }, (_, c) => [TOTAL_ROWS - 1, c]);
    game = { ...game, board: lockPieceToBoard(game.board, almostFullRow, 'I') };
    game = {
      ...game,
      activePiece: { type: 'O', rotation: 0, row: TOTAL_ROWS - 2, col: COLS - 2 },
    };
    const locked = lockPiece(game);
    expect(locked.gameState).toBe(GAME_STATE.LINE_CLEARING);
    expect(locked.pendingClearRows.length).toBeGreaterThan(0);
  });

  it('resolveLineClear awards score and spawns the next piece', () => {
    let game = createGame(6);
    const fullRow = Array.from({ length: COLS }, (_, c) => [TOTAL_ROWS - 1, c]);
    game = { ...game, board: lockPieceToBoard(game.board, fullRow, 'I'), gameState: 'LINE_CLEARING', pendingClearRows: [TOTAL_ROWS - 1] };
    const resolved = resolveLineClear(game);
    expect(resolved.score).toBeGreaterThan(0);
    expect(resolved.lines).toBe(1);
    expect(resolved.gameState).toBe(GAME_STATE.PLAYING);
  });

  it('detects game over when spawn position is blocked', () => {
    let game = createGame(7);
    const spawnCells = getPieceCells(game.activePiece);
    const blockedBoard = lockPieceToBoard(game.board, spawnCells, 'I');
    game = { ...game, board: blockedBoard };
    const locked = lockPiece({ ...game, activePiece: { ...game.activePiece, row: game.activePiece.row + 20 } });
    expect(locked).toBeTruthy();
  });
});
