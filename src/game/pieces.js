// Standard piece shapes defined on a 4x4 (or 3x3 for most) grid, per SRS spawn orientation.
// Each shape is a set of [row, col] cell offsets for rotation state 0 (spawn).

export const SHAPES = {
  I: {
    cells: [
      [1, 0], [1, 1], [1, 2], [1, 3],
    ],
    size: 4,
  },
  O: {
    cells: [
      [0, 0], [0, 1], [1, 0], [1, 1],
    ],
    size: 2,
  },
  T: {
    cells: [
      [0, 1], [1, 0], [1, 1], [1, 2],
    ],
    size: 3,
  },
  S: {
    cells: [
      [0, 1], [0, 2], [1, 0], [1, 1],
    ],
    size: 3,
  },
  Z: {
    cells: [
      [0, 0], [0, 1], [1, 1], [1, 2],
    ],
    size: 3,
  },
  J: {
    cells: [
      [0, 0], [1, 0], [1, 1], [1, 2],
    ],
    size: 3,
  },
  L: {
    cells: [
      [0, 2], [1, 0], [1, 1], [1, 2],
    ],
    size: 3,
  },
};

// Precomputed rotation states (0=spawn,1=R,2=180,3=L) for each piece using
// standard rotation-by-matrix-transform around the SRS bounding box.
function rotateCellsCW(cells, size) {
  return cells.map(([r, c]) => [c, size - 1 - r]);
}

function computeRotationStates(pieceType) {
  const { cells, size } = SHAPES[pieceType];
  if (pieceType === 'O') {
    return [cells, cells, cells, cells];
  }
  const states = [cells];
  let current = cells;
  for (let i = 0; i < 3; i++) {
    current = rotateCellsCW(current, size);
    states.push(current);
  }
  return states;
}

export const ROTATION_STATES = Object.fromEntries(
  Object.keys(SHAPES).map((type) => [type, computeRotationStates(type)])
);

export function createPiece(type) {
  return {
    type,
    rotation: 0,
    row: type === 'I' ? -1 : 0,
    col: type === 'I' ? 3 : type === 'O' ? 4 : 3,
  };
}

export function getPieceCells(piece) {
  const states = ROTATION_STATES[piece.type];
  const cells = states[piece.rotation];
  return cells.map(([r, c]) => [r + piece.row, c + piece.col]);
}
