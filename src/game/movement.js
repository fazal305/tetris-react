import { isValidPosition } from './collision';
import { getWallKicks } from './rotations';
import { ROTATION_STATES } from './pieces';

export function tryMove(board, piece, dCol, dRow) {
  const candidate = { ...piece, col: piece.col + dCol, row: piece.row + dRow };
  if (isValidPosition(board, candidate)) return candidate;
  return null;
}

export function tryRotate(board, piece, direction) {
  const numStates = ROTATION_STATES[piece.type].length;
  const toRotation = (piece.rotation + direction + numStates) % numStates;
  const kicks = getWallKicks(piece.type, piece.rotation, toRotation);

  for (const [dCol, dRow] of kicks) {
    const candidate = {
      ...piece,
      rotation: toRotation,
      col: piece.col + dCol,
      row: piece.row + dRow,
    };
    if (isValidPosition(board, candidate)) {
      return candidate;
    }
  }
  return null;
}

export function softDrop(board, piece) {
  return tryMove(board, piece, 0, 1);
}

export function hardDropDistance(board, piece) {
  let distance = 0;
  let current = piece;
  while (true) {
    const next = tryMove(board, current, 0, 1);
    if (!next) break;
    current = next;
    distance++;
  }
  return { piece: current, distance };
}

export function isGrounded(board, piece) {
  return tryMove(board, piece, 0, 1) === null;
}
